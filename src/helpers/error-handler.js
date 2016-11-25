import gutil from 'gulp-util';

module.exports = function (title) {
  return function (error) {
    gutil.log([
      gutil.colors.bold.red(title || 'Error in ' + error.plugin),
      '',
      error.message,
      ''
    ].join('\n'));
    this.emit('end');
  };
};
