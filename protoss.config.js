const fs = require('fs');
const webpackConfigPath = `${process.cwd()}/webpack.config.js`;

module.exports = {
  templates: {
    enabled: true,
    src: './src/templates/**/*.pug',
    dest: './build/',
    filter: function(file) {
      const path = file.path.replace(/\\/g, '/');
      const relative = file.relative.replace(/\\/g, '/');
      return !/\/_/.test(path) && !/^_/.test(relative);
    },
    inheritance: {
      basedir: '/src/templates/',
      skip: 'node_modules',
    },
    data: {},
    prettify: true,
    posthtml: false,
    w3c: {
      src: './build/*.html',
    },
  },

  styles: {
    enabled: true,
    bundles: [
      {
        name: 'app',
        src: './src/styles/app.scss',
        dest: './build/static/css/',
        watch: [
          './src/styles/**/*.scss',
        ],
        minify: true,
        postcss: false,
        sourceMaps: true,
        cssnanoConfig: {
          autoprefixer: false,
          discardComments: {
            removeAll: true,
          },
          colormin: false,
          convertValues: false,
          zindex: false,
          discardDuplicates: true,
        },
      },
    ],
    lint: {
      src: [
        './src/styles/**/*.scss',
        '!./temp/**/*.scss',
      ],
      config: {
        reporters: [
          { formatter: 'string', console: true },
        ],
      },
    },
  },

  scripts: {
    enabled: true,
    webpackConfig: fs.existsSync(webpackConfigPath) ? require(webpackConfigPath) : null,
  },

  images: {
    enabled: true,
    src: ['./src/resources/images/**/*.{png,jpg,gif,svg}'],
    dest: './build/static/images/',
    minPath: './build/static/images/**/*.{png,jpg,gif,svg}',
  },

  sprites: {
    enabled: true,
    src: './src/sprites/png/**/*.png',
    dest: './build/static/images/sprites/',
    retina: true,
    stylesName: '_sprites.scss',
    stylesDest: './temp/sprites/',
    template: __dirname + '/assets/sprite.mustache',
    templateData: {
      spritePath: '#{$pathToImages}sprites/',
    },
  },

  spritesSvg: {
    enabled: true,
    src: './src/sprites/svg/',
    dest: './build/static/images/sprites-svg/',
    stylesName: '_sprites-svg.scss',
    stylesDest: './temp/sprites/',
    template: __dirname + '/assets/sprite-svg.mustache',
    templateData: {
      spritePath: '#{$pathToImages}sprites-svg/',
    },
    fallback: false,
  },

  icons: {
    enabled: true,
    src: './src/icons/',
    dest: './build/static/images/icons/',
  },

  copy: [
    {
      src: './src/resources/fonts/**/*',
      dest: './build/fonts/',
    },
  ],

  del: [
    './build',
    './temp',
  ],

  favicons: {
    enabled: true,
    src: './src/resources/favicon-master.png',
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
        windows: false,
        appleStartup: false,
        coast: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
      },
    },
  },

  serve: {
    browsersync: {
      open: true,
      port: 9001,
      server: {
        directory: true,
        baseDir: './build/',
      },
      files: ['./build/'],
      reloadDelay: 200,
      logConnections: true,
      debugInfo: true,
      injectChanges: false,
      browser: 'default',
      startPath: '/',
      ghostMode: {
        clicks: false,
        forms: false,
        scroll: false,
      },
    },
  },
};
