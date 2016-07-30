const config = protoss.config.templates;
const plumber = require('gulp-plumber');
const hashSrc = require('gulp-hash-src');

module.exports = function(options) {

  return function(cb) {

    if (!config.hashes) return;

    protoss.gulp.src(config.hashes)

    // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while add hashes in html: ' + error);
        this.emit('end');
      }))

      // Add hashes
      .pipe(hashSrc({
        build_dir: './',
        src_path: './',
        query_name: '',
        hash_len: 10,
        exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ico']
      }))

      // Save files
      .pipe(protoss.gulp.dest(config.dest))

      .on('end', function() {

        cb(null); // End task

      });

  };

};
