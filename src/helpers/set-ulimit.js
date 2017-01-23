/**
 * Set ulimit. Topical for Linux-family OS and OSX.
 */

const os = require('os');

function setUlimit() {
  if (os.platform() !== 'win32') {
    const limit = 4096;
    let posix;
    try {
      posix = require('posix'); // eslint-disable-line global-require, import/no-extraneous-dependencies, import/no-unresolved, max-len
    } catch (ex) {
      // do nothing
    }
    if (posix) {
      try {
        posix.setrlimit('nofile', { soft: limit });
        return true;
      } catch (ex) {
        // do nothing
      }
    }
  }
  return false;
}

module.exports = setUlimit;
