const config = protoss.config.browserSync;
protoss.browserSync = require('browser-sync').create();

module.exports = function(options) {

  return function(cb) {

    protoss.browserSync.init({
      open: true,
      port: config.port,
      server: {
        directory: true,
        baseDir: config.basedir
      },
      reloadDelay: 200,
      logConnections: true,
      debugInfo: true,
      injectChanges: false,
      browser: config.browser,
      startPath: config.startPath,
      ghostMode: config.ghostMode
    });

    cb(null);

  }

};
