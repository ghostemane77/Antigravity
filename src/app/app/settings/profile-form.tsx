'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import InputMask from 'react-input-mask'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Invalid phone number format'),
    websiteUrl: z.string().url('Invalid URL').or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

type UserProps = {
    email?: string,
    user_metadata?: {
        full_name?: string,
        phone?: string,
        website_url?: string
    }
}

export default function ProfileForm({ user }: { user: UserProps }) {
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState('')

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || '',
            websiteUrl: user.user_metadata?.website_url || '',
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true)
        setMessage('')

        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: data.name,
                phone: data.phone,
                website_url: data.websiteUrl,
            }
        })

        if (error) {
            setMessage('Error saving profile: ' + error.message)
        } else {
            setMessage('Profile updated successfully!')
        }

        setIsSaving(false)
    }

    return (
        <Card className="glass">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={user?.email} disabled className="bg-secondary/50" />
                        <p className="text-xs text-muted-foreground">Email changing is disabled in MVP.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input id="name" placeholder="Creator Name" {...form.register('name')} />
                        {form.formState.errors.name && (
                            <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <InputMask
                            mask="(99) 99999-9999"
                            {...form.register('phone')}
                        >
                            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => <Input id="phone" placeholder="(11) 99999-9999" {...inputProps} />}
                        </InputMask>
                        {form.formState.errors.phone && (
                            <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website URL</Label>
                        <Input id="websiteUrl" placeholder="https://youtube.com/..." {...form.register('websiteUrl')} />
                        {form.formState.errors.websiteUrl && (
                            <p className="text-xs text-red-500">{form.formState.errors.websiteUrl.message}</p>
                        )}
                    </div>

                    {message && <p className="text-sm font-medium text-emerald-500">{message}</p>}

                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
