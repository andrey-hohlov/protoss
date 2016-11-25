import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import svgSprite from 'gulp-svg-sprite';
import svg2png from 'gulp-svg2png';
import gulpif from 'gulp-if';
import mergeStream from 'merge-stream';
import listDir from '../helpers/list-directory';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4
const config = protoss.config.spritesSvg;

protoss.gulp.task('protoss/sprites-svg', (cb) => {
  if (!config.enabled) return cb(null);

  let sprites = listDir(config.src, 'dirs', 'names');
  let queue = sprites.length;
  let stylesStream = mergeStream();
  let padding = 4;

  let makeSprite = function(sprite, index) {
    let make = function() {
      let imagesFilter = filter(['*.svg'], {restore: true});
      let stylesFilter = filter(['*.scss']);

      stylesStream.add(
        protoss.gulp.src(config.src + sprite + '/*.svg')
          .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'sprites-svg\' task`)}))
          .pipe(svgSprite({
            shape: {
              spacing: {
                padding: padding
              }
            },
            mode: {
              css: {
                dest: './',
                sprite: sprite + '.svg',
                bust: false,
                render: {
                  scss: {
                    dest: sprite + '.scss',
                    template: config.template
                  }
                },
                variables: {
                  spritePadding: padding,
                  spriteName: sprite,
                  spritePath: config.spritePath,
                  spriteSvg: sprite + '.svg',
                  spriteFallback: config.fallback ? sprite + '.fallback.png' : false,
                  mixin: index == queue - 1 // Create mixin only for last sprite
                }
              }
            }
          }))
          .pipe(imagesFilter)
          .pipe(protoss.gulp.dest(config.dest))
          .pipe(gulpif(config.fallback, svg2png()))
          .pipe(gulpif(config.fallback, rename({
            suffix:'.fallback'
          })))
          .pipe(gulpif(config.fallback, protoss.gulp.dest(config.dest)))
          .pipe(imagesFilter.restore)
          .pipe(stylesFilter)
          .on('end', handleQueue)
      );
    };

    let handleQueue = function() {
      protoss.notifier.info('Svg-sprite processed:', sprite);
      if(queue) {
        queue--;
        if(queue === 0) {
          stylesStream
            .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'sprites-svg\' task`)}))
            .pipe(concat(config.stylesName))
            .pipe(protoss.gulp.dest(config.stylesDest))
            .on('end', function () {
              protoss.notifier.success('Svg-sprites ready');
              cb(null);
            });
        }
      }
    };

    return make();
  };

  if(queue) {
    sprites.forEach(makeSprite);
  } else {
    cb(null);
  }
});

protoss.gulp.task('protoss/sprites-svg:watch', () => {
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
      'protoss/sprites-svg'
    );
  });
});
