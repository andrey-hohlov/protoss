const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config;

const templatesTask = config.templates.enabled ? 'protoss/templates' : null;
const stylesTask = config.styles.enabled ? 'protoss/styles' : null;
const webpackTask = config.webpack.enabled ? 'protoss/webpack' : null;
const imagesTask = config.images.enabled ? 'protoss/images' : null;
const imagesOptimizeTask = config.images.enabled ? 'protoss/images:optimize' : null;
const iconsTask = config.icons.enabled ? 'protoss/icons' : null;
const spritesTask = config.sprites.enabled ? 'protoss/sprites' : null;
const spritesSvgTask = config.spritesSvg.enabled ? 'protoss/sprites-svg' : null;
const faviconsTask = config.favicons.enabled ? 'protoss/favicons' : null;
const copyTask = 'protoss/copy';

const templatesWatch = config.templates.enabled ? 'protoss/templates:watch' : null;
const stylesWatch = config.styles.enabled ? 'protoss/styles:watch' : null;
const imagesWatch = config.images.enabled ? 'protoss/images:watch' : null;
const iconsWatch = config.icons.enabled ? 'protoss/icons:watch' : null;
const spritesWatch = config.sprites.enabled ? 'protoss/sprites:watch' : null;
const spritesSvgWatch = config.spritesSvg.enabled ? 'protoss/sprites-svg:watch' : null;
const webpackWatch = config.webpack.enabled ? 'protoss/webpack:watch' : null;

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
  // TODO: Reorganize https://github.com/shama/webpack-stream/issues/79
  runSequence(
    'protoss/serve',
    'protoss/watch',
    cb,
  );
});

protoss.gulp.task('protoss/watch', (cb) => {
  let tasks = [
    [
      iconsTask,
      spritesTask,
      spritesSvgTask,
      faviconsTask,
    ],
    [
      copyTask,
      imagesTask,
      stylesTask,
      templatesTask,
    ],
    [
      templatesWatch,
      stylesWatch,
      webpackWatch,
      imagesWatch,
      iconsWatch,
      spritesWatch,
      spritesSvgWatch,
    ],
    () => {
      protoss.isWatch = true;
      cb();
    },
  ];

  tasks = filterTasks(tasks);
  runSequence.apply(null, tasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/build', (cb) => {
  process.env.NODE_ENV = 'production';
  let tasks = [
    'protoss/del',
    'protoss/dev',
    imagesOptimizeTask,
    () => {
      cb();
    },
  ];

  tasks = filterTasks(tasks);
  runSequence.apply(null, tasks); // eslint-disable-line prefer-spread
});

protoss.gulp.task('protoss/dev', (cb) => {
  let tasks = [
    [
      imagesTask,
      iconsTask,
      spritesTask,
      spritesSvgTask,
      faviconsTask,
    ],
    [
      copyTask,
      webpackTask,
      stylesTask,
      templatesTask,
    ],
    () => {
      cb();
    },
  ];

  tasks = filterTasks(tasks);
  runSequence.apply(null, tasks); // eslint-disable-line prefer-spread
});
