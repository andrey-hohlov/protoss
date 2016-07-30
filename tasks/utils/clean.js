const del = require('del');

module.exports = function(options) {

  return function(cb) {
    return del(protoss.config.clean, {dot: true});
  };

};
