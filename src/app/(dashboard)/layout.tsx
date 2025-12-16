'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { useCompany } from '@/hooks/use-company';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { company, loading } = useCompany();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Redirect to onboarding if no company exists (except if already on onboarding)
    if (!loading && !company && pathname !== '/onboarding' && mounted) {
      router.push('/onboarding');
    }
  }, [company, loading, pathname, router, mounted]);

  if (!mounted || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      </div>
    );
  }

  // Allow onboarding page to render without company
  if (!company && pathname !== '/onboarding') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar companyName={company?.name} />
      <div className="lg:pl-64">
        <main className="px-4 py-6 pt-20 lg:px-8 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
