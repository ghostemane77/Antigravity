import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Activity, Eye, ThumbsUp } from 'lucide-react'

export default function AnalyticsPage() {
    // Using static mock data since recharts needs client-side wrapper and we want simple server component for MVP
    // If we wanted real charts we'd make a 'use client' Recharts wrapper.

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-outfit font-bold">Analytics</h1>
                <p className="text-muted-foreground mt-2">Track your clip performance across social platforms.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                <StatCard title="Total Views" value="2.4M" trend="+12%" icon={<Eye className="text-primary" />} />
                <StatCard title="Engagements" value="142K" trend="+5%" icon={<ThumbsUp className="text-primary" />} />
                <StatCard title="Growth Rate" value="18%" trend="+2%" icon={<Activity className="text-primary" />} />
                <StatCard title="Clips Posted" value="45" trend="steady" icon={<BarChart className="text-primary" />} />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Views Over Time</CardTitle>
                        <CardDescription>Last 30 days performance</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-end gap-2 pb-0 opacity-80">
                        {/* Mock Bar Chart using simple divs */}
                        {[40, 20, 60, 40, 80, 100, 60, 50, 90, 120, 80, 60].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/60 hover:bg-primary transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Top Performing Clips</CardTitle>
                        <CardDescription>Clips with highest engagement</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-xs font-mono">C{i}</div>
                                        <div>
                                            <p className="font-medium text-sm">Podcast Highlight {i}</p>
                                            <p className="text-xs text-muted-foreground">{100 - i * 10}k views</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary">{5 + i * 2}%</p>
                                        <p className="text-xs text-muted-foreground">CTR</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatCard({ title, value, trend, icon }: { title: string, value: string, trend: string, icon: React.ReactNode }) {
    return (
        <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold font-outfit">{value}</div>
                <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-400' : 'text-muted-foreground'}`}>{trend} relative to last month</p>
            </CardContent>
        </Card>
    )
}
