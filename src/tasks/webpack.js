import webpack from 'webpack';
import gutil from 'gulp-util';

const config = protoss.config.scripts;

if (config.workflow === 'webpack') {
  const webpackErrorHandler = protoss.errorHandler('Error in \'webpack\' task');

  function runWebpack(watch = false) {
    return function (callback) {
      const webpackConfig = config.webpackConfig || require(process.cwd() + '/webpack.config.js');
      webpackConfig.watch = watch;
      return webpack(webpackConfig, (error, stats) => {
        const jsonStats = stats.toJson();
        if (jsonStats.errors.length) {
          jsonStats.errors.forEach(message => {
            webpackErrorHandler.call({
              emit() {/* noop */
              }
            }, {message});
          });
        }
        gutil.log(stats.toString({colors: true}));

        if (webpackConfig.watch === false) {
          callback();
        }
      });
    };
  }

  protoss.gulp.task('protoss/webpack', runWebpack(false));

  protoss.gulp.task('protoss/webpack:watch', runWebpack(true));
}
