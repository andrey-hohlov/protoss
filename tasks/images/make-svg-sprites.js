'use strict';

var config = protoss.config.spritesSvg;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Make svg-sprites and mixins for this sprites
 */

module.exports = function() {
  packages.gulp.task('protoss/images/make-svg-sprites', function(cb) {

    if(config.enabled) {

      var sprites,
        queue,
        stylesStream = packages.mergeStream(),
        padding = 2;

      var makeSprite = function(sprite, index) {

        var make = function() {

          var imagesFilter = packages.filter(['*.svg'],{restore: true});
          var stylesFilter = packages.filter(['*.scss']);

          stylesStream.add(
            packages.gulp.src(config.src + sprite + '/*.svg')

            // Prevent pipe breaking
              .pipe(packages.plumber(function(error) {
                notifier.error('An error occurred while making svg-sprite: ' + error);
                this.emit('end');
              }))

              // Make sprites
              .pipe(packages.svgSprite({
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
              .pipe(packages.gulp.dest(config.dest))

              // Make fallback image
              .pipe(packages.svg2png())

              // Rename fallback image
              .pipe(packages.rename({
                suffix:'.fallback'
              }))

              // Save fallback image
              .pipe(packages.gulp.dest(config.dest))

              // Filter scss files
              .pipe(imagesFilter.restore)
              .pipe(stylesFilter)

              .on('end', handleQueue)

          );

        };

        var handleQueue = function() {

          notifier.info('Svg-sprite processed:', sprite);

          if(queue) {

            queue--;

            if(queue === 0) {

              stylesStream
              // Prevent pipe breaking
                .pipe(packages.plumber(function(error) {
                  notifier.error('An error occurred while making svg-sprite: ' + error);
                  this.emit('end');
                }))

                // Concat all scss to one
                .pipe(packages.concat(config.stylesName))

                // Save scss file
                .pipe(packages.gulp.dest(config.stylesDest))

                .on('end', function () {
                  notifier.success('Svg-sprites ready');

                  if(protoss.flags.isWatching)
                    packages.browserSync.reload();

                  cb(null); // End task
                });
            }
          }
        };

        return make();

      };

      sprites = protoss.helpers.listDir(config.src, 'dirs', 'names'); // get folders with sprites
      queue = sprites.length;

      if(queue)
        sprites.forEach(makeSprite);
      else
        cb(null); // End task

    } else {
      cb(null); // End task
    }
  });
};
