'use strict';

var config = protoss.config.watch;
var packages = protoss.packages;
var chokidar = packages.chokidar;

/**
 * Create scripts bundles
 */

module.exports = function() {

  protoss.packages.gulp.task('protoss/run-watchers', function(cb) {

    if (!config) return;

    var queue = config.length;

    var runWatcher = function (watch) {

      var run = function () {

        var watcher = chokidar.watch(
          watch.path,
          {
            ignored: watch.ignore,
            ignoreInitial: true,
            cwd: watch.cwd
          });

        watch.on.forEach(function (on) {
          watcher.on(on.event, function(event, path) {

            // todo: two args path on 'all' event, one - on other events
            // https://github.com/paulmillr/chokidar#getting-started
            if (!path) {
              path = event;
              event = on.event;
            }

            protoss.helpers.watcherLog(event, path);
            packages.gulp.start(on.task);

          })
        });

        handleQueue();

      };

      var handleQueue = function() {
        if(queue) {

          queue--;

          if(queue === 0) {
            protoss.flags.isWatching = true;
            cb(null); // End task
          }

        }
      };

      return run();

    };

    config.forEach(runWatcher);

  });

};
