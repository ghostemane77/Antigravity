'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointer2, Settings2, Sparkles, MoveRight, Layers, Workflow, Activity, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Navbar Transformation
      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'nav-scrolled', targets: '.navbar-container' },
      });

      // Hero Animation
      gsap.from('.hero-element', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Philosophy Split Text mock
      gsap.from('.philosophy-line', {
        scrollTrigger: {
          trigger: '.philosophy-section',
          start: 'top 70%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out'
      });

      // Shuffler Animation
      const cards = gsap.utils.toArray('.shuffler-card');
      if (cards.length > 0) {
        gsap.to(cards, {
          y: (i) => -i * 12,
          scale: (i) => 1 - i * 0.05,
          opacity: (i) => 1 - i * 0.2,
          duration: 0.5,
          ease: 'power2.inOut',
          stagger: 0.1
        });
      }

      // Sticky Stacking Cards (Protocol)
      const protocolCards = gsap.utils.toArray('.protocol-card');
      protocolCards.forEach((card: any, i) => {
        if (i === protocolCards.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          endTrigger: '.protocol-section',
          end: 'bottom bottom',
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.5,
            filter: 'blur(20px)',
            ease: 'power2.inOut'
          }),
          scrub: true,
        });
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/30 relative">
      <div className="noise-overlay"></div>

      {/* A. NAVBAR - A Ilha Flutuante */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 navbar-container px-2">
        <nav className="glass rounded-[2rem] px-6 py-3 flex items-center justify-between gap-12 transition-all">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="ClipX" width={80} height={24} className="object-contain" priority />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors text-white/80 hover:-translate-y-[1px]">Features</Link>
            <Link href="#protocol" className="hover:text-primary transition-colors text-white/80 hover:-translate-y-[1px]">Protocolo</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors text-white/80 hover:-translate-y-[1px]">Premium</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-white/80 hover:text-primary transition-colors">Entrar</Link>
            <Link href="/signup">
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-[2rem] text-sm font-bold shadow-[0_0_20px_rgba(123,97,255,0.3)] hover:scale-105 hover:bg-white transition-all transform origin-center" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                Gerar Cortes
              </button>
            </Link>
          </div>
        </nav>
      </div>

      {/* B. HERO SECTION - A Cena de Abertura */}
      <section className="relative h-[100dvh] flex items-center px-8 md:px-16 overflow-hidden">
        {/* Background Image & Gradient */}
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Dark marble luxury texture" fill className="object-cover opacity-30 mix-blend-luminosity" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-end h-full pb-24 md:pb-32">
          <div className="max-w-4xl pt-32">
            <h1 className="hero-element flex flex-col">
              <span className="font-sans font-bold text-3xl md:text-5xl tracking-tight text-white/80 mb-2 uppercase">A escala em conteúdo encontra a</span>
              <span className="font-playfair italic text-7xl md:text-[8rem] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-primary text-gradient-subtle">
                Precisão.
              </span>
            </h1>

            <p className="hero-element mt-8 text-lg md:text-xl text-white/60 font-sans max-w-2xl leading-relaxed">
              ClipX é um instrumento profissional impulsionado por IA que transforma vídeos longos em recortes virais curtos para TikTok, Reels e Shorts — frame a frame, com enquadramento e retenção absolutos.
            </p>

            <div className="hero-element mt-12 flex flex-wrap gap-4 items-center">
              <Link href="/signup">
                <button className="relative overflow-hidden bg-primary text-primary-foreground px-8 py-4 rounded-[2rem] text-lg font-bold shadow-[0_0_30px_rgba(123,97,255,0.4)] hover:scale-105 transition-transform group flex items-center gap-2" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                  <span className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                  <span className="relative z-10 mix-blend-difference group-hover:text-black">Gerar meus primeiros cortes</span>
                  <MoveRight className="relative z-10 w-5 h-5 mix-blend-difference group-hover:text-black opacity-70" />
                </button>
              </Link>
              <Link href="#features">
                <button className="px-8 py-4 rounded-[2rem] text-lg font-medium border border-white/10 hover:bg-white/5 transition-all hover:scale-105" style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
                  Ver exemplos de cortes
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* C. FEATURES - Artefatos Funcionais Interativos */}
      <section id="features" className="py-32 px-8 md:px-16 max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center md:text-left">
          <h2 className="font-playfair italic text-5xl md:text-6xl text-white mb-6">Instrumentos de Viralidade</h2>
          <p className="text-white/50 text-xl max-w-xl font-sans">
            Construído não como um site genérico, mas como um motor de inteligência central projetado para maximizar retenção e alcance orgânico.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 - Diagnostic Shuffler */}
          <div className="glass rounded-[2rem] p-8 flex flex-col h-[450px] relative overflow-hidden group hover:-translate-y-[2px] transition-transform">
            <div className="flex justify-between items-center mb-12">
              <Layers className="w-6 h-6 text-primary" />
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-mono">LÓGICA: AUTOMÁTICA</div>
            </div>

            <div className="relative h-40 w-full flex justify-center mb-8">
              <div className="absolute w-3/4 h-32 bg-[#1A1A24] rounded-2xl border border-white/10 shuffler-card flex items-center justify-center p-4 text-center shadow-lg">
                <span className="text-sm font-medium">Extração de Ganchos</span>
              </div>
              <div className="absolute w-3/4 h-32 bg-[#22222E] rounded-2xl border border-white/5 shuffler-card flex items-center justify-center p-4 text-center z-10 shadow-lg">
                <span className="text-sm font-medium">Reconhecimento de Fala</span>
              </div>
              <div className="absolute w-3/4 h-32 bg-primary/10 rounded-2xl border border-primary/20 shuffler-card flex items-center justify-center p-4 text-center z-20 shadow-[0_0_15px_rgba(123,97,255,0.1)]">
                <span className="text-sm font-bold text-primary">Cortes Virais em Minutos</span>
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="font-sans font-bold text-2xl mb-2 text-white">Múltiplas Versões</h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                A IA identifica os trechos mais fortes e gera variações completas em velocidade recorde, cortando o processo manual viciante.
              </p>
            </div>
          </div>

          {/* Card 2 - Telemetry Typewriter */}
          <div className="glass rounded-[2rem] p-8 flex flex-col h-[450px] relative overflow-hidden group hover:-translate-y-[2px] transition-transform">
            <div className="flex justify-between items-center mb-8">
              <Workflow className="w-6 h-6 text-primary" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-mono text-white/50">LIVE FEED</span>
              </div>
            </div>

            <div className="flex-1 bg-black/50 rounded-xl border border-white/5 p-4 font-jetbrains text-xs text-primary leading-loose tracking-wider overflow-hidden">
              {`> initializing processing...\n> detecting aspect ratio...\n> auto-framing on face...\n> sync: captioning generated\n> status: READY_TO_PUBLISH_`}<span className="animate-pulse bg-primary w-2 h-4 inline-block ml-1 align-middle"></span>
            </div>

            <div className="mt-8">
              <h3 className="font-sans font-bold text-2xl mb-2 text-white">Pronto para Publicar</h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                Padrão vertical 9:16 nativo com enquadramento inteligente no ator e legendas dinâmicas perfeitamente ajustadas.
              </p>
            </div>
          </div>

          {/* Card 3 - Cursor Protocol Scheduler */}
          <div className="glass rounded-[2rem] p-8 flex flex-col h-[450px] relative overflow-hidden group hover:-translate-y-[2px] transition-transform">
            <div className="flex justify-between items-center mb-8">
              <Settings2 className="w-6 h-6 text-primary" />
              <div className="bg-white/5 text-white/80 px-3 py-1 rounded-full text-xs font-mono">ESCALA PRO</div>
            </div>

            <div className="relative flex-1 bg-black/30 rounded-xl border border-white/5 p-4 flex flex-col">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-[10px] text-center text-white/40 font-jetbrains">{d}</div>
                ))}
                {[...Array(14)].map((_, i) => (
                  <div key={`cell-${i}`} className={`aspect-square rounded-[4px] ${i === 9 ? 'bg-primary/40 border border-primary animate-pulse' : 'bg-white/5'}`}></div>
                ))}
              </div>
              <div className="mt-auto self-end pointer-events-none">
                <MousePointer2 className="w-8 h-8 text-white -rotate-12 translate-x-4 translate-y-4" />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-sans font-bold text-2xl mb-2 text-white">Escala Profissional</h3>
              <p className="text-sm text-white/50 leading-relaxed font-sans">
                De 1 vídeo longo brotam diversos cortes mantendo consistência e redução absurda de tempo/custo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* D. PHILOSOPHY - O Manifesto */}
      <section className="py-32 bg-black relative px-8 md:px-16 overflow-hidden philosophy-section">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2000&auto=format&fit=crop" alt="Dark organic texture" fill className="object-cover grayscale" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-12">
          <p className="philosophy-line text-xl md:text-2xl text-white/40 font-sans font-medium max-w-2xl">
            A maioria da indústria foca em edição genérica, onde a quantidade de templates sobrepõe as métricas de engajamento humano.
          </p>
          <p className="philosophy-line text-4xl md:text-7xl font-playfair italic text-white leading-tight">
            Nós focamos em <span className="text-primary not-italic font-sans font-bold underline decoration-white/20 underline-offset-8">engenharia de retenção</span> profunda, transformando tempo assíncrono em tráfego exponencial.
          </p>
        </div>
      </section>

      {/* E. PROTOCOL - Sticky Stacking */}
      <section id="protocol" className="relative py-24 protocol-section bg-background">
        <div className="max-w-4xl mx-auto px-8 mb-20 text-center">
          <h2 className="font-playfair italic text-5xl text-white mb-4">O Protocolo ClipX</h2>
          <p className="text-white/50 font-jetbrains text-sm uppercase tracking-widest">Procedimento Fixo de Operação</p>
        </div>

        <div className="flex flex-col items-center gap-[50vh] pb-[50vh]">
          {/* Step 1 */}
          <div className="protocol-card w-full max-w-5xl h-[70vh] glass rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 sticky top-[15vh]">
            <div className="flex-1 space-y-6">
              <div className="text-primary font-jetbrains text-xl">STEP_01</div>
              <h3 className="font-sans font-bold text-5xl md:text-6xl">Upload Bruto.</h3>
              <p className="text-xl text-white/60 font-sans max-w-md">Insira URLs robustas ou submeta arquivos diretos. Nossos tenents de processamento deglutem podcasts em segundos.</p>
            </div>
            <div className="w-64 h-64 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-white/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed"></div>
              <div className="absolute inset-4 border border-primary/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="protocol-card w-full max-w-5xl h-[70vh] glass rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 sticky top-[15vh] bg-[#0E0E14]">
            <div className="flex-1 space-y-6">
              <div className="text-accent font-jetbrains text-xl">STEP_02</div>
              <h3 className="font-sans font-bold text-5xl md:text-6xl">Curadoria de IA.</h3>
              <p className="text-xl text-white/60 font-sans max-w-md">Análise semântica frame a frame. A IA encontra picos emocionais e estabelece limites exatos de tempo.</p>
            </div>
            <div className="w-64 h-64 relative bg-black/50 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-4">
              <div className="w-full h-full border border-white/5 rounded grid grid-cols-4 grid-rows-4 relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/80 shadow-[0_0_10px_#4A90E2] animate-[bounce_2s_infinite]"></div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="protocol-card w-full max-w-5xl h-[70vh] glass rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 sticky top-[15vh] bg-[#110E1A]">
            <div className="flex-1 space-y-6">
              <div className="text-primary font-jetbrains text-xl">STEP_03</div>
              <h3 className="font-sans font-bold text-5xl md:text-6xl">Distribuição em Massa.</h3>
              <p className="text-xl text-white/60 font-sans max-w-md">Exportação pronta no formato 9:16. Com marcas d'água removidas em tiers avançados, seu alcance decola.</p>
            </div>
            <div className="w-64 h-64 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                <path fill="none" stroke="currentColor" strokeWidth="2" d="M0,50 Q25,0 50,50 T100,50" className="opacity-80 animate-pulse" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* F. MEMBERSHIP / PRICING */}
      <section id="pricing" className="py-32 px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-playfair italic text-5xl text-white mb-6">Acesso à Engenharia</h2>
          <p className="text-white/50 text-xl font-sans">Níveis de assinatura calibrados para criadores, editores e empresas de mídia.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Tier 1 */}
          <div className="glass rounded-[2.5rem] p-8 border border-white/5 h-fit">
            <h3 className="font-sans text-2xl font-bold mb-2">Essencial</h3>
            <div className="font-jetbrains text-4xl mb-6">$0<span className="text-sm text-white/40">/mês</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> 90 Créditos a cada 15 dias</li>
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> Resolução 720p</li>
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> Marca d'água ClipX</li>
            </ul>
            <Link href="/signup">
              <button className="w-full py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium">
                Testar Grátis
              </button>
            </Link>
          </div>

          {/* Tier 2 - Highlighted */}
          <div className="bg-secondary rounded-[2.5rem] p-10 border border-primary ring-1 ring-primary/30 relative transform md:-translate-y-4 shadow-[0_0_50px_rgba(123,97,255,0.15)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black font-bold px-4 py-1 rounded-full text-xs tracking-wider">RECOMENDADO</div>
            <h3 className="font-sans text-2xl font-bold mb-2">Performance</h3>
            <div className="font-jetbrains text-5xl mb-6 text-primary">$39<span className="text-sm text-white/40">/mês</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-sm text-white/90"><CheckCircle2 className="w-5 h-5 text-primary" /> 1000 Créditos mensais</li>
              <li className="flex gap-3 text-sm text-white/90"><CheckCircle2 className="w-5 h-5 text-primary" /> Qualidade 4K Master</li>
              <li className="flex gap-3 text-sm text-white/90"><CheckCircle2 className="w-5 h-5 text-primary" /> Sem marca d'água</li>
              <li className="flex gap-3 text-sm text-white/90"><CheckCircle2 className="w-5 h-5 text-primary" /> Multi-exportação via API</li>
            </ul>
            <Link href="/signup">
              <button className="w-full py-4 rounded-full bg-primary text-background hover:bg-white transition-colors font-bold shadow-lg shadow-primary/20">
                Assinar Performance
              </button>
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="glass rounded-[2.5rem] p-8 border border-white/5 h-fit">
            <h3 className="font-sans text-2xl font-bold mb-2">Enterprise</h3>
            <div className="font-jetbrains text-4xl mb-6">$129<span className="text-sm text-white/40">/mês</span></div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> Créditos Ilimitados</li>
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> Integração Direta (SSO)</li>
              <li className="flex gap-3 text-sm text-white/70"><CheckCircle2 className="w-5 h-5 text-white/30" /> Suporte Dedicado em tempo real</li>
            </ul>
            <Link href="/signup">
              <button className="w-full py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium">
                Falar com Vendas
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* G. FOOTER */}
      <footer className="mt-24 bg-card rounded-t-[4rem] pt-20 pb-12 px-8 md:px-16 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Image src="/logo.png" alt="ClipX" width={100} height={32} className="object-contain mb-6" />
            <p className="text-white/40 text-sm max-w-xs font-sans leading-relaxed">
              Engenharia de precisão para retenção. Automação pesada para a mídia criadora contemporânea.
            </p>

            {/* System Operational Indicator */}
            <div className="mt-8 flex items-center gap-3 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="font-jetbrains text-xs text-white/60 tracking-wider">SYSTEM OPERATIONAL</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 font-sans">Ecossistema</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="#" className="hover:text-primary transition-colors">Manifesto</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Casos de Uso</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 font-sans">Legal</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><Link href="#" className="hover:text-primary transition-colors">Termos de Serviço</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacidade de Dados</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">SLA</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30 font-jetbrains">
          <p>© {new Date().getFullYear()} CLIPX CORPORATION. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">X/TWITTER</span>
            <span className="hover:text-white cursor-pointer transition-colors">GITHUB</span>
            <span className="hover:text-white cursor-pointer transition-colors">DISCORD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
