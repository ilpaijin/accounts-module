modulejs.define 'ViewPartialsCallcenter', [
	'Q'
	'jquery'
	'ViewPartialsFactory'
], (Q,$,ViewPartialsFactory) ->
	ViewPartialsCallcenter = ViewPartialsFactory.extend
		events:
			"click .openModal": "openModal"

		initialize: ->
			@.init(@.options.active)
		
		render: ->
			
			@.$el.html @.templateTab 
				'account' : @.options.model.toJSON()
			@.renderDataTable()
			return 

		renderDataTable: ->
			@.table = @.$el.find('#datatable-account-' + @.options.model.get('idutente') + '-callcenter').dataTable
				aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]]
				iDisplayLength: 20
				aaData: @.model.toJSON().callcenter
				bDeferRender: true
				bRetrieve: true
				bIgnoreEmpty: false
				oColumnFilterWidgets:
				  "aiExclude": [0]
				aoColumns: do ->
					aNewData = [
						{'mData': (data, objs) -> '<a class="btn btn-mini btn-yellow openModal" data-toggle="modal" rel="' + data.id + '-' + data.idutente + '" href="#' + data.id + '"><i class="fontello-icon-accounts-callcenter"></i>modifica</a>'},
						{'mData': (data) -> data.dataora},
						{'mData': (data) -> data.user.username},
						{'mData': (data) -> 
							if not data.esito
								label = 'warning'
								txt = 'manca esito'
							else
								txt =  data.esito
								if data.esito is 'Positivo'
							        label = "success"
							    else 
							        label =  "important"
							"<span class='label label-" + label + "' />" + txt + '</span>'},
						{'mData': (data) -> if data.descrizione then data.descrizione else ''}
					]
					aNewData;
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
			return

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
		    			# d.id = parseInt(d.id)
		    			if d
		    				$(e.currentTarget).siblings('.close').click()
		    				me.addOrModifyItem(d)
		    			return
		    	return	
		    , 100
		    return 		

		addOrModifyItem: (d) ->
			currentSet = @.options.model.get @.options.name
			updated = _.reject currentSet, (item) ->
				return item.id is d.id
			updated.push d	

			@.options.model.set @.options.name, updated
			@.refreshTable()

		refreshTable: ->
			sett = @.table.fnSettings()
			sett.aaData = @.options.model.attributes.callcenter
			@.table.fnReloadAjax(sett)
			return 	