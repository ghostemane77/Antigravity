
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function updateSchema() {
    console.log('Applying schema updates...')

    // Using rpc or direct sql if available via dashboard, but here since we don't have a direct raw sql 
    // we try to use the REST API to check if we can. 
    // Actually, safest is to assume the columns might be missing and handling them in metadata JSON if SQL fails.
    // But let's try to run a simple update to verify connection
    const { error } = await supabase.from('clips').select('id, category').limit(1)

    if (error && error.message.includes('column "category" does not exist')) {
        console.log('Column "category" missing. Please run this SQL in your Supabase Dashboard:')
        console.log('ALTER TABLE public.clips ADD COLUMN category TEXT;')
        console.log('ALTER TABLE public.clips ADD COLUMN thumbnail_url TEXT;')
    } else if (error) {
        console.error('Connection error:', error.message)
    } else {
        console.log('Schema seems updated or accessible.')
    }
}

updateSchema()
