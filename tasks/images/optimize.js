const config = protoss.config.images;
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');

module.exports = function(options) {

  return function(cb) {

    if (!protoss.flags.isDev) return cb(null);

    protoss.gulp.src(config.dest + '**/*.{png,jpg,gif,svg}')

      // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while optimizing images: ' + error);
        this.emit('end');
      }))

      // Minify images
      .pipe(imagemin([
        imagemin.svgo({
          plugins: [
            { removeUselessDefs: false },
            { cleanupIDs: false },
            { removeViewBox: false },
            { convertPathData: false },
            { mergePaths: false },
            { removeXMLProcInst: false }
          ]
        })
      ]))

      // Save optimized images
      .pipe(protoss.gulp.dest(config.dest))

      .on('end', function() {

        protoss.notifier.success('Images optimized');

        if (protoss.flags.isWatching)
          protoss.browserSync.reload();

        cb(null); // End task

      });

  };

};
