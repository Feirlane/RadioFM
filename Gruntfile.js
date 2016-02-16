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
				config: 'src/js/config.js',
				less: 'src/less/*.less',
				statics: 'src/assets/',
			},
			dest: {
				js: 'build/js/main.min.js',
				radio: 'build/js/radio.min.js',
				player: 'build/js/player.min.js',
				html: 'build/',
				lastfm: 'build/js/lastfm.min.js',
				config: 'build/js/config.min.js',
				css: 'build/css/style.css',
				statics: 'build/assets/',
			},
		},
		uglify: {
			js: {
				options: {
					separator: ';',
					screwIE8: true,
					compress: {},
					beautify: true,
				},
				files: {
					'<%= paths.dest.radio %>': ['<%= paths.src.radio %>'],
					'<%= paths.dest.player %>': ['<%= paths.src.player %>'],
					'<%= paths.dest.lastfm %>': ['<%= paths.src.lastfm %>'],
					'<%= paths.dest.config %>': ['<%= paths.src.config %>'],
				},
			},
		},
		less: {
			production: {
				options: {
					plugins: [
						new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
					],
					compress: true,
				},
				files: {
					'<%= paths.dest.css %>': '<%= paths.src.less %>',
				},
			}
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
			assets: {
				files: [
					{
						expand: true,
						cwd: '<%= paths.src.statics %>',
						src: ['**'],
						dest: '<%= paths.dest.statics %>',
					},
				],
			},
		},
		watch: {
			files: ['<%= paths.src.all %>'],
			tasks: ['copy', 'uglify', 'less'],
		},
	});

	grunt.registerTask('default', ['copy', 'uglify', 'less']);
};
