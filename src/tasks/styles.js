import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import cssnano from 'gulp-cssnano';
import csscomb from 'gulp-csscomb';
import csso from 'gulp-csso';
import autoprefixer from 'gulp-autoprefixer';
import gmq from 'gulp-group-css-media-queries';
import postcss from 'gulp-postcss';
import prettify from 'gulp-jsbeautifier';
import hashSrc from 'gulp-hash-src';
import stylelint from 'gulp-stylelint';
import chokidar from 'chokidar';
import sourcemaps from 'gulp-sourcemaps';
import logger from '../helpers/watcher-log';

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
        .pipe(gulpif(isProduction, cssnano({
          autoprefixer: false,
          discardComments: {
            removeAll: bundleData.minify,
          },
          colormin: false,
          convertValues: false,
          zindex: false,
        })))
        // TODO: remove when cssnano get 'remove overridden rules' feature
        .pipe(gulpif(isProduction, csso()))
        .pipe(gulpif(isProduction && !bundleData.minify, prettify({
          indentSize: 2,
        })))
        .pipe(gulpif(isProduction && !bundleData.minify, csscomb()))
        // TODO: why hashes added only after save files?
        .pipe(protoss.gulp.dest(bundleData.dest))
        .pipe(gulpif(isProduction && bundleData.hashes, hashSrc({
          build_dir: './',
          src_path: './',
          query_name: 'v',
          hash_len: 10,
          exts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        })))
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

protoss.gulp.task('protoss/styles:lint', () => { // eslint-disable-line  arrow-body-style
  return protoss.gulp.src(config.lint.src)
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true,
        },
      ],
    }));
});

protoss.gulp.task('protoss/styles:watch', () => {
  if (!config.bundles || !config.bundles.length) return;

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
