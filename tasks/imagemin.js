const config = protoss.config.images;
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

protoss.gulp.task('protoss/imagemin', (cb) => {
  if (protoss.flags.isDev) return;

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
