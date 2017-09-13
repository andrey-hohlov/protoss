import gulp from 'gulp'
import gutil from 'gulp-util';
import webpackStream from 'webpack-stream';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.webpack;
const webpackErrorHandler = protoss.errorHandler('Error in \'webpack\' task');

const runWebpack = function runWebpack(watch) {
  return () => {
    let webpackConfig = config.config;

    if (typeof webpackConfig === 'function') {
      webpackConfig = webpackConfig();
    }

    if (watch !== undefined) {
      webpackConfig.watch = watch;
    }

    return gulp.src(config.src)
      .pipe(webpackStream(webpackConfig, null, (err, stats) => {
        const jsonStats = stats.toJson();

        if (jsonStats.errors.length) {
          jsonStats.errors.forEach((message) => {
            webpackErrorHandler.call({
              emit() { /* noop */
              }
            }, {message});
          });
        }

        gutil.log(stats.toString({colors: true}));
      }))
      .pipe(gulp.dest(config.dest))
  }
};

protoss.gulp.task('protoss/webpack', runWebpack(false));

protoss.gulp.task('protoss/webpack:watch', runWebpack(true));

protoss.gulp.task('protoss/webpack:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/webpack',
    cb,
  );
});
