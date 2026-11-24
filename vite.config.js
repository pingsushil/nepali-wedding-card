import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Exposes `virtual:optional-assets` so the app knows at dev & build time whether
 * optional user-supplied files in `public/` exist, preventing 404 console errors
 * while seamlessly activating them the moment the files are placed in `public/`.
 */
function optionalAssetsPlugin() {
  const virtualId = 'virtual:optional-assets';
  const resolvedId = '\0' + virtualId;
  const watchedFiles = ['wedding-theme.mp3', 'qr-honeymoon.png'];

  const getPublicDir = (root) => path.resolve(root || process.cwd(), 'public');
  let projectRoot = process.cwd();

  return {
    name: 'optional-public-assets',
    configResolved(config) {
      projectRoot = config.root;
    },
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return null;
      const publicDir = getPublicDir(projectRoot);
      const hasAudio = fs.existsSync(path.join(publicDir, 'wedding-theme.mp3'));
      const hasQrImage = fs.existsSync(path.join(publicDir, 'qr-honeymoon.png'));
      return `export const OPTIONAL_ASSETS = {
        hasAudio: ${hasAudio},
        hasQrImage: ${hasQrImage},
        audioPath: '/wedding-theme.mp3',
        qrImagePath: '/qr-honeymoon.png',
      };`;
    },
    configureServer(server) {
      const publicDir = getPublicDir(projectRoot);
      const invalidate = (file) => {
        if (!file) return;
        const base = path.basename(file);
        if (watchedFiles.includes(base)) {
          const mod = server.moduleGraph.getModuleById(resolvedId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: 'full-reload' });
          }
        }
      };
      server.watcher.add(publicDir);
      server.watcher.on('add', invalidate);
      server.watcher.on('unlink', invalidate);
    },
  };
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/nepali-wedding-card/' : '/',
  plugins: [react(), tailwindcss(), optionalAssetsPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
}));
