const config = protoss.config.spritesPng;
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const spritesmithMulti = require('gulp.spritesmith-multi');
const mergeStream = require('merge-stream');

module.exports = function(options) {

  return function(cb) {

    if (!config.enabled) return cb(null);

    var src = [config.src + '**/*.png'];
    var index = 0;

    if(!config.retina)
      src.push('!'+config.src + '**/*@2x.png');

    // Generate our spritesheet
    var spriteData = protoss.gulp.src(src)

    // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while making png-sprite: ' + error);
        this.emit('end');
      }))

      // Make sprites
      .pipe(spritesmithMulti({
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
      .pipe(protoss.gulp.dest(config.dest));

    var cssStream = spriteData.css
    // Concat all scss to one
      .pipe(concat(config.stylesName))
      // Save scss file
      .pipe(protoss.gulp.dest(config.stylesDest));

    // End task
    return mergeStream(imgStream, cssStream).pipe(
      protoss.notifier.success('Png-sprites maked')
    );


  }

};
