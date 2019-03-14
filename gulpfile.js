var gulp          = require('gulp'), // Подключаем Gulp
	sass          = require('gulp-sass'),	// Подключаем Sass пакет
	browserSync   = require('browser-sync'), // Подключаем Browser Sync
	concat        = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify        = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
	cleancss      = require('gulp-clean-css'), // Подключаем пакет для минификации CSS
	rename        = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
	autoprefixer  = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
	notify        = require('gulp-notify'),	// Подключаем библиотеку для опопвещения об ошибках в .scss файлах
	del           = require('del'); // Подключаем библиотеку для удаления файлов и папок

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('app/scss/**/*.scss')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 5 versions']))
	.pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/js/common.js', // Always at the end
	])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('clean', async function() {
	return del.sync('dist'); // Удаляем папку dist перед сборкой
});


/**
 * если используем 'img' таск, добавить его в таск 'build'
 */
// gulp.task('img', function() {
// 	return gulp.src('app/img/**/*') // Берем все изображения из app
// 		.pipe(cache(imagemin({ // С кешированием
// 		// .pipe(imagemin({ // Сжимаем изображения без кеширования
// 			interlaced: true,
// 			progressive: true,
// 			svgoPlugins: [{removeViewBox: false}],
// 			use: [pngquant()]
// 		}))/**/)
// 		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
// });
gulp.task('prebuild', async function() {

	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'app/css/main.min.css'
	])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('dist/fonts'))

	var buildJs = gulp.src('app/js/scripts.min.js') // Переносим скрипты в продакшен
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
	.pipe(gulp.dest('dist'));

	var buildImages = gulp.src('app/img/**/*') // Переносим images в продакшен
	.pipe(gulp.dest('dist/img'));

});

gulp.task('watch', function() {
	gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.html', gulp.parallel('code'))
});

gulp.task('default', gulp.parallel('styles', 'scripts', 'browser-sync', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'styles', 'scripts'));