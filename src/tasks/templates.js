import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import cached from 'gulp-cached';
import gulpif from 'gulp-if';
import compile from 'gulp-pug';
import inheritance from 'gulp-pug-inheritance';
import prettify from 'gulp-jsbeautifier';
import hashSrc from 'gulp-hash-src';
import rename from 'gulp-rename';
import posthtml from 'gulp-posthtml';
import w3cjs from 'gulp-w3cjs';
import chokidar from 'chokidar';
import logger from '../helpers/watcher-log';

const runSequence = require('run-sequence').use(protoss.gulp); // TODO: remove on Gulp 4

const config = protoss.config.templates;

protoss.gulp.task('protoss/templates', (cb) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const isWatch = protoss.isWatch;

  protoss.gulp.src(config.src)
    .pipe(plumber({
      errorHandler: protoss.errorHandler('Error in templates task'),
    }))
    .pipe(gulpif(isWatch, cached()))
    .pipe(gulpif(isWatch, inheritance(config.inheritance)))
    .pipe(filter((file) => {
      const path = file.path.replace(/\\/g, '/');
      const relative = file.relative.replace(/\\/g, '/');
      if (/\/_/.test(path) || /^_/.test(relative)) return false;

      if (config.filter && typeof config.filter === 'function') {
        return config.filter(file);
      }

      return true;
    }))
    .pipe(compile({
      pretty: false,
      data: config.data,
    }))
    .pipe(gulpif(config.posthtml, posthtml(config.posthtml.plugins, config.posthtml.options)))
    .pipe(gulpif(isProduction && config.prettify, prettify()))
    .pipe(rename({ dirname: '.' }))
    .pipe(protoss.gulp.dest(config.dest)) // TODO: remove double saving
    .pipe(gulpif(isProduction && config.hashes.enabled, hashSrc({
      build_dir: config.hashes.build_dir,
      src_path: config.hashes.src_path,
      query_name: 'v',
      hash_len: 10,
      exts: ['.js', '.css', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ico'],
    })))
    .pipe(protoss.gulp.dest(config.dest))
    .on('end', () => {
      protoss.notifier.success('Templates compiled');
      cb(null);
    });
});

protoss.gulp.task('protoss/templates:w3c-test', (cb) => {
  protoss.gulp.src(config.w3c.src)
    .pipe(w3cjs())
    .pipe(w3cjs.reporter())
    .on('end', () => {
      cb(null);
    });
});

protoss.gulp.task('protoss/templates:watch', () => {
  const watcher = chokidar.watch(
    config.watch ? config.watch : config.src,
    {
      ignoreInitial: true,
    },
  );

  watcher.on('all', (event, path) => {
    logger(event, path);
    runSequence(
      'protoss/templates',
    );
  });
});
