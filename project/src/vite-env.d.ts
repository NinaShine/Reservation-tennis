/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string
    // tu peux rajouter d'autres variables si besoin
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  