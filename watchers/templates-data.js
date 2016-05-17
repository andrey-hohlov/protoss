'use strict';

var runSequence = require('run-sequence').use(protoss.packages.gulp);

/**
 * Watcher for templates data files
 */

module.exports = function() {
  return protoss.packages.chokidar.watch(
    protoss.config.templates.dataSrc + '**/*.json',
    {
      ignoreInitial: true
    }).on('all', function(event, path) {
    protoss.helpers.watcherLog(event, path);
    protoss.flags.isDataReload = true;
    runSequence(
      'protoss/templates/compile',
      function() {
        protoss.flags.isDataReload = false;
      }
    );
  });
};
