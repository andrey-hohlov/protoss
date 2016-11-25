import plumber from 'gulp-plumber';
import cheerio from 'gulp-cheerio';
import svgSprite from 'gulp-svg-sprite';
import listDir from '../helpers/list-directory';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4
const config = protoss.config.icons;

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

protoss.gulp.task('protoss/icons:watch', () => {
  if (!config.enabled) return;

  let watcher = chokidar.watch(
    config.src,
    {
      ignoreInitial: true
    }
  );
  watcher.on('all', function (event, path) {
    logger(event, path);
    runSequence(
      'protoss/icons'
    );
  });
});
