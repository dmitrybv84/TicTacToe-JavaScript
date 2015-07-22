module.exports = function (grunt) {

	var watchTaskJSFiles = [],
		watchTaskSCSSFiles = [];
	
	var jsFiles = ['app/js/**/*.js'],
		scssFiles = ['app/scss/**/*.scss'];
	
	//// concat JS files for watch task
	//for (var prop in jsFiles) {
	//	if (jsFiles.hasOwnProperty(prop)) {
	//		watchTaskJSFiles.push(jsFiles[prop]);
	//	}
	//}
	//
	//// concat SCSS files for watch task
	//for (var prop in scssFiles) {
	//	if (scssFiles.hasOwnProperty(prop)) {
	//		watchTaskSCSSFiles.push(scssFiles[prop]);
	//	}
	//}
	
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
	    // Watch task config
	    watch: {
	      sass: {
	        files: scssFiles,
	        tasks: ['sass']
	      },
	      scripts : {
    	  	files : jsFiles,
	      	tasks : ['uglify']
	      }
	    },
	    // SASS task config
	    sass: {
	        dev: {
	            files: [{
	            	src 	: scssFiles,
	            	dest	: "app/build/css/demo-app.min.css"
	            }],
	            options: {
			    	style: 'compressed'
			    }
	        }
	    },
	    uglify: {
		    options: {
		    	compress	: true
		    	//beautify	: true
		    },
		    dev: {
		      files: [{
		      	src 	: jsFiles,
		      	dest	: 'app/build/js/demo-app.min.js'
		      }]
		    }
		  }
	});

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('myuglify', ['uglify']);
};