/**
 * Protoss
 * Gulp tasks bundle for fast front-end development
 */

require('./helpers/set-ulimit')();

global.protoss = {};
protoss.notifier = require('./helpers/notifier');
protoss.errorHandler = require('./helpers/error-handler');
protoss.flags = {
  isWatch: false,
  isBuild: false
};

module.exports = function(gulp, userConfig) {

  if (!gulp) throw new Error('No gulp passed!'); // TODO: error text

  protoss.gulp = gulp;

  // Prepare config
  let defaultConfig = require(__dirname + '/protoss-config.js');
  protoss.config = require('./helpers/merge-config')(defaultConfig, userConfig);

  // Load tasks
  require('require-dir')('tasks-new', {recurse: true});

  // TODO: 'make config' task

  // TODO: Remove that:

  var runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

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
