import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;

  return {
    base: API_URL,
    server: {
      open: true,
      port: PORT,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window' // Only if you need it for legacy packages
    },
    plugins: [
      react(),
      tsconfigPaths(),
      VitePWA({
        registerType: 'autoUpdate',
        manifestFilename: 'manifest.json',
        includeAssets: ['favicon.ico', 'favicon.png', 'apple-touch-icon.png', 'logo.png', 'logo192.png', 'logo512.png'],
        manifest: {
          name: 'Bill System - Billing Software',
          short_name: 'Bill System',
          description: 'Billing Software by Pixscale',
          theme_color: '#575757',
          background_color: '#000000',
          display: 'standalone',
          orientation: 'any',
          start_url: '.',
          icons: [
            {
              "src": "logo.jpg",
              "sizes": "72x72 64x64 32x32 24x24 16x16",
              "type": "image/jpg"
            },
            {
              "src": "logo.jpg",
              "type": "image/jpg",
              "sizes": "192x192",
              "purpose": "any maskable"
            },
            {
              "src": "logo.jpg",
              "type": "image/jpg",
              "sizes": "512x512",
              "purpose": "any maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 // 1 day
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true, // Enable PWA in dev for testing
          type: 'module',
          navigateFallback: 'index.html',
          suppressWarnings: true
        }
      })
    ],
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            const ext = name.split('.').pop();
            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
            return `assets/[name]-[hash].${ext}`;
          }
          // manualChunks: { ... } // Add if you want custom chunk splitting
        }
      },
      // Only drop console/debugger in production
      ...(mode === 'production' && {
        esbuild: {
          drop: ['console', 'debugger'],
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      })
      // No need to set build.target unless you need to support older browsers
      // target: 'baseline-widely-available', // This is now the default
    },
    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});

