modulejs.define 'ViewPartialsIsolutions', [
	'Q'
	'ViewPartialsFactory'
], (Q,ViewPartialsFactory) ->
	ViewPartialsIsolutions = ViewPartialsFactory.extend
		initialize: ->
			@.init(@.options.active)
			
		setAjaxUrl: -> 
			Q.Accounts.paths.api + 'partial/'+@.options.name + '/'+@.options.model.id+'/'+Q.paths.currentpage

		render: ->
			@.$el.html @.templateTab 
				'account' : @.options.model.toJSON()

			return @