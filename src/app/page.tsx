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
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />

      {/* Animated mesh gradient orbs */}
      <div
        className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full opacity-60 blur-3xl animate-blob"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
          transform: `translate(${scrollY * 0.05}px, ${scrollY * 0.02}px)`,
        }}
      />
      <div
        className="absolute -top-20 -left-40 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl animate-blob animation-delay-2000"
        style={{
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
          transform: `translate(${-scrollY * 0.03}px, ${scrollY * 0.04}px)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl animate-blob animation-delay-4000"
        style={{
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, rgba(236, 72, 153, 0.15) 50%, transparent 70%)',
          transform: `translate(calc(-50% + ${scrollY * 0.02}px), calc(-50% + ${-scrollY * 0.03}px))`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute top-20 left-[20%] h-2 w-2 rounded-full bg-blue-400/40 animate-float" />
      <div className="absolute top-40 right-[30%] h-3 w-3 rounded-full bg-purple-400/30 animate-float animation-delay-1000" />
      <div className="absolute top-60 left-[40%] h-2 w-2 rounded-full bg-green-400/40 animate-float animation-delay-2000" />
      <div className="absolute top-32 right-[15%] h-2 w-2 rounded-full bg-orange-400/30 animate-float animation-delay-3000" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
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
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(30px, 10px) scale(1.02); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
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
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% 100%;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
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
