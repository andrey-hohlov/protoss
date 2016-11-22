const config = protoss.config.svgIcons;
const plumber = require('gulp-plumber');
const cheerio = require('gulp-cheerio');
const svgSprite =require('gulp-svg-sprite');
const listDir = require('../helpers/list-directory');

protoss.gulp.task('protoss/icons', (cb) => {
  if (!config.enabled) return cb(null);

  let icons = listDir(config.src, 'dirs', 'names');
  let queue = icons.length;

  let makeSprite = function(iconSet) {
    let make = function() {
      protoss.gulp.src(config.src + iconSet + '/*.svg')
        .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'icons\' task`)}))
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
        .pipe(protoss.gulp.dest(config.dest))
        .on('end', handleQueue)
    };

    let handleQueue = function() {
      protoss.notifier.info('Icons processed:', iconSet);
      if(queue) {
        queue--;
        if(queue === 0) {
          protoss.notifier.success('Svg-icons maked');
          cb(null);
        }
      }
    };

    return make();
  };

  if(queue) {
    icons.forEach(makeSprite);
  } else {
    cb(null);
  }
});

