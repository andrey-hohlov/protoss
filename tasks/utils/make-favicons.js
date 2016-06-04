'use strict';

var config = protoss.config.favicons;
var packages = protoss.packages;

/**
 * Generate favicons for all platforms
 */

module.exports = function() {
  packages.gulp.task('protoss/utils/make-favicons', function(cb) {

    if (config.enabled) {
      var rootFilter = packages.filter(['favicon.ico', 'browserconfig.xml']);
      var nonRootFilter = packages.filter(['*', '!favicon.ico', '!browserconfig.xml'], {restore: true});

      packages.gulp.src(config.source)

        // Prevent pipe breaking
        .pipe(packages.plumber(function(error) {
          notifier.error('An error occurred while making favicons: ' + error);
          this.emit('end');
        }))

        // Make favicons
        .pipe(
          packages.favicons({
            appName: config.appName,
            background: config.background,
            path: config.path,
            display: 'standalone',
            orientation: 'portrait',
            version: 1.0,
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
        .pipe(nonRootFilter)
        .pipe(packages.gulp.dest(config.dest))

        // Save favicons in root
        .pipe(nonRootFilter.restore)
        .pipe(rootFilter)
        .pipe(packages.gulp.dest(config.rootDest))

        .on('end', function() {
          cb(null); // End task
        });

    } else {
      cb(null); // End task
    }

  });
};
