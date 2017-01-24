const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const isWebpack = protoss.config.scripts.workflow === 'webpack';

protoss.gulp.task('protoss/watch-and-sync', (cb) => {
  runSequence(
    'protoss/watch',
    'protoss/serve',
    cb,
  );
});

const watchTasks = [
  'protoss/dev',
  'protoss/styles:watch',
  'protoss/images:watch',
  'protoss/templates:watch',
  'protoss/sprites:watch',
  'protoss/sprites-svg:watch',
  'protoss/icons:watch',
];

if (!isWebpack) {
  watchTasks.push('protoss/scripts:watch');
}

protoss.gulp.task('protoss/watch', (cb) => {
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
  runSequence(
    [
      'protoss/images',
      'protoss/sprites',
      'protoss/sprites-svg',
      'protoss/icons',
      'protoss/favicons',
    ],
    [
      'protoss/copy',
      isWebpack ? 'protoss/webpack' : 'protoss/scripts',
      'protoss/templates',
      'protoss/styles',
    ],
    () => {
      protoss.notifier.success('Development version was built successfully!');
      cb();
    },
  );
});

protoss.gulp.task('protoss/styles:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    [
      'protoss/sprites',
      'protoss/sprites-svg',
    ],
    'protoss/styles',
    cb,
  );
});

if (isWebpack) {
  protoss.gulp.task('protoss/webpack:build', (cb) => {
    process.env.NODE_ENV = 'production';
    runSequence(
      'protoss/webpack',
      cb,
    );
  });
} else {
  protoss.gulp.task('protoss/scripts:build', (cb) => {
    process.env.NODE_ENV = 'production';
    runSequence(
      'protoss/scripts',
      cb,
    );
  });
}

protoss.gulp.task('protoss/templates:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/templates',
    cb,
  );
});

protoss.gulp.task('protoss/images:build', (cb) => {
  process.env.NODE_ENV = 'production';
  runSequence(
    'protoss/images',
    'protoss/images:optimize',
    cb,
  );
});
