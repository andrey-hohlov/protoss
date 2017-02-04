const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config;
const isWebpack = config.scripts.workflow === 'webpack';
const isIcons = config.icons.enabled;
const isSprites = config.sprites.enabled;
const isSpritesSvg = config.spritesSvg.enabled;
const isFavicons = config.favicons.enabled;

protoss.gulp.task('protoss/watch-and-sync', (cb) => {
  runSequence(
    'protoss/watch',
    'protoss/serve',
    cb,
  );
});

protoss.gulp.task('protoss/watch', (cb) => {
  const watchTasks = [
    'protoss/dev',
    'protoss/styles:watch',
    'protoss/images:watch',
    'protoss/templates:watch',
  ];

  if (isIcons) {
    watchTasks.push('protoss/icons:watch');
  }
  if (isSprites) {
    watchTasks.push('protoss/sprites:watch');
  }
  if (isSpritesSvg) {
    watchTasks.push('protoss/sprites-svg:watch');
  }
  if (!isWebpack) {
    watchTasks.push('protoss/scripts:watch');
  }

  watchTasks.push(() => {
    protoss.isWatch = true;
    if (isWebpack) {
      protoss.notifier.warning('Run `protoss/webpack:watch` for start webpack!');
    }
    cb();
  });

  runSequence.apply(null, watchTasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/del',
    'protoss/dev',
    'protoss/images:optimize',
    () => {
      protoss.notifier.success('Production version was built successfully!');
      cb();
    },
  );
});

protoss.gulp.task('protoss/dev', (cb) => {
  const firstTasks = [
    'protoss/images',
  ];
  const secondTasks = [
    'protoss/copy',
    isWebpack ? 'protoss/webpack' : 'protoss/scripts',
    'protoss/styles',
  ];

  if (isSprites) {
    firstTasks.push('protoss/sprites');
  }
  if (isSpritesSvg) {
    firstTasks.push('protoss/sprites-svg');
  }
  if (isIcons) {
    firstTasks.push('protoss/icons');
  }

  const devTasks = [firstTasks, secondTasks, 'protoss/templates'];

  if (isFavicons) {
    firstTasks.push('protoss/favicons');
  }

  devTasks.push(() => {
    protoss.notifier.success('Development version was built successfully!');
    cb();
  });

  runSequence.apply(null, devTasks); // eslint-disable-line prefer-spread
});