'use strict';

var fs = require('fs');

/**
 * Load task and watchers
 * @param  {String} dir directory with files
 * @return {Array}      Path to dirs
 */

var loadJsFiles = function (dir) {
    var results = [];

    try {
        var list = fs.readdirSync(dir);

        list.forEach(function (file) {
            var stat;

            file = dir + '/' + file;
            stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(loadJsFiles(file));
            } else {
                if (file.match(/(.js*)/)) {
                    results.push(file);
                }
            }
        });
    }
    catch (e) {
        console.log(dir + " does not exist.");
    }

    return results.length > 0 ? results : false;
};

module.exports = loadJsFiles;
