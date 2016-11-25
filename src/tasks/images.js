import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4
const config = protoss.config.images;
const isWatch = protoss.isWatch;

protoss.gulp.task('protoss/images', () => {
  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'images\' task`)}))
    .pipe(gulpif(isWatch, changed(config.dest)))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      protoss.notifier.success('Images moved');
    })
});

protoss.gulp.task('protoss/images:watch', () => {
  let watcher = chokidar.watch(
    config.src,
    {
      ignoreInitial: true
    }
  );

  watcher.on('add', function (path, stats) {
    logger('add', path);
    runSequence(
      'protoss/images'
    );
  });

  watcher.on('change', function (path, stats) {
    logger('change', path);
    runSequence(
      'protoss/images'
    );
  });
});

protoss.gulp.task('protoss/images:optimize', (cb) => {
  let isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) return;

  protoss.gulp.src(config.minPath)
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
