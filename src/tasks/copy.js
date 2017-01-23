import plumber from 'gulp-plumber';
import mergeStream from 'merge-stream';

const config = protoss.config.copy;

protoss.gulp.task('protoss/copy', () => {
  const streams = mergeStream();
  const copy = config || [];

  copy.forEach((files) => {
    const copyStream = protoss.gulp.src(files[0])
      .pipe(plumber({
        errorHandler: protoss.errorHandler('Error in copy task'),
      }))
      .pipe(protoss.gulp.dest(files[1]));
    streams.add(copyStream);
  });

  return streams;
});
