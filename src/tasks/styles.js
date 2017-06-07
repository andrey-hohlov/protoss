import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import cssnano from 'gulp-cssnano';
import autoprefixer from 'gulp-autoprefixer';
import gmq from 'gulp-group-css-media-queries';
import postcss from 'gulp-postcss';
import stylelint from 'gulp-stylelint';
import chokidar from 'chokidar';
import sourcemaps from 'gulp-sourcemaps';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.styles;

function bundleStyles(bundle) {
  const isProduction = process.env.NODE_ENV === 'production';
  let queue = config.bundles ? config.bundles.length : false;

  const buildBundle = function buildBundle(bundleData) {
    const handleQueue = function handleQueue() {
      protoss.notifier.info('Bundled styles:', bundleData.name);
      if (queue) {
        queue -= 1;
        if (queue === 0) {
          protoss.notifier.success('Styles bundled');
        }
      }
    };

    const build = function build() {
      const postProcessors = [];

      if (bundleData.postcss && bundleData.postcss.length) {
        bundleData.postcss.forEach((postProcessor) => {
          postProcessors.push(postProcessor.processor(postProcessor.options));
        });
      }

      protoss.gulp.src(bundleData.src)
        .pipe(plumber({
          errorHandler: protoss.errorHandler('Error in styles task'),
        }))
        .pipe(sassGlob())
        .pipe(gulpif(!isProduction && bundleData.sourceMaps, sourcemaps.init()))
        .pipe(sass())
        .pipe(postcss(postProcessors))
        .pipe(gulpif(isProduction, autoprefixer()))
        .pipe(gulpif(isProduction, gmq()))
        .pipe(gulpif(isProduction, cssnano(bundleData.cssnanoConfig)))
        .pipe(gulpif(!isProduction && bundleData.sourceMaps, sourcemaps.write()))
        .pipe(protoss.gulp.dest(bundleData.dest))
        .on('end', handleQueue);
    };

    return build();
  };

  if (bundle) {
    buildBundle(bundle);
  } else if (queue) {
    config.bundles.forEach(buildBundle);
  }
}

protoss.gulp.task('protoss/styles', () => { // eslint-disable-line  arrow-body-style
  return bundleStyles();
});

protoss.gulp.task('protoss/styles:watch', () => {
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
      bundleStyles(bundle);
    });
  };

  config.bundles.forEach(runWatcher);
});

protoss.gulp.task('protoss/styles:build', (cb) => {
  process.env.NODE_ENV = 'production';

  const stylesDeps = [];
  const stylesTasks = [];
  const isSprites = protoss.config.sprites.enabled;
  const isSpritesSvg = protoss.config.spritesSvg.enabled;

  if (isSprites) {
    stylesDeps.push('protoss/sprites');
  }
  if (isSpritesSvg) {
    stylesDeps.push('protoss/sprites-svg');
  }


  if (stylesDeps.length > 0) {
    stylesTasks.push(stylesDeps);
  }

  stylesTasks.push('protoss/styles');
  stylesTasks.push(cb);

  runSequence.apply(null, stylesTasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/styles:lint', () => { // eslint-disable-line  arrow-body-style
  return protoss.gulp.src(config.lint.src)
    .pipe(stylelint(config.lint.config));
});
