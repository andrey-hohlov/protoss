'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Get list of paths or names for files or directories
 * @param path {String} - path to directory for list
 * @param target {String} - get files or dirs
 * @param format {String} - return paths or names
 * @returns {Array}
 *
 * TODO: optional recursion
 */

var listDir = function(path, target, format) {

  target = target || 'files'; // 'dirs'
  format = format || 'paths'; // 'names'

  var results = [],
    list = [];

  try {
    // Chek if directory exist
    var dirExist = fs.statSync(path);

    if (dirExist) {
      list = fs.readdirSync(path);

      if (list.length > 0) {
        list.forEach(function (file) {
          var filePath = path + '/' + file, // Path to file (folder)
            stat = fs.statSync(filePath),
            result;

          if (format == 'paths') {
            result = filePath;
          } else {
            result = file;
          }
          // Get files or directories
          if (target == 'dirs' && stat.isDirectory()) {
            results.push(result );
          } else if (target == 'files' && stat.isFile()) {
            results.push(result );
          }
        });
      }

    }

  } catch(err) {
    console.log('Error when check directory ' + path + err);
  }

  return results;
};

module.exports = listDir;
