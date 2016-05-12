'use strict';

var config = protoss.config.images,
    packages = protoss.packages,
    notifier = protoss.helpers.notifier;

/**
 * Make sprites and mixins for this sprites
 */

module.exports = function () {
    return packages.gulp.task('protoss/images/make-png-sprite', function() {

        if(!config.spritesPng) return;

        var src = [config.src + 'sprites/**/*.png'],
            index = 0;

        if(!config.retina)
            src.push('!'+config.src + 'sprites/**/*@2x.png');

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
                        spriteName: (config.spritePrefixPng && sprite != 'main') ? sprite + '-'  : '',
                        retina: config.retina,
                        mixin: index == 0 // Create mixin only for first sprite
                    };
                    options.cssTemplate = protoss.config.styles.src + 'sprite-generator-templates/sprite.mustache';
                    index++;
                }
            }));

        // Save images
        var imgStream = spriteData.img
            .pipe(packages.gulp.dest(config.dest + 'sprites/'));

        var cssStream = spriteData.css
            // Concat all scss to one
            .pipe(packages.concat('_sprites.scss'))
            // Save scss file
            .pipe(packages.gulp.dest(protoss.config.styles.src + 'sprites/'));

        // End task
        return packages.merge(imgStream, cssStream).pipe(
            notifier.success('Png-sprites maked')
        );

    });
};
