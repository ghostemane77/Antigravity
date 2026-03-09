'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error("Login Error:", error.message, error)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/app/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error("Signup Error:", error.message, error)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/app/dashboard')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
    }

    const { error } = await supabase.auth.resetPasswordForEmail(data.email)

    if (error) {
        redirect('/reset-password?error=Could not reset password')
    }

    redirect('/login?message=Check your email for the password reset link')
}

export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (data?.url) {
        redirect(data.url)
    }
}
