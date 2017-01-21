/**
 * Set ulimit. Topical for Linux-family OS and OSX.
 */

module.exports = function () {
  if (require('os').platform() !== 'win32') {
    const limit = 4096;
    let posix;
    try {
      posix = require('posix');
    } catch (ex) {}
    if (posix) {
      try {
        posix.setrlimit('nofile', {soft: limit});
        return true;
      } catch (ex) {}
    }
  }
  return false;
};
