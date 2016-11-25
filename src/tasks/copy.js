import plumber from 'gulp-plumber';

const config = protoss.config.copy;

protoss.gulp.task('protoss/copy', function(cb) {
  var files = config || [];
  if (files.length != 0) {
    for (var i = 0; i < files.length; i++) {
      protoss.gulp.src(files[i][0])
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'copy\' task`)}))
        .pipe(protoss.gulp.dest(files[i][1]))
    }
    cb(null);
  }
});
