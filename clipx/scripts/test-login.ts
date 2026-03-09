
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
    const email = 'tester@clipx.app'
    const password = 'ClipX@2026'

    console.log(`Attempting to login as: ${email}`)

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error('Login failed:', error.message)
        process.exit(1)
    } else {
        console.log('Login successful!')
        console.log('User ID:', data.user.id)
        process.exit(0)
    }
}

testLogin().catch(err => {
    console.error(err)
    process.exit(1)
})
