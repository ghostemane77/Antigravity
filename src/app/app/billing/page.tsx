'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, CreditCard, Sparkles, Loader2, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/constants/plans'
import { toast } from 'sonner'

export default function BillingPage() {
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [userData, setUserData] = useState<{ plan_type: string, balance: number } | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('credits')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()
                setUserData(data)
            }
            setLoading(false)
        }
        fetchData()
    }, [])

    const handleSubscribe = async (priceId: string) => {
        setActionLoading(true)
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
                toast.error(error || "Failed to start checkout")
                setActionLoading(false)
            }
        } catch {
            toast.error("Failed to start checkout")
            setActionLoading(false)
        }
    }

    const handlePortal = async () => {
        setActionLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', {
                method: 'POST'
            })
            const { url, error } = await res.json()
            if (url) {
                window.location.href = url
            } else {
                toast.error(error || "Failed to access billing portal")
                setActionLoading(false)
            }
        } catch {
            toast.error("Failed to access billing portal")
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    const currentPlan = userData?.plan_type || 'free'
    const balance = userData?.balance ?? 0
    const planConfig = Object.values(PLANS).find(p => p.id === currentPlan) || PLANS.FREE

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-outfit font-bold">Billing & Usage</h1>
                    <p className="text-muted-foreground mt-2">Manage your subscription and track credit usage.</p>
                </div>
                {currentPlan !== 'free' && (
                    <Button variant="outline" onClick={handlePortal} disabled={actionLoading} className="gap-2">
                        <CreditCard size={16} /> Manage Subscription
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass relative overflow-hidden border-primary/20">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Current Plan: <Badge variant="secondary" className="capitalize">{currentPlan}</Badge>
                        </CardTitle>
                        <CardDescription>Your plan resets monthly with a fresh credit allowance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-medium">Available Credits</span>
                                <span className="text-sm font-bold text-primary">{balance} / {planConfig.credits}</span>
                            </div>
                            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-500"
                                    style={{ width: `${Math.min((balance / planConfig.credits) * 100, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Plan Features</h4>
                            <ul className="space-y-2">
                                {planConfig.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                                        <Check size={14} className="text-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Upgrade options if on free/starter */}
                {(currentPlan === 'free' || currentPlan === 'starter') && (
                    <Card className="glass border-primary shadow-[0_0_30px_rgba(123,97,255,0.15)] relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-primary hover:bg-primary text-primary-foreground px-4 py-1">MOST POPULAR</Badge>
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl font-bold">{PLANS.PRO.name}</CardTitle>
                                    <CardDescription>{PLANS.PRO.features[1]}</CardDescription>
                                </div>
                                <Sparkles className="text-primary animate-pulse" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <span className="text-5xl font-outfit font-extrabold">${PLANS.PRO.price}</span>
                                <span className="text-muted-foreground"> / month</span>
                            </div>
                            <ul className="space-y-3">
                                {PLANS.PRO.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <div className="p-0.5 rounded-full bg-primary/20">
                                            <Check size={12} className="text-primary" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => handleSubscribe(PLANS.PRO.priceId)}
                                disabled={actionLoading}
                                className="w-full text-lg h-12 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                            >
                                {actionLoading ? <Loader2 className="animate-spin mr-2" /> : <Zap size={18} className="mr-2 fill-current" />}
                                Upgrade to {PLANS.PRO.name}
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* If already on Pro, show Business */}
                {currentPlan === 'pro' && (
                    <Card className="glass border-border/50">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{PLANS.BUSINESS.name}</CardTitle>
                            <CardDescription>Scale your video production to the next level.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <span className="text-4xl font-extrabold">${PLANS.BUSINESS.price}</span>
                                <span className="text-muted-foreground"> / month</span>
                            </div>
                            <ul className="space-y-3">
                                {PLANS.BUSINESS.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <Check size={16} className="text-primary" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                onClick={() => handleSubscribe(PLANS.BUSINESS.priceId)}
                                disabled={actionLoading}
                                variant="outline"
                                className="w-full"
                            >
                                {actionLoading ? <Loader2 className="animate-spin" /> : `Get ${PLANS.BUSINESS.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
