const config = protoss.config.scripts;

const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');

protoss.gulp.task('protoss/scripts', function(cb) {

  var queue = config.bundles.length;

  var buildBundle = function(bundle) {

    var build = function() {
      protoss.gulp.src(bundle.src)
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'scripts\' task`)}))
        .pipe(gulpif(bundle.concat, concat(bundle.name+'.js')))
        .pipe(gulpif(protoss.flags.isBuild, stripDebug()))
        .pipe(gulpif(protoss.flags.isBuild && bundle.minify, uglify({
            mangle: {
              keep_fnames: false
            }
          })))
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

});
