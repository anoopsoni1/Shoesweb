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
            src: 'https://t3.ftcdn.net/jpg/01/65/57/24/360_F_165572468_LkZKKoyx527dRkz6IeAo5JFJXogfsZn4.jpg',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://t3.ftcdn.net/jpg/01/65/57/24/360_F_165572468_LkZKKoyx527dRkz6IeAo5JFJXogfsZn4.jpg',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'https://t3.ftcdn.net/jpg/01/65/57/24/360_F_165572468_LkZKKoyx527dRkz6IeAo5JFJXogfsZn4.jpg',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
