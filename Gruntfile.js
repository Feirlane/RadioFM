module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		paths: {
			src: {
				all: 'src/**',
				js: 'src/js/**/*.js',
				radio: 'src/js/radio/*.js',
				player: 'src/js/player/*.js',
				html: 'src/',
				lastfm: 'src/js/lastfm/*.js',
			},
			dest: {
				js: 'build/js/main.min.js',
				radio: 'build/js/radio.min.js',
				player: 'build/js/player.min.js',
				html: 'build/',
				lastfm: 'build/js/lastfm.min.js',
			},
		},
		uglify: {
			js: {
				options: {
					separator: ';',
					screwIE8: true,
					/*
					compress: {
						drop_console: false,
					},*/
					compress: false,
					beautify: true,
				},
				files: {
					'<%= paths.dest.radio %>': ['<%= paths.src.radio %>'],
					'<%= paths.dest.player %>': ['<%= paths.src.player %>'],
					'<%= paths.dest.lastfm %>': ['<%= paths.src.lastfm %>'],
				},
			},
		},
		less: {

		},
		copy: {
			html: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.src.html %>',
						src: ['*.html'],
						dest: '<%= paths.dest.html %>',
						filter: 'isFile'
					},
				],
			},
		},
		watch: {
			files: ['<%= paths.src.all %>'],
			tasks: ['copy', 'uglify'],
		},
	});

	grunt.registerTask('default', ['copy', 'uglify']);
};
