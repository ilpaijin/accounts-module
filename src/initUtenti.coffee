modulejs.define 'initUtenti', [
	'Q',
	'CollectionUtenti',
	'ViewUtenti', 
	'ViewSchedaEdit'
], 
(
	Q,
	CollectionUtenti,
	ViewUtenti,
	ViewSchedaEdit
) ->

	collectionUtenti = new CollectionUtenti()

	ViewSchedaEdit.prototype.partials = [
		'Scheda'
		'Isolutions'
		# 'Documenti'
		'Callcenter'
		'Qpoints'
		# 'Gallery'
		# 'Assegni'
		# 'Qshop'
	]

	viewAccounts = new ViewUtenti
		collection: collectionUtenti
		el: "#accounts-listautenti"
		dataTableColumns: [
			'uid'
			'idutente'
			'padre'
			# 'ragione'
			'nome'
			'cognome'
			'comune'
			'provincia'
			'regione'
			# 'qshop'
		] 

	Router = Backbone.Router.extend
		initialize: ->
			@.collection = collectionUtenti
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
