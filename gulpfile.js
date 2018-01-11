'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const spawn = require('child_process').spawn;
const minify = require('gulp-minifier');

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

let devServerMode = process.env.DEV_SERVER === '1';
let minifyMode = !devServerMode;

const path = {
	appRoot: './',
	build: './local/build/',
	source: './local/source/',
};

const sources = {
	vendor: {
		js: [
			// todo: make nicer include of that polyfill
			path.appRoot + 'node_modules/babel-polyfill/dist/polyfill.min.js',
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

gulp.task('js-vendor', () => {

	let stream = gulp.src(sources.vendor.js);

	if(minifyMode) {
		stream = stream.pipe(minify(minifyParams))
	}

	return stream.pipe(concat('vendor.js'))
		.pipe(gulp.dest(path.build));
});

gulp.task('css-vendor', () => {

	let stream = gulp.src(sources.vendor.css);

	if(minifyMode) {
		stream = stream.pipe(minify(minifyParams))
	}

	return stream.pipe(concat('vendor.css'))
		.pipe(gulp.dest(path.build));
});

gulp.task('js', () => {

	let stream = gulp.src(sources.js)
		.pipe(babel());

	if(minifyMode) {
		stream = stream.pipe(minify(minifyParams))
	}

	return stream.pipe(concat('main.js'))
		.pipe(gulp.dest(path.build));
});

gulp.task('css', () => {

	let stream = gulp.src(sources.scss)
		.pipe(sass());

	if(minifyMode) {
		stream = stream.pipe(minify(minifyParams))
	}

	return stream.pipe(concat('main.css')).
		pipe(gulp.dest(path.build));
});

gulp.task('watch', () => {
	gulp.watch(sources.vendor.js, ['js-vendor']);
	gulp.watch(sources.vendor.css, ['css-vendor']);
	gulp.watch(sources.js, ['js']);
	gulp.watch(sources.scss, ['css']);
});

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

gulp.task('build', ['js-vendor', 'css-vendor', 'js', 'css']);