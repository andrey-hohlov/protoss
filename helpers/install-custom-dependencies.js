'use strict';

var exec = require('child_process').exec;

var usersDeps;

try {
    usersDeps = require('../../custom-package');
} catch (er) {
    console.log('custom-package.json is not valid!\n');
    console.log(er);
}

for (var dep in usersDeps.dependencies) {
    if (dep) {
        exec('npm i ' + dep + '@' + usersDeps.dependencies[dep], function (error, stdout, stderr) {
            if (error) {
                console.log(stderr);
            } else {
                console.log(stdout);
            }
        });
    }
}
