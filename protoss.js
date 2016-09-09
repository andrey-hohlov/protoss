/**
 * Protoss
 * Front-end builder
 */

const merge = require('merge');

// Set ulimit to 4096 for *nix FS. It needs to work with big amount of files
if (require('os').platform() !== 'win32') {
  require('./helpers/set-ulimit')();
}

global.protoss = {};

protoss.helpers = {
  listDir: require('./helpers/list-directory')
};

protoss.notifier = require('./helpers/notifier');
protoss.errorHandler = require('./helpers/error-handler');

protoss.flags = {
  isWatching: false,
  isDev: true
};

module.exports = function(gulp, userConfig) {

  // TODO: throw error if no gulp
  if (gulp) {
    protoss.gulp = gulp;
  } else {
    protoss.gulp = require('gulp');
  }

  /**
   * Load config
   */

  // TODO: make config task

  var defaultConfig = require(__dirname + '/protoss-config.js');

  if (!userConfig) {
    protoss.helpers.notifier.error('You don\'t create protoss-config file. Using deault settings.');
    userConfig = {};
  } else if (typeof userConfig !== 'object') {
    protoss.helpers.notifier.error('Protoss config must be an object! Using deault settings.');
    userConfig = {};
  }

  protoss.config = merge.recursive(defaultConfig, userConfig);

  var runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4


  // Load tasks
  require('require-dir')('tasks-new', {recurse: true});

  /**
   * Lazy load tasks
   */

  function lazyRequireTask(path) {
    var args = [].slice.call(arguments, 1);
    return function(callback) {
      var task = require(path).apply(this, args);

      return task(callback);
    };
  }

  gulp.task('protoss/watch-and-sync', function(cb) {
    runSequence(
      'protoss/dev',
      'protoss/browserSync',
      'protoss/run-watchers',
      cb
    );
  });

  gulp.task('protoss/watch', function(cb) {
    runSequence(
      'protoss/dev',
      'protoss/run-watchers',
      cb
    );
  });

  gulp.task('protoss/build', function(cb) {
    protoss.flags.isBuild = true;
    runSequence(
      'protoss/utils/clean',
      [
        'protoss/images/move',
        'protoss/scripts',
        'protoss/favicons'
      ],
      [
        'protoss/images/sprites',
        'protoss/images/sprites-svg',
        'protoss/images/icons'
      ],
      [
        'protoss/templates',
        'protoss/styles',
        'protoss/images/optimize'
      ],
      [
        'protoss/utils/copy'
      ],
      function () {
        protoss.notifier.success('Production version have been builded successfully!');
        cb();
      }
    );
  });

  gulp.task('protoss/dev', function(cb) {
    protoss.flags.isDev = true;
    runSequence(
      [
        'protoss/images/move',
        'protoss/images/sprites',
        'protoss/images/sprites-svg',
        'protoss/images/icons',
        'protoss/favicons'
      ],
      [
        'protoss/templates',
        'protoss/styles',
        'protoss/scripts',
        'protoss/utils/copy'
      ],
      function () {
        protoss.notifier.success('Development version have been builded successfully!');
        cb();
      }
    );
  });

  //Separate tasks

  gulp.task('protoss/images/move', lazyRequireTask(__dirname + '/tasks/images/move'));

  gulp.task('protoss/images/sprites', lazyRequireTask(__dirname + '/tasks/images/sprites'));

  gulp.task('protoss/images/sprites-svg', lazyRequireTask(__dirname + '/tasks/images/sprites-svg'));

  gulp.task('protoss/images/icons', lazyRequireTask(__dirname + '/tasks/images/icons'));

  gulp.task('protoss/images/optimize', lazyRequireTask(__dirname + '/tasks/images/optimize'));

  gulp.task('protoss/utils/clean', lazyRequireTask(__dirname + '/tasks/utils/clean'));

  gulp.task('protoss/utils/copy', lazyRequireTask(__dirname + '/tasks/utils/copy'));

  gulp.task('protoss/favicons', lazyRequireTask(__dirname + '/tasks/favicons'));

  gulp.task('protoss/browserSync', lazyRequireTask(__dirname + '/tasks/browserSync'));

  gulp.task('protoss/run-watchers', lazyRequireTask(__dirname + '/tasks/watchers', {logger: require('./helpers/watcher-log')}));

};
