'use strict';

var config = protoss.config.templates;
var packages = protoss.packages;
var  notifier = protoss.helpers.notifier;

/**
 * Add cache busting hashes to links
 */
module.exports = function () {

  packages.gulp.task('protoss/templates/add-hashes', function (cb) {

    packages.gulp.src(config.dest + '**/*.html')

      // Prevent pipe breaking
      .pipe(packages.plumber(function(error) {
        notifier.error('An error occurred while add hashes in html: ' + error);
        this.emit('end');
      }))

      // Add hashes
      .pipe(packages.hashSrc({
        build_dir: './',
        src_path: './',
        query_name: '',
        hash_len: 10,
        exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ico']
      }))

      // Save files
      .pipe(packages.gulp.dest(config.dest))

      .on('end', function() {

        cb(null); // End task

      });

  });
};
