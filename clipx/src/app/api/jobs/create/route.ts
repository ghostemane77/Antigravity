import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensureCreditCycle, deductCredits } from '@/lib/credits'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

import { createAdminClient } from '@/lib/supabase/admin'

const CreateJobSchema = z.object({
    source_url: z.string().url(),
    template_id: z.string().min(1),
    title: z.string().min(1).max(100),
})

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        if (!checkRateLimit(ip, 20, 60000)) { // 20 requests per minute
            return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
        }

        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const json = await req.json()
        const result = CreateJobSchema.safeParse(json)

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.issues }, { status: 400 })
        }

        const { source_url, template_id, title } = result.data

        // 1. Check credits and refill if needed
        const cost = 10 // Mock cost per job
        const currentCredits = await ensureCreditCycle(user.id)

        if (!currentCredits || currentCredits.balance < cost) {
            return NextResponse.json({ error: 'Insufficient credits', code: 'insufficient_credits' }, { status: 402 })
        }

        // 2. Deduct credits
        await deductCredits(user.id, cost, 'job_create')

        // 3. Create clip record in pending state using ADMIN client to bypass RLS limits if they restrict insert
        const adminSupabase = createAdminClient()
        const { data: clip, error: clipError } = await adminSupabase
            .from('clips')
            .insert({
                user_id: user.id,
                title,
                source_url,
                template_id,
                status: 'pending',
            })
            .select()
            .single()

        if (clipError) throw clipError

        // **Mock Worker Trigger**: In a real app we'd dispatch to Inngest/BullMQ etc.
        // For MVP, we'll internally fetch our worker route without awaiting its completion.
        // We use the full URL from site config to avoid relative fetch issues
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        fetch(`${siteUrl}/api/jobs/worker`, {
            method: 'POST',
            body: JSON.stringify({ clip_id: clip.id }),
            headers: {
                'Content-Type': 'application/json',
                // Add a simple secret to allow this in-house call
                'x-worker-key': process.env.SUPABASE_SERVICE_ROLE_KEY || ''
            },
        }).catch(e => console.error("Worker trigger failed:", e))

        return NextResponse.json({ success: true, clip })
    } catch (err: unknown) {
        return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 500 })
    }
}
