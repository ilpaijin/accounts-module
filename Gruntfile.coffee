module.exports = (grunt) ->

	#Project configuration
	grunt.file.setBase('../../../')
	
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		jasmine:
			app:
				src: [ 
					'htdocs/bundles/qoffice/js/admin.packed.min.js'
					'htdocs/bundles/qoffice/js/plugins/modulejs.js'
					"htdocs/bundles/qoffice/js/config.js"
					'htdocs/bundles/qoffice/js/accounts/src/app.js',
					'htdocs/bundles/qoffice/js/accounts/src/**/accounts.js'
					'htdocs/bundles/qoffice/js/accounts/spec/**/accounts.js'
				]
				options: 
					keepRunner: true
		clean_accounts:
			accounts: 
				src: [
					"htdocs/bundles/qoffice/js/accounts/build/accounts.*"
				]
		concat:
			options:
				separator: ' \n'
			accounts_js:
		  		src: [
		  			'htdocs/bundles/qoffice/js/config.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/models/*.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/collections/*.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/views/partials/partials.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/views/partials/!(partials)*.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/views/*.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/initAccounts.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/initFoglinotizia.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/app.coffee',
		  			'htdocs/bundles/qoffice/js/accounts/src/ui.coffee',
		  		]
		  		dest: 'htdocs/bundles/qoffice/js/accounts/build/accounts.concat.coffee'     
		  	# admin_css:
		  	# 	src: [
		  	# 		'htdocs/boo/assets/css/lib/bootstrap.css',
		  	# 		'htdocs/boo/assets/css/lib/bootstrap-responsive.css',
		  	# 		'htdocs/boo/assets/css/boo.min.css',
		  	# 		'htdocs/boo/assets/fonts/pack/font.css',
		  	# 		'htdocs/boo/assets/css/boo-coloring.min.css',
		  	# 		'htdocs/boo/assets/css/boo-utility.min.css',
		  	# 		'htdocs/boo/assets/css/style.css'
		  	# 	],
		  	# 	dest: "htdocs/bundles/qoffice/css/admin.css"	  
		coffee:
			accounts:
		        expand: true
		        cwd: 'htdocs/bundles/qoffice/js/accounts/build'
		        src: ["accounts.concat.coffee"]
		        dest: "htdocs/bundles/qoffice/js/accounts/build/"
		        ext: ".concat.js"
		uglify:
			options:
		  		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			accounts:
				files:
		  			'htdocs/bundles/qoffice/js/accounts/build/accounts.min.js' : ['htdocs/bundles/qoffice/js/accounts/build/accounts.concat.js']
		# cssmin:
		# 	options:
		#   		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		# 	adminfiles:
		# 		files: 
		# 			"htdocs/bundles/qoffice/css/admin.min.css" : ['htdocs/bundles/qoffice/css/admin.css']  				
		clean:
			accounts: 
				src: [
					"htdocs/bundles/qoffice/js/accounts/build/*.coffee",
					"htdocs/bundles/qoffice/js/accounts/src/**/*.js"
				] 			
		# replace:
		#     build_replace: 
		#     	options: 
		#     		variables: [
		#     			'ugly': '<%= ((new Date()).valueOf().toString()) + (Math.floor((Math.random()*1000000)+1).toString()) %>'
		#     		]
		#     	files: [
		#     		expand: true
		#     		flatten : true
		#     		src: ['build/ugly.js']
		#     		dest: 'build/'		
		#     	]	

	  
	# Load the plugin that provides the "uglify" task

	grunt.loadNpmTasks 'grunt-contrib-jasmine'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-cssmin'

	#Default task(s).
	grunt.registerTask 'default', ['clean', 'concat','coffee', 'uglify','clean']

	return