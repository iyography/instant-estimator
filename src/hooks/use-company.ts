'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Company } from '@/types/database';

export function useCompany() {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompany() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error: dbError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        // PGRST116 = no rows found, which is expected for new users
        setError(dbError.message);
      }

      if (data) {
        setCompany(data as Company);
      }

      setLoading(false);
    }

    fetchCompany();
  }, []);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      setError(dbError.message);
    }

    if (data) {
      setCompany(data as Company);
    }

    setLoading(false);
  };

  return { company, loading, error, refetch };
}
