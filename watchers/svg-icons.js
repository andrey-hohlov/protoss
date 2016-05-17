'use strict';

var config = protoss.config.images;
var packages = protoss.packages;

/**
 * Watcher for png images for sprite
 */

module.exports = function () {
  return packages.chokidar.watch(
      config.src + 'svg-icons/**/*.svg',
    {
      ignoreInitial: true
    })
    .on('all', function (event, path) {
      protoss.helpers.watcherLog(event, path);
      packages.gulp.start('protoss/images/make-svg-icons');
    });
};
