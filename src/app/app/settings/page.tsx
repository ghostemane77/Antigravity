import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account preferences.</p>
            </div>

            <ProfileForm user={user} />

            <Card className="glass border-destructive/20">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive" className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-white">
                        Delete Account
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
