import { signup, signInWithGoogle } from '../login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#0a0e17] font-inter">
            <div className="w-full max-w-md bg-[#131823] border border-white/5 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center mb-8">
                    <Image src="/logo.png" alt="ClipX" width={120} height={40} className="object-contain" priority />
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2 font-outfit">Sign Up</h1>
                    <p className="text-gray-400 text-sm">
                        Create a new account to start turning videos into viral clips.
                    </p>
                </div>

                <form className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            className="bg-[#1a202c] border-[#2d3748] text-white placeholder:text-gray-500 focus-visible:ring-cyan-400"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="bg-[#1a202c] border-[#2d3748] text-white focus-visible:ring-cyan-400"
                        />
                    </div>

                    <Button formAction={signup} className="w-full bg-[#00d4ff] hover:bg-[#00b8e6] text-black font-bold text-base py-6 rounded-xl mt-2 transition-all">
                        Create Account
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#131823] px-4 text-gray-500 tracking-wider">
                                OU CONTINUE COM
                            </span>
                        </div>
                    </div>

                    <Button formAction={signInWithGoogle} formNoValidate variant="outline" className="w-full bg-[#1a202c] border-transparent text-white hover:bg-[#2d3748] hover:text-white py-6 rounded-xl transition-all">
                        <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:text-[#00d4ff] transition underline-offset-4 hover:underline">
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
