import webpack from 'webpack';
import gutil from 'gulp-util';

const config = protoss.config.scripts;

const webpackErrorHandler = protoss.errorHandler('Error in \'webpack\' task');

const runWebpack = function runWebpack(watch = false) {
  return (callback) => {
    let webpackConfig = config.webpackConfig;

    if (typeof webpackConfig === 'function') {
      webpackConfig = webpackConfig();
    }
    webpackConfig.watch = watch;

    return webpack(webpackConfig, (error, stats) => {
      const jsonStats = stats.toJson();

      if (jsonStats.errors.length) {
        jsonStats.errors.forEach((message) => {
          webpackErrorHandler.call({ emit() { /* noop */ } }, { message });
        });
      }

      gutil.log(stats.toString({ colors: true }));

      if (webpackConfig.watch === false) {
        callback();
      }
    });
  };
};

protoss.gulp.task('protoss/webpack', runWebpack(false));

protoss.gulp.task('protoss/webpack:watch', runWebpack(true));
