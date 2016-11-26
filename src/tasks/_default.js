const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

protoss.gulp.task('protoss/watch-and-sync', (cb) => {
  runSequence(
    'protoss/watch',
    'protoss/serve',
    cb
  );
});

protoss.gulp.task('protoss/watch', (cb) => {
  runSequence(
    'protoss/dev',
    'protoss/scripts:watch',
    'protoss/styles:watch',
    'protoss/images:watch',
    'protoss/templates:watch',
    'protoss/sprites:watch',
    'protoss/sprites-svg:watch',
    'protoss/icons:watch',
    function () {
      protoss.isWatch = true;
      cb();
    }
  );
});

protoss.gulp.task('protoss/build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/del',
    'protoss/dev',
    'protoss/images:optimize',
    function () {
      protoss.notifier.success('Production version was built successfully!');
      cb();
    }
  );
});

protoss.gulp.task('protoss/dev', (cb) => {
  runSequence(
    [
      'protoss/images',
      'protoss/sprites',
      'protoss/sprites-svg',
      'protoss/icons',
      'protoss/favicons'
    ],
    [
      'protoss/copy',
      'protoss/scripts',
      'protoss/templates',
      'protoss/styles'
    ],
    function () {
      protoss.notifier.success('Development version was built successfully!');
      cb();
    }
  );
});

protoss.gulp.task('protoss/styles:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    [
      'protoss/sprites',
      'protoss/sprites-svg'
    ],
    'protoss/styles',
    cb
  );
});

protoss.gulp.task('protoss/scripts:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/scripts',
    cb
  );
});

protoss.gulp.task('protoss/templates:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/templates',
    cb
  );
});

protoss.gulp.task('protoss/images:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/images',
    'protoss/images:optimize',
    cb
  );
});