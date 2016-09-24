const config = protoss.config.styles;

const plumber = require('gulp-plumber');
const filter = require('gulp-filter');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const csscomb = require('gulp-csscomb');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const gmq = require('gulp-group-css-media-queries');
const postcss = require('gulp-postcss');
const postcssPe = require('postcss-pseudoelements');
const prettify = require('gulp-jsbeautifier');
const hashSrc = require('gulp-hash-src');

protoss.gulp.task('protoss/styles', function(cb) {

  let queue = config.bundles.length;

  let buildBundle = function(bundle) {

    let build = function() {

      let scssFilter = filter(['*.scss'], {restore: true});
      let processors = [
        postcssPe
      ];

      protoss.gulp.src(bundle.src)
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'styles\' task`)}))
        .pipe(scssFilter)
        .pipe(sass())
        .pipe(scssFilter.restore)
        .pipe(gulpif(bundle.concat, concat(bundle.name+'.css')))
        .pipe(gulpif(protoss.flags.isBuild, postcss(processors)))
        .pipe(gulpif(protoss.flags.isBuild, autoprefixer()))
        .pipe(gulpif(protoss.flags.isBuild, gmq()))
        .pipe(gulpif(protoss.flags.isBuild, cssnano({
          autoprefixer: false,
          discardComments: {
            removeAll: bundle.minify
          },
          colormin: false,
          convertValues: false,
          zindex: false
        })))
        .pipe(gulpif(protoss.flags.isBuild, csso())) // TODO: remove when cssnano get 'remove overridden rules' feature
        .pipe(gulpif(protoss.flags.isBuild && !bundle.minify, prettify({
          indentSize: 2
        })))
        .pipe(gulpif(protoss.flags.isBuild && !bundle.minify, csscomb()))
        .pipe(protoss.gulp.dest(bundle.dest)) //TODO: why hashes added only after save files?
        .pipe(gulpif(protoss.flags.isBuild, hashSrc({
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
          cb(null); // End task
        }
      }
    };

    return build();

  };

  config.bundles.forEach(buildBundle);

});
