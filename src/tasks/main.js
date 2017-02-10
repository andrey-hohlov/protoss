const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config;
const useTemplates = config.templates.enabled;
const useScripts = config.scripts.enabled;
const useStyles = config.styles.enabled;
const useImages = config.images.enabled;
const useIcons = config.icons.enabled;
const useSprites = config.sprites.enabled;
const useSpritesSvg = config.spritesSvg.enabled;
const useFavicons = config.favicons.enabled;
const useWebpack = config.scripts.workflow === 'webpack';

// Remove 'null' tasks
function filterTasks(tasks) {
  const filtered = [];
  tasks.forEach((task) => {
    if (Array.isArray(task)) {
      const tasksGroup = filterTasks(task);
      if (tasksGroup.length > 0) filtered.push(tasksGroup);
    } else if (task !== null) {
     filtered.push(task);
    }
  });
  return filtered;
}

protoss.gulp.task('protoss/watch-and-sync', (cb) => {
  runSequence(
    'protoss/watch',
    'protoss/serve',
    cb,
  );
});

protoss.gulp.task('protoss/watch', (cb) => {
  let watchTasks = [
    'protoss/dev',
    useStyles ? 'protoss/styles:watch' : null,
    useImages ? 'protoss/images:watch' : null,
    useTemplates ? 'protoss/templates:watch' : null,
    useIcons ? 'protoss/icons:watch' : null,
    useSprites ? 'protoss/sprites:watch' : null,
    useSpritesSvg ? 'protoss/sprites-svg:watch' : null,
    useScripts && !useWebpack ? 'protoss/scripts:watch' : null,
    () => {
      protoss.isWatch = true;
      if (useScripts && useWebpack) {
        protoss.notifier.warning('Run `protoss/webpack:watch` for start webpack!');
      }
      cb();
    },
  ];

  watchTasks = filterTasks(watchTasks);
  runSequence.apply(null, watchTasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/build', (cb) => {
  process.env.NODE_ENV = 'production';
  let buildTasks = [
    'protoss/del',
    'protoss/dev',
    useImages ? 'protoss/images:optimize' : null,
    () => {
      cb();
    },
  ];

  buildTasks = filterTasks(buildTasks);
  runSequence.apply(null, buildTasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/dev', (cb) => {
  let devTasks = [
    [
      useImages ? 'protoss/images' : null,
      useIcons ? 'protoss/icons' : null,
      useSprites ? 'protoss/sprites' : null,
      useSpritesSvg ? 'protoss/sprites-svg' : null,
    ],
    [
      'protoss/copy',
      // eslint-disable-next-line no-nested-ternary
      useScripts ? useWebpack ? 'protoss/webpack' : 'protoss/scripts' : null,
      useStyles ? 'protoss/styles' : null,
    ],
    useTemplates ? 'protoss/templates' : null,
    useFavicons ? 'protoss/favicons' : null,
    () => {
      cb();
    },
  ];

  devTasks = filterTasks(devTasks);
  runSequence.apply(null, devTasks); // eslint-disable-line prefer-spread
});
