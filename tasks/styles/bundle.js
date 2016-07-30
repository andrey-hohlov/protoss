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

module.exports = function(options) {

  return function(cb) {

      var queue = config.bundles.length;

      var buildBundle = function(bundle) {

        var build = function() {

          var scssFilter = filter(['*.scss'], {restore: true});

          var processors = [
            postcssPe
          ];

          protoss.gulp.src(bundle.src)

          // Prevent pipe breaking
            .pipe(plumber(function(error) {
              protoss.notifier.error('An error occurred while bundling styles: ' + error.message + ' on line ' + error.line + ' in ' + error.file);
              this.emit('end');
            }))

            // Filter .scss files
            .pipe(scssFilter)

            // Process sass files
            .pipe(sass())

            // Restore filter
            .pipe(scssFilter.restore)

            // Concat if needed
            .pipe(gulpif(
              bundle.concat,
              concat(bundle.name+'.css')
            ))

            // Postcss plugins
            .pipe(gulpif(
              !protoss.flags.isDev,
              postcss(processors)
            ))

            // Add prefixes
            .pipe(gulpif(
              !protoss.flags.isDev,
              autoprefixer({
                browsers: config.autoprefixer
              })
            ))

            // Group media queries
            .pipe(gulpif(
              !protoss.flags.isDev,
              gmq()
            ))

            // Minify css in all cases (for delete overwriting rules)
            .pipe(gulpif(
              !protoss.flags.isDev,
              cssnano({
                autoprefixer: false,
                discardComments: {
                  removeAll: bundle.minify
                },
                colormin: false,
                convertValues: false,
                zindex: false
              })
            ))

            // Use csso optimization for remove overridden rules
            // TODO: remove when cssnano get this feature
            .pipe(gulpif(
              !protoss.flags.isDev,
              csso()
            ))

            // Prettify again css for non-minifying build
            .pipe(gulpif(
              !protoss.flags.isDev && !bundle.minify,
              prettify({
                indentSize: 2
              })
            ))

            // Add more beauty
            .pipe(gulpif(
              !protoss.flags.isDev && !bundle.minify,
              csscomb()
            ))

            // Save
            .pipe(protoss.gulp.dest(bundle.dest))

            .on('end', handleQueue);

        };

        var handleQueue = function() {

          protoss.notifier.info('Bundled styles:', bundle.name);

          if (queue) {

            queue--;

            if (queue === 0) {
              protoss.notifier.success('Styles bundled');

              if(protoss.flags.isWatching)
                protoss.browserSync.reload();

              cb(null); // End task

            }
          }
        };

        return build();

      };

      config.bundles.forEach(buildBundle);

  };

};
