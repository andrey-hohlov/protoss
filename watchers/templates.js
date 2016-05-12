'use strict';

/**
 * Watcher for jade files
 */

module.exports = function () {
    return protoss.packages.chokidar.watch(
        protoss.config.templates.src + '**/*.jade',
        {
            ignoreInitial: true
        }).on('all', function (event, path) {
            protoss.helpers.watcherLog(event, path);
            protoss.packages.gulp.start('protoss/templates/compile');
        });
};
