const gulp       = require('gulp');
const include    = require('gulp-file-include');
const typescript = require('gulp-typescript');


const folder = {
  include : {
    html : 'src/app/html/*.html',
    css  : 'src/app/css/*.css',
    js   : 'src/app/js/*.js',
    svg  : 'src/app/img/*.svg',
    dest : 'build/app/'
  },
  tsApp  : {
    src  : 'src/ts/*.ts',
    dest : 'src/js/'
  },
  tsNode : {
    src  : 'src/*.ts',
    dest : 'build/'
  }
}

gulp.task('default', () => {
  gulp.watch(folder.include.html, ['include']);
  gulp.watch(folder.include.css,  ['include']);
  gulp.watch(folder.include.js,   ['include']);
  gulp.watch(folder.tsApp.src,    ['compile']);
  gulp.watch(folder.tsNode.src,   ['compile']);
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
