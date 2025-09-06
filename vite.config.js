import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ,tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'], // Optional
      manifest: {
        name: 'Solemate',
        short_name: 'Solemate',
        description: 'My React app as a PWA with offline caching',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'https://static.tildacdn.com/tild3031-3964-4231-a265-363666353732/solemate.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://static.tildacdn.com/tild3031-3964-4231-a265-363666353732/solemate.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // ✅ Cache API responses
            urlPattern: ({ url }) => url.origin.includes('localhost:5000`'),
            handler: 'NetworkFirst', // Fetch from network first, fallback to cache
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
     
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
})
