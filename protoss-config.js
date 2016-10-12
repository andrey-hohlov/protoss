module.exports = {

  templates: {
    src: './src/**/*.jade',
    filterFunc: false,
    inhBaseDir: './src/',
    dest: './build/',
    data: {},
    hashes: true,
    w3c: {
      src: './build/*.html'
    }
  },

  styles: {
    bundles: [
      {
        name: 'app',
        src: ['./src/styles/app.scss'],
        dest: './build/static/css/',
        minify: true,
        hashes: true,
        postcss: false
      }
    ]
  },

  scripts: {
    bundles: [
      {
        name: 'app',
        src: ['./src/scripts/**/*.js'],
        dest: './build/static/js/',
        concat: true,
        minify: true
      }
    ]
  },

  images: {
    src: ['./src/resources/images/**/*.{png,jpg,gif,svg}'],
    dest: './build/images/',
    minPath: './build/images/'
  },

  spritesPng: {
    enabled: true,
    src: './src/sprites/png/',
    dest: './build/static/images/sprites/',
    retina: true,
    stylesName: '_sprites.scss',
    stylesDest: './src/styles/_global/_sprites/',
    spritePath: '#{$pathToImages}sprites/',
    template: __dirname + '/assets/sprite.mustache'
  },

  spritesSvg: {
    enabled: true,
    src: './src/sprites/svg/',
    dest: './build/static/images/sprites-svg/',
    stylesName: '_sprites-svg.scss',
    stylesDest: './src/styles/_global/_sprites/',
    spritePath: '#{$pathToImages}svg-sprites/',
    template: __dirname + '/assets/sprite-svg.mustache',
    fallback: false
  },

  svgIcons: {
    enabled: true,
    src: './src/icons/',
    dest: './build/static/images/icons/'
  },

  watch: [
    {
      path: './src/{blocks,pages}/**/*.jade',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/templates'
        }
      ]
    },
    {
      path: './src/{blocks,styles}/**/*.scss',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/styles'
        }
      ]
    },
    {
      path: './src/scripts/**/*.js',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/scripts'
        }
      ]
    },
    {
      path: '**/*.{png,jpg,gif,svg}',
      config: {
        cwd: './src/resources/images/',
        ignoreInitial: true
      },
      on: [
        {
          event: 'add',
          task: 'protoss/images'
        },
        {
          event: 'change',
          task: 'protoss/images'
        }
      ]
    },
    {
      path: './src/sprites/png/**/*.png',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/sprites'
        }
      ]
    },
    {
      path: './src/sprites/svg/**/*.svg',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/sprites-svg'
        }
      ]
    },
    {
      path: './src/icons/**/*.svg',
      config: {
        ignoreInitial: true
      },
      on: [
        {
          event: 'all',
          task: 'protoss/icons'
        }
      ]
    }
  ],

  copy: [
    ['./src/resources/fonts/**/*', './build/fonts/']
  ],

  del: [
    './build'
  ],

  favicons: {
    enabled: true,
    src: '.src/resources/favicon-master.png',
    dest: './build/static/favicons/',
    config: {
      appName: 'Protoss',
      background: '#ffffff',
      path: '/static/favicons/',
      display: 'standalone',
      orientation: 'portrait',
      version: 2.0,
      logging: false,
      online: false,
      html: false,
      replace: true,
      icons: {
        favicons: true,
        android: true,
        appleIcon: true,
        windows: true,
        appleStartup: false,
        coast: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false
      }
    }
  },

  browserSync: {
    open: true,
    port: 9001,
    server: {
      directory: true,
      baseDir: './build/'
    },
    reloadDelay: 200,
    logConnections: true,
    debugInfo: true,
    injectChanges: false,
    browser: 'default',
    startPath: '/',
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  }

};
