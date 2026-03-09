import Link from 'next/link'
import { LogOut, Home, Video, PieChart, CreditCard, Settings, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

import Image from 'next/image'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 glass border-r border-border md:h-screen flex flex-col sticky top-0">
                <div className="p-6">
                    <Link href="/app/dashboard">
                        <div className="relative w-28 h-8">
                            <Image src="/logo.png" alt="ClipX" fill className="object-contain object-left" priority />
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <Link href="/app/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md bg-white/5 text-foreground font-medium">
                        <Home size={18} /> Dashboard
                    </Link>
                    <Link href="/app/create" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <Video size={18} /> Create Clip
                    </Link>
                    <Link href="/app/clips" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <LayoutTemplate size={18} /> My Clips
                    </Link>
                    <Link href="/app/templates" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <LayoutTemplate size={18} /> Templates
                    </Link>
                    <Link href="/app/analytics" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <PieChart size={18} /> Analytics
                    </Link>
                    <Link href="/app/billing" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <CreditCard size={18} /> Billing
                    </Link>
                    <Link href="/app/settings" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <Settings size={18} /> Settings
                    </Link>
                </nav>

                <div className="p-4 mt-auto">
                    <form action="/auth/signout" method="POST">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-red-400 hover:bg-red-400/10">
                            <LogOut size={18} /> Logout
                        </Button>
                    </form>
                    <div className="mt-4 px-2 truncate text-xs text-muted-foreground opacity-50">
                        {user.email}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
