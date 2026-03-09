import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: '/ 15 days',
            credits: '90 Credits',
            features: ['Watermarked exports', 'Basic templates', 'Standard processing'],
            button: 'Start for Free',
            href: '/signup',
            popular: false,
        },
        {
            name: 'Starter',
            price: '$9.90',
            period: '/ month',
            credits: '150 Credits',
            features: ['No watermarks', 'All templates', 'Fast processing'],
            button: 'Subscribe',
            href: '/login', // in production this might go to checkout or sign up
            popular: false,
        },
        {
            name: 'Pro',
            price: '$15',
            period: '/ month',
            credits: '600 Credits',
            features: ['No watermarks', 'All templates', 'Priority processing', 'API Access'],
            button: 'Subscribe',
            href: '/login',
            popular: true,
        },
        {
            name: 'Business',
            price: '$18',
            period: '/ month',
            credits: 'Unlimited (+10k)',
            features: ['Everything in Pro', 'Unlimited exports', 'Custom branding'],
            button: 'Subscribe',
            href: '/login',
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen bg-background py-24">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto">
                    Choose the best plan for you. Upgrade, downgrade, or cancel at any time.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`glass flex flex-col relative ${plan.popular ? 'border-primary shadow-[0_0_20px_rgba(0,212,255,0.2)]' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="text-sm">Includes {plan.credits}</CardDescription>
                                <div className="mt-4 flex items-baseline text-4xl font-extrabold">
                                    {plan.price}
                                    <span className="ml-1 text-xl font-medium text-muted-foreground">{plan.period}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-4">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-5 w-5 text-primary"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href={plan.href} className="w-full">
                                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                                        {plan.button}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
