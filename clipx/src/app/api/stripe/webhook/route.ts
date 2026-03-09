import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-02-25.clover',
})

// Webhook payload needs raw body
export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Billing is not configured' }, { status: 400 })
    }

    const body = await req.text()
    const sig = req.headers.get('stripe-signature') as string
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: unknown) {
        return NextResponse.json({ error: `Webhook Error: ${(err instanceof Error ? err.message : String(err))}` }, { status: 400 })
    }

    const supabase = await createClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (userId) {
            const subscriptionId = session.subscription as string
            const customerId = session.customer as string

            // Update to Pro (hardcoded for MVP)
            await supabase
                .from('credits')
                .update({
                    plan_type: 'pro',
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    balance: 600, // Monthly pro credits
                })
                .eq('user_id', userId)

            await supabase.from('credit_ledger').insert({
                user_id: userId,
                amount: 600,
                reason: 'plan_upgrade_pro',
            })
        }
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription

        // Find the user with this subscription
        const { data: credits } = await supabase
            .from('credits')
            .select('user_id')
            .eq('stripe_subscription_id', subscription.id)
            .single()

        if (credits) {
            await supabase
                .from('credits')
                .update({
                    plan_type: 'free',
                    stripe_subscription_id: null,
                    balance: 90,
                })
                .eq('user_id', credits.user_id)
        }
    }

    return NextResponse.json({ received: true })
}
