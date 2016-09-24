const config = protoss.config.spritesSvg;

const plumber = require('gulp-plumber');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const svgSprite =require('gulp-svg-sprite');
const svg2png = require('gulp-svg2png');
const mergeStream = require('merge-stream');
const listDir = require('../helpers/list-directory');

protoss.gulp.task('protoss/sprites-svg', (cb) => {

  if (!config.enabled) return cb(null);

  let sprites = listDir(config.src, 'dirs', 'names');
  let queue = sprites.length;
  let stylesStream = mergeStream();
  let padding = 2;

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
                  spriteName: config.prefix ? sprite + '-' : '',
                  spritePath: config.spritePath,
                  spriteSvg: sprite + '.svg',
                  spriteFallback: sprite + '.fallback.png',
                  mixin: index == queue - 1 // Create mixin only for last sprite
                }
              }
            }
          }))
          .pipe(imagesFilter)
          .pipe(protoss.gulp.dest(config.dest))
          .pipe(svg2png())
          .pipe(rename({
            suffix:'.fallback'
          }))
          .pipe(protoss.gulp.dest(config.dest))
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
