modulejs.define 'initUtenti', [
	'Q',
	'CollectionAccounts',
	'ViewUtenti', 
	'ViewSchedaEdit'
], 
(
	Q,
	CollectionAccounts,
	ViewUtenti,
	ViewSchedaEdit
) ->

	# collectionAccounts = new CollectionAccounts()

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
		# collection: collectionAccounts
		el: '#lista-'+Q.paths.currentpage
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
			# @.collection = collectionAccounts
			@.route /(.+)/, "schedaAccount"	
			@.route /^tab-(.+)$/, "tabAccount"
			@

		schedaAccount: (r) ->
			# console.info 'scehda'
			# console.info r
			# @.listenTo @.collection, "reset" : -> 
				# viewAccounts.openAccountTabScheda r	

		tabAccount: (r) ->
			# console.info 'tab'
			# console.info r
			r = r.split('-') # r[0] = tab, r[1] username
			# @.listenTo @.collection, "reset" : -> 
				# viewAccounts.openAccountTabScheda r[1], r[0]		

	router = new Router 	

	Backbone.history.start()	
