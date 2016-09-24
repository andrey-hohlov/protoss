const del = require('del');

protoss.gulp.task('protoss/del', function(cb) {
  del(protoss.config.del, {dot: true});
  cb(null);
});
