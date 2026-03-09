'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Play,
    MoreVertical,
    Edit2,
    Download,
    Trash2,
    Clock,
    Calendar,
    Search,
    Filter,
    Plus,
    Loader2,
    VideoIcon
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function ClipsPage() {
    const [clips, setClips] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchClips = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('clips')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setClips(data)
            }
            setLoading(false)
        }

        fetchClips()
    }, [supabase, router])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this clip?')) return
        const { error } = await supabase.from('clips').delete().eq('id', id)
        if (!error) {
            setClips(prev => prev.filter(c => c.id !== id))
        }
    }

    const filteredClips = clips.filter(clip =>
        clip.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="aspect-[9/16] bg-white/5 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-sora font-bold tracking-tight bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                        Seus <span className="font-instrument italic text-primary">Clips</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 font-sora">
                        Gerencie e edite seus melhores momentos virais.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar clips..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm font-sora focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all"
                        />
                    </div>
                    <Link href="/app/create">
                        <Button className="rounded-xl gap-2 btn-magnetic btn-slide shadow-[0_0_20px_rgba(123,97,255,0.2)]">
                            <Plus size={18} /> <span className="relative z-10">Novo Clip</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {filteredClips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredClips.map((clip) => (
                        <ClipCard key={clip.id} clip={clip} onDelete={() => handleDelete(clip.id)} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 glass rounded-[3rem] border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <VideoIcon size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-xl font-sora font-bold text-white mb-2">Nenhum clip encontrado</h3>
                    <p className="text-muted-foreground max-w-xs text-center mb-8 font-sora">
                        {searchTerm ? 'Tente mudar o termo da busca.' : 'Comece agora colando um link do YouTube.'}
                    </p>
                    <Link href="/app/create">
                        <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5 btn-magnetic">
                            Começar
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}

function ClipCard({ clip, onDelete }: { clip: any, onDelete: () => void }) {
    const statusMap: any = {
        completed: { label: 'Pronto', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
        processing: { label: 'Processando', color: 'bg-primary/10 text-primary border-primary/20 animate-pulse' },
        pending: { label: 'Fila', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        failed: { label: 'Falhou', color: 'bg-destructive/10 text-destructive border-destructive/20' }
    }

    const currentStatus = statusMap[clip.status] || { label: clip.status, color: 'bg-white/10 text-white' }

    return (
        <Card className="group glass border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Link href={`/app/clips/${clip.id}`} className="block relative aspect-[9/16] overflow-hidden">
                {/* Thumbnail / Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-transparent to-transparent opacity-80 z-10" />

                {clip.thumbnail_url ? (
                    <img
                        src={clip.thumbnail_url}
                        alt={clip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className={`w-full h-full flex flex-col items-center justify-center bg-secondary transition-colors duration-500 ${clip.status === 'processing' ? 'animate-pulse' : ''}`}>
                        {/* Dynamic Template Pattern */}
                        {clip.template_id === 'neon' ? (
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#7B61FF_0%,_transparent_70%)]" />
                        ) : null}
                        <Play size={40} className="text-white/20 group-hover:text-primary transition-all duration-500 group-hover:scale-125 z-20" />
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute top-4 right-4 z-20">
                    <Badge className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest border ${currentStatus.color} font-fira`}>
                        {currentStatus.label}
                    </Badge>
                </div>

                {clip.duration && (
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/5">
                        <Clock size={12} className="text-primary" />
                        <span className="text-[11px] font-fira text-white/90">{clip.duration}s</span>
                    </div>
                )}
            </Link>

            <CardContent className="p-5 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="font-sora font-bold text-sm text-white truncate group-hover:text-primary transition-colors" title={clip.title}>
                            {clip.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold bg-white/5 px-2 py-0.5 rounded font-fira">
                                {clip.category || 'Viral Clip'}
                            </span>
                        </div>
                    </div>
                    {/* Actions Menu */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                            onClick={(e) => { e.preventDefault(); onDelete(); }}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg text-muted-foreground transition-colors btn-magnetic"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-fira">
                        <Calendar size={12} />
                        <span>{formatDistanceToNow(new Date(clip.created_at), { addSuffix: true, locale: ptBR })}</span>
                    </div>
                    <Link href={`/app/clips/${clip.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs hover:bg-primary/10 hover:text-primary rounded-lg font-bold font-sora btn-magnetic">
                            EDITAR
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
