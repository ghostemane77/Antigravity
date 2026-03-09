import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Simulates a backend worker processing a clip
export async function POST(req: Request) {
    try {
        // Simple security check for internal worker route
        const workerKey = req.headers.get('x-worker-key')
        if (workerKey !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const adminSupabase = createAdminClient()

        const { clip_id } = await req.json()
        if (!clip_id) return NextResponse.json({ error: 'Missing clip_id' }, { status: 400 })

        // 1. Set to processing
        await adminSupabase.from('clips').update({ status: 'processing' }).eq('id', clip_id)

        // 2. Simulate work (wait 5 seconds to mock video processing)
        await new Promise(resolve => setTimeout(resolve, 5000))

        // 3. Mock successful outcome
        const duration = Math.floor(Math.random() * 45) + 15 // 15-60s
        const { error: updateError } = await adminSupabase.from('clips').update({
            status: 'completed',
            duration,
            preview_url: '/mock/preview.mp4',
            updated_at: new Date().toISOString()
        }).eq('id', clip_id)

        if (updateError) throw updateError

        // 4. Create mock assets and captions
        await adminSupabase.from('clip_assets').insert({
            clip_id,
            captions: [
                { text: "Capturando a essência visual...", start: 0, end: 2 },
                { text: "Design Vapor Clinic aplicado.", start: 2, end: 4 },
                { text: "Marca d'água ClipX processada.", start: 4, end: 6 }
            ],
            format_settings: {
                aspectRatio: '9:16',
                fontSize: '24px'
            }
        })

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        console.error("Worker Error:", err)
        return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 500 })
    }
}
