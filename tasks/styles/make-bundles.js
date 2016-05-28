'use strict';

var config = protoss.config.styles;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

var pe = require('postcss-pseudoelements');
var processors = [
  pe
];

/**
 * Create styles bundles
 */

module.exports = function() {

  packages.gulp.task('protoss/styles/make-bundles', function(cb) {

    var queue = config.bundles.length;

    var buildBundle = function(bundle) {

      var build = function() {

        var scssFilter = packages.filter(['*.scss'],{restore: true});

        packages.gulp.src(bundle.src)

          // Prevent pipe breaking
          .pipe(packages.plumber(function(error) {
            notifier.error('An error occurred while bundling styles: ' + error.message + ' on line ' + error.line + ' in ' + error.file);
            this.emit('end');
          }))

          // Filter .scss files
          .pipe(scssFilter)

          // Process sass files
          .pipe(packages.sass())

          // Restore filter
          .pipe(scssFilter.restore)

          // Concat if needed
          .pipe(packages.gulpif(
            bundle.concat,
            packages.concat(bundle.name+'.css')
          ))

          // Postcss plugins
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.postcss(processors)
          ))

          // Add prefixes
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.autoprefixer({
              browsers: config.autoprefixer
            })
          ))

          // Group media queries
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.gmq()
          ))

          // Minify css in all cases (for delete overwriting rules)
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.cssnano({
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
          .pipe(packages.gulpif(
            !protoss.flags.isDev,
            packages.csso()
          ))

          // Prettify again css for non-minifying build
          .pipe(packages.gulpif(
            !protoss.flags.isDev && !bundle.minify,
            packages.prettify({
              indentSize: 2
            })
          ))

          // Add more beauty
          .pipe(packages.gulpif(
            !protoss.flags.isDev && !bundle.minify,
            packages.csscomb()
          ))

          // Save
          .pipe(packages.gulp.dest(bundle.dest))

          .on('end', handleQueue);

      };

      var handleQueue = function() {

        notifier.info('Bundled styles:', bundle.name);

        if (queue) {

          queue--;

          if (queue === 0) {
            notifier.success('Styles bundled');

            if(protoss.flags.isWatching)
              packages.browserSync.reload();

            cb(null); // End task

          }
        }
      };

      return build();

    };

    config.bundles.forEach(buildBundle);
  });

};
