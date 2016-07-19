const gulp = require('gulp');
const concat = require('gulp-concat');
const less = require('gulp-less');

const config = {
  modules: './node_modules/'
};

const vendorJs = [
  config.modules + 'angular/angular.js',
  config.modules + 'angular-resource/angular-resource.js',
  config.modules + 'angular-route/angular-route.js',
  config.modules + 'bootstrap/dist/js/bootstrap.js'
];

const vendorCss = [
  config.modules + 'bootstrap/dist/css/bootstrap.css'
];

gulp.task('vendorJs', () => {
  return gulp.src(vendorJs)
             .pipe(concat('vendor.js'))
             .pipe(gulp.dest('./public'));
});

gulp.task('vendorCss', () => {
  return gulp.src(vendorCss)
             .pipe(concat('vendor.css'))
             .pipe(gulp.dest('./public'));
});

gulp.task('js', () => {
  return gulp.src(['./public/app/**/*.module.js','./public/app/**/*.js'])
             .pipe(concat('main.js'))
             .pipe(gulp.dest('./public'));
});

gulp.task('css', () => {
  return gulp.src('./public/app/main.less')
             .pipe(less())
             .pipe(gulp.dest('./public'));
});

gulp.task('watchJs', ['js'], () => {
  gulp.watch('./public/app/**/*.js', ['js']);
});

gulp.task('watchLess', ['css'], () => {
  gulp.watch('./public/app/**/*.less', ['css']);
});
 
gulp.task('default', ['vendorJs', 'vendorCss', 'watchJs', 'watchLess']);