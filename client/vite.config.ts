import { defineConfig, loadEnv, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig((config): UserConfig => {
  const env = loadEnv(config.mode, process.cwd(), '');
  return {
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      strictPort: true,
      port: 3001,
      cors: true,
      allowedHosts: [`.${env.VITE_APP_BASE_URL}`],
    },
    preview: {
      host: '0.0.0.0',
      strictPort: true,
      port: 3001,
      cors: true,
      allowedHosts: [`.${env.VITE_APP_BASE_URL}`],
    },
  };
});
