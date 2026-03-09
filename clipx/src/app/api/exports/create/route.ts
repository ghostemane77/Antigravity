import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureCreditCycle, deductCredits } from '@/lib/credits'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const CreateExportSchema = z.object({
    clip_id: z.string().uuid(),
    trim_start: z.number().optional(),
    trim_end: z.number().optional(),
})

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        if (!checkRateLimit(ip, 10, 60000)) { // 10 exports per minute
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await req.json()
        const result = CreateExportSchema.safeParse(json)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 })
        }

        const { clip_id } = result.data

        // Check credits: exporting costs 1 credit
        const cost = 1
        const currentCredits = await ensureCreditCycle(user.id)
        if (!currentCredits || currentCredits.balance < cost) {
            return NextResponse.json({ error: 'Insufficient credits', code: 'insufficient_credits' }, { status: 402 })
        }

        // Verify ownership of the clip
        const { data: clip } = await supabase
            .from('clips')
            .select('user_id')
            .eq('id', clip_id)
            .single()

        if (!clip || clip.user_id !== user.id) {
            return NextResponse.json({ error: 'Clip not found or unauthorized' }, { status: 404 })
        }

        // Deduct credit
        await deductCredits(user.id, cost, 'export')

        // Create export row in DB
        // To mock the watermark logic, we check user's plan type
        const isWatermarked = currentCredits.plan_type === 'free' || currentCredits.plan_type === 'starter'

        const { data: exportJob, error: exportError } = await supabase
            .from('exports')
            .insert({
                clip_id,
                user_id: user.id,
                status: 'completed', // we mock instant export completion
                watermarked: isWatermarked,
                download_url: '/mock/export.mp4'
            })
            .select()
            .single()

        if (exportError) throw exportError

        return NextResponse.json({ success: true, export: exportJob })
    } catch (err: unknown) {
        return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 500 })
    }
}
