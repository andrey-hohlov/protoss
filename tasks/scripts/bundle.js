const config = protoss.config.scripts;
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');

module.exports = function(options) {

  return function(cb) {

    var queue = config.bundles.length;

    var buildBundle = function(bundle) {

      var build = function() {

        protoss.gulp.src(bundle.src)

        // Prevent pipe breaking
          .pipe(plumber(function(error) {
            protoss.notifier.error('An error occurred while bundling scripts: ' + error);
            this.emit('end');
          }))

          // Concat if needed
          .pipe(gulpif(
            bundle.concat,
            concat(bundle.name+'.js')
          ))

          // Clean debug if needed
          .pipe(gulpif(
            protoss.flags.isBuild,
            stripDebug()
          ))

          // Compress if needed
          .pipe(gulpif(
            protoss.flags.isBuild && bundle.minify,
            uglify({
              mangle: {
                keep_fnames: false
              }
            })
          ))

          // Save
          .pipe(protoss.gulp.dest(bundle.dest))

          .on('end', handleQueue);

      };

      var handleQueue = function() {
        protoss.notifier.info('Bundled scripts:', bundle.name);

        if(queue) {

          queue--;

          if(queue === 0) {
            protoss.notifier.success('Scripts bundled');
            cb(null); // End task

          }
        }
      };

      return build();

    };

    config.bundles.forEach(buildBundle);

  };

};
