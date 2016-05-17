'use strict';

var config = protoss.config.scripts;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Create scripts bundles
 */

module.exports = function() {

  packages.gulp.task('protoss/scripts/make-bundles', function(cb) {

    var queue = config.bundles.length;

    var buildBundle = function(bundle) {

      var build = function() {

        packages.gulp.src(bundle.src)

          // Prevent pipe breaking
          .pipe(packages.plumber(function(error) {
            notifier.error('An error occurred while bundling scripts: ' + error);
            this.emit('end');
          }))

          // Concat if needed
          .pipe(packages.gulpif(
            bundle.concat,
            packages.concat(bundle.name+'.js')
          ))

          // Clean debug if needed
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.stripDebug()
          ))

          // Compress if needed
          .pipe(packages.gulpif(
            !protoss.flags.isDev && bundle.minify,
            packages.uglify({
              mangle: {
                keep_fnames: false
              }
            })
          ))

          // Save
          .pipe(packages.gulp.dest(bundle.dest))

          .on('end', handleQueue);

      };

      var handleQueue = function() {
        notifier.info('Bundled scripts:', bundle.name);

        if(queue) {

          queue--;

          if(queue === 0) {
            notifier.success('Scripts bundled');

            if(protoss.flags.isWatching)
              packages.browserSync.reload();

            cb(null); // End task

          }
        }
      };

      return build();

    };

    config.bundles.forEach(buildBundle);
  });

};
