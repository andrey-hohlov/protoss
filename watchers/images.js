'use strict';

var config = protoss.config.images,
    packages = protoss.packages;

/**
 * Watcher for images
 */

module.exports = function () {
    return packages.chokidar.watch(
        //config.src+ '**/*.{png,jpg,gif,svg}',
        '**/*.{png,jpg,gif,svg}',
        {
            ignored: [
                'sprites',
                'sprites-svg',
                'svg-icons'
            ],
            ignoreInitial: true,
            cwd: config.src
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
