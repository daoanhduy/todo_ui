import colors from 'vuetify/es5/util/colors'
require("dotenv").config();

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s',
    title: 'Todo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      },
      {
        rel: "stylesheet",
        href:
          "https://cdn.jsdelivr.net/npm/font-awesome@4.x/css/font-awesome.min.css"
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com"
      },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Mali:wght@300&display=swap"
      },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css"
      }
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-3.5.1.js"
      },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"
      },
      {
        src:
          "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"
      },
      {
        src:
          "https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ["~/assets/css/style.css",'~/assets/variables.scss'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ["~/plugins/modal.js","~/plugins/vuetify.js"],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    //'@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    "@nuxtjs/auth",
    "@nuxtjs/pwa"
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {baseURL: process.env.BASE_URL},
  auth: {
    localStorage: false,
    user: {
      autoFetch: false
    },
    cookie: {
      prefix: "auth.",
      options: {
        maxAge: 1200
      }
    },
    redirect: {
      login: "/auth/login",
      logout: false,
      callback: false,
      home: false
    },
    strategies: {
      local: {
        scheme: "local",
        token: {
          name: "Authorization",
          type: "Bearer",
          maxAge: 1200
        },
        refreshToken: {
          required: true,
          tokenRequired: true
        },
        endpoints: {
          login: {
            url: "/api/auths/Login",
            method: "post",
            propertyName: "token"
          },
          logout: {
            url: "/api/auths/Logout",
            method: "post"
          },
          user: {
            url: "/api/users/getuser",
            method: "get",
            propertyName: "data"
          }
        },
        globalToken: true,
        autoLogout: true
      }
    }
  },
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    maxChunkSize:900000
  }
}
