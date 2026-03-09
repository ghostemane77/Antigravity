import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function SignoutRoute() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function POST() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}
