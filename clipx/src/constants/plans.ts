export const PLANS = {
    FREE: {
        id: 'free',
        name: 'Free',
        credits: 90,
        priceId: '',
        price: 0,
        features: ['90 Credits per month', 'Standard processing', 'ClipX watermark', 'Community support'],
    },
    STARTER: {
        id: 'starter',
        name: 'Starter',
        credits: 300,
        priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_starter_mock',
        price: 9,
        features: ['300 Credits per month', 'Faster processing', 'Remove watermark', 'Email support'],
    },
    PRO: {
        id: 'pro',
        name: 'Pro',
        credits: 800,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_mock',
        price: 19,
        features: ['800 Credits per month', 'Priority processing', 'Remove watermark', 'Priority support', 'All templates'],
    },
    BUSINESS: {
        id: 'business',
        name: 'Business',
        credits: 2000,
        priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || 'price_business_mock',
        price: 49,
        features: ['2000 Credits per month', 'Enterprise processing', 'Custom branding', 'Dedicated support', 'Team access'],
    }
} as const;

export type PlanType = keyof typeof PLANS;
export type Plan = typeof PLANS[PlanType];

export function getPlanByPriceId(priceId: string): Plan | undefined {
    return Object.values(PLANS).find(p => p.priceId === priceId);
}

export function getPlanByType(type: string): Plan {
    return (PLANS as any)[type.toUpperCase()] || PLANS.FREE;
}
