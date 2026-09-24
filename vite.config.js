import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'salman-user.jpg'],
      manifest: {
        name: 'BHAIJAAN',
        short_name: 'BHAIJAAN',
        description: 'A tiny, nostalgic music room for Salman Khan\'s Bollywood eras.',
        theme_color: '#080604',
        background_color: '#080604',
        display: 'standalone',
        icons: [
          {
            src: 'salman-user.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          {
            src: 'salman-user.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
