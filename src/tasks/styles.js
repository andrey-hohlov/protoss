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
import logger from '../helpers/watcher-log';

const config = protoss.config.styles;

function bundleStyles(bundle) {
  if (!config.bundles || !config.bundles.length) return;
  const isProduction = process.env.NODE_ENV === 'production';
  let queue = config.bundles.length;

  let buildBundle = function(bundle) {
    let build = function() {
      let postProcessors = [];

      if (bundle.postcss && bundle.postcss.length) {
        bundle.postcss.forEach(postProcessor => {
          postProcessors.push(postProcessor.processor(postProcessor.options));
        });
      }

      protoss.gulp.src(bundle.src)
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'styles\' task`)}))
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(postcss(postProcessors))
        .pipe(gulpif(isProduction, autoprefixer()))
        .pipe(gulpif(isProduction, gmq()))
        .pipe(gulpif(isProduction, cssnano({
          autoprefixer: false,
          discardComments: {
            removeAll: bundle.minify
          },
          colormin: false,
          convertValues: false,
          zindex: false
        })))
        .pipe(gulpif(isProduction, csso())) // TODO: remove when cssnano get 'remove overridden rules' feature
        .pipe(gulpif(isProduction && !bundle.minify, prettify({
          indentSize: 2
        })))
        .pipe(gulpif(isProduction && !bundle.minify, csscomb()))
        .pipe(protoss.gulp.dest(bundle.dest)) //TODO: why hashes added only after save files?
        .pipe(gulpif(isProduction && bundle.hashes, hashSrc({
          build_dir: './',
          src_path: './',
          query_name: 'v',
          hash_len: 10,
          exts: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
        })))
        .pipe(protoss.gulp.dest(bundle.dest))
        .on('end', handleQueue);
    };

    let handleQueue = function() {
      protoss.notifier.info('Bundled styles:', bundle.name);
      if (queue) {
        queue--;
        if (queue === 0) {
          protoss.notifier.success('Styles bundled');
          return true;
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

protoss.gulp.task('protoss/styles', () => {
  return bundleStyles();
});

protoss.gulp.task('protoss/styles:lint', () => {
  return protoss.gulp.src(config.lint.src)
    .pipe(stylelint({
      reporters: [
        {
          formatter: 'string',
          console: true
        }
      ]
    }));
});

protoss.gulp.task('protoss/styles:watch', () => {
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
      bundleStyles(bundle);
    });
  };
  config.bundles.forEach(runWatcher);
});
