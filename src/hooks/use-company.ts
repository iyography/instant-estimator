'use client';

import { useEffect, useState } from 'react';
import { DEMO_COMPANY } from '@/lib/demo/data';
import type { Company } from '@/types/database';

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always return demo company
    setCompany(DEMO_COMPANY as unknown as Company);
    setLoading(false);
  }, []);

  const refetch = async () => {
    // Do nothing in demo mode
  };

  return { company, loading, error: null, refetch };
}
