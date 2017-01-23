const merge = require('merge');
const gutil = require('gulp-util');

function mergeConfig(defaultConfig, userConfig) {
  if (!userConfig) {
    gutil.log([
      gutil.colors.bold.red('You don\'t create protoss-config file. Using default settings.'),
    ].join('\n'));
  }
  return merge.recursive(defaultConfig, userConfig || {});
}

module.exports = mergeConfig;
