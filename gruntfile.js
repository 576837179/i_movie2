module.exports = function(grunt){
	
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true //当文件改动会重新启动服务
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
//			uglify: {
//		        files: ['public/**/*.js'],
//		        tasks: ['jshint'],
//		        options: {
//		          livereload: true
//		        }
//		    },
//	        styles: {
//		        files: ['public/**/*.less'],
//		        tasks: ['less'],
//		        options: {
//		            nospawn: true
//		        }
//		    }
		},
		
		jshint: {
			options: {
				jshintrc: '.jshintrc',
        		ignores: ['public/libs/**/*.js']
			},
			all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},
		
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 3
				},
				files: {
					'public/build/index.css': 'public/less/index.less'
				}
			}
		},
		
		uglify: {
			development: {
				files: {
					'public/build/admin.min.js': 'public/js/admin.js',
					'public/build/detail.min.js': [
						'public/js/detail.js'
					]
				}
			}
		},
		
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
                	args: [],
                	nodeArgs: ['--debug'],
                	ignore: ['README.md', 'node_modules/**', '.DS_Store'],
                	ext: 'js',
                	watch: ['./'],
                	delay: 1000,
                	env: {
                    	PORT: '3000'
                	},
                	cwd: __dirname
          		}
			}
		},
		
		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},
		
		concurrent: {
			tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
			options: {
				logConcurrentOutput: true,
				limit: 5
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');//监听文件增删改，重新执行任务
	grunt.loadNpmTasks('grunt-nodemon');      //实时监听app.js
	grunt.loadNpmTasks('grunt-concurrent');   //监控慢任务SASS LESS 等
	grunt.loadNpmTasks('grunt-mocha-test');   //单元测试
	grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
	
	grunt.option('force', true);  //开发时不因为语法错误或警告而中断整个grunt服务
	
	//注册
	grunt.registerTask('default', ['concurrent']);
	
	grunt.registerTask('test', ['mochaTest']);
}
