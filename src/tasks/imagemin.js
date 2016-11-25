import plumber from 'gulp-plumber';
import imagemin from 'gulp-imagemin';

const config = protoss.config.images;

protoss.gulp.task('protoss/imagemin', (cb) => {
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) return;

  protoss.gulp.src(config.minPath + '**/*.{png,jpg,gif,svg}')
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'imagemin\' task`)}))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          { removeUselessDefs: false },
          { cleanupIDs: false },
          { removeViewBox: false },
          { convertPathData: false },
          { mergePaths: false },
          { removeXMLProcInst: false }
        ]
      }),
      imagemin.gifsicle(),
      imagemin.jpegtran(),
      imagemin.optipng()
    ]))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      protoss.notifier.success('Images optimized');
      cb(null);
    });
});
