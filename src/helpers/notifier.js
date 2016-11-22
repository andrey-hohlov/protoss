/**
 * Notify helper
 * @param  {String|Array} data
 */

const gutil = require('gulp-util');

const writeLog = function(message, file, color) {
  color = color || 'yellow';
  let log = 'Protoss: ' + message;
  if (file) {
    log += ' ' + file;
  }
  gutil.log(gutil.colors[color](log));
  return gutil.noop();
};

module.exports = {

  error: function(message, file) {
    return writeLog(message, file, 'red');
  },

  success: function(message, file) {
    return writeLog(message, file, 'green');
  },

  info: function(message, file) {
    return writeLog(message, file, 'blue');
  }
};
