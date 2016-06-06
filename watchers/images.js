'use strict';

var config = protoss.config.images;
var packages = protoss.packages;

/**
 * Watcher for images
 */

module.exports = function() {
  return packages.chokidar.watch(
    config.watchPaths,
    {
      ignored: config.watchIgnore,
      ignoreInitial: true,
      cwd: config.watchCwd
    })
    .on('add', function(path) {
      protoss.helpers.watcherLog('Add', path);
      packages.gulp.start('protoss/images/move');
    })
    .on('change', function(path) {
      protoss.helpers.watcherLog('Change', path);
      packages.gulp.start('protoss/images/move');
    });
};
