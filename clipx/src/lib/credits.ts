import { createAdminClient } from './supabase/admin'
import { getPlanByType } from '@/constants/plans'

export async function ensureCreditCycle(userId: string) {
    const adminSupabase = createAdminClient()

    // 1. Fetch current credits
    const { data: credits, error } = await adminSupabase
        .from('credits')
        .select('*')
        .eq('user_id', userId)
        .single()

    // Wait, it is possible the DB trigger failed to create the user credit row on signup.
    // If it's missing, let's gracefully init it instead of crashing.
    if (error || !credits) {
        const { data: newCredits, error: setupError } = await adminSupabase
            .from('credits')
            .insert({
                user_id: userId,
                balance: 90,
                plan_type: 'free',
            })
            .select()
            .single()

        if (setupError) {
            console.error("Critical error setting up credits:", setupError)
            return null
        }
        return newCredits
    }

    // 2. Check if we are past the cycle end
    const now = new Date()
    const cycleEnd = new Date(credits.cycle_end)

    if (now > cycleEnd) {
        // Find plan config
        const plan = getPlanByType(credits.plan_type)
        const refillAmount = plan.credits

        // Reset to full allowance every 30 days (or 15 for free?)
        // Let's stick to 30 days for all paid, 15 for free as per current logic
        const days = credits.plan_type === 'free' ? 15 : 30
        const nextEnd = new Date()
        nextEnd.setDate(nextEnd.getDate() + days)

        const { data: updatedCredits, error: updateError } = await adminSupabase
            .from('credits')
            .update({
                balance: refillAmount,
                cycle_start: now.toISOString(),
                cycle_end: nextEnd.toISOString(),
                updated_at: now.toISOString()
            })
            .eq('user_id', userId)
            .select()
            .single()

        if (!updateError) {
            // Record in ledger
            await adminSupabase.from('credit_ledger').insert({
                user_id: userId,
                amount: refillAmount,
                reason: 'cycle_refill'
            })
            return updatedCredits
        }
    }

    return credits
}

export async function deductCredits(userId: string, amount: number, reason: string) {
    const adminSupabase = createAdminClient()

    const { data: credits } = await adminSupabase
        .from('credits')
        .select('balance')
        .eq('user_id', userId)
        .single()

    if (!credits || credits.balance < amount) return false

    const { error } = await adminSupabase
        .from('credits')
        .update({ balance: credits.balance - amount })
        .eq('user_id', userId)

    if (!error) {
        await adminSupabase.from('credit_ledger').insert({
            user_id: userId,
            amount: -amount,
            reason: reason
        })
        return true
    }

    return false
}
