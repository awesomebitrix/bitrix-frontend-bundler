'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const spawn = require('child_process').spawn;
const sourceMaps = require('gulp-sourcemaps');
const uglifyJs = require('gulp-uglify-es').default;
const cleanCss = require('gulp-clean-css');

/* ---------------- PARAMS -------------------- */

const devServerMode = process.env.DEV_SERVER == '1';
const minifyMode = !devServerMode;
const sourceMapsMode = devServerMode;

/* ---------------- PATHS -------------------- */

const path = {
	build: 'local/build/',
	source: 'local/source/',
	maps: './'
};

const sources = {
	vendor: {
		js: [
			// todo: make nicer include of that polyfill
			'node_modules/babel-polyfill/dist/polyfill.min.js',
			path.source + 'vendor/js/**/*.js'
		],
		css: [
			path.source + 'vendor/css/**/*.css'
		],
	},

	js: [
		path.source + 'js/**/*.js'
	],

	scss: [
		path.source + 'scss/[^_]*.scss'
	],
};

/* ---------------- FUNCTIONS -------------------- */

function onStreamError(error) {
	console.error(error);
	this.emit('end');
}

let prepareJsStream = (stream) => {

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.init());
	}

	return stream;
};

let finishJsStream = (stream) => {

	if(minifyMode) {
		stream = stream.pipe(uglifyJs());
	}

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.write(path.maps));
	}

	return stream.pipe(gulp.dest(path.build));
};

let prepareCssStream = (stream) => {

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.init());
	}

	return stream;
};

let finishCssStream = (stream) => {

	if(minifyMode) {
		stream = stream.pipe(cleanCss());
	}

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.write(path.maps));
	}

	return stream.pipe(gulp.dest(path.build));
};

/* ---------------- MAIN JS -------------------- */

gulp.task('js-main', () => {

	let stream = gulp.src(sources.js);

	stream = prepareJsStream(stream)
		.pipe(concat('main.latest.js'))
		.on('error', onStreamError);

	return finishJsStream(stream);
});

/* ---------------- MAIN JS (BABELED ES5 FALLBACK) -------------------- */

gulp.task('js-fallback', () => {

	let stream = gulp.src(sources.js);

	stream = prepareJsStream(stream)
		.pipe(concat('main.es5.js'))
		.pipe(babel())
		.on('error', onStreamError);

	return finishJsStream(stream);
});

/* ---------------- VENDOR JS -------------------- */

gulp.task('js-vendor', () => {

	let stream = gulp.src(sources.vendor.js);

	stream = prepareJsStream(stream)
		.pipe(concat('vendor.js'))
		.on('error', onStreamError);

	return finishJsStream(stream);
});

/* ---------------- MAIN CSS -------------------- */

gulp.task('css-main', () => {

	let stream = gulp.src(sources.scss);
	
	stream = prepareCssStream(stream)
		.pipe(concat('main.css'))
		.pipe(sass({
			errLogToConsole: true
		}))
		.on('error', onStreamError);

	return finishCssStream(stream);
});

/* ---------------- VENDOR CSS -------------------- */

gulp.task('css-vendor', () => {

	let stream = gulp.src(sources.vendor.css);

	stream = prepareCssStream(stream)
		.pipe(concat('vendor.css'));

	return finishCssStream(stream);
});

/* ---------------- BUILD + WATCHER with reloading -------------------- */

gulp.task('serve', () => {

	let process;

	let startGulp = (e) => {
		if(process) {
			process.kill();
		}

		process = spawn('gulp', ['build', 'watch'], {
			stdio: 'inherit'
		});
	};

	gulp.watch('gulpfile.js', startGulp);

	startGulp();
});

/* ---------------- WATCHER -------------------- */

gulp.task('watch', () => {
	gulp.watch(sources.js, ['js-main', 'js-fallback']);
	gulp.watch(sources.scss, ['css-main']);
	gulp.watch(sources.vendor.js, ['js-vendor']);
	gulp.watch(sources.vendor.css, ['css-vendor']);
});

/* ---------------- BUILD -------------------- */

gulp.task('build', ['js-main', 'js-fallback', 'js-vendor', 'css-main', 'css-vendor']);