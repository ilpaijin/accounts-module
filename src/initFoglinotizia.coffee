modulejs.define 'initFoglinotizia', [
	'Q',
	'CollectionFoglinotizia',
	'ViewFoglinotizia', 
	'ViewSchedaEdit'
], 
(
	Q,
	CollectionFoglinotizia,
	ViewFoglinotizia,
	ViewSchedaEdit
) ->
	
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

	viewFoglinotizia = new ViewFoglinotizia
		collection: new CollectionFoglinotizia()
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