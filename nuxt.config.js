export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'tabe-you',
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['bootstrap/dist/css/bootstrap.min.css', '~/assets/css/main.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/composition-api/module',
    [
      '@nuxtjs/google-fonts',
      {
        families: { NotoSansJP: true },
        display: 'swap',
        download: true,
        inject: true,
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    proxy: true,
  },

  proxy: {
    '/api/': {
      target: 'http://webservice.recruit.co.jp',
      pathRewrite: { '^/api/': '/' },
      onProxyReq: (proxyReq) => {
        proxyReq.path += `&format=json&key=${process.env.API_KEY}`
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
