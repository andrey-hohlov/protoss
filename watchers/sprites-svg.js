'use strict';

var config = protoss.config.spritesSvg;
var packages = protoss.packages;

/**
 * Watcher for svg images for sprite
 */

module.exports = function () {
  return packages.chokidar.watch(
      config.src + '**/*.svg',
    {
      ignoreInitial: true
    })
    .on('all', function (event, path) {
      protoss.helpers.watcherLog(event, path);
      packages.gulp.start('protoss/images/make-svg-sprites');
    });
};
