const merge = require('merge');
const notifier = require('./helpers/notifier');

module.exports = function (defaultConfig, userConfig) {

  return function () {

    if (!userConfig) {
      notifier.error('You don\'t create protoss-config file. Using default settings.');
      userConfig = {};
    } else if (typeof userConfig !== 'object') {
      notifier.error('Protoss config must be an object! Using default settings.');
      userConfig = {};
    }

    protoss.config = merge.recursive(defaultConfig, userConfig);
  };

};
