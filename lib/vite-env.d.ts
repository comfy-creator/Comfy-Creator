/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean;
  // Define other environment variables here, for example:
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
