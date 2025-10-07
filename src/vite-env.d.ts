/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_AYRSHARE_DOMAIN: string
  readonly VITE_AYRSHARE_API_KEY: string
  readonly VITE_AYRSHARE_PRIVATE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
