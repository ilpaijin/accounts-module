modulejs.define 'initAccounts', [
	'Q',
	'CollectionAccounts',
	'ViewAccounts', 
	'ViewSchedaEdit'
], 
(
	Q,
	CollectionAccounts,
	ViewAccounts,
	ViewSchedaEdit
) ->

	collectionAccounts = new CollectionAccounts()

	ViewSchedaEdit.prototype.partials = [
		'Scheda'
		'Isolutions'
		'Documenti'
		'Callcenter'
		'Qpoints'
		'Gallery'
		'Assegni'
		'Qshop'
	]

	viewAccounts = new ViewAccounts
		collection: collectionAccounts
		el: '#lista-'+Q.paths.currentpage
		dataTableColumns: [
			'uid'
			'idutente'
			'padre'
			'ragione'
			'nome'
			'cognome'
			'comune'
			'provincia'
			'regione'
			'qshop'
		] 

	Router = Backbone.Router.extend
		initialize: ->
			@.collection = collectionAccounts
			@.route /(.+)/, "schedaAccount"	
			@.route /^tab-(.+)$/, "tabAccount"
			@

		schedaAccount: (r) ->
			@.listenTo @.collection, "reset" : -> 
				viewAccounts.openAccountTabScheda r	

		tabAccount: (r) ->
			r = r.split('-') # r[0] = tab, r[1] username
			@.listenTo @.collection, "reset" : -> 
				viewAccounts.openAccountTabScheda r[1], r[0]		

	router = new Router 	

	Backbone.history.start()	
