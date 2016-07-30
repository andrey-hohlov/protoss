const config = protoss.config.templates;
const plumber = require('gulp-plumber');
const filter = require('gulp-filter');
const changed = require('gulp-changed');
const cached = require('gulp-cached');
const gulpif = require('gulp-if');
const pug = require('gulp-pug');
const pugInheritance = require('gulp-pug-inheritance');
const htmlmin = require('gulp-htmlmin');
const prettify = require('gulp-jsbeautifier');

module.exports = function(options) {

  var noCache = options ? options.noCache || false : false;

  return function(cb) {

    protoss.gulp.src(config.src)

      // Prevent pipe breaking
      .pipe(plumber(function(error) {
        protoss.notifier.error('An error occurred while compiling templates: ' + error.message + ' on line ' + error.line + ' in ' + error.file);
        this.emit('end');
      }))

      // Only pass through changed main files and all the partials
      .pipe(gulpif(
        protoss.flags.isWatching && !noCache,
        changed(config.dest, {extension: '.html'})
      ))
      .pipe(gulpif(
        protoss.flags.isWatching && !noCache,
        cached('pug')
      ))
      .pipe(gulpif(
        protoss.flags.isWatching && !noCache,
        pugInheritance({basedir: config.inhBaseDir})
      ))

      // Filter out partials (folders and files starting with "_" )
      .pipe(filter(function (file) {
        return !/\/_/.test(file.path) && !/^_/.test(file.relative);
      }))

      // Process pug templates
      .pipe(pug({
        pretty: false,
        data: config.data
      }))

      // Prettify HTML
      .pipe(gulpif(
        !protoss.flags.isDev && !config.minify,
        prettify({
          braceStyle: "collapse",
          indentChar: " ",
          indentScripts: "normal",
          indentSize: 4,
          maxPreserveNewlines: 0,
          preserveNewlines: false,
          unformatted: ["a", "sub", "sup", "b", "i", "u"],
          wrapLineLength: 0
        })
      ))

      // Minify HTML
      .pipe(gulpif(
        !protoss.flags.isDev && config.minify,
        htmlmin({
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        })
      ))

      // Save all the files
      .pipe(protoss.gulp.dest(config.dest))

      .on('end', function() {
        protoss.notifier.success('Templates compiled');

        if(protoss.flags.isWatching)
          protoss.browserSync.reload();

        cb(null); // End task

      });

  };

};
