import plumber from 'gulp-plumber';
import favicons from 'gulp-favicons';

const config = protoss.config.favicons;

protoss.gulp.task('protoss/favicons', (cb) => {
  protoss.gulp.src(config.src)
    .pipe(plumber({
      errorHandler: protoss.errorHandler('Error in favicons task'),
    }))
    .pipe(favicons(config.config))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', () => {
      cb(null);
    });
});
