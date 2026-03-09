'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, Link as LinkIcon, Upload, Loader2, Video as VideoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

const templates = [
    { id: 'recess', name: 'Recess', style: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'neon', name: 'Neon', style: 'bg-gradient-to-br from-pink-500 to-orange-400' },
    { id: 'velocity', name: 'Velocity', style: 'bg-gradient-to-br from-green-400 to-cyan-500' }
]

export default function CreateClipPage() {
    const router = useRouter()
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [template, setTemplate] = useState('recess')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/jobs/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source_url: url,
                    template_id: template,
                    title: title || 'Untitled Clip'
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create job')
            }

            // Redirect to clips page to wait
            router.push('/app/clips')

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-outfit font-bold">Create Viral Clip</h1>
                <p className="text-muted-foreground mt-2">Drop a link or upload a video to let the AI find the best viral moments.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="glass border-primary/20 shadow-[0_0_15px_rgba(0,212,255,0.05)]">
                    <CardHeader>
                        <CardTitle>Source</CardTitle>
                        <CardDescription>YouTube, TikTok, or direct video URL.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="url">Video Link</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="url"
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="pl-9"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Clip Title</Label>
                                <Input
                                    id="title"
                                    placeholder="My Awesome Podcast Ep 12"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Choose Template</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {templates.map(t => (
                                        <div
                                            key={t.id}
                                            onClick={() => setTemplate(t.id)}
                                            className={`cursor-pointer rounded-lg border-2 p-1 transition-all ${template === t.id ? 'border-primary scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <div className={`aspect-[9/16] rounded flex items-center justify-center text-white font-bold text-xs ${t.style}`}>
                                                {t.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <Button type="submit" className="w-full text-lg py-6" disabled={loading || !url || !title}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <VideoIcon className="mr-2 h-5 w-5" />}
                                {loading ? 'Generating Magic...' : 'Generate Clips (10 Credits)'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Upload Dropzone Mock */}
                <Card className="glass bg-secondary/30 border-dashed border-2 flex flex-col items-center justify-center p-12 text-center text-muted-foreground hover:bg-white/5 transition-colors cursor-pointer group">
                    <Upload size={48} className="mb-4 text-primary/50 group-hover:text-primary transition-colors" />
                    <h3 className="text-xl font-bold font-outfit mb-2 text-foreground">Upload Local File</h3>
                    <p className="text-sm">Drag and drop your MP4, MOV, or WEBM file here.</p>
                    <p className="text-xs mt-4">Max file size: 2GB. Max duration: 2 hours.</p>
                </Card>
            </div>
        </div>
    )
}
