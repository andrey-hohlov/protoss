const fs = require('fs');
const notifier = require('./notifier');

/**
 * Get array of directories names inside path (no recursive)
 * @param path
 * @returns {*}
 */

function listChildDirs(path) {
  const results = [];

  try {
    const list = fs.readdirSync(path);
    list.forEach((file) => {
      const filePath = `${path}/${file}`;
      if (fs.statSync(filePath).isDirectory()) {
        results.push(file);
      }
    });
  } catch (err) {
    notifier.error(`Error when check directory ${path}\n ${err}`);
  }

  return results;
}

module.exports = listChildDirs;
