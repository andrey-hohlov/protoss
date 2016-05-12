'use strict';

/**
 * Watcher for all scss files
 */

module.exports = function () {
    return protoss.packages.chokidar.watch(
        [
            protoss.config.styles.src + '**/*.scss',
            protoss.config.styles.src + '**/*.css'
        ],
        {
            ignoreInitial: true
        }).on('all', function (event, path) {
        protoss.helpers.watcherLog(event, path);
        protoss.packages.gulp.start('protoss/styles/make-bundles');
    });
};
