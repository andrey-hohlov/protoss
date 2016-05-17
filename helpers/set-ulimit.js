'use strict';

/**
 * Set ulimit. Topical for Linux-family OS and OSX.
 */

module.exports = function () {
  var limit = 4096;
  var posix;

  try {
    posix = require('posix');
  } catch (ex) {
  }

  if (posix) {
    try {
      posix.setrlimit('nofile', { soft: limit });
      return true;
    } catch (ex) {
    }
  }
  return false;
};
