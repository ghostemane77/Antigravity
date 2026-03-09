import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Activity, Plus, Video, PlayCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UpgradeModule } from '@/components/dashboard/UpgradeModule'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch user profile and credits
    const { data: credits } = await supabase
        .from('credits')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const { data: clips } = await supabase
        .from('clips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

    const planType = credits?.plan_type || 'free'
    const balance = credits?.balance ?? 0

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-outfit font-bold">Dashboard</h1>
                <Link href="/app/create">
                    <Button className="gap-2">
                        <Plus size={16} /> New Clip
                    </Button>
                </Link>
            </div>

            <UpgradeModule planType={planType} />

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{balance}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Plan: {planType.toUpperCase()}
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Clips</CardTitle>
                        <Video className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{clips?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">Created this month</p>
                    </CardContent>
                </Card>

                <Card className="glass flex items-center justify-center p-6 text-center">
                    <div className="space-y-2">
                        <h3 className="font-medium text-lg">Need more credits?</h3>
                        <Link href="/app/billing">
                            <Button variant="outline" size="sm">Upgrade Plan</Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <div>
                <div className="grid md:grid-cols-3 gap-6">
                    {clips && clips.length > 0 ? (
                        clips.map((clip) => (
                            <Card key={clip.id} className="glass overflow-hidden group">
                                <div className="aspect-[9/16] bg-secondary relative flex items-center justify-center border-b border-border group-hover:bg-primary/5 transition-colors">
                                    <PlayCircle size={48} className="text-muted-foreground group-hover:text-primary transition-colors delay-100" />
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur text-[10px] uppercase font-bold text-primary rounded-sm">
                                        {clip.status}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold truncate" title={clip.title}>{clip.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{new Date(clip.created_at).toLocaleDateString()}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-12 border border-dashed border-border rounded-lg text-muted-foreground">
                            No clips yet. <Link href="/app/create" className="text-primary underline">Create your first clip</Link> to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
