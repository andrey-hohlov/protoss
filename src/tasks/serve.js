const browserSync = require('browser-sync').create();

const config = protoss.config.serve;

protoss.gulp.task('protoss/serve', () => browserSync.init(config.browsersync));
