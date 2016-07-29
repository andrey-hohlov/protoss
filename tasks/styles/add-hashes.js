'use strict';

var config = protoss.config.styles;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Add cache busting hashes to links
 */

module.exports = function() {

  packages.gulp.task('protoss/styles/add-hashes', function(cb) {

    var queue = config.bundles.length;

    var addHashes = function(bundle) {

      if (!bundle.hashes) return function () {
        handleQueue();
      };

      var add = function() {

        packages.gulp.src(bundle.dest + bundle.name + '.css')

          // Prevent pipe breaking
          .pipe(packages.plumber(function(error) {
            notifier.error('An error occurred while add hashes in css: ' + error);
            this.emit('end');
          }))

          // Add hashes
          .pipe(packages.hashSrc({
            build_dir: './',
            src_path: './',
            query_name: '',
            hash_len: 10,
            exts: ['.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
          }))

          // Save
          .pipe(packages.gulp.dest(bundle.dest))

          .on('end', handleQueue);

      };

      var handleQueue = function() {

        if (queue) {

          queue--;

          if (queue === 0) {

            cb(null); // End task

          }
        }
      };

      return add();

    };

    config.bundles.forEach(addHashes);

  });
};
