import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockTemplates = [
    { id: 'recess', name: 'Recess', style: 'bg-gradient-to-br from-blue-500 to-purple-600', tags: ['Gaming', 'Dynamic'] },
    { id: 'cinematic-ii', name: 'Cinematic II', style: 'bg-gradient-to-br from-slate-800 to-black', tags: ['Podcast', 'Minimal'] },
    { id: 'pulse', name: 'Pulse', style: 'bg-gradient-to-tr from-rose-400 to-red-500', tags: ['Vlog', 'Bold'] },
    { id: 'neon', name: 'Neon', style: 'bg-gradient-to-br from-pink-500 to-orange-400', tags: ['Trendy', 'Glow'] },
    { id: 'velocity', name: 'Velocity', style: 'bg-gradient-to-br from-green-400 to-cyan-500', tags: ['Fast', 'Action'] },
    { id: 'blueprint', name: 'Blueprint', style: 'bg-gradient-to-bl from-blue-900 to-indigo-900', tags: ['Educator', 'Clean'] },
]

export default function TemplatesPage() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-outfit font-bold">Templates</h1>
                <p className="text-muted-foreground mt-2">Choose the perfect style for your clips. AI automatically adapts timing and pacing.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockTemplates.map((t) => (
                    <Card key={t.id} className="glass overflow-hidden cursor-pointer group hover:border-primary transition-all">
                        <div className={`aspect-[4/5] relative ${t.style} flex items-center justify-center p-6`}>
                            {/* Mock Captions Representation */}
                            <div className="text-center font-extrabold text-white text-3xl uppercase tracking-tighter mix-blend-overlay opacity-80 group-hover:scale-110 transition-transform duration-500">
                                {t.name}
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium border border-white/20 shadow-lg">Preview</span>
                            </div>
                        </div>
                        <CardContent className="p-4 flex justify-between items-center bg-background/50">
                            <h3 className="font-bold">{t.name}</h3>
                            <div className="flex gap-2">
                                {t.tags.map(tag => (
                                    <Badge variant="secondary" key={tag} className="text-[10px] bg-white/5 border-white/10">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
