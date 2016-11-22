const config = protoss.config.templates;

const plumber = require('gulp-plumber');
const filter = require('gulp-filter');
const cached = require('gulp-cached');
const gulpif = require('gulp-if');
const compile = require('gulp-jade');
const inheritance = require('gulp-jade-inheritance');
const prettify = require('gulp-jsbeautifier');
const hashSrc = require('gulp-hash-src');
const rename = require('gulp-rename');
const w3cjs = require('gulp-w3cjs');

protoss.gulp.task('protoss/templates', (cb) => {
  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'templates\' task`)}))
    .pipe(gulpif(protoss.flags.isWatch, cached()))
    .pipe(gulpif(protoss.flags.isWatch,inheritance({basedir: config.inhBaseDir})))
    .pipe(filter(file => {
      let path = file.path.replace(/\\/g, '/');
      let relative = file.relative.replace(/\\/g, '/');
      if (/\/_/.test(path) || /^_/.test(relative)) return false;

      if (config.filterFunc && typeof config.filterFunc === 'function') {
        return config.filterFunc(file);
      }

      return true;
    }))
    .pipe(compile({pretty: false, data: config.data}))
    .pipe(gulpif(protoss.flags.isBuild && config.prettify, prettify()))
    .pipe(rename({dirname: '.'}))
    .pipe(protoss.gulp.dest(config.dest))
    .pipe(gulpif(protoss.flags.isBuild && config.hashes.enabled, hashSrc({
      build_dir: config.hashes.build_dir,
      src_path: config.hashes.src_path,
      query_name: 'v',
      hash_len: 10,
      exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ico']
    })))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', function() {
      protoss.notifier.success('Templates compiled');
      cb(null);
    });
});

protoss.gulp.task('protoss/templates:w3c-test', (cb) => {
  protoss.gulp.src(config.w3c.src)
    .pipe(w3cjs())
    .pipe(w3cjs.reporter())
    .on('end', function() {
      cb(null);
    });
});
