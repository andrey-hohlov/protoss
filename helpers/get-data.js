'use strict';

var fs = require('fs'),
    path = require('path');

/**
 * Get data from json file
 * @param  {String} dataFile
 */

module.exports = function (dataFile) {

    var config = protoss.config.templates,
        resolvedPath = path.resolve(config.dataSrc),
        dataPath = resolvedPath + path.sep,
        dataFilePath = path.resolve(path.join(dataPath, /\.json$/.test(dataFile) && dataFile || dataFile + '.json'));

    if (dataPath != dataFilePath.slice(0, dataPath.length)) {
        throw new Error('Data path is not in data directory. Abort due potential data disclosure.');
    }
    return JSON.parse(fs.readFileSync(dataFilePath));
};
