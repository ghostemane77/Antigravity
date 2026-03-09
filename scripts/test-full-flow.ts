
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testClipGeneration() {
    const email = 'tester@clipx.app'
    const password = 'ClipX@2026'

    console.log(`Logging in as: ${email}`)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (authError) throw authError

    const token = authData.session.access_token

    console.log('Sending request to generate clips...')
    const response = await fetch('http://localhost:3000/api/jobs/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token=${token}` // Try setting cookie if header fails in some envs
        },
        body: JSON.stringify({
            source_url: 'https://www.youtube.com/watch?v=Ps042FNImds&list=RDMQZsHwf2EOA&index=2',
            title: 'Auto Test Clip',
            template_id: 'neon'
        })
    })

    const result = await response.json()
    console.log('API Response:', result)

    if (result.success) {
        console.log('Job created successfully! Clip ID:', result.clip.id)

        // Poll for status
        console.log('Waiting for processing...')
        for (let i = 0; i < 15; i++) {
            const { data: clipData } = await supabase.from('clips').select('status').eq('id', result.clip.id).single()
            if (!clipData) {
                console.log('No clip data found yet...')
                continue
            }
            console.log(`Status: ${clipData.status}`)
            if (clipData.status === 'completed') {
                console.log('Clip completed successfully!')
                process.exit(0)
            }
            await new Promise(r => setTimeout(r, 2000))
        }
    } else {
        console.error('Failed to create job:', result.error)
        process.exit(1)
    }
}

testClipGeneration().catch(err => {
    console.error(err)
    process.exit(1)
})
