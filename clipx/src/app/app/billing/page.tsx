'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client' // Wait, client component

// Hardcoded stripe price IDs for MVP (Normally these come from ENV)
const PLANS = {
    starter: 'price_starter_mock', // replace with real
    pro: 'price_pro_mock', // replace with real
    business: 'price_business_mock' // replace with real
}

export default function BillingPage() {
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (priceId: string) => {
        setLoading(true)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId }),
            })
            const { url, error } = await res.json()
            if (url) {
                window.location.href = url
            } else {
                alert(error)
                setLoading(false)
            }
        } catch {
            alert("Failed to start checkout")
            setLoading(false)
        }
    }

    const handlePortal = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST'
            })
            const { url, error } = await res.json()
            if (url) {
                window.location.href = url
            } else {
                alert(error)
                setLoading(false)
            }
        } catch {
            alert("Failed to access billing portal")
            setLoading(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold">Billing & Usage</h1>
                <p className="text-muted-foreground mt-2">Manage your subscription and track credit usage.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
                    <CardHeader>
                        <CardTitle className="text-xl">Current Plan</CardTitle>
                        <CardDescription>You are currently on the <strong className="text-foreground">Free</strong> plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium">Credits usage</span>
                                <span className="text-sm text-muted-foreground">0 / 90</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[0%]" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Resets automatically in 15 days.</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" onClick={handlePortal} disabled={loading} className="w-full gap-2">
                            <CreditCard size={16} /> Customer Portal
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="glass border-primary shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                    <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                            <Badge className="bg-primary text-primary-foreground pointer-events-none border-none">Most Popular</Badge>
                            <Sparkles size={20} className="text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Pro Plan</CardTitle>
                        <CardDescription>For serious creators scaling their reach.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold">$15</span>
                            <span className="text-muted-foreground"> / month</span>
                        </div>
                        <ul className="space-y-3">
                            {['600 Credits per month', 'Remove ClipX watermark', 'All premium templates', 'Priority rendering queue'].map(f => (
                                <li key={f} className="flex items-center gap-3 text-sm">
                                    <Check size={16} className="text-primary" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSubscribe(PLANS.pro)} disabled={loading} className="w-full text-lg">
                            {loading ? <Loader2 className="animate-spin" /> : 'Upgrade to Pro'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
