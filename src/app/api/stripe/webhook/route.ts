import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS, getPlanByType } from '@/constants/plans'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-02-25.clover' as any,
})

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

    const supabaseAdmin = createAdminClient()

    // 1. Handle Successful Checkout (New Subscription)
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const planType = session.metadata?.planType || 'pro'

        if (userId) {
            const subscriptionId = session.subscription as string
            const customerId = session.customer as string
            const plan = getPlanByType(planType)

            await supabaseAdmin
                .from('credits')
                .update({
                    plan_type: plan.id,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    balance: plan.credits,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId)

            await supabaseAdmin.from('credit_ledger').insert({
                user_id: userId,
                amount: plan.credits,
                reason: `plan_upgrade_${plan.id}`,
            })
        }
    }

    // 2. Handle Subscription Updates (Upgrade/Downgrade)
    if (event.type === 'customer.subscription.updated') {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        // Find the user if userId not in metadata
        let targetId = userId
        if (!targetId) {
            const { data } = await supabaseAdmin
                .from('credits')
                .select('user_id')
                .eq('stripe_subscription_id', subscription.id)
                .single()
            targetId = data?.user_id
        }

        if (targetId) {
            const priceId = subscription.items.data[0].price.id
            const plan = Object.values(PLANS).find(p => p.priceId === priceId)

            if (plan) {
                await supabaseAdmin
                    .from('credits')
                    .update({
                        plan_type: plan.id,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', targetId)
            }
        }
    }

    // 3. Handle Recurring Payments (Monthly Credit Refill)
    if (event.type === 'invoice.paid') {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = (invoice as any).subscription as string

        if (subscriptionId) {
            const { data: credits } = await supabaseAdmin
                .from('credits')
                .select('*')
                .eq('stripe_subscription_id', subscriptionId)
                .single()

            if (credits) {
                const plan = getPlanByType(credits.plan_type)

                // Set balance to monthly allowance
                await supabaseAdmin
                    .from('credits')
                    .update({
                        balance: plan.credits,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', credits.user_id)

                await supabaseAdmin.from('credit_ledger').insert({
                    user_id: credits.user_id,
                    amount: plan.credits,
                    reason: 'cycle_refill',
                })
            }
        }
    }

    // 4. Handle Subscription Deletion (Cancel)
    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription

        const { data: credits } = await supabaseAdmin
            .from('credits')
            .select('user_id')
            .eq('stripe_subscription_id', subscription.id)
            .single()

        if (credits) {
            await supabaseAdmin
                .from('credits')
                .update({
                    plan_type: 'free',
                    stripe_subscription_id: null,
                    balance: 90, // Reset to free allowance
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', credits.user_id)
        }
    }

    return NextResponse.json({ received: true })
}
