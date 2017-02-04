import eslint from 'gulp-eslint';
import uglify from 'gulp-uglify';
import gulpif from 'gulp-if';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import chokidar from 'chokidar';
import sourcemaps from 'gulp-sourcemaps';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.scripts;

function bundleScripts(bundle) {
  if (!config.bundles || !config.bundles.length) return;

  const isProduction = process.env.NODE_ENV === 'production';
  let queue = config.bundles.length;

  const buildBundle = function buildBundle(bundleData) {
    const handleQueue = function handleQueue() {
      protoss.notifier.info('Bundled scripts:', bundleData.name);
      if (queue) {
        queue -= 1;
        if (queue === 0) {
          protoss.notifier.success('Scripts bundled');
        }
      }
    };

    const build = function build() {
      protoss.gulp.src(bundleData.src)
        .pipe(plumber({
          errorHandler: protoss.errorHandler('Error in scripts task'),
        }))
        .pipe(gulpif(!isProduction && bundleData.sourceMaps, sourcemaps.init()))
        .pipe(gulpif(bundleData.concat, concat(`${bundleData.name}.js`)))
        .pipe(gulpif(isProduction && bundleData.minify, uglify({
          mangle: {
            keep_fnames: false,
          },
          compress: {
            drop_console: true,
            drop_debugger: false,
          },
        })))
        .pipe(gulpif(!isProduction && bundleData.sourceMaps, sourcemaps.write()))
        .pipe(protoss.gulp.dest(bundleData.dest))
        .on('end', handleQueue);
    };

    return build();
  };

  if (bundle) {
    buildBundle(bundle);
  } else {
    config.bundles.forEach(buildBundle);
  }
}

protoss.gulp.task('protoss/scripts', () => { // eslint-disable-line  arrow-body-style
  return bundleScripts();
});

protoss.gulp.task('protoss/scripts:watch', () => {
  if (!config.bundles || !config.bundles.length) return;
  protoss.isWatch = true;

  const runWatcher = function runWatcher(bundle) {
    const watcher = chokidar.watch(
      bundle.watch ? bundle.watch : bundle.src,
      {
        ignoreInitial: true,
      },
    );
    watcher.on('all', (event, path) => {
      logger(event, path);
      bundleScripts(bundle);
    });
  };

  config.bundles.forEach(runWatcher);
});

protoss.gulp.task('protoss/scripts:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/scripts',
    cb,
  );
});

protoss.gulp.task('protoss/scripts:lint', () => { // eslint-disable-line  arrow-body-style
  return protoss.gulp.src(config.lint.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
