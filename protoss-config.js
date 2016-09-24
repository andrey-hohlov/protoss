const src = './src/';
const dest = './build/';
const stylesSrc = src + 'styles/';
const scriptsSrc = src + 'scripts/';
const assetsDest = dest + 'static/';
const assetsPath = '/static/';
const protossRoot = __dirname;

module.exports = {

  templates: {
    src: src + '**/*.jade',
    filterReg: /src[\\\/]pages/,
    inhBaseDir: src,
    dest: dest,
    data: {
      dataSrc: src + 'data/',
      assetsPath: assetsPath,
      imagesPath: assetsPath + 'images/',
      svgIconsPath: assetsPath + 'images/icons/',
      useFavicons: true,
      faviconsPath: assetsPath + 'favicons/',
      getData: function (dataFile) {
        var fs = require('fs');
        var path = require('path');
        dataFile = /\.json$/.test(dataFile) && dataFile || dataFile + '.json';
        var resolvedPath = path.resolve(dataFile);
        return JSON.parse(fs.readFileSync(resolvedPath));
      }
    }
  },

  styles: {
    bundles: [
      {
        name: 'styles',
        src: [
          stylesSrc + 'vendor/normalize.css',
          stylesSrc + 'vendor/*.css',
          stylesSrc + 'styles.scss'
        ],
        dest: assetsDest + 'css/',
        minify: true,
        concat: true,
        hashes: true
      }
    ]

  },

  scripts: {
    bundles: [
      {
        name: 'libs',
        src: scriptsSrc + 'libs/**/*.js',
        dest: assetsDest + 'js/libs/',
        concat: false,
        minify: true
      },
      {
        name: 'plugins',
        src: scriptsSrc + 'plugins/**/*.js',
        dest: assetsDest + 'js/',
        concat: true,
        minify: true
      },
      {
        name: 'app',
        src: [
          scriptsSrc + 'app/utils.js',
          scriptsSrc + 'app/common.js',
          scriptsSrc + 'app/**/*.js'
        ],
        dest: assetsDest + 'js/',
        concat: true,
        minify: true
      }
    ]
  },

  images: {
    src: [src + 'resources/images/**/*.{png,jpg,gif,svg}'],
    dest: assetsDest + 'images/'
  },

  spritesPng: {
    enabled: true,
    src: src + 'sprites/png/',
    dest: assetsDest + 'images/sprites/',
    retina: true,
    stylesName: '_sprites.scss',
    stylesDest: src + 'styles/_global/_sprites/',
    spritePath: '#{$pathToImages}sprites/',
    template: protossRoot + '/assets/sprite.mustache',
    prefix: true
  },

  spritesSvg: {
    enabled: true,
    src: src + 'sprites/svg/',
    dest: assetsDest + 'images/svg-sprites/',
    stylesName: '_sprites-svg.scss',
    stylesDest: src + 'styles/_global/_sprites/',
    spritePath: '#{$pathToImages}svg-sprites/',
    template: protossRoot + '/assets/sprite-svg.mustache',
    prefix: true
  },

  svgIcons: {
    enabled: true,
    src: src + 'icons/',
    dest: assetsDest + 'images/icons/'
  },

  watch: [
    {
      cwd: null,
      path: src + '{blocks,pages}/**/*.jade',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/templates'
        }
      ]
    },
    {
      cwd: null,
      path: src + '{blocks,styles}/**/*.{css,scss}',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/styles'
        }
      ]
    },
    {
      cwd: null,
      path: scriptsSrc + '**/*.js',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/scripts'
        }
      ]
    },
    {
      cwd: src + 'resources/images/',
      path: '**/*.{png,jpg,gif,svg}',
      ignore: [],
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
      cwd: null,
      path: src + 'sprites/png/**/*.png',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/sprites'
        }
      ]
    },
    {
      cwd: null,
      path: src + 'sprites/svg/**/*.svg',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/sprites-svg'
        }
      ]
    },
    {
      cwd: null,
      path: src + 'icons/**/*.svg',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/icons'
        }
      ]
    }
  ],

  copy: [
    [src + 'resources/fonts/**/*', assetsDest + 'fonts/'],
    [assetsDest + 'favicons/favicon.ico', dest]
  ],

  del: [
    dest
  ],

  favicons: {
    enabled: true,
    appName: 'Protoss',
    src: src + 'resources/favicon-master.png',
    dest: assetsDest + 'favicons/',
    path: assetsPath + 'favicons/',
    background: '#fff'
  },

  browserSync: {
    port: 9001,
    basedir: dest,
    startPath: '/',
    browser: 'default',
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  }

};
