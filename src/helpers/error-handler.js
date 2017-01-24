import gutil from 'gulp-util';

function errorHandler(title) {
  return function handler(error) {
    gutil.log([
      gutil.colors.bold.red(title || `Error in ${error.plugin}`),
      '',
      error.message,
      '',
    ].join('\n'));
    this.emit('end');
  };
}

module.exports = errorHandler;
