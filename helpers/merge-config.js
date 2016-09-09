const merge = require('merge');
const gutil = require('gulp-util');

module.exports = function (defaultConfig, userConfig) {
  if (!userConfig) {
    gutil.log([
      gutil.colors.bold.red('You don\'t create protoss-config file. Using default settings.')
    ].join('\n'));
    userConfig = {};
  }

  return protoss.config = merge.recursive(defaultConfig, userConfig);
};
