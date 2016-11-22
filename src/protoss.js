/**
 * Protoss
 * Gulp tasks bundle for fast front-end development
 */

global.protoss = {};
protoss.notifier = require('./helpers/notifier');
protoss.errorHandler = require('./helpers/error-handler');
protoss.flags = {
  isWatch: false,
  isBuild: false
};

require('./helpers/set-ulimit')();

module.exports = function(gulp, userConfig) {
  if (!gulp) throw new Error('No gulp passed!'); // TODO: error text

  protoss.gulp = gulp;

  // Prepare config
  let defaultConfig = require('../protoss-config.js');
  protoss.config = require('./helpers/merge-config')(defaultConfig, userConfig);

  // Load tasks
  require('require-dir')('tasks', {recurse: true});
  // TODO: 'make config' task
};
