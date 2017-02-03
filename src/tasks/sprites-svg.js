import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import svgSprite from 'gulp-svg-sprite';
import svg2png from 'gulp-svg2png';
import gulpif from 'gulp-if';
import mergeStream from 'merge-stream';
import chokidar from 'chokidar';
import listDir from '../helpers/list-child-dirs';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.spritesSvg;

protoss.gulp.task('protoss/sprites-svg', (cb) => {
  const stylesStream = mergeStream();
  const padding = 4;
  let sprites = listDir(config.src);
  let queue = sprites.length;

  const makeSprite = function makeSprite(sprite, index) {
    const handleQueue = function handleQueue() {
      protoss.notifier.info('Svg-sprite processed:', sprite);
      if (queue) {
        queue -= 1;
        if (queue === 0) {
          stylesStream
            .pipe(plumber({
              errorHandler: protoss.errorHandler('Error in sprites-svg task'),
            }))
            .pipe(concat(config.stylesName))
            .pipe(protoss.gulp.dest(config.stylesDest))
            .on('end', () => {
              protoss.notifier.success('Svg-sprites ready');
              cb(null);
            });
        }
      }
    };

    const make = function make() {
      const imagesFilter = filter(['*.svg'], { restore: true });
      const stylesFilter = filter(['*.scss']);

      stylesStream.add(
        protoss.gulp.src(`${config.src + sprite}/*.svg`)
          .pipe(plumber({
            errorHandler: protoss.errorHandler('Error in sprites-svg task'),
          }))
          .pipe(svgSprite({
            shape: {
              spacing: {
                padding,
              },
            },
            mode: {
              css: {
                dest: './',
                sprite: `${sprite}.svg`,
                bust: false,
                render: {
                  scss: {
                    dest: `${sprite}.scss`,
                    template: config.template,
                  },
                },
                variables: {
                  spritePadding: padding,
                  spriteName: sprite,
                  spritePath: config.spritePath,
                  spriteSvg: `${sprite}.svg`,
                  spriteFallback: config.fallback ? `${sprite}.fallback.png` : false,
                  mixin: index === queue - 1, // Create mixin only for last sprite
                },
              },
            },
          }))
          .pipe(imagesFilter)
          .pipe(protoss.gulp.dest(config.dest))
          .pipe(gulpif(config.fallback, svg2png()))
          .pipe(gulpif(config.fallback, rename({
            suffix: '.fallback',
          })))
          .pipe(gulpif(config.fallback, protoss.gulp.dest(config.dest)))
          .pipe(imagesFilter.restore)
          .pipe(stylesFilter)
          .on('end', handleQueue));
    };

    return make();
  };

  queue ? sprites.forEach(makeSprite) : cb(null);
});

protoss.gulp.task('protoss/sprites-svg:watch', () => {
  const watcher = chokidar.watch(
    config.src,
    {
      ignoreInitial: true,
    },
  );

  watcher.on('all', (event, path) => {
    logger(event, path);
    runSequence(
      'protoss/sprites-svg',
    );
  });
});
