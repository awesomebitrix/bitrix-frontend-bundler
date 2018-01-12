'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const spawn = require('child_process').spawn;
const minify = require('gulp-minifier');
const sourceMaps = require('gulp-sourcemaps');

/* ---------------- PARAMS -------------------- */

const minifyParams = {
	minify: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	minifyJS: true,
	minifyCSS: true,
	getKeptComment: function (content, filePath) {
		var m = content.match(/\/\*![\s\S]*?\*\//img);
		return m && m.join('\n') + '\n' || '';
	}
};

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
		path.source + 'scss/**/*.scss'
	],
};

/* ---------------- FUNCTIONS -------------------- */

function onStreamError(error) {
	console.error(error.messageOriginal);
	this.emit('end');
}

function initStream(stream) {

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.init());
	}

	return stream;
}

function finishStream(stream) {

	stream.on('error', onStreamError);

	if(sourceMapsMode) {
		stream = stream.pipe(sourceMaps.write(path.maps));
	}

	if(minifyMode) {
		stream = stream.pipe(minify(minifyParams))
	}

	return stream.pipe(gulp.dest(path.build));
}

/* ---------------- MAIN JS -------------------- */

gulp.task('js-main', () => {

	let stream = gulp.src(sources.js);

	stream = initStream(stream)
		.pipe(babel())
		.pipe(concat('main.js'));

	return finishStream(stream);
});

/* ---------------- MAIN CSS -------------------- */

gulp.task('css-main', () => {

	let stream = gulp.src(sources.scss);
	
	stream = initStream(stream)
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat('main.css'));

	return finishStream(stream);
});

/* ---------------- VENDOR JS -------------------- */

gulp.task('js-vendor', () => {

	let stream = gulp.src(sources.vendor.js);

	stream = initStream(stream)
		.pipe(concat('vendor.js'));

	return finishStream(stream);
});

/* ---------------- VENDOR CSS -------------------- */

gulp.task('css-vendor', () => {

	let stream = gulp.src(sources.vendor.css);

	stream = initStream(stream)
		.pipe(concat('vendor.css'));

	return finishStream(stream);
});

/* ---------------- WATCHER -------------------- */

gulp.task('watch', () => {
	gulp.watch(sources.vendor.js, ['js-vendor']);
	gulp.watch(sources.vendor.css, ['css-vendor']);
	gulp.watch(sources.js, ['js-main']);
	gulp.watch(sources.scss, ['css-main']);
});

/* ---------------- BUILD -------------------- */

gulp.task('build', ['js-main', 'css-main', 'js-vendor', 'css-vendor']);

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