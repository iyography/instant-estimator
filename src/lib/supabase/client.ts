// Dummy Supabase client - does nothing in demo mode
export function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signInWithOAuth: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
        }),
        order: () => ({ data: [], error: null }),
        in: () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: async () => ({ error: null }),
      }),
      delete: () => ({
        eq: async () => ({ error: null }),
      }),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: () => {},
  };
}
