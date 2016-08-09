const config = protoss.config.favicons;

const plumber = require('gulp-plumber');
const favicons = require('gulp-favicons');

module.exports = function(options) {

  return function(cb) {

    if (!config.enabled) return cb(null);

    protoss.gulp.src(config.source)

      // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while making favicons: ' + error);
        this.emit('end');
      }))

      // Make favicons
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

      // Save favicons excluded that saving in root
      .pipe(protoss.gulp.dest(config.dest))

      .on('end', function() {
        cb(null); // End task
      });

  };

};
