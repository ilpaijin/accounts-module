modulejs.define 'CollectionAccounts', [
	'Q'
	'Backbone'
	'ModelAccounts'
], (Q,Backbone, ModelAccounts) ->

	CollectionAccounts = Backbone.Collection.extend
		model: ModelAccounts
		url: location.origin + "/qoffice/api/accounts/lista/" + Q.paths.currentpage
		initialize: ->
			@.fetch reset: true	
			return