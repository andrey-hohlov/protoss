const config = protoss.config.styles;
const plumber = require('gulp-plumber');
const hashSrc = require('gulp-hash-src');

module.exports = function(options) {

  return function(cb) {

    var queue = config.bundles.length;

    var addHashes = function(bundle) {

      if (!bundle.hashes) return function () {
        handleQueue();
      };

      var add = function() {

        protoss.gulp.src(bundle.dest + bundle.name + '.css')

        // Prevent pipe breaking
          .pipe(plumber(function(error) {
            protoss.notifier.error('An error occurred while add hashes in css: ' + error);
            this.emit('end');
          }))

          // Add hashes
          .pipe(hashSrc({
            build_dir: './',
            src_path: './',
            query_name: '',
            hash_len: 10,
            exts: ['.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
          }))

          // Save
          .pipe(protoss.gulp.dest(bundle.dest))

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


  };

};
