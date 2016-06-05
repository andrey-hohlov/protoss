'use strict';

var config = protoss.config.images;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Optimize images to build folder
 */

module.exports = function() {
  packages.gulp.task('protoss/images/optimize', function(cb) {

    if (!protoss.flags.isDev) {

      packages.gulp.src(config.dest + '**/*.{png,jpg,gif,svg}')

        // Prevent pipe breaking
        .pipe(packages.plumber(function(error) {
          notifier.error('An error occurred while optimizing images: ' + error);
          this.emit('end');
        }))

        // Minify images
        .pipe(packages.imagemin({
          svgoPlugins: [
            { cleanupIDs: false },
            { removeViewBox: false },
            { convertPathData: false },
            { mergePaths: false },
            {removeXMLProcInst: false }
          ]
        }))

        // Save optimized images
        .pipe(packages.gulp.dest(config.dest))

        .on('end', function() {

          notifier.success('Images optimized');

          if (protoss.flags.isWatching)
            packages.browserSync.reload();

          cb(null); // End task

        });

    } else {

      cb(null); // End task

    }

  });
};
