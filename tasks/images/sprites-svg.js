const config = protoss.config.spritesSvg;

const plumber = require('gulp-plumber');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const svgSprite =require('gulp-svg-sprite');
const svg2png = require('gulp-svg2png');
const mergeStream = require('merge-stream');
const listDir = require('./helpers/list-directory');

module.exports = function(options) {

  return function(cb) {

    if (!config.enabled) return cb(null);

    var sprites,
      queue,
      stylesStream = mergeStream(),
      padding = 2;

    var makeSprite = function(sprite, index) {

      var make = function() {

        var imagesFilter = filter(['*.svg'], {restore: true});
        var stylesFilter = filter(['*.scss']);

        stylesStream.add(
          protoss.gulp.src(config.src + sprite + '/*.svg')

          // Prevent pipe breaking
            .pipe(plumber(function(error) {
              protoss.notifier.error('An error occurred while making svg-sprite: ' + error);
              this.emit('end');
            }))

            // Make sprites
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

            // Filter svg image
            .pipe(imagesFilter)

            // Save svg image
            .pipe(protoss.gulp.dest(config.dest))

            // Make fallback image
            .pipe(svg2png())

            // Rename fallback image
            .pipe(rename({
              suffix:'.fallback'
            }))

            // Save fallback image
            .pipe(protoss.gulp.dest(config.dest))

            // Filter scss files
            .pipe(imagesFilter.restore)
            .pipe(stylesFilter)

            .on('end', handleQueue)

        );

      };

      var handleQueue = function() {

        protoss.notifier.info('Svg-sprite processed:', sprite);

        if(queue) {

          queue--;

          if(queue === 0) {

            stylesStream
            // Prevent pipe breaking
              .pipe(plumber(function(error) {
                protoss.notifier.error('An error occurred while making svg-sprite: ' + error);
                this.emit('end');
              }))

              // Concat all scss to one
              .pipe(concat(config.stylesName))

              // Save scss file
              .pipe(protoss.gulp.dest(config.stylesDest))

              .on('end', function () {
                protoss.notifier.success('Svg-sprites ready');
                cb(null); // End task
              });
          }
        }
      };

      return make();

    };

    sprites = listDir(config.src, 'dirs', 'names'); // get folders with sprites
    queue = sprites.length;

    if(queue) {
      sprites.forEach(makeSprite);
    } else {
      cb(null); // End task
    }

  };

};
