import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import cached from 'gulp-cached';
import gulpif from 'gulp-if';
import compile from 'gulp-jade';
import inheritance from 'gulp-jade-inheritance';
import prettify from 'gulp-jsbeautifier';
import hashSrc from 'gulp-hash-src';
import rename from 'gulp-rename';
import w3cjs from 'gulp-w3cjs';

const config = protoss.config.templates;

protoss.gulp.task('protoss/templates', (cb) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isWatch = protoss.isWatch;

  protoss.gulp.src(config.src)
    .pipe(plumber({errorHandler: protoss.errorHandler(`Error in \'templates\' task`)}))
    .pipe(gulpif(isWatch, cached()))
    .pipe(gulpif(isWatch,inheritance({basedir: config.inhBaseDir})))
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
    .pipe(gulpif(isProduction && config.prettify, prettify()))
    .pipe(rename({dirname: '.'}))
    .pipe(protoss.gulp.dest(config.dest)) // TODO: remove double saving
    .pipe(gulpif(isProduction && config.hashes.enabled, hashSrc({
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
