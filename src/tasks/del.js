import del from 'del';

protoss.gulp.task('protoss/del', (cb) => {
  del(protoss.config.del, { dot: true }).then(() => {
    cb(null);
  });
});
