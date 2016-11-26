import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import spritesmithMulti from 'gulp.spritesmith-multi';
import mergeStream from 'merge-stream';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4
const config = protoss.config.sprites;

protoss.gulp.task('protoss/sprites', () => {
  if (!config.enabled) return;

  let src = [config.src];
  let index = 0;

  if(!config.retina) {
    src.push('!'+config.src + '**/*@2x.png');
  }

  let spriteData = protoss.gulp.src(src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'sprites\' task`)}))
    .pipe(spritesmithMulti({
      spritesmith: function(options, sprite) {
        options.imgName = sprite+'.png';
        options.cssName = 'sprite-' + sprite + '.scss';
        options.Algorithms = 'diagonal';
        options.padding = 2;
        options.cssOpts = {
          spriteName: sprite,
          spritePath: config.spritePath,
          retina: config.retina,
          mixin: index == 0 // Create mixin only for first sprite
        };
        options.cssTemplate = config.template;
        index++;
      }
    }));

  let imgStream = spriteData.img
    .pipe(protoss.gulp.dest(config.dest))
    .pipe(protoss.gulp.dest(config.dest));

  let cssStream = spriteData.css
    .pipe(concat(config.stylesName))
    .pipe(protoss.gulp.dest(config.stylesDest));

  return mergeStream(imgStream, cssStream).pipe(
    protoss.notifier.success('Png-sprites ready')
  );
});

protoss.gulp.task('protoss/sprites:watch', () => {
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
      'protoss/sprites'
    );
  });
});