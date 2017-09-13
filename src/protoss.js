/**
 * Protoss
 * Gulp tasks bundle for fast front-end development
 */

/* eslint-disable global-require */
function runProtoss(gulp, userConfig) {
  if (!gulp) throw new Error('No Gulp passed to Protoss!');

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  require('./helpers/set-ulimit')(); // eslint-disable-line

  global.protoss = {};

  protoss.gulp = gulp;

  // Helpers
  protoss.notifier = require('./helpers/notifier');
  protoss.errorHandler = require('./helpers/error-handler');

  // Flags
  protoss.isWatch = false;

  // Prepare config
  const mergeConfig = require('./helpers/merge-config');
  const defaultConfig = require('../protoss.config.js');
  protoss.config = mergeConfig(defaultConfig, userConfig);

  // Load tasks
  const config = protoss.config;

  require('./tasks/main');

  if (config.templates.enabled) {
    require('./tasks/templates');
  }

  if (config.styles.enabled) {
    require('./tasks/styles');
  }

  if (config.scripts.enabled) {
    require('./tasks/webpack');
  }

  if (config.icons.enabled) {
    require('./tasks/icons');
  }

  if (config.sprites.enabled) {
    require('./tasks/sprites');
  }

  if (config.spritesSvg.enabled) {
    require('./tasks/sprites-svg');
  }

  if (config.images.enabled) {
    require('./tasks/images');
  }

  require('./tasks/serve');
  require('./tasks/copy');
  require('./tasks/del');

  if (config.favicons.enabled) {
    require('./tasks/favicons');
  }
}

module.exports = runProtoss;
