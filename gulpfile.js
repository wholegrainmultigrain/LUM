var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var browserify = require('gulp-browserify');
var imagemin = require('gulp-imagemin');
var reload = browserSync.reload;



// ------------------------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css/'));
});

// ------------------------------------------------------------------------
gulp.task('js', function() {
  gulp.src('src/js/main.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./app/js/'))
});

// ------------------------------------------------------------------------
// use this task to copy bower components into app/js
gulp.task('copy', function () {
//  gulp.src('./bower_components/howler.js/howler.min.js').pipe(gulp.dest('./app/js'));
});


// ------------------------------------------------------------------------
// use this task to compress and copy images over to app/images
gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .pipe(gulp.dest('app/images'));
});

// ------------------------------------------------------------------------
gulp.task('serve', function() {
    browserSync.init({
        server: {
        	index: "index.html",
          baseDir: "./app"
        },
    });
    gulp.watch(['*.html', 'css/**/*.css', 'js/*.js'], {cwd: 'app'}, reload);
});

// ------------------------------------------------------------------------
gulp.task('watch', function () {
  gulp.watch('./src/js/*.js', ['js']);
  gulp.watch('./src/sass/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'js', 'copy']);
