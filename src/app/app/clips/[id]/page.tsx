'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
    Play,
    Pause,
    Download,
    ChevronLeft,
    Type,
    Scissors,
    Settings2,
    Save,
    CheckCircle2,
    Clock,
    Plus,
    X,
    MessageSquare,
    Loader2,
    MoreHorizontal,
    Volume2,
    VolumeX
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Caption {
    text: string
    start: number
    end: number
}

export default function ClipEditorPage() {
    const { id } = useParams()
    const router = useRouter()
    const supabase = createClient()
    const videoRef = useRef<HTMLVideoElement>(null)

    const [clip, setClip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [captions, setCaptions] = useState<Caption[]>([])
    const [trimStart, setTrimStart] = useState(0)
    const [trimEnd, setTrimEnd] = useState(15)
    const [exporting, setExporting] = useState(false)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch clip details
                const { data: clipData, error: clipError } = await supabase
                    .from('clips')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (clipError) throw clipError
                setClip(clipData)

                // Fetch assets (captions)
                const { data: assetData } = await supabase
                    .from('clip_assets')
                    .select('*')
                    .eq('clip_id', id)
                    .single()

                if (assetData?.captions) {
                    setCaptions(assetData.captions as Caption[])
                } else {
                    // Default captions
                    setCaptions([
                        { text: "Seja bem-vindo ao futuro da edição", start: 0, end: 3 },
                        { text: "Neste vídeo vamos aprender como os virais funcionam", start: 3, end: 7 },
                        { text: "O algoritmo prioriza retenção e legenda", start: 7, end: 12 },
                    ])
                }

                if (assetData?.format_settings) {
                    const settings = assetData.format_settings as any
                    if (settings.trimStart !== undefined) setTrimStart(settings.trimStart)
                    if (settings.trimEnd !== undefined) setTrimEnd(settings.trimEnd)
                } else {
                    setTrimEnd(clipData.duration || 15)
                }
            } catch (error) {
                console.error('Error fetching clip:', error)
                // Fallback for development/non-existent UUIDs
                if (id === '1' || (typeof id === 'string' && id.length < 10)) {
                    setClip({ id, title: 'Highlight de Produtividade', preview_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', status: 'completed', category: 'podcast' })
                    setCaptions([
                        { text: "Exemplo de Legenda 1", start: 0, end: 5 },
                        { text: "Exemplo de Legenda 2", start: 5, end: 10 }
                    ])
                } else {
                    toast.error('Erro ao carregar o clip')
                    router.push('/app/clips')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, supabase, router])

    const handlePlayPause = () => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleTimeUpdate = () => {
        if (!videoRef.current) return
        setCurrentTime(videoRef.current.currentTime)
    }

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value)
        if (!videoRef.current) return
        videoRef.current.currentTime = time
        setCurrentTime(time)
    }

    const seekTo = (time: number) => {
        if (!videoRef.current) return
        videoRef.current.currentTime = time
        setCurrentTime(time)
        if (!isPlaying) {
            videoRef.current.play()
            setIsPlaying(true)
        }
    }

    const handleSaveDraft = async () => {
        setSaving(true)
        try {
            // Update clips table (category, etc)
            const { error: clipError } = await supabase
                .from('clips')
                .update({ category: clip.category })
                .eq('id', id)

            // Update or Insert clip_assets
            const { error: assetError } = await supabase
                .from('clip_assets')
                .upsert({
                    clip_id: id,
                    captions,
                    format_settings: {
                        trimStart,
                        trimEnd,
                        aspectRatio: '9:16'
                    },
                    updated_at: new Date().toISOString()
                }, { onConflict: 'clip_id' })

            if (clipError || assetError) throw clipError || assetError
            toast.success('Rascunho salvo com sucesso!')
        } catch (err) {
            toast.error('Erro ao salvar rascunho.')
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleExport = async () => {
        setExporting(true)
        const toastId = toast.loading('Processando exportação...')

        try {
            const res = await fetch('/api/exports/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clip_id: id,
                    captions,
                    title: clip?.title,
                    category: clip?.category,
                    trim_start: trimStart,
                    trim_end: trimEnd
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success('Clip exportado com sucesso!', { id: toastId })
                // Normally we'd redirect or provide download link
                if (data.export?.download_url) {
                    toast.info('Iniciando download...', { description: 'Seu arquivo estará pronto em segundos.' })
                }
            } else {
                toast.error(data.error || 'Erro na exportação', { id: toastId })
            }
        } catch (err) {
            toast.error('Falha na comunicação com o servidor.', { id: toastId })
            console.error(err)
        } finally {
            setExporting(false)
        }
    }

    const updateCaption = (index: number, field: keyof Caption, value: string | number) => {
        const newCaptions = [...captions]
        newCaptions[index] = { ...newCaptions[index], [field]: value }
        setCaptions(newCaptions)
    }

    const addCaption = () => {
        const lastEnd = captions.length > 0 ? captions[captions.length - 1].end : 0
        setCaptions([...captions, { text: "Novo trecho...", start: lastEnd, end: lastEnd + 3 }])
    }

    const removeCaption = (index: number) => {
        setCaptions(prev => prev.filter((_, i) => i !== index))
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground animate-pulse font-sora uppercase tracking-widest text-xs">Sincronizando ambiente...</p>
            </div>
        )
    }

    const activeCaption = captions.find(c => currentTime >= c.start && currentTime <= c.end)

    return (
        <div className="h-full flex flex-col gap-6 -mt-4 font-sora">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-4 glass border-white/5 px-6 rounded-2xl">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 btn-magnetic" onClick={() => router.back()}>
                        <ChevronLeft />
                    </Button>
                    <div>
                        <h1 className="font-sora font-bold text-lg">{clip?.title}</h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-2 font-fira">
                            <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px] ${clip?.status === 'completed' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50'}`} />
                            Status: {clip?.status}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl border-white/10 hover:bg-white/5 gap-2 h-9 text-xs font-bold btn-magnetic"
                        onClick={handleSaveDraft}
                        disabled={saving}
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        {saving ? 'SALVANDO...' : 'Salvar Rascunho'}
                    </Button>
                    <Button
                        onClick={handleExport}
                        disabled={exporting}
                        className="rounded-xl bg-primary shadow-[0_0_20px_rgba(123,97,255,0.3)] gap-2 h-9 text-xs px-6 font-bold btn-magnetic btn-slide"
                    >
                        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        <span className="relative z-10">{exporting ? 'EXPORTANDO...' : 'EXPORTAR CLIP'}</span>
                    </Button>
                </div>
            </div>

            {/* Editor Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left Pane - Video Preview */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="aspect-[9/16] bg-[#0A0A14] rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                        <video
                            ref={videoRef}
                            src={clip?.preview_url}
                            className="w-full h-full object-contain"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onClick={handlePlayPause}
                            muted={isMuted}
                        />

                        {/* Caption Overlay */}
                        {activeCaption && (
                            <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none text-center select-none z-30">
                                <span className="text-2xl font-sora font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] uppercase leading-tight">
                                    <span className="bg-primary px-2 py-1 inline-block">{activeCaption.text}</span>
                                </span>
                            </div>
                        )}

                        {/* Watermark */}
                        <div className="absolute bottom-6 right-6 opacity-30 select-none pointer-events-none z-20 transition-opacity group-hover:opacity-60 font-fira">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
                                <span className="text-[10px] font-black tracking-widest text-primary">CLIPX.AI</span>
                            </div>
                        </div>

                        {/* Centered Play Button on Pause */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all z-40">
                                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_30px_rgba(123,97,255,0.4)] cursor-pointer hover:scale-110 transition-all btn-magnetic" onClick={handlePlayPause}>
                                    <Play fill="white" size={24} className="ml-1" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compact Controls */}
                    <div className="glass border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <button onClick={handlePlayPause} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors btn-magnetic text-white">
                                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                            </button>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[10px] font-fira text-muted-foreground uppercase tracking-widest">
                                    <span>{currentTime.toFixed(1)}s</span>
                                    <span>{duration ? duration.toFixed(1) : '0.0'}s</span>
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 100}
                                    step={0.1}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(123,97,255,1)]"
                                />
                            </div>

                            <button onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-white transition-colors">
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Middle Pane - Caption Editor */}
                <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={16} className="text-primary" />
                            <h2 className="font-sora font-bold text-sm uppercase tracking-widest">Legendas Magnéticas</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] border-white/10 uppercase font-fira tracking-tight">Sincronizado</Badge>
                            <Badge variant="secondary" className="text-[9px] uppercase font-fira tracking-tight bg-white/5">{captions.length} Trechos</Badge>
                        </div>
                    </div>

                    <div className="flex-1 glass border-white/5 rounded-[2rem] overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {captions.map((cap, idx) => (
                            <div
                                key={idx}
                                onClick={() => seekTo(cap.start)}
                                className={`group p-4 rounded-2xl border transition-all cursor-pointer ${currentTime >= cap.start && currentTime <= cap.end
                                    ? 'bg-primary/5 border-primary/20 shadow-[inset_0_0_20px_rgba(123,97,255,0.05)] scale-[1.02]'
                                    : 'bg-white/5 border-transparent hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-fira text-muted-foreground bg-black/20 px-2 py-1 rounded-md">
                                            <Clock size={10} />
                                            <input
                                                type="number"
                                                value={cap.start}
                                                step={0.1}
                                                onChange={(e) => updateCaption(idx, 'start', parseFloat(e.target.value))}
                                                className="w-10 bg-transparent border-none p-0 focus:ring-0 text-white font-bold"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span>s</span>
                                            <span className="mx-1 opacity-30">|</span>
                                            <input
                                                type="number"
                                                value={cap.end}
                                                step={0.1}
                                                onChange={(e) => updateCaption(idx, 'end', parseFloat(e.target.value))}
                                                className="w-10 bg-transparent border-none p-0 focus:ring-0 text-white font-bold"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span>s</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 hover:bg-white/5 rounded btn-magnetic text-muted-foreground hover:text-white" onClick={(e) => e.stopPropagation()}><MoreHorizontal size={14} /></button>
                                        <button className="p-1 hover:bg-destructive/10 hover:text-destructive rounded btn-magnetic" onClick={(e) => { e.stopPropagation(); removeCaption(idx); }}><X size={14} /></button>
                                    </div>
                                </div>
                                <textarea
                                    value={cap.text}
                                    onChange={(e) => updateCaption(idx, 'text', e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-sm font-sora font-medium resize-none overflow-hidden h-auto p-0 text-white"
                                    rows={2}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        ))}
                        <Button
                            variant="ghost"
                            className="w-full border border-dashed border-white/10 rounded-2xl h-12 gap-2 text-muted-foreground hover:text-white hover:bg-white/5 transition-all btn-magnetic"
                            onClick={addCaption}
                        >
                            <Plus size={16} /> Adicionar Novo Trecho
                        </Button>
                    </div>
                </div>

                {/* Right Pane - Controls/Settings */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <div className="glass border-white/5 rounded-[2rem] p-6 space-y-8">
                        {/* Branding */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Settings2 size={16} className="text-primary" />
                                <h2 className="font-sora font-bold text-sm uppercase tracking-widest">Ajustes</h2>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Categoria do Conteúdo</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Podcast', 'Vlog', 'Gaming', 'Educativo'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setClip({ ...clip, category: cat.toLowerCase() })}
                                            className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all btn-magnetic ${clip?.category === cat.toLowerCase()
                                                ? 'bg-primary border-primary shadow-[0_0_15px_rgba(123,97,255,0.4)] text-white'
                                                : 'bg-white/5 border-white/5 hover:border-white/20 text-muted-foreground'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5 font-sora">
                                <label className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Template Visual</label>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white/5 rounded-xl border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(123,97,255,0.1)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center"><Type size={14} className="text-primary" /></div>
                                            <span className="text-xs font-bold font-instrument italic text-white uppercase tracking-tight">VAPOR CLINIC (Padrão)</span>
                                        </div>
                                        <CheckCircle2 size={16} className="text-primary shadow-[0_0_10px_rgba(123,97,255,0.5)]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Export Preview / Meta */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Scissors size={16} className="text-primary" />
                                <h2 className="font-sora font-bold text-sm uppercase tracking-widest">Corte Final (Trim)</h2>
                            </div>

                            <div className="p-4 bg-[#0A0A14] rounded-2xl border border-white/5 space-y-5">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-fira uppercase">
                                        <span className="text-muted-foreground">Início / Fim</span>
                                        <span className="text-primary font-bold">{trimStart.toFixed(1)}s - {trimEnd.toFixed(1)}s</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] text-muted-foreground w-8 font-fira">START</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={duration || 30}
                                                step={0.1}
                                                value={trimStart}
                                                onChange={(e) => setTrimStart(Math.min(parseFloat(e.target.value), trimEnd - 0.5))}
                                                className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[9px] text-muted-foreground w-8 font-fira">END</span>
                                            <input
                                                type="range"
                                                min={0}
                                                max={duration || 30}
                                                step={0.1}
                                                value={trimEnd}
                                                onChange={(e) => setTrimEnd(Math.max(parseFloat(e.target.value), trimStart + 0.5))}
                                                className="flex-1 h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-[10px] font-fira border-t border-white/5 pt-3">
                                    <span className="text-muted-foreground uppercase">Duração Total</span>
                                    <span className="text-primary font-bold">{(trimEnd - trimStart).toFixed(1)}s</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-fira">
                                    <span className="text-muted-foreground uppercase">Qualidade</span>
                                    <span className="font-bold text-white">1080x1920 (9:16)</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-fira">
                                    <span className="text-muted-foreground uppercase">Watermark</span>
                                    <span className="text-emerald-500 font-bold">Ativa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
