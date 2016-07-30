const config = protoss.config.images;
const plumber = require('gulp-plumber');
const gulpif = require('gulp-if');
const changed = require('gulp-changed');

module.exports = function(options) {

  return function(cb) {

    protoss.gulp.src(config.src)

    // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while move images: ' + error);
        this.emit('end');
      }))

      // Only pass through changed files
      .pipe(gulpif(
        protoss.flags.isWatching,
        changed(config.dest)
      ))

      // Copy images
      .pipe(protoss.gulp.dest(config.dest))

      .on('end', function() {

        protoss.notifier.success('Images moved');

        if(protoss.flags.isWatching)
          protoss.browserSync.reload();

        cb(null); // End task

      });

  };

};
