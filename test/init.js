const gulp = require('gulp');
const chai = require('chai');
const expect = chai.expect;

require('../lib/protoss')(gulp, require('./fixtures/init/protoss.config.js'));
require('mocha');

describe('Initializing', function () {
  it('Gulp gets Protoss tasks', function (done) {
    expect(gulp.tasks['protoss/build']).to.be.a('object');
    done();
  });
});
