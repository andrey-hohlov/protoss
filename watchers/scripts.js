'use strict';

/**
 * Watcher for all scripts exclude libs
 */

module.exports = function() {
  return protoss.packages.chokidar.watch(
    protoss.config.scripts.src + '**/*.js',
    {
      ignoreInitial: true
    }).on('all', function (event, path) {
    protoss.helpers.watcherLog(event, path);
    protoss.packages.gulp.start('protoss/scripts/make-bundles');
  });
};
