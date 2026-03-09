import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@/constants/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-02-25.clover' as any,
})

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: 'Billing is not configured' }, { status: 400 })
    }

    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { priceId } = await req.json()

        // Find plan by priceId to pass in metadata
        const plan = Object.values(PLANS).find(p => p.priceId === priceId)

        // Create Checkout Sessions from body params
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.headers.get('origin')}/app/billing?success=true`,
            cancel_url: `${req.headers.get('origin')}/app/billing?canceled=true`,
            client_reference_id: user.id, // Map the checkout to the user
            customer_email: user.email,
            metadata: {
                userId: user.id,
                planType: plan?.id || 'unknown'
            },
            subscription_data: {
                metadata: {
                    userId: user.id,
                    planType: plan?.id || 'unknown'
                }
            }
        })

        return NextResponse.json({ url: session.url })
    } catch (err: unknown) {
        return NextResponse.json({ error: (err instanceof Error ? err.message : String(err)) }, { status: 500 })
    }
}
