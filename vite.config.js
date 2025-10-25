import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react() ,tailwindcss(),
     VitePWA({
      manifest: {
        name: 'Solemate',
        short_name: 'Solemate',
        description: '',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'https://assets.simon.com/tenantlogos/34449.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://assets.simon.com/tenantlogos/34449.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://assets.simon.com/tenantlogos/34449.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
