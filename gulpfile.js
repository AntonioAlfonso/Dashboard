const gulp    = require('gulp');
const include = require('gulp-file-include');
const typescript = require('gulp-typescript');


const folder = {
  include : {
    html : 'src/app/*.html',
    css  : 'src/app/*.css',
    js   : 'src/app/*.js',
    svg  : 'src/app/*.svg',
    dest : 'build/app/'
  },
  ts      : {
    src  : 'src/*.ts',
    dest : 'build/'
  }
}

gulp.task('default', () => {
  gulp.watch(folder.include.html, ['include']);
  gulp.watch(folder.include.css,  ['include']);
  gulp.watch(folder.include.js,   ['include']);
  gulp.watch(folder.ts.src,       ['compile']);
});

gulp.task('include', () => {
  return gulp.src([folder.include.html])
  .pipe(include({
    prefix   : '@@',
    basepath : '@file'
  }))
  .pipe(gulp.dest(folder.include.dest));
});

gulp.task('compile', () => {
  return gulp.src(folder.ts.src)
    .pipe(typescript())
    .pipe(gulp.dest(folder.ts.dest))
})
