modulejs.define 'ViewPartialsQpoints', [
	'Q'
	'jquery'
	'ViewPartialsFactory'
], (Q,$,ViewPartialsFactory) ->
	ViewPartialsQpoints = ViewPartialsFactory.extend
		initialize: ->
			@.init(@.options.active)

		events:
			"click .openModal": "openModal"

		render: ->
			@.$el.html @.templateTab 
				'account' : @.options.model.toJSON()
				'lastMovement': @.options.model.get('qpoints')[0]
			@.renderDataTable()
			return 

		renderDataTable: ->
			@.table = @.$el.find('#datatable-account-' + @.options.model.get('idutente') + '-qpoints').dataTable
				aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]]
				iDisplayLength: 20
				aaData: @.model.toJSON().qpoints
				bDeferRender: true
				bRetrieve: true
				bIgnoreEmpty: false
				oColumnFilterWidgets:
					"aiExclude": [0]
				aoColumns: do ->
					aNewData = [
						{'mData': (data, objs) -> '<a class="btn btn-mini btn-yellow openModal" data-toggle="modal" rel="' + data.idtransazione + '-' + data.idutente + '" href="#' + data.idtransazione + '"><i class="fontello-icon-accounts-qpoints"></i>modifica</a>'}, 
						{'mData': (data) -> data.dataora},
						{'mData': (data) -> data.operatore.username},
						{'mData': (data) -> 
							if not data.causali	
								label = 'important'
								txt = 'manca causale'
							else
								txt =  data.causali.descrizione
								if data.causali.idcausale is '2'
							        label = "success"
							    else 
							        label =  "info"

							"<span class='label label-" + label + "' />" + txt + '</span>'},
						{'mData': (data) -> data.movimenti },
						{'mData': (data) -> data.saldo },
						{'mData': (data) -> if data.descrizione then data.descrizione else '' }
					]
					aNewData
				oLanguage: 
					sInfoEmpty: "0 record trovati"
					sInfoFiltered: "(filtrati su un totale di _MAX_)"
					sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali"
					sSearch: "Global search: "
					sLengthMenu: "Mostra _MENU_ risultati"
					sZeroRecords: 'Nessun record trovato'
				bSortCellsTop: true
				aaSorting: [[1, 'desc']]
				sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"
			.columnFilter sPlaceHolder: 'head:after'

		openModal: (e) ->
			me = @
			target = @.$el.find('.ajaxModalTarget')

			$('.ajaxModalTarget').empty()
			$('body').modalmanager('loading')

			target.load Q.Accounts.paths.api + @.options.name + '/' + $(e.currentTarget).attr('rel'),'', (e) ->
				target.modal().css 'margin-top' : '0px'
				$('body').delegate '.ajaxModalSave', 'click', (e) ->
					me.saveDataFromModal(e)
				return
			return

		saveDataFromModal: (e) ->
			$('body').undelegate '.ajaxModalSave', 'click'
			me = @
			target = $(e.currentTarget).parents('.ajaxModalTarget')
			target.modal('loading')

			setTimeout ->
		    	$.ajax
		    		url: Q.Accounts.paths.api + me.options.name
		    		type: 'POST'
		    		data: target.find('form').serialize()
		    		success: (ev) ->
		    			d = JSON.parse(ev).saved
		    			# d.idtransazione = parseInt(d.idtransazione)
		    			if d
		    				$(e.currentTarget).siblings('.close').click()
		    				me.addOrModifyItem(d)
		    			return
		    	return	
		    , 100
		    return 		

		addOrModifyItem: (d) ->
			currentSet = @.options.model.get @.options.name
			updated = _.reject currentSet, (item,index,ctx) ->
				return item.idtransazione is d.idtransazione

			exists = currentSet.length > updated.length

			updated.push d	
			@.options.model.set @.options.name, updated

			if not exists then @.updateUIAttuali(d)
			@.refreshTable()

		refreshTable: ->
			sett = @.table.fnSettings()
			sett.aaData = @.options.model.attributes[@.options.name]
			@.table.fnReloadAjax(sett)
			return 	

		updateUIAttuali: (d) ->
			positiveSign = d.movimenti > 0
			target = @.$el.find('.statistic-values')
			target.find('span.balance').html(d.saldo)
			movement = @.$el.find('.movement')
			movement.removeClass('positive negative').addClass('movement '+(if positiveSign then 'positive' else 'negative'))
			movement.find('.indicator').removeClass('fontello-icon-up-dir fontello-icon-down-dir').addClass( if positiveSign then 'fontello-icon-up-dir' else 'fontello-icon-down-dir')
			movement.find('sup').html(d.movimenti)
			return	