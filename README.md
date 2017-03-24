# Protoss
[Gulp](http://gulpjs.com/)-tasks collection for frontend building.

*2.0 branch [here](https://github.com/andrey-hohlov/protoss/tree/2.0).*

0. [Features](#features)
0. [Installation](#installation)
0. [Tasks](#tasks)
0. [Configuration](#configuration)

## [Usage example](https://github.com/andrey-hohlov/layout-starter)

## Features

- Compile [Pug](https://pugjs.org/api/getting-started.html) (ex Jade) templates. Use [PostHTML](https://github.com/posthtml) plugins.
- Compile [SCSS](http://sass-lang.com/) in separate result files (bundles), use `glod` imports. Add vendor prefixes, optimize css, write source maps. Support [PostCSS](http://postcss.org/).
- Use [Webpack 2](https://webpack.js.org/) for bundle JavaScript. Or just concatenate files in separate bundles and minify. Source maps support.
- Generate multiple png-sprites with retina support.
- Generate multiple svg-sprites with png-fallback.
- Generate multiple svg-icons sets.
- Optimize images.
- Generate favicons.
- Add cache busting hashes to links in HTML and CSS.
- Lint SCSS and JavaScript. Validate HTML with W3C.
- [BrowserSync](https://www.browsersync.io/) include.
- Add Protoss-tasks to you workflow, configure it as you need.


## Installation

Install gulp globally:

```bash
$ npm install -g gulp
```

Install gulp and protoss local in you project:

```bash
$ npm install --save-dev gulp protoss 
```

Add protoss require in you `gulpfile.js`:

```javascript
const gulp = require('gulp');
const config = {};
require('protoss')(gulp, config);
```

Now you can use Protoss tasks.


## Tasks

### Common

`protoss/build` - build production version

`protoss/dev` - build development version

`protoss/watch` - protoss/dev + run all watchers

`protoss/watch-and-sync` - protoss/watch + start browsersync server

### Templates

`protoss/templates` - compile templates

`protoss/templates:build` - compile templates with all optimizations

`protoss/templates:watch` - watch for templates sources and recompile HTML after changes

`protoss/templates:w3c-test` - validate compiled HTML

### Styles

`protoss/styles` - build styles bundles

`protoss/styles:build` - build styles bundles with all optimizations

`protoss/styles:watch` - watch for styles sources and recompile css after changes

`protoss/styles:lint` - lint SCSS with stylelint

### Scripts - webpack workflow

`protoss/webpack` - run webpack

`protoss/webpack:build` - set `NODE_ENV = 'production'` and run webpack

`protoss/webpack:watch` - run webpack with force set `watch: true`

### Scripts - concat workflow

`protoss/scripts` - build scripts bundles

`protoss/scripts:build` - build scripts bundles with all optimizations

`protoss/scripts:watch` - watch for scripts sources and recompile css after changes

`protoss/scripts:lint` - lint JavaScript files with ESLint

### Images

`protoss/images` - copy images from source to destination folder

`protoss/images:watch` - watch for source images changes and run protoss/images task 

`protoss/images:optimize` - optimize images
 
`protoss/images:build` - run protoss/images and then protoss/images:optimize tasks

`protoss/icons` - make icons sprite (svg symbols)

`protoss/icons:watch` - watch for icons changes and make sprite

`protoss/sprites` - generate png-sprites

`protoss/sprites:watch` - watch for changes and generate png-sprites
 
`protoss/sprites-svg` - generate svg-sprites

`protoss/sprites-svg:watch` - watch for changes and generate svg-sprites
 
`protoss/favicons` - generate favicons


### Utils

`protoss/copy` - copy files from source to destination
 
`protoss/del` - delete files

`protoss/serve` - run browsersync


## Configuration

### Default

```javascript
module.exports = {
  templates: {
    enabled: true,
    src: './src/templates/**/*.jade',
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
    hashes: {
      build_dir: './',
      src_path: './',
      query_name: 'v',
      hash_len: 10,
      exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ico'],
    },
    w3c: {
      src: './build/*.html',
    },
  },

  styles: {
    bundles: [
      {
        name: 'app',
        src: './src/styles/app.scss',
        dest: './build/static/css/',
        watch: [
          './src/styles/**/*.scss',
          './temp/**/*.scss',
        ],
        minify: true,
        hashes:  {
          build_dir: './',
          src_path: './',
          query_name: 'v',
          hash_len: 10,
          exts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        },
        postcss: false,
        sourceMaps: true,
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
    workflow: 'webpack', // 'webpack' or 'concat'
    webpackConfig: fs.existsSync(webpackConfigPath) ? require(webpackConfigPath) : null,
    bundles: [
      {
        name: 'app',
        src: ['./src/scripts/**/*.js'],
        dest: './build/static/js/',
        watch: './src/scripts/**/*.js',
        concat: true,
        minify: true,
        sourceMaps: true,
      },
    ],
    lint: {
      src: ['./src/scripts/**/*.js'],
    },
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
  }
}
```

### Templates

`templates.enabled` (boolean) - use templates tasks.

`templates.src` (string|array) - path to templates source files.

`templates.dest` (string) - compiled HTML destination.

`templates.filter` (function) - function for filter out files.

`templates.inheritance` (object) - configuration for [gulp-pug-inheritance](https://www.npmjs.com/package/gulp-pug-inheritance).

`templates.data` (object) - data, passed to templates.

`templates.prettify` (boolean) - prettify final HTML (use config from `.jsbeautifyrc` file in project root).

`templates.posthtml` (boolean|object) - config for [https://www.npmjs.com/package/gulp-posthtml](https://www.npmjs.com/package/gulp-posthtml).  

`templates.hashes` (boolean|object) - config for [gulp-hash-src](https://www.npmjs.com/package/gulp-hash-src). Set `false` for disable hashes.

`templates.w3c.src` (string|array) - path to HTML files to test validity with W3C.

### Styles

`styles.enabled` (boolean) - use styles tasks.

`styles.bundles` (array) - array of bundles.

`styles.bundles.%bundle%.name` (string) - name of bundle (name of final file).

`styles.bundles.%bundle%.src` (string|array) - path to bundle source files.

`styles.bundles.%bundle%.dest` (string) - destination of bundle file.

`styles.bundles.%bundle%.watch` (string|array) - path for watch files of this bundle. If not set `src` will be used.

`styles.bundles.%bundle%.minify` (boolean) - minify this bundle.

`styles.bundles.%bundle%.hashes` (boolean|object) - config for [gulp-hash-src](https://www.npmjs.com/package/gulp-hash-src). Set `false` for disable hashes.

`styles.bundles.%bundle%.postcss` (boolean|array) - array of [PostCSS](http://postcss.org/) plugins.

`styles.bundles.%plugin%.processor` (object) - PostCSS processor.

`styles.bundles.%plugin%.options` (options) - options for processor.

`styles.bundles.%bundle%.sourceMaps` (boolean) - generate sourcemaps for this bundle.

`styles.lint.src` (string|array) - path to files that will be checked by stylelint.

`styles.lint.config` (object) - config for [gulp-stylelint](https://github.com/olegskl/gulp-stylelint).

### Scripts

`scripts.enabled` (boolean) - use scripts tasks.

`scripts.workflow` (string) - scripts workflow: `concat` or `webpack`.

`scripts.webpackConfig` (object|function) - webpack config.

`scripts.bundles` (array) - array of bundles (only concat workflow).

`scripts.bundles.%bundle%.name` (string) - name of bundle (name of final file).

`scripts.bundles.%bundle%.src` (string|array) - path to bundle source files.

`scripts.bundles.%bundle%.dest` (string) - destination of bundle file.

`scripts.bundles.%bundle%.watch` (string|array) - path for watch files of this bundle. If not set `src` will be used.

`scripts.bundles.%bundle%.concat` (boolean) - concat files in this bundle or copy it separate.

`scripts.bundles.%bundle%.minify` (boolean) - minify this bundle.

`scripts.bundles.%bundle%.sourceMaps` (boolean) - generate sourcemaps for this bundle.

`scripts.lint.src` (string|array) - path to files that will be checked by ESlint (only for concat workflow).
    
### Images

`images.enabled` (boolean) - use images tasks.

`images.src` (string|array) - images source.

`images.dest` (string) - images destination.

`images.minPath` (string|array) - path for minifying images.
 
### Sprites

`sprites.enabled` (boolean) - use png sprites.

`sprites.src` (string) - path to source *folders*. Each folder - separate sprite.

`sprites.dest` (string) - destination for sprite.

`sprites.retina` (boolean) - create retina sprites (each icon need to be in to sizes: `icon.png` and `icon@2x.png`).

`sprites.stylesName` (string) - name of sprite styles file.

`sprites.stylesDest` (string) - destination of sprite styles file.

`sprites.template` (string) - template for styles file.

`sprites.templateData` (object) - data, passed to styles template.

### SVG sprites

`spritesSvg.enabled` (boolean) - use svg sprites.

`spritesSvg.src` (string) - path to source *folders*. Each folder - separate sprite.

`spritesSvg.dest` (string) - destination for sprite.

`spritesSvg.stylesName` (string) - name of sprite styles file.

`spritesSvg.stylesDest` (string) - destination of sprite styles file.

`spritesSvg.template` (string) - template for styles file.

`sprites.templateData` (object) - data, passed to styles template.

`spritesSvg.fallback` (boolean) - create png-fallback.

### Icons

`icons.enabled` (boolean) - use [svg icons](https://css-tricks.com/svg-symbol-good-choice-icons/).

`icons.src` (string) - path to source *folders*. Each folder - separate icon set.

`icons.dest` (string) - destination for icon sets.

### Copy

`copy` (array) - copy tasks.

`copy.%tasks%.src` (string) - path to source files.

`copy.%tasks%.dest` (string) - path to copy destination.

### Del

`del` (array) - array of pathes to delete.

### Favicons

`favicons.enabled` (boolean) - generate favicons.

`favicons.src` (string) - path to favicon source file.

`favicons.dest` (string) - favicons destination.

`favicons.config` (object) - config for [Favicons](https://github.com/haydenbleasel/favicons).

### Serve

`serve.browsersync` (object) - [BrowserSync](https://www.browsersync.io/docs/options) config.


## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Andrey Hohlov
