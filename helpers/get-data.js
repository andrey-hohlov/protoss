'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Get data from json file
 * @param  {String} dataFile
 */

module.exports = function (dataFile) {

  // Add .json to file path
  dataFile = /\.json$/.test(dataFile) && dataFile || dataFile + '.json';

  var resolvedPath = path.resolve(dataFile);

  return JSON.parse(fs.readFileSync(resolvedPath));
};
