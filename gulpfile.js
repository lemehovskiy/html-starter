var 	gulp         = require('gulp'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss    = require('gulp-uglifycss'),
        uglify       = require('gulp-uglify'),
        rename       = require('gulp-rename'),
        concat       = require('gulp-concat'),
        sass         = require('gulp-sass'),
        plumber      = require('gulp-plumber'),
        notify       = require('gulp-notify'),
        streamqueue  = require('streamqueue'),
        clone = require('gulp-clone'),
        sourcemaps   = require('gulp-sourcemaps'),
        merge = require('merge-stream'),
        importCss = require('gulp-import-css'),
        watch = require('gulp-watch'),
        nunjucksRender = require('gulp-nunjucks-render'),
        data = require('gulp-data');


// define the default task and add the watch task to it
gulp.task('default', ['watch']);

gulp.task('styles', function () {

    gulp.task('styles', function () {
        return gulp.src('./src/css/style.scss')
            .pipe(plumber({
                errorHandler: notify.onError("Error: <%= error.message %>")
            }))
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 10 versions'],
                cascade: false
            }))
            .pipe(importCss())
            .pipe(rename({ suffix: '.min' }))
            .pipe(minifycss())
            .pipe(gulp.dest('./build/css'))
            .pipe(notify("Styles task complete"));
    });

});

gulp.task('vendorsJs', function() {
    return streamqueue({ objectMode: true },
        gulp.src('./src/js/vendor/jquery.js')

    )
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./build/js'))
        .pipe(notify("Vendor script task complete"));
});


gulp.task('scriptsJs', function() {
    return streamqueue({ objectMode: true },
        gulp.src('./src/js/custom/custom.js')
    )
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(concat('custom.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build/js'))
        .pipe(notify("Custom script task complete"))
});


gulp.task('nunjucks', function() {
    return gulp.src('src/html/pages/**/*.+(html|nunjucks)')
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        
        .pipe(data(function() {
            delete require.cache[require.resolve('./src/pages.json')];
            return require('./src/pages.json')
        }))
        .pipe(nunjucksRender({
            path: ['src/html/templates']
        }))
        .pipe(gulp.dest('./'))

        .pipe(notify("NUNJUCKS task complete"))
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['styles', 'vendorsJs', 'scriptsJs', 'nunjucks'], function() {
    gulp.watch('src/css/**/*.scss', ['styles']);
    gulp.watch('src/js/vendor/*.js', ['vendorJs']);
    gulp.watch('src/js/custom/*.js', ['scriptsJs']);
    gulp.watch('src/html/**/*.nunjucks', ['nunjucks']);
    gulp.watch('src/*.json', ['nunjucks']);
});