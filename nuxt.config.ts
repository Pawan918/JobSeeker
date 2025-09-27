// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL
    }
  },
  modules: ['nuxt-zod-i18n', '@nuxtjs/i18n', 'nuxt-toast', 'nuxt-socket-io'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  io: {
    // module options
    sockets: [{
      name: 'main',
      url: process.env.API_BASE_URL,
      default: true
    }]
  }
})
