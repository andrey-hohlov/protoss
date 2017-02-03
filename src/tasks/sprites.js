import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import spritesmithMulti from 'gulp.spritesmith-multi';
import mergeStream from 'merge-stream';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.sprites;

protoss.gulp.task('protoss/sprites', () => {
  const src = [config.src];
  const templateData = config.templateData || {};
  let index = 0;

  const spriteData = protoss.gulp.src(src)
    .pipe(plumber({
      errorHandler: protoss.errorHandler('Error in sprites task'),
    }))
    .pipe(spritesmithMulti({
      spritesmith(options, sprite) {
        /* eslint-disable no-param-reassign */
        options.imgName = `${sprite}.png`;
        options.cssName = `sprite-${sprite}.scss`;
        options.Algorithms = 'diagonal';
        options.padding = 2;
        options.cssOpts = {
          templateData,
          spriteName: sprite,
          retina: config.retina,
          mixin: index === 0, // Create mixin only for first sprite
        };
        options.cssTemplate = config.template;
        index += 1;
        return options;
        /* eslint-enable no-param-reassign */
      },
    }));

  const imgStream = spriteData.img
    .pipe(protoss.gulp.dest(config.dest))
    .pipe(protoss.gulp.dest(config.dest));

  const cssStream = spriteData.css
    .pipe(concat(config.stylesName))
    .pipe(protoss.gulp.dest(config.stylesDest));

  return mergeStream(imgStream, cssStream).pipe(protoss.notifier.success('Png-sprites ready'));
});

protoss.gulp.task('protoss/sprites:watch', () => {
  const watcher = chokidar.watch(
    config.src,
    {
      ignoreInitial: true,
    },
  );
  watcher.on('all', (event, path) => {
    logger(event, path);
    runSequence(
      'protoss/sprites',
    );
  });
});
