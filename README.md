# Protoss
[Gulp](http://gulpjs.com/)-tasks collection for frontend building.

0. [Features](#features)
0. [Installation](#install)
0. [Tasks](#tasks)
0. [Configuration](#configuration)

## Features

- Compile [Pug](https://pugjs.org/api/getting-started.html) (Jade) templates. Use [PostHTML]() plugins and validate HTML with W3C.
- Compile [SCSS](http://sass-lang.com/) in separate result files (bundles), use `glod` imports. Add vendor prefixes, optimize css, write source maps. Support [PostCSS](http://postcss.org/).
- Use Webpack 2 for bundle JavaScript, or just concatenate in separate bundles and minify. Source maps support.
- Generate multiple png-sprites with retina support.
- Generate multiple svg-sprites with png-fallback.
- Generate multiple svg-icons sets.
- Optimize images.
- Generate favicons.
- Add cache busting hashes to links in HTML and CSS.
- Lint SCSS adn JavaScript.
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
var gulp = require('gulp');
var config = {};
require('protoss')(gulp, config);
```

Now you can use protoss-tasks.


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

### Scripts

`protoss/scripts:lint` - lint JavaScript files with ESLint

#### Webpack workflow

`protoss/webpack` - run webpack

`protoss/webpack:build` - set `NODE_ENV = 'production'` and run webpack

`protoss/webpack:watch` - run webpack with force set `watch: true`

#### Concat workflow

`protoss/scripts:build` - build scripts bundles

`protoss/scripts:build` - build scripts bundles with all optimizations

`protoss/scripts:watch` - watch for scripts sources and recompile css after changes

### Images

`protoss/images` - copy images from source to destination folder

`protoss/images:watch` - watch for source images changes and run protoss/images task 

`protoss/images:optimize` - optimize images
 
`protoss/images:build` - run protoss/images and then protoss/images:optimize tasks

`protoss/icons` -

`protoss/icons:watch` -
 
`protoss/icons` -

`protoss/sprites` -

`protoss/sprites:watch` -
 
`protoss/sprites-svg` -

`protoss/sprites-svg:watch` - 
 
`protoss/favicons` - generate favicons


### Utils

`protoss/copy` - copy files from source to destination
 
`protoss/del` - delete files

`protoss/serve` - run browsersync


## Configuration

### Default

```javascript
{
  templates: {
    src: './src/templates/**/*.jade',
    filterFunc: false,
    inhBaseDir: './src/',
    dest: './build/',
    data: {},
    prettify: true,
    posthtml: false,
    hashes: {
      enabled: true,
      build_dir: './',
      src_path: './'
    },
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
        watch: './src/styles/**/*.scss',
        minify: true,
        hashes: true,
        postcss: false,
        sourceMaps: true
      }
    ],
    lint: {
      src: ['./src/styles/**/*.scss']
    }
  },
  scripts: {
    workflow: 'webpack',
    webpackConfig: require(`${process.cwd()}/webpack.config.js`),
    bundles: [
      {
        name: 'app',
        src: ['./src/scripts/**/*.js'],
        dest: './build/static/js/',
        watch: './src/scripts/**/*.js',
        concat: true,
        minify: true,
        sourceMaps: true
      }
    ],
    lint: {
      src: ['./src/scripts/**/*.js']
    }
  },
  images: {
    src: ['./src/resources/images/**/*.{png,jpg,gif,svg}'],
    dest: './build/static/images/',
    minPath: './build/static/images/**/*.{png,jpg,gif,svg}'
  },
  sprites: {
    enabled: true,
    src: './src/sprites/png/**/*.png',
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
    spritePath: '#{$pathToImages}sprites-svg/',
    template: __dirname + '/assets/sprite-svg.mustache',
    fallback: false
  },
  icons: {
    enabled: true,
    src: './src/icons/',
    dest: './build/static/images/icons/'
  },
  copy: [
    {
      src: './src/resources/fonts/**/*',
      dest: './build/fonts/'
    }
  ],
  del: [
    './build'
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
  serve: {
    browsersync: {
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
    },
    watch: './build/'
  }
}
```

### Templates
### Styles
### Scripts
### Images
### Sprites
### SVG sprites
### SVG icons
### Copy
### Del
### Favicons
### Serve


## License

The [MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2017 Andrey Hohlov
