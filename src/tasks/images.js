import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import changed from 'gulp-changed';

const config = protoss.config.images;
const isWatch = protoss.isWatch;

protoss.gulp.task('protoss/images', () => (
  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'images\' task`)}))
    .pipe(gulpif(isWatch, changed(config.dest)))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      protoss.notifier.success('Images moved');
    })
));
