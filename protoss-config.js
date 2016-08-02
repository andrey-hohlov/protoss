var src = './src/';
var dest = './build/';

var imagesSrc = src + 'images/';
var stylesSrc = src + 'styles/';
var templatesSrc = src + 'templates/';
var scriptsSrc = src + 'scripts/';

var assetsDest = dest + 'static/';
var assetsPath = '/static/';

var protossRoot = __dirname;

module.exports = {

  templates: {

    /**
     * Path to templates source files
     * @type {String}
     */
    src: templatesSrc + '**/*.jade',


    /**
     * Jade files base directory for inheritance
     * @type {String}
     */

    inhBaseDir: templatesSrc,

    /**
     * Path to compiled HTML files
     * @type {String}
     */
    dest: dest,

    /**
     * Minify final HTML or not
     * @type {Boolean}
     */
    minify: false,

    /**
     * Passed to jade compiler data
     * @type {Object}
     */
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
    },

    /**
     * Add hash to src (set false for disable)
     * @type {Object|boolean}
     */
    hashes: dest + '**/*.html'

  },

  styles: {

    /**
     * Styles bundles
     * @type {Array}
     */
    bundles: [
      {
        name: 'styles',
        src: [stylesSrc + 'vendor/normalize.css', stylesSrc + 'styles.scss', stylesSrc + 'vendor/*.css'],
        dest: assetsDest + 'css/',
        minify: true,
        concat: true,
        hashes: true
      }
    ],

    /**
     * Autoprefixer config
     * @type {Array}
     */
    autoprefixer: ['last 12 versions']

  },

  scripts: {

    /**
     * Scripts bundles
     * @type {Array}
     */
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
        src: [scriptsSrc + 'app/utils.js', scriptsSrc + 'app/common.js', scriptsSrc + 'app/**/*.js'],
        dest: assetsDest + 'js/',
        concat: true,
        minify: true
      }
    ]

  },

  images: {

    /**
     * Paths to images source
     * @type {String|Array}
     */
    src: [
      imagesSrc + '**/*.{png,jpg,gif,svg}',
      '!' + imagesSrc + 'sprites/**/*',
      '!' + imagesSrc + 'svg-sprites/**/*',
      '!' + imagesSrc + 'icons/**/*'
    ],

    /**
     * Paths to images in build
     * @type {String|Array}
     */
    dest: assetsDest + 'images/'

  },

  spritesPng: {

    /**
     * Generate png sprites
     * @type {Boolean}
     */
    enabled: true,

    /**
     * Paths to sprite source files
     * @type {String|Array}
     */
    src: imagesSrc + 'sprites/',

    /**
     * Paths to generated sprites
     * @type {String}
     */
    dest: assetsDest + 'images/sprites/',

    /**
     * Use *@2x.png images to generate retina sprites
     * @type {Boolean}
     */
    retina: true,

    /**
     * Name of sprites styles file
     * @type {String}
     */
    stylesName: '_sprites.scss',

    /**
     * Paths to generated sprites styles
     * @type {String}
     */
    stylesDest: stylesSrc + '_sprites/',

    /**
     * Paths to sprite styles file template
     * @type {String}
     */
    template: protossRoot + '/assets/sprite.mustache',

    /**
     * Paths to sprite in background url (styles mixin)
     * @type {String}
     */
    spritePath: '#{$pathToImages}sprites/',

    /**
     * Add sprite name for icon variable name:
     * $sprite-name_icon
     * @type {Boolean}
     */
    prefix: true

  },

  spritesSvg: {

    /**
     * Generate svg sprites
     * @type {Boolean}
     */
    enabled: true,

    /**
     * Paths to sprite source files
     * @type {String|Array}
     */
    src: imagesSrc + 'svg-sprites/',

    /**
     * Paths to generated sprites
     * @type {String}
     */
    dest: assetsDest + 'images/svg-sprites/',

    /**
     * Name of sprites styles file
     * @type {String}
     */
    stylesName: '_sprites-svg.scss',

    /**
     * Paths to generated sprites styles
     * @type {String}
     */
    stylesDest: stylesSrc + '_sprites/',

    /**
     * Paths to sprite styles file template
     * @type {String}
     */
    template: protossRoot + '/assets/sprite-svg.mustache',

    /**
     * Paths to sprite in background url (styles mixin)
     * @type {String}
     */
    spritePath: '#{$pathToImages}svg-sprites/',

    /**
     * Add sprite name for icon variable name:
     * $sprite-name_icon
     * @type {Boolean}
     */
    prefix: true

  },

  svgIcons: {

    /**
     * Generate svg icons
     * @type {Boolean}
     */
    enabled: true,

    /**
     * Paths to icons source files
     * @type {String|Array}
     */
    src: imagesSrc + 'icons/',

    /**
     * Paths to generated icons sets
     * @type {String}
     */
    dest: assetsDest + 'images/icons/'


  },

  /**
   * Watch for files and run tasks
   */

  watch: [

    // Templates
    {
      cwd: null,
      path: templatesSrc + '**/*.jade',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/templates/compile'
        }
      ]
    },

    // Templates data
    {
      cwd: null,
      path: src + 'data/**/*',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/templates/compile-all'
        }
      ]
    },

    // Styles
    {
      cwd: null,
      path: stylesSrc +'**/*.{css,scss}',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/styles/bundle'
        }
      ]
    },

    // Scripts
    {
      cwd: null,
      path: scriptsSrc + '**/*.js',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/scripts/bundle'
        }
      ]
    },

    // Images
    {
      cwd: imagesSrc,
      path: '**/*.{png,jpg,gif,svg}',
      ignore: [
        'sprites/**/*',
        'svg-sprites/**/*',
        'svg-icons/**/*'
      ],
      on: [
        {
          event: 'add',
          task: 'protoss/images/move'
        },
        {
          event: 'change',
          task: 'protoss/images/move'
        }
      ]
    },

    // Png sprites
    {
      cwd: null,
      path: imagesSrc + 'sprites/**/*.png',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/images/sprites'
        }
      ]
    },

    // Svg sprites
    {
      cwd: null,
      path: imagesSrc + 'svg-sprites/**/*.svg',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/images/sprites-svg'
        }
      ]
    },

    // Svg icons
    {
      cwd: null,
      path: imagesSrc + 'icons/**/*.svg',
      ignore: null,
      on: [
        {
          event: 'all',
          task: 'protoss/images/icons'
        }
      ]
    }

  ],

  /**
   * Copy files from one directory to another
   * [path, destination]
   * @type {Array}
   */
  copy: [
    [src + 'fonts/**/*', assetsDest + 'fonts/']
  ],

  /**
   * Directories to clean on build
   * @type {Array}
   */
  clean: [
    dest
  ],

  favicons: {

    /**
     * Generate favicons
     * @type {Boolean}
     */
    enabled: true,

    /**
     * Application name for manifest.json
     * @type {Boolean}
     */
    appName: 'Protoss',

    /**
     * Path to favicons source image
     * @type {String}
     */
    source: src + 'resources/favicon-master.png',

    /**
     * Path to store generated favicons
     * @type {String}
     */
    dest: assetsDest + 'favicons/',

    /**
     * Path to store generated favicons in site root (for .ico and browserconfig.xml)
     * @type {String}
     */
    rootDest: dest,

    /**
     * Background colour for flattened icons (apple-touch-icon)
     * @type {String}
     */
    background: '#fff'

  },

  browserSync: {

    /**
     * Port of local server for browser-sync
     * @type {Number}
     */
    port: 9001,

    /**
     * Root directory to web server
     * @type {String}
     */
    basedir: dest,

    /**
     * Choose the page to open in browser at first opening
     * @type {String}
     */
    startPath: '/',

    /**
     * Browser to open
     * Example: ['google chrome', 'firefox']
     * Avalible: default, safari, internet explorer, google chrome, firefox, opera
     * @type {String|Array}
     */
    browser: 'default',

    /**
     * Clicks, Scrolls & Form inputs on any device will be mirrored to all others or not
     * https://www.browsersync.io/docs/options/#option-ghostMode
     */
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }

  }

};
