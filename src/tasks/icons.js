import plumber from 'gulp-plumber';
import cheerio from 'gulp-cheerio';
import svgSprite from 'gulp-svg-sprite';
import chokidar from 'chokidar';
import listDir from '../helpers/list-child-dirs';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.icons;

protoss.gulp.task('protoss/icons', (cb) => {
  let icons;
  let queue;

  if (config.enabled) {
    icons = listDir(config.src);
    queue = icons.length;
  }

  const makeSprite = function makeSprite(iconSet) {
    const handleQueue = function handleQueue() {
      protoss.notifier.info('Icons processed:', iconSet);
      if (queue) {
        queue -= 1;
        if (queue === 0) {
          protoss.notifier.success('Svg-icons maked');
          cb(null);
        }
      }
    };

    const make = function make() {
      protoss.gulp.src(`${config.src + iconSet}/*.svg`)
        .pipe(plumber({
          errorHandler: protoss.errorHandler('Error in icons task'),
        }))
        .pipe(cheerio({
          run($, file) {
            const $svg = $('svg');
            // TODO: Need this?
            // http://www.carsonshold.com/2015/11/svg-icon-workflow-with-gulp-and-shopify/
            if (file.relative.indexOf('--colored') >= 0) {
              $svg.addClass('svg-icon svg-icon--colored');
            }
            $svg.addClass('svg-icon');
          },
        }))
        .pipe(svgSprite({
          svg: {
            namespaceClassnames: false,
          },
          mode: {
            symbol: {
              inline: false,
              sprite: iconSet,
              dest: '.',
            },
          },
        }))
        .pipe(protoss.gulp.dest(config.dest))
        .on('end', handleQueue);
    };

    return make();
  };

  if (queue && config.enabled) {
    icons.forEach(makeSprite);
  } else {
    cb(null);
  }
});

protoss.gulp.task('protoss/icons:watch', () => {
  if (!config.enabled) return;

  const watcher = chokidar.watch(
    config.src,
    {
      ignoreInitial: true,
    },
  );

  watcher.on('all', (event, path) => {
    logger(event, path);
    runSequence(
      'protoss/icons',
    );
  });
});
