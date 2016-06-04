'use strict';

var config = protoss.config.templates;
var packages = protoss.packages;
var notifier = protoss.helpers.notifier;

var jadeData = config.data;
jadeData.getData = protoss.helpers.getData;

/**
 * Compile jade templates.
 */

module.exports = function () {
  packages.gulp.task('protoss/templates/compile', function(cb) {
    packages.gulp.src(config.src+'**/*.jade')

      // Prevent pipe breaking
      .pipe(packages.plumber(function(error) {
        notifier.error('An error occurred while compiling templates: ' + error.message + ' on line ' + error.line + ' in ' + error.file);
        this.emit('end');
      }))

      // Only pass through changed main files and all the partials
      .pipe(packages.gulpif(
        protoss.flags.isWatching && !protoss.flags.isDataReload,
        packages.changed(config.dest, {extension: '.html'})
      ))
      .pipe(packages.gulpif(
        protoss.flags.isWatching && !protoss.flags.isDataReload,
        packages.cached('jade')
      ))
      .pipe(packages.gulpif(
        protoss.flags.isWatching && !protoss.flags.isDataReload,
        packages.jadeInheritance({basedir: config.src})
      ))

      // Filter out partials (folders and files starting with "_" )
      .pipe(packages.filter(['*', '!**/_*']))

      // Process jade templates
      .pipe(packages.jade({
        pretty: false,
        data: jadeData
      }))

      // Prettify HTML
      .pipe(packages.gulpif(
        !protoss.flags.isDev && !config.minify,
        packages.prettify({
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
      .pipe(packages.gulpif(
        !protoss.flags.isDev && config.minify,
        packages.htmlmin({
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true
        })
      ))

      // Save all the files
      .pipe(packages.gulp.dest(config.dest))

      .on('end', function() {
        notifier.success('Templates compiled');

        if(protoss.flags.isWatching)
          packages.browserSync.reload();

        cb(null); // End task

      });

  });
};
