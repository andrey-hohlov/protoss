'use strict';

/**
 * Clean build directory
 */

module.exports = function () {
   return protoss.packages.gulp.task('protoss/utils/clean', function() {
      return protoss.packages.del(protoss.config.utils.clean, {dot: true});
    });
};
