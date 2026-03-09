import { resetPassword } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPasswordPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center p-4">
            <Card className="w-full max-w-sm glass">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email and we will send you a password reset link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <Button formAction={resetPassword} className="w-full">
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
