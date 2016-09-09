const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

protoss.gulp.task('protoss/build/styles', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/styles',
    cb
  );
});

protoss.gulp.task('protoss/build/scripts', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/scripts',
    cb
  );
});

protoss.gulp.task('protoss/build/templates', function(cb) {
  protoss.flags.isBuild = true;
  runSequence(
    'protoss/templates',
    cb
  );
});
