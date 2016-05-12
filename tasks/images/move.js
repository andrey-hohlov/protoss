'use strict';

var config = protoss.config.images,
    packages = protoss.packages,
    notifier = protoss.helpers.notifier;

/**
 * Copy images to build folder
 */

module.exports = function () {
    packages.gulp.task('protoss/images/move', function(cb) {
        packages.gulp.src(
            [
                config.src + '**/*.{png,jpg,gif,svg}',
                '!' + config.src + 'sprites/**/*',
                '!' + config.src + 'sprites-svg/**/*',
                '!' + config.src + 'svg-icons/**/*'
            ])

            // Prevent pipe breaking
            .pipe(packages.plumber(function(error) {
                notifier.error('An error occurred while move images: ' + error);
                this.emit('end');
            }))

            // Only pass through changed files
            .pipe(packages.gulpif(
                protoss.flags.isWatching,
                packages.changed(config.dest)
            ))

            // Copy images
            .pipe(packages.gulp.dest(config.dest))

            .on('end', function() {

                notifier.success('Images moved');

                if(protoss.flags.isWatching)
                    packages.browserSync.reload();

                cb(null); // End task

            });
    });
};
