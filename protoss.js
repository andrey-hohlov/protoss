'use strict';

/**
 * Load tasks
 */

global.protoss = {};

protoss.packages = {
  autoprefixer: require('gulp-autoprefixer'),
  browserSync: require('browser-sync').create(),
  cached: require('gulp-cached'),
  changed: require('gulp-changed'),
  cheerio: require('gulp-cheerio'),
  chokidar: require('chokidar'),
  concat: require('gulp-concat'),
  csscomb: require('gulp-csscomb'),
  cssnano: require('gulp-cssnano'),
  csso: require('gulp-csso'),
  del: require('del'),
  favicons: require('gulp-favicons'),
  filter: require('gulp-filter'),
  gmq: require('gulp-group-css-media-queries'),
  gulpif: require('gulp-if'),
  gutil: require('gulp-util'),
  hashSrc: require('gulp-hash-src'),
  htmlmin: require('gulp-htmlmin'),
  imagemin: require('gulp-imagemin'),
  jade: require('gulp-jade'),
  jadeInheritance: require('gulp-jade-inheritance'),
  prettify: require('gulp-jsbeautifier'),
  mergeStream: require('merge-stream'),
  plumber: require('gulp-plumber'),
  postcss: require('gulp-postcss'),
  rename: require('gulp-rename'),
  sass: require('gulp-sass'),
  spritesmithMulti: require('gulp.spritesmith-multi'),
  stripDebug: require('gulp-strip-debug'),
  svg2png: require('gulp-svg2png'),
  svgSprite: require('gulp-svg-sprite'),
  uglify: require('gulp-uglify')
};

protoss.helpers = {
  merge: require('merge'),
  fileLoader: require('./helpers/file-loader'),
  getData: require('./helpers/get-data'),
  listDir: require('./helpers/list-directory'),
  notifier:  require('./helpers/notifier'),
  watcherLog: require('./helpers/watcher-log')
};

protoss.flags = {
  isWatching: false,
  isDev: false,
  isDataReload: false
};

// Set ulimit to 4096 for *nix FS. It needs to work with big amount of files
if (require('os').platform() !== 'win32') {
  require('./helpers/set-ulimit')();
}

// Get all tasks and watchers
var tasks = protoss.helpers.fileLoader(__dirname+ '/tasks') || [];
var watchers = protoss.helpers.fileLoader(__dirname + '/watchers') || [];

module.exports = function(gulp, userConfig) {

  if (gulp) {
    protoss.packages.gulp = gulp;
  } else {
    protoss.packages.gulp = require('gulp');
  }


  /**
   * Load config
   */

  var defaultConfig = require(__dirname + '/protoss-config.js');

  if (!userConfig) {
    protoss.helpers.notifier.error('You don\'t create protoss-config file. Using deault settings.');
    userConfig = {};
  } else if (typeof userConfig !== 'object') {
    protoss.helpers.notifier.error('Protoss config must be an object! Using deault settings.');
    userConfig = {};
  }

  protoss.config = protoss.helpers.merge.recursive(defaultConfig, userConfig);


  /**
   * Load tasks
   */

  tasks.forEach(function (file) {
    require(file)();
  });


  /**
   * Main tasks
   */

  var runSequence = require('run-sequence').use(protoss.packages.gulp); // TODO: remove on Gulp 4

  protoss.packages.gulp.task('protoss/_build', function(cb) {
    protoss.flags.isDev = false;
    runSequence(
      'protoss/utils/clean',
      [
        'protoss/images/move',
        'protoss/scripts/make-bundles',
        'protoss/utils/copy',
        'protoss/utils/make-favicons'
      ],
      [
        'protoss/images/make-svg-sprites',
        'protoss/images/make-png-sprites',
        'protoss/images/make-svg-icons'
      ],
      [
        'protoss/templates/compile',
        'protoss/styles/make-bundles',
        'protoss/images/optimize'
      ],
      [
        'protoss/templates/add-hashes',
        'protoss/styles/add-hashes'
      ],
      function () {
        protoss.helpers.notifier.success('Production version have been builded successfully!');
        cb();
      }
    );

  });

  protoss.packages.gulp.task('protoss/_dev', function(cb) {
    protoss.flags.isDev = true;
    runSequence(
      [
        'protoss/images/move',
        'protoss/images/make-svg-sprites',
        'protoss/images/make-png-sprites',
        'protoss/images/make-svg-icons',
        'protoss/utils/copy'
      ],
      [
        'protoss/templates/compile',
        'protoss/scripts/make-bundles',
        'protoss/styles/make-bundles',
        'protoss/utils/make-favicons'
      ],
      function () {
        protoss.helpers.notifier.success('Development version have been builded successfully!');
        cb()
      }
    );
  });

  protoss.packages.gulp.task('protoss/utils/run-watchers', function(cb) {
    return (function (){
      watchers.forEach(function (file) {
        require(file)();
      });

      protoss.flags.isWatching = true;
      cb();

    })()

  });

  protoss.packages.gulp.task('protoss/utils/browserSync', function() {

    var config = protoss.config.browserSync;

    return protoss.packages.browserSync.init({
      open: true,
      port: config.port,
      server: {
        directory: true,
        baseDir: config.basedir
      },
      reloadDelay: 200,
      logConnections: true,
      debugInfo: true,
      injectChanges: false,
      browser: config.browser,
      startPath:  config.startPath,
      ghostMode:  config.ghostMode
    });
  });

  protoss.packages.gulp.task('protoss/_watch-and-sync', function(cb) {
    runSequence(
      'protoss/_dev',
      'protoss/utils/browserSync',
      'protoss/utils/run-watchers',
      cb
    );
  });

  protoss.packages.gulp.task('protoss/_watch', function(cb) {
    runSequence(
      'protoss/_dev',
      'protoss/utils/run-watchers',
      cb
    );
  });


  /**
   * Separate tasks
   */

  protoss.packages.gulp.task('protoss/_dev-scripts', function(cb) {
    protoss.flags.isDev = true;
    runSequence(
      'protoss/scripts/make-bundles',
      cb
    );
  });

  protoss.packages.gulp.task('protoss/_dev-styles', function(cb) {
    protoss.flags.isDev = true;
    runSequence(
      'protoss/styles/make-bundles',
      cb
    );
  });

  protoss.packages.gulp.task('protoss/_build-scripts', function(cb) {
    protoss.flags.isDev = false;
    runSequence(
      'protoss/scripts/make-bundles',
      cb
    );
  });

  protoss.packages.gulp.task('protoss/_build-styles', function(cb) {
    protoss.flags.isDev = false;
    runSequence(
      'protoss/styles/make-bundles',
      cb
    );
  });

};
