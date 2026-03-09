import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-02-25.clover',
})

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user's Stripe customer ID
        const { data: credits } = await supabase
            .from('credits')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single()

        if (!credits?.stripe_customer_id) {
            return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: credits.stripe_customer_id,
            return_url: `${req.headers.get('origin')}/app/billing`,
        })

        return NextResponse.json({ url: session.url })
    } catch (err: unknown) {
        return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 500 })
    }
}
