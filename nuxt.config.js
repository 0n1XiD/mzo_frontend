export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Мастерская здоровой осанки',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/style.scss',
    '@/static/gilroy/stylesheet.css',
  ],

  styleResources: {
    scss: [
      './assets/css/*.scss',
      './assets/css/*/*.scss'
    ]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vuelidate', ssr: true },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/i18n',
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy',
    'cookie-universal-nuxt',
  ],

  i18n: {
    locales: [
      {
        name: 'Русский',
        code: 'ru',
        iso: 'ru-RU',
        file: 'ru-RU.js'
      },
      {
        name: 'Қазақ',
        code: 'kk',
        iso: 'KAZ',
        file: 'kz-KZ.js'
      }
    ],
    defaultLocale: 'ru',
    vueI18n: {
      fallbackLocale: 'ru'
    },
    langDir: '~/langs/'
  },

  router: {
    middleware: ['check_mzo_client_rate', 'check_valid_route'],
  },

  ...process.env.NODE_ENV === 'development' && {
    proxy: {
      '/api/v1/user/': { target: 'http://127.0.0.1:8000/api/v1/user/', pathRewrite: {'^/api/v1/user/': ''}, changeOrigin: true },
      '/api/v1/course/': { target: 'http://127.0.0.1:8000/api/v1/course/', pathRewrite: {'^/api/v1/course/': ''}, changeOrigin: true },
      '/api/v1/rates/': { target: 'http://127.0.0.1:8000/api/v1/rates/', pathRewrite: {'^/api/v1/rates/': ''}, changeOrigin: true },
      '/api/v1/site_content/': { target: 'http://127.0.0.1:8000/api/v1/site_content/', pathRewrite: {'^/api/v1/site_content/': ''}, changeOrigin: true },
      '/api/v1/chat/': { target: 'http://127.0.0.1:8000/api/v1/chat/', pathRewrite: {'^/api/v1/chat/': ''}, changeOrigin: true }
    }
  },

  ...process.env.NODE_ENV !== 'development' && {
    proxy: {
      '/api/v1/user/': { target: 'https://mzosanki.space/api/v1/user/', pathRewrite: {'^/api/v1/user/': ''}, changeOrigin: true },
      '/api/v1/course/': { target: 'https://mzosanki.space/api/v1/course/', pathRewrite: {'^/api/v1/course/': ''}, changeOrigin: true },
      '/api/v1/rates/': { target: 'https://mzosanki.space/api/v1/rates/', pathRewrite: {'^/api/v1/rates/': ''}, changeOrigin: true },
      '/api/v1/site_content/': { target: 'https://mzosanki.space/api/v1/site_content/', pathRewrite: {'^/api/v1/site_content/': ''}, changeOrigin: true },
      '/api/v1/chat/': { target: 'https://mzosanki.space/api/v1/chat/', pathRewrite: {'^/api/v1/chat/': ''}, changeOrigin: true }
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },

  server: {
    port: 3003 // default: 3000
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(webm|mp4|m4a|mp3|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[path][name].[ext]'
        }
      })
    },
  }
}
