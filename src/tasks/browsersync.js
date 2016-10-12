const config = protoss.config.browserSync;
protoss.browserSync = require('browser-sync').create();

protoss.gulp.task('protoss/browserSync', function(cb) {
  protoss.browserSync.init(config);
  cb(null);
});
