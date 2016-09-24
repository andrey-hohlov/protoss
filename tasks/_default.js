const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

protoss.gulp.task('protoss/watch-and-sync', function(cb) {
  runSequence(
    'protoss/watch',
    'protoss/browserSync',
    cb
  );
});

protoss.gulp.task('protoss/watch', function(cb) {
  protoss.flags.isWatch = true;
  runSequence(
    'protoss/dev',
    'protoss/watchers',
    cb
  );
});

protoss.gulp.task('protoss/build', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/del',
    'protoss/dev',
    'protoss/imagemin',
    function () {
      protoss.notifier.success('Production version was built successfully!');
      cb();
    }
  );
});

protoss.gulp.task('protoss/dev', function(cb) {
  runSequence(
    [
      'protoss/images',
      'protoss/sprites',
      'protoss/sprites-svg',
      'protoss/icons'
    ],
    [
      'protoss/copy',
      'protoss/scripts',
      'protoss/templates',
      'protoss/styles'
    ],
    [
      'protoss/favicons'
    ],
    function () {
      protoss.notifier.success('Development version was built successfully!');
      cb();
    }
  );
});

protoss.gulp.task('protoss/styles:build', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    [
      'protoss/sprites',
      'protoss/sprites-svg'
    ],
    'protoss/styles',
    cb
  );
});

protoss.gulp.task('protoss/scripts:build', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/scripts',
    cb
  );
});

protoss.gulp.task('protoss/templates:build', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/templates',
    cb
  );
});
