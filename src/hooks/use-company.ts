'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DEMO_MODE, DEMO_COMPANY } from '@/lib/demo/data';
import type { Company } from '@/types/database';

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCompany() {
      // Demo mode - return demo company immediately
      if (DEMO_MODE) {
        setCompany(DEMO_COMPANY as unknown as Company);
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setCompany(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch company'));
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, [supabase]);

  const refetch = async () => {
    // Demo mode - just return
    if (DEMO_MODE) {
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setCompany(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch company'));
    } finally {
      setLoading(false);
    }
  };

  return { company, loading, error, refetch };
}
