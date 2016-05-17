'use strict';

var copy = protoss.config.utils.copy;
var packages = protoss.packages;

/**
 * Copy files to build directory
 */

module.exports = function() {
  return packages.gulp.task('protoss/utils/copy', function() {

    var files = copy || [];

    if (files.length != 0) {
      for (var i = 0; i<files.length; i++) {
        packages.gulp.src(copy[i][0])

          // Prevent pipe breaking
          .pipe(packages.plumber(function(error) {
            notifier.error('An error occurred while copying files: ' + error);
            this.emit('end');
          }))

          .pipe(packages.gulp.dest(copy[i][1]))
      }

    }

  });
};
