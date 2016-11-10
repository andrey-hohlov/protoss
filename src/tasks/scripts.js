const config = protoss.config.scripts;

const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');

protoss.gulp.task('protoss/scripts', function(cb) {
  let queue = config.bundles.length;

  let buildBundle = function (bundle) {
    let build = function () {
      protoss.gulp.src(bundle.src)
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'scripts\' task`)}))
        .pipe(gulpif(bundle.concat, concat(bundle.name+'.js')))
        .pipe(gulpif(protoss.flags.isBuild && bundle.minify, uglify({
          mangle: {
            keep_fnames: false
          },
          compress: {
            drop_console: true,
            drop_debugger: false
          }
        })))
        .pipe(protoss.gulp.dest(bundle.dest))
        .on('end', handleQueue);
    };

    let handleQueue = function () {
      protoss.notifier.info('Bundled scripts:', bundle.name);
      if(queue) {
        queue--;
        if(queue === 0) {
          protoss.notifier.success('Scripts bundled');
          cb(null);
        }
      }
    };

    return build();
  };

  config.bundles.forEach(buildBundle);
});

protoss.gulp.task('protoss/scripts:lint', () => {
  return protoss.gulp.src(config.lint.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
