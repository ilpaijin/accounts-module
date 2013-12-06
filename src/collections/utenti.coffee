modulejs.define 'CollectionUtenti', [
	'Q'
	'Backbone'
	'ModelAccounts'
], (Q,Backbone, ModelAccounts) ->

	CollectionAccounts = Backbone.Collection.extend
		model: ModelAccounts
