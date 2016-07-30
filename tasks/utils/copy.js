const config = protoss.config.copy;
const plumber = require('gulp-plumber');

module.exports = function(options) {

  return function(cb) {
    var files = config || [];

    if (files.length != 0) {

      for (var i = 0; i < files.length; i++) {
        protoss.gulp.src(files[i][0])
          // Prevent pipe breaking
          .pipe(plumber(function(error) {
            protoss.notifier.error('An error occurred while copying files: ' + error);
            this.emit('end');
          }))

          .pipe(protoss.gulp.dest(files[i][1]))
      }

      cb(null); // End task

    }

  };

};
