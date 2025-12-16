'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Users, BarChart3, Code, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/lib/i18n/context';

function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

function useIntersectionObserver(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function AnimatedSection({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MeshGradientBackground() {
  const scrollY = useScrollAnimation();

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep base gradient - much more colorful */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 via-40% to-pink-100" />

      {/* Secondary color layer */}
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-100/80 via-transparent to-cyan-100/60" />

      {/* Large animated mesh gradient orbs - MUCH more vibrant */}
      <div
        className="absolute -top-20 -right-20 h-[800px] w-[800px] rounded-full opacity-80 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.7) 0%, rgba(168, 85, 247, 0.5) 40%, rgba(236, 72, 153, 0.3) 70%, transparent 100%)',
          transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)`,
        }}
      />
      <div
        className="absolute -top-40 -left-20 h-[700px] w-[700px] rounded-full opacity-70 blur-3xl animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(59, 130, 246, 0.5) 40%, rgba(139, 92, 246, 0.3) 70%, transparent 100%)',
          transform: `translate(${-scrollY * 0.03}px, ${scrollY * 0.04}px)`,
        }}
      />
      <div
        className="absolute top-1/3 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.5) 0%, rgba(236, 72, 153, 0.4) 30%, rgba(168, 85, 247, 0.3) 60%, transparent 100%)',
          transform: `translate(calc(-50% + ${scrollY * 0.02}px), ${-scrollY * 0.03}px)`,
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full opacity-70 blur-3xl animate-blob animation-delay-3000"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(6, 182, 212, 0.4) 40%, rgba(59, 130, 246, 0.2) 70%, transparent 100%)',
          transform: `translate(${scrollY * 0.04}px, ${-scrollY * 0.02}px)`,
        }}
      />
      <div
        className="absolute top-20 left-1/3 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-1000"
        style={{
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.4) 0%, rgba(249, 115, 22, 0.3) 50%, transparent 80%)',
          transform: `translate(${-scrollY * 0.02}px, ${scrollY * 0.03}px)`,
        }}
      />

      {/* Extra color accent orbs */}
      <div
        className="absolute top-1/2 right-10 h-[400px] w-[400px] rounded-full opacity-60 blur-2xl animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(192, 132, 252, 0.6) 0%, rgba(139, 92, 246, 0.3) 60%, transparent 100%)',
        }}
      />
      <div
        className="absolute bottom-1/4 left-10 h-[350px] w-[350px] rounded-full opacity-50 blur-2xl animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, rgba(34, 211, 238, 0.5) 0%, rgba(6, 182, 212, 0.3) 60%, transparent 100%)',
        }}
      />

      {/* Many tiny floating particles rising upward - spread across the hero */}
      {/* Row 1 - bottom */}
      <div className="absolute bottom-[5%] left-[3%] h-0.5 w-0.5 rounded-full bg-indigo-400/70 animate-float-up" />
      <div className="absolute bottom-[8%] left-[7%] h-1 w-1 rounded-full bg-purple-400/60 animate-float-up animation-delay-500" />
      <div className="absolute bottom-[3%] left-[12%] h-0.5 w-0.5 rounded-full bg-pink-400/70 animate-float-up animation-delay-1000" />
      <div className="absolute bottom-[10%] left-[18%] h-1 w-1 rounded-full bg-cyan-400/60 animate-float-up animation-delay-1500" />
      <div className="absolute bottom-[6%] left-[23%] h-0.5 w-0.5 rounded-full bg-blue-400/70 animate-float-up animation-delay-2000" />
      <div className="absolute bottom-[4%] left-[28%] h-1 w-1 rounded-full bg-violet-400/60 animate-float-up animation-delay-2500" />
      <div className="absolute bottom-[9%] left-[33%] h-0.5 w-0.5 rounded-full bg-rose-400/70 animate-float-up animation-delay-3000" />
      <div className="absolute bottom-[7%] left-[38%] h-1 w-1 rounded-full bg-emerald-400/60 animate-float-up animation-delay-3500" />
      <div className="absolute bottom-[5%] left-[43%] h-0.5 w-0.5 rounded-full bg-amber-400/70 animate-float-up animation-delay-4000" />
      <div className="absolute bottom-[8%] left-[48%] h-1 w-1 rounded-full bg-fuchsia-400/60 animate-float-up animation-delay-4500" />
      <div className="absolute bottom-[3%] left-[53%] h-0.5 w-0.5 rounded-full bg-sky-400/70 animate-float-up animation-delay-5000" />
      <div className="absolute bottom-[6%] left-[58%] h-1 w-1 rounded-full bg-indigo-400/60 animate-float-up animation-delay-5500" />
      <div className="absolute bottom-[10%] left-[63%] h-0.5 w-0.5 rounded-full bg-purple-400/70 animate-float-up animation-delay-6000" />
      <div className="absolute bottom-[4%] left-[68%] h-1 w-1 rounded-full bg-pink-400/60 animate-float-up animation-delay-6500" />
      <div className="absolute bottom-[7%] left-[73%] h-0.5 w-0.5 rounded-full bg-cyan-400/70 animate-float-up animation-delay-7000" />
      <div className="absolute bottom-[9%] left-[78%] h-1 w-1 rounded-full bg-blue-400/60 animate-float-up animation-delay-7500" />
      <div className="absolute bottom-[5%] left-[83%] h-0.5 w-0.5 rounded-full bg-violet-400/70 animate-float-up animation-delay-500" />
      <div className="absolute bottom-[8%] left-[88%] h-1 w-1 rounded-full bg-rose-400/60 animate-float-up animation-delay-1000" />
      <div className="absolute bottom-[6%] left-[93%] h-0.5 w-0.5 rounded-full bg-emerald-400/70 animate-float-up animation-delay-1500" />
      <div className="absolute bottom-[4%] left-[97%] h-1 w-1 rounded-full bg-amber-400/60 animate-float-up animation-delay-2000" />
      {/* Row 2 */}
      <div className="absolute bottom-[15%] left-[5%] h-1 w-1 rounded-full bg-fuchsia-400/60 animate-float-up animation-delay-2500" />
      <div className="absolute bottom-[18%] left-[10%] h-0.5 w-0.5 rounded-full bg-sky-400/70 animate-float-up animation-delay-3000" />
      <div className="absolute bottom-[12%] left-[15%] h-1 w-1 rounded-full bg-indigo-400/60 animate-float-up animation-delay-3500" />
      <div className="absolute bottom-[20%] left-[20%] h-0.5 w-0.5 rounded-full bg-purple-400/70 animate-float-up animation-delay-4000" />
      <div className="absolute bottom-[16%] left-[25%] h-1 w-1 rounded-full bg-pink-400/60 animate-float-up animation-delay-4500" />
      <div className="absolute bottom-[14%] left-[30%] h-0.5 w-0.5 rounded-full bg-cyan-400/70 animate-float-up animation-delay-5000" />
      <div className="absolute bottom-[19%] left-[35%] h-1 w-1 rounded-full bg-blue-400/60 animate-float-up animation-delay-5500" />
      <div className="absolute bottom-[17%] left-[40%] h-0.5 w-0.5 rounded-full bg-violet-400/70 animate-float-up animation-delay-6000" />
      <div className="absolute bottom-[13%] left-[45%] h-1 w-1 rounded-full bg-rose-400/60 animate-float-up animation-delay-6500" />
      <div className="absolute bottom-[21%] left-[50%] h-0.5 w-0.5 rounded-full bg-emerald-400/70 animate-float-up animation-delay-7000" />
      <div className="absolute bottom-[15%] left-[55%] h-1 w-1 rounded-full bg-amber-400/60 animate-float-up animation-delay-7500" />
      <div className="absolute bottom-[18%] left-[60%] h-0.5 w-0.5 rounded-full bg-fuchsia-400/70 animate-float-up" />
      <div className="absolute bottom-[12%] left-[65%] h-1 w-1 rounded-full bg-sky-400/60 animate-float-up animation-delay-500" />
      <div className="absolute bottom-[20%] left-[70%] h-0.5 w-0.5 rounded-full bg-indigo-400/70 animate-float-up animation-delay-1000" />
      <div className="absolute bottom-[16%] left-[75%] h-1 w-1 rounded-full bg-purple-400/60 animate-float-up animation-delay-1500" />
      <div className="absolute bottom-[14%] left-[80%] h-0.5 w-0.5 rounded-full bg-pink-400/70 animate-float-up animation-delay-2000" />
      <div className="absolute bottom-[19%] left-[85%] h-1 w-1 rounded-full bg-cyan-400/60 animate-float-up animation-delay-2500" />
      <div className="absolute bottom-[17%] left-[90%] h-0.5 w-0.5 rounded-full bg-blue-400/70 animate-float-up animation-delay-3000" />
      <div className="absolute bottom-[13%] left-[95%] h-1 w-1 rounded-full bg-violet-400/60 animate-float-up animation-delay-3500" />
      {/* Row 3 */}
      <div className="absolute bottom-[25%] left-[2%] h-0.5 w-0.5 rounded-full bg-rose-400/70 animate-float-up animation-delay-4000" />
      <div className="absolute bottom-[28%] left-[8%] h-1 w-1 rounded-full bg-emerald-400/60 animate-float-up animation-delay-4500" />
      <div className="absolute bottom-[23%] left-[14%] h-0.5 w-0.5 rounded-full bg-amber-400/70 animate-float-up animation-delay-5000" />
      <div className="absolute bottom-[30%] left-[22%] h-1 w-1 rounded-full bg-fuchsia-400/60 animate-float-up animation-delay-5500" />
      <div className="absolute bottom-[26%] left-[27%] h-0.5 w-0.5 rounded-full bg-sky-400/70 animate-float-up animation-delay-6000" />
      <div className="absolute bottom-[24%] left-[32%] h-1 w-1 rounded-full bg-indigo-400/60 animate-float-up animation-delay-6500" />
      <div className="absolute bottom-[29%] left-[37%] h-0.5 w-0.5 rounded-full bg-purple-400/70 animate-float-up animation-delay-7000" />
      <div className="absolute bottom-[27%] left-[42%] h-1 w-1 rounded-full bg-pink-400/60 animate-float-up animation-delay-7500" />
      <div className="absolute bottom-[22%] left-[47%] h-0.5 w-0.5 rounded-full bg-cyan-400/70 animate-float-up" />
      <div className="absolute bottom-[31%] left-[52%] h-1 w-1 rounded-full bg-blue-400/60 animate-float-up animation-delay-500" />
      <div className="absolute bottom-[25%] left-[57%] h-0.5 w-0.5 rounded-full bg-violet-400/70 animate-float-up animation-delay-1000" />
      <div className="absolute bottom-[28%] left-[62%] h-1 w-1 rounded-full bg-rose-400/60 animate-float-up animation-delay-1500" />
      <div className="absolute bottom-[23%] left-[67%] h-0.5 w-0.5 rounded-full bg-emerald-400/70 animate-float-up animation-delay-2000" />
      <div className="absolute bottom-[30%] left-[72%] h-1 w-1 rounded-full bg-amber-400/60 animate-float-up animation-delay-2500" />
      <div className="absolute bottom-[26%] left-[77%] h-0.5 w-0.5 rounded-full bg-fuchsia-400/70 animate-float-up animation-delay-3000" />
      <div className="absolute bottom-[24%] left-[82%] h-1 w-1 rounded-full bg-sky-400/60 animate-float-up animation-delay-3500" />
      <div className="absolute bottom-[29%] left-[87%] h-0.5 w-0.5 rounded-full bg-indigo-400/70 animate-float-up animation-delay-4000" />
      <div className="absolute bottom-[27%] left-[92%] h-1 w-1 rounded-full bg-purple-400/60 animate-float-up animation-delay-4500" />
      {/* Row 4 - mid section */}
      <div className="absolute bottom-[35%] left-[4%] h-1 w-1 rounded-full bg-pink-400/60 animate-float-up animation-delay-5000" />
      <div className="absolute bottom-[38%] left-[11%] h-0.5 w-0.5 rounded-full bg-cyan-400/70 animate-float-up animation-delay-5500" />
      <div className="absolute bottom-[33%] left-[17%] h-1 w-1 rounded-full bg-blue-400/60 animate-float-up animation-delay-6000" />
      <div className="absolute bottom-[40%] left-[24%] h-0.5 w-0.5 rounded-full bg-violet-400/70 animate-float-up animation-delay-6500" />
      <div className="absolute bottom-[36%] left-[31%] h-1 w-1 rounded-full bg-rose-400/60 animate-float-up animation-delay-7000" />
      <div className="absolute bottom-[34%] left-[38%] h-0.5 w-0.5 rounded-full bg-emerald-400/70 animate-float-up animation-delay-7500" />
      <div className="absolute bottom-[39%] left-[44%] h-1 w-1 rounded-full bg-amber-400/60 animate-float-up" />
      <div className="absolute bottom-[37%] left-[51%] h-0.5 w-0.5 rounded-full bg-fuchsia-400/70 animate-float-up animation-delay-500" />
      <div className="absolute bottom-[32%] left-[58%] h-1 w-1 rounded-full bg-sky-400/60 animate-float-up animation-delay-1000" />
      <div className="absolute bottom-[41%] left-[64%] h-0.5 w-0.5 rounded-full bg-indigo-400/70 animate-float-up animation-delay-1500" />
      <div className="absolute bottom-[35%] left-[71%] h-1 w-1 rounded-full bg-purple-400/60 animate-float-up animation-delay-2000" />
      <div className="absolute bottom-[38%] left-[78%] h-0.5 w-0.5 rounded-full bg-pink-400/70 animate-float-up animation-delay-2500" />
      <div className="absolute bottom-[33%] left-[84%] h-1 w-1 rounded-full bg-cyan-400/60 animate-float-up animation-delay-3000" />
      <div className="absolute bottom-[40%] left-[91%] h-0.5 w-0.5 rounded-full bg-blue-400/70 animate-float-up animation-delay-3500" />
      <div className="absolute bottom-[36%] left-[96%] h-1 w-1 rounded-full bg-violet-400/60 animate-float-up animation-delay-4000" />

      {/* Glowing accent lines */}
      <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      {/* Subtle noise texture overlay for depth */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  const { ref, isVisible } = useIntersectionObserver(0.1);

  return (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-8 backdrop-blur-sm transition-all duration-700 ease-out hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Hover gradient effect */}
      <div className={cn(
        'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
        gradient
      )} />

      <div className="relative z-10">
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
          gradient.replace('bg-gradient-to-br', 'bg-gradient-to-br').replace('/5', '/20')
        )}>
          <Icon className="h-7 w-7 text-slate-700" />
        </div>
        <h3 className="mt-6 text-xl font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mt-3 text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function scrollToFeatures() {
  const featuresSection = document.getElementById('features');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
}

export default function HomePage() {
  const scrollY = useScrollAnimation();
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -40px) scale(1.08); }
          50% { transform: translate(-30px, 30px) scale(0.92); }
          75% { transform: translate(40px, 15px) scale(1.04); }
        }
        @keyframes float-up {
          0% { transform: translateY(0px); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 20s ease-in-out infinite;
        }
        .animate-float-up {
          animation: float-up 8s linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-1500 { animation-delay: 1.5s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-2500 { animation-delay: 2.5s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-3500 { animation-delay: 3.5s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-4500 { animation-delay: 4.5s; }
        .animation-delay-5000 { animation-delay: 5s; }
        .animation-delay-5500 { animation-delay: 5.5s; }
        .animation-delay-6000 { animation-delay: 6s; }
        .animation-delay-6500 { animation-delay: 6.5s; }
        .animation-delay-7000 { animation-delay: 7s; }
        .animation-delay-7500 { animation-delay: 7.5s; }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>

      {/* Header */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrollY > 50
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm'
          : 'bg-transparent'
      )}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Instant Estimator
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {t.nav.features}
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {t.nav.howItWorks}
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {t.nav.pricing}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                {t.nav.signIn}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                {t.nav.getStarted}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <MeshGradientBackground />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div
              className={cn(
                'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-4 py-2 mb-8 transition-all duration-700',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">
                {t.hero.badge}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className={cn(
                'text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-700 delay-100',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <span className="block text-slate-900">{t.hero.title1}</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-shimmer">
                {t.hero.title2}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={cn(
                'mx-auto mt-8 max-w-2xl text-xl text-slate-600 leading-relaxed transition-all duration-700 delay-200',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                'mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <Link href="/signup">
                <Button size="lg" className="h-14 px-8 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  {t.hero.cta1}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base border-slate-300 hover:bg-slate-50 transition-all duration-300">
                  {t.hero.cta2}
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className={cn(
                'mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-500 transition-all duration-700 delay-400',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t.hero.trust1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t.hero.trust2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{t.hero.trust3}</span>
              </div>
            </div>
          </div>

          {/* Scroll indicator - now clickable */}
          <button
            onClick={scrollToFeatures}
            className={cn(
              'absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 cursor-pointer group',
              scrollY > 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
            )}
          >
            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-slate-600 transition-colors">
              <span className="text-xs font-medium uppercase tracking-wider">{t.hero.scrollDown}</span>
              <div className="h-10 w-6 rounded-full border-2 border-slate-300 group-hover:border-slate-400 p-1 transition-colors">
                <div className="h-2 w-1.5 rounded-full bg-slate-400 group-hover:bg-slate-500 animate-bounce mx-auto transition-colors" />
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <span className="inline-block text-sm font-semibold text-blue-600 tracking-wider uppercase mb-4">
              {t.features.label}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
              {t.features.title1}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.features.title2}
              </span>
            </h2>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              {t.features.subtitle}
            </p>
          </AnimatedSection>

          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Zap}
              title={t.features.feature1Title}
              description={t.features.feature1Desc}
              gradient="bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
              delay={0}
            />
            <FeatureCard
              icon={Users}
              title={t.features.feature2Title}
              description={t.features.feature2Desc}
              gradient="bg-gradient-to-br from-green-500/5 to-emerald-500/5"
              delay={100}
            />
            <FeatureCard
              icon={BarChart3}
              title={t.features.feature3Title}
              description={t.features.feature3Desc}
              gradient="bg-gradient-to-br from-purple-500/5 to-pink-500/5"
              delay={200}
            />
            <FeatureCard
              icon={Code}
              title={t.features.feature4Title}
              description={t.features.feature4Desc}
              gradient="bg-gradient-to-br from-orange-500/5 to-amber-500/5"
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="relative py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <span className="inline-block text-sm font-semibold text-blue-400 tracking-wider uppercase mb-4">
              {t.howItWorks.label}
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              {t.howItWorks.title1}{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t.howItWorks.title2}
              </span>
            </h2>
          </AnimatedSection>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">
            {[
              { step: '01', title: t.howItWorks.step1Title, description: t.howItWorks.step1Desc },
              { step: '02', title: t.howItWorks.step2Title, description: t.howItWorks.step2Desc },
              { step: '03', title: t.howItWorks.step3Title, description: t.howItWorks.step3Desc },
            ].map((item, index) => (
              <AnimatedSection key={item.step} delay={index * 150}>
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <span className="text-6xl font-bold bg-gradient-to-r from-blue-400/20 to-purple-400/20 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
              {t.cta.title1}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t.cta.title2}
              </span>
            </h2>
            <p className="mt-6 text-xl text-slate-600">
              {t.cta.subtitle}
            </p>
            <div className="mt-10">
              <Link href="/signup">
                <Button size="lg" className="h-16 px-10 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  {t.cta.button}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              {t.cta.trust}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Instant Estimator
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <Link href="#" className="hover:text-white transition-colors">
                {t.footer.privacy}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t.footer.terms}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t.footer.contact}
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                {t.footer.support}
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            {t.footer.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
