const config = protoss.config.watch;
const chokidar = require('chokidar');
const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4
const logger = require('../helpers/watcher-log');

protoss.gulp.task('protoss/watchers', (cb) => {
  if (!config) return cb(null);

  let queue = config.length;

  let runWatcher = function (watch) {
    let run = function () {
      let watcher = chokidar.watch(
        watch.path,
        watch.config
      );

      watch.on.forEach(function (on) {
        watcher.on(on.event, function (event, path) {

          // todo: two args path on 'all' event, one - on other events
          // https://github.com/paulmillr/chokidar#getting-started
          if (!path) {
            path = event;
            event = on.event;
          }

          logger(event, path);
          runSequence(
            on.task,
            function () {
              if(protoss.flags.isWatch && protoss.browserSync) {
                protoss.browserSync.reload();
              }
            }
          );
        })
      });

      handleQueue();
    };

    let handleQueue = function () {
      if (queue) {
        queue--;
        if (queue === 0) {
          protoss.flags.isWatch = true;
          cb(null);
        }
      }
    };

    return run();
  };

  config.forEach(runWatcher);
});
