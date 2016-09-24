const config = protoss.config.favicons;

const plumber = require('gulp-plumber');
const favicons = require('gulp-favicons');

protoss.gulp.task('protoss/favicons', () => {
  if (!config.enabled) return;
  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'favicons\' task`)}))
    .pipe(favicons({
      appName: config.appName,
      background: config.background,
      path: config.path,
      display: 'standalone',
      orientation: 'portrait',
      version: 2.0,
      logging: false,
      online: false,
      html: false,
      replace: true,
      icons: {
        favicons: true,
        android: true,
        appleIcon: true,
        windows: true,
        appleStartup: false,
        coast: false,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false
      }
    }))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      //cb(null);
    });
});
