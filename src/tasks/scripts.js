import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';
import sourcemaps from 'gulp-sourcemaps';

const config = protoss.config.scripts;

function bundleScripts(bundle) {
  if (!config.bundles || !config.bundles.length) return;

  const isProduction = process.env.NODE_ENV === 'production';
  let queue = config.bundles.length;

  let buildBundle = function (bundle) {
    let build = function () {
      protoss.gulp.src(bundle.src)
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'scripts\' task`)}))
        .pipe(gulpif(!isProduction && bundle.sourceMaps, sourcemaps.init()))
        .pipe(gulpif(bundle.concat, concat(bundle.name+'.js')))
        .pipe(gulpif(isProduction && bundle.minify, uglify({
          mangle: {
            keep_fnames: false
          },
          compress: {
            drop_console: true,
            drop_debugger: false
          }
        })))
        .pipe(gulpif(!isProduction && bundle.sourceMaps, sourcemaps.write()))
        .pipe(protoss.gulp.dest(bundle.dest))
        .on('end', handleQueue);
    };

    let handleQueue = function () {
      protoss.notifier.info('Bundled scripts:', bundle.name);
      if(queue) {
        queue--;
        if(queue === 0) {
          protoss.notifier.success('Scripts bundled');
        }
      }
    };

    return build();
  };

  if (bundle) {
    buildBundle(bundle);
  } else {
    config.bundles.forEach(buildBundle);
  }
}

protoss.gulp.task('protoss/scripts', () => {
  return bundleScripts();
});

protoss.gulp.task('protoss/scripts:lint', () => {
  return protoss.gulp.src(config.lint.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

protoss.gulp.task('protoss/scripts:watch', () => {
  if (!config.bundles || !config.bundles.length) return;

  let runWatcher = function (bundle) {
    let watcher = chokidar.watch(
      bundle.watch ? bundle.watch : bundle.src,
      {
        ignoreInitial: true
      }
    );
    watcher.on('all', function (event, path) {
      logger(event, path);
      bundleScripts(bundle);
    });
  };
  config.bundles.forEach(runWatcher);
});
