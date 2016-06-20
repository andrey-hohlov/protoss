'use strict';

var config = protoss.config.spritesPng;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

/**
 * Make sprites and mixins for this sprites
 */

module.exports = function () {
  return packages.gulp.task('protoss/images/make-png-sprites', function() {

    if(!config.enabled) return;

    var src = [config.src + '**/*.png'];
    var index = 0;

    if(!config.retina)
      src.push('!'+config.src + '**/*@2x.png');

    // Generate our spritesheet
    var spriteData = packages.gulp.src(src)

      // Prevent pipe breaking
      .pipe(packages.plumber(function(error) {
        notifier.error('An error occurred while making png-sprite: ' + error);
        this.emit('end');
      }))

      // Make sprites
      .pipe(packages.spritesmithMulti({
        spritesmith: function(options, sprite) {
          options.imgName = sprite+'.png';
          options.cssName = 'sprite-' + sprite + '.scss';
          options.Algorithms = 'diagonal';
          options.padding = 2;
          options.cssOpts = {
            spriteName: config.prefix ? sprite + '-'  : '',
            spritePath: config.spritePath,
            retina: config.retina,
            mixin: index == 0 // Create mixin only for first sprite
          };
          options.cssTemplate = config.template;
          index++;
        }
      }));

    // Save images
    var imgStream = spriteData.img
      .pipe(packages.gulp.dest(config.dest));

    var cssStream = spriteData.css
      // Concat all scss to one
      .pipe(packages.concat(config.stylesName))
      // Save scss file
      .pipe(packages.gulp.dest(config.stylesDest));

    // End task
    return packages.mergeStream(imgStream, cssStream).pipe(
      notifier.success('Png-sprites maked')
    );

  });
};
