'use strict';

var config = protoss.config.images;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Make svg-icons for use in html
 */

module.exports = function() {
  packages.gulp.task('protoss/images/make-svg-icons', function(cb) {

    if (config.svgIcons) {

      var icons,
        queue;

      var makeSprite = function(iconSet) {

        var make = function() {

          packages.gulp.src(config.src + 'svg-icons/' + iconSet + '/*.svg')

            // Prevent pipe breaking
            .pipe(packages.plumber(function(error) {
              notifier.error('An error occurred while making svg icons: ' + error);
              this.emit('end');
            }))

            // Add classes
            .pipe(packages.cheerio({
              run: function ($, file) {
                var $svg = $('svg');
                // http://www.carsonshold.com/2015/11/svg-icon-workflow-with-gulp-and-shopify/
                if (file.relative.indexOf('--colored') >= 0){
                  $svg.addClass('svg-icon svg-icon--colored')
                }
                $svg.addClass('svg-icon');
              }
            }))

            // Make icons
            .pipe(packages.svgSprite({
              svg: {
                namespaceClassnames: false
              },
              shape: {
                id: {
                  generator: function(name) {
                    var id = name.substr(0, name.lastIndexOf('.')) || name;
                    id = 'icon-' + id;
                    return id;
                  }
                }
              },
              mode: {
                symbol: {
                  inline: false,
                  sprite: iconSet,
                  dest: '.'
                }
              }
            }))

            // Save icons.svg file
            .pipe(packages.gulp.dest(config.dest + 'icons/'))
            .on('end', handleQueue)


        };

        var handleQueue = function() {

          notifier.info('Svg-icons processed:', iconSet);

          if(queue) {

            queue--;

            if(queue === 0) {

              if(protoss.flags.isWatching)
                packages.browserSync.reload();

              notifier.success('Svg-icons maked');

              cb(null); // End task

            }
          }
        };

        return make();

      };

      icons = protoss.helpers.listDir(config.src + 'svg-icons', 'dirs', 'names'); // get folders with icons
      queue = icons.length;

      if(queue)
        icons.forEach(makeSprite);
      else
        cb(null); // End task

    } else {
      cb(null); // End task
    }

  });
};
