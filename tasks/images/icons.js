const config = protoss.config.svgIcons;

const plumber = require('gulp-plumber');
const cheerio = require('gulp-cheerio');
const svgSprite =require('gulp-svg-sprite');
const listDir = require('../../helpers/list-directory');

module.exports = function(options) {

  return function(cb) {

    if (!config.enabled) return cb(null);

    var icons,
      queue;

    var makeSprite = function(iconSet) {

      var make = function() {

        protoss.gulp.src(config.src + iconSet + '/*.svg')

        // Prevent pipe breaking
          .pipe(plumber(function(error) {
            protoss.notifier.error('An error occurred while making svg icons: ' + error);
            this.emit('end');
          }))

          // Add classes
          .pipe(cheerio({
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
          .pipe(svgSprite({
            svg: {
              namespaceClassnames: false
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
          .pipe(protoss.gulp.dest(config.dest))
          .on('end', handleQueue)

      };

      var handleQueue = function() {

        protoss.notifier.info('Icons processed:', iconSet);

        if(queue) {

          queue--;

          if(queue === 0) {
            protoss.notifier.success('Svg-icons maked');
            cb(null); // End task
          }
        }
      };

      return make();

    };

    icons = listDir(config.src, 'dirs', 'names'); // get folders with icons
    queue = icons.length;

    if(queue) {
      icons.forEach(makeSprite);
    } else {
      cb(null); // End task
    }

  }

};

