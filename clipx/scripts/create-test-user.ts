
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createTestUser() {
    const email = 'tester@clipx.app'
    const password = 'ClipXPassword123!'

    console.log(`Attempting to create/update user: ${email}`)

    // Try to create user
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists, updating password...')
            const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
            if (listError) throw listError

            const user = listData.users.find(u => u.email === email)
            if (user) {
                const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
                    password,
                    email_confirm: true
                })
                if (updateError) throw updateError
                console.log('Password updated successfully.')
            }
        } else {
            throw error
        }
    } else {
        console.log('User created successfully.')
    }

    console.log('\n--- TEST CREDENTIALS ---')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('------------------------')
}

createTestUser().catch(console.error)
