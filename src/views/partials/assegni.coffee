modulejs.define 'ViewPartialsAssegni', [
	'Q'
	'jquery'
	'ViewPartialsFactory'
], (Q,$,ViewPartialsFactory) ->
	ViewPartialsAssegni = ViewPartialsFactory.extend
		initialize: ->
			@.init(@.options.active)

		setAjaxUrl: -> 
			Q.Accounts.paths.api + 'partial/'+@.options.name + '/'+@.options.model.id+'/'+Q.paths.currentpage


		# events:
		# 	"click .openModal": "openModal"

		render: ->
			me = @
			@.$el.children('div').html @.templateTab 
				'account' : @.options.model.toJSON()

			# @.renderDataTable()
			# 
			@.$el.find('.fileupload').each ->
				$(@).fileupload
					maxFileSize: 3145728
					limitMultiFileUploads: 5
					acceptFileTypes: /(\.|\/)(pdf|docx|doc|rtf|txt|gif|jpe?g|png)$/i
					submit: (e, data) ->
						me.loaded = false
						return

			@.$el.on 'click','.accounts-elimina-file', (e) ->
				e.preventDefault()

				if not confirm 'Sei sicuro?' then return false;
				
				$(e.currentTarget).parents('li').detach()

				$.ajax
					url: $(e.currentTarget).attr('href')
					type: 'DELETE'
					success: (result) ->				
						return		

			return @