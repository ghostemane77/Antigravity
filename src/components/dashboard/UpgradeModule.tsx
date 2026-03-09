'use client'

import { PLANS, getPlanByType } from '@/constants/plans'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UpgradeModuleProps {
    planType: string
}

export function UpgradeModule({ planType }: UpgradeModuleProps) {
    const isFree = planType === 'free'
    const isPro = planType === 'pro'
    const isStarter = planType === 'starter'

    if (planType === 'business') return null

    const nextPlan = isFree ? PLANS.PRO : isStarter ? PLANS.PRO : PLANS.BUSINESS

    return (
        <Card className="glass overflow-hidden border-primary/30 relative group">
            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-500"></div>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                                Unlock full viral potential
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md">
                                {isFree
                                    ? "Upgrade to Pro to remove watermarks, get 800 monthly credits, and access exclusive cinematic templates."
                                    : `Switch to ${nextPlan.name} for ${nextPlan.credits} credits and priority processing speeds.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="text-center md:text-right hidden sm:block">
                            <span className="block text-2xl font-bold font-outfit">${nextPlan.price}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">per month</span>
                        </div>
                        <Link href="/app/billing" className="w-full sm:w-auto">
                            <Button className="w-full gap-2 shadow-lg shadow-primary/30 hover:scale-105 transition-all h-11 px-6">
                                <Zap size={16} className="fill-current" />
                                Upgrade to {nextPlan.name}
                                <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
