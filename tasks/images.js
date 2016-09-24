const config = protoss.config.images;
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');

protoss.gulp.task('protoss/images', () => (
  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'images\' task`)}))
    .pipe(gulpif(protoss.flags.isWatch, changed(config.dest)))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      protoss.notifier.success('Images moved');
    })
));
