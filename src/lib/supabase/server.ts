// Dummy Supabase server client - does nothing in demo mode
export async function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
  };
}

export async function createServiceClient() {
  return createClient();
}
