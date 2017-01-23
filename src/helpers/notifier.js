const gutil = require('gulp-util');

function writeLog(message, file, color = 'yellow') {
  let log = `[Protoss]: ${message}`;
  if (file) log += ` ${file}`;
  gutil.log(gutil.colors[color](log));
  return gutil.noop();
}

module.exports = {
  error(message, file) {
    return writeLog(message, file, 'red');
  },

  success(message, file) {
    return writeLog(message, file, 'green');
  },

  info(message, file) {
    return writeLog(message, file, 'blue');
  },

  warning(message, file) {
    return writeLog(message, file, 'yellow');
  },
};
