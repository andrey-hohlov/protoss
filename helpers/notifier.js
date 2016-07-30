'use strict';

var gutil = require('gulp-util');

/**
 * Notify helper
 * @param  {String|Array} data
 */

module.exports = {

  error: function(message, file) {
    var log = '';
    log += gutil.colors['red'](message);

    if (file){
      log += ' ' + gutil.colors['red'](file);
    }

    gutil.log(log);
    return gutil.noop();
  },

  success: function(message, file) {
    var log = '';
    log += gutil.colors['yellow'](message);

    if (file){
      log += ' ' + gutil.colors['blue'](file);
    }

    gutil.log(log);
    return gutil.noop();
  },

  info: function(message, file) {
    var log = '';
    log += message;

    if (file){
      log += ' ' + gutil.colors['blue'](file);
    }

    gutil.log(log);
    return gutil.noop();
  },

  custom: function (func){
    var log = func();
    gutil.log(log);
    return gutil.noop();
  }

};
