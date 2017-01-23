import gutil from 'gulp-util';

/**
 * Helper for watcher logging
 * @param  {String} event Type of event
 * @param  {String} path  Path of changed file
 */

function watcherLog(event, path) {
  gutil.log(`File: ${gutil.colors.green.bold(path)}  Event: ${gutil.colors.green.bold(event)}`);
}

module.exports = watcherLog;
