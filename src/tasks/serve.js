const browserSync = require('browser-sync').create();
const config = protoss.config.serve;

protoss.gulp.task('protoss/serve', (cb) => {
  browserSync.init(config.browsersync);
  if (config.watch) {
    browserSync.watch(config.watch).on('change', browserSync.reload);
  }
  cb(null);
});
