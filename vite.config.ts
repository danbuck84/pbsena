import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: './', // Fix for production paths
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'pwa-icon.jpg'],
            manifest: {
                name: 'PB Sena',
                short_name: 'PB Sena',
                description: 'Seus jogos da Mega-Sena, organizados.',
                theme_color: '#102213',
                background_color: '#102213',
                display: 'standalone',
                scope: '/',
                start_url: '/',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-icon.jpg',
                        sizes: '192x192',
                        type: 'image/jpeg',
                        purpose: 'any'
                    },
                    {
                        src: 'pwa-icon.jpg',
                        sizes: '512x512',
                        type: 'image/jpeg',
                        purpose: 'any'
                    }
                ]
            }
        })
    ],
})
