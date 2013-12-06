modulejs.define 'ViewUtenti', [
    'Q'
    'jquery'
    'Backbone'
    'ViewSchedaEdit'
    'ViewTabMenuSchede'
], (Q,$,Backbone,ViewSchedaEdit, ViewTabMenuSchede) ->

    ViewAccounts = Backbone.View.extend
        events: 
            'click .aprischeda': 'openAccountTabScheda'
            'submit #formlistautenti': 'drawDataTable'

        initialize: ->
            _.bindAll @, 'render'
            @.renderDataTable()
            @.TabMenu = new ViewTabMenuSchede({collection: @.collection})

            return

        render: ->
            @.renderDataTable()
            @

        renderDataTable: ->
            self = @
            @.OdataTable = $(@.el).find('#lista-utenti').dataTable
                aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]]
                iDisplayLength: 20
                bProcessing: true,
                bServerSide: true,
                sAjaxSource: "/qoffice/api/accounts/dataTable/utenti"
                fnServerData: (sSource, aoData, fnCallback, oSettings) ->
                    aoData.push 
                        "name": "utente", 
                        "value": $(self.el).find('input[name=utente]').val()
                    aoData.push 
                        "name": "padre", 
                        "value": $(self.el).find('input[name=padre]').val()    
                    $.getJSON sSource, aoData, (json) ->
                        self.validateForm self.el, json
                        self.collection.add(json.aaData)
                        fnCallback json

                bDeferRender: false
                bRetrieve: true
                bIgnoreEmpty: false
                aoColumns: do ->
                    aNewData = [
                        {'mData': (data, objs) ->
                            reg = ''
                            menuaddition = ''

                            if not data.accounts
                                reg = "<span class='fontello-icon-attention' style='padding-left:5px;'></span>"

                            if Q.paths.realm is "developer" or Q.paths.realm is 'amministrazione'
                                if data.accounts
                                    if data.accounts.nascosto is 'si'
                                        nascosto_class = 'active" style="opacity:0.3"'
                                        nascosto_label = 'nascosto'
                                        nascosto_value = 'no'
                                    else 
                                        nascosto_class = '"'
                                        nascosto_label = 'nascondi'
                                        nascosto_value = 'si'

                                    nascosto = if data.accounts.nascosto is 'si' then '<span class=>nascosto</span>' else '<span>nascondi</span>'
                                    
                                    if data.accounts.tipoutente isnt "Utente"        
                                        menuaddition = '<a target="_blank" class="btn btn-mini btn-red ' + nascosto_class + ' href="' + Q.Accounts.paths.api + 'nascosto/' + nascosto_value + '/' + data.idutente + '">' + nascosto_label + '</a>'
                                
                            '<a class="btn btn-mini btn-yellow aprischeda" rel="' + (if typeof data.uid isnt 'undefined' then data.uid else data.ragione) + '" href="#' + data.uid + '"><i class="fontello-icon-accounts-scheda"></i>Vedi</a>' + reg + menuaddition
                            },
                        {'mData': (data) -> if data.idutente then data.idutente else '' },
                        {'mData': (data) -> if data.uid then data.uid else '' },
                        {'mData': (data) -> if data.padre and data.padre.uid then data.padre.uid else ''},
                        {'mData': (data) -> if data.nome then data.nome else ''},
                        {'mData': (data) -> if data.cognome then data.cognome else '' },
                        {'mData': (data) -> if data.accounts and data.accounts.comune isnt '' then data.accounts.comune else data.citta},
                        {'mData': (data) -> if data.accounts and data.accounts.provincia isnt '' then data.accounts.provincia else data.provincia},
                        {'mData': (data) -> if data.accounts and data.accounts.regione isnt '' then data.accounts.regione else data.regione},
                    ]
                    aNewData;
                oLanguage:
                    sInfoEmpty: "0 record trovati"
                    sInfoFiltered: ""
                    sInfo: "Visualizzi da _START_ a _END_ di _TOTAL_ totali"
                    sSearch: "Global search: "
                    sLengthMenu: "Mostra _MENU_ risultati"
                    sZeroRecords: 'Nessun record trovato'
                bSortCellsTop: true
                aaSorting: [[2, 'asc']]
                sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"

        updateDataTable: ->
            @.OdataTable.fnSettings().aaData = @.collection.toJSON()
            @.OdataTable.fnReloadAjax(@.OdataTable.fnSettings())
            return

        drawDataTable: (e)->
            e.preventDefault()
            @.validateForm(e.currentTarget)
            @.OdataTable.fnDraw()

        validateForm: (el, json = false) ->
            inputs = $(el).find('input[type="text"]')

            for input in inputs
                $(input).parents('div').next('.label').text('')

                if input.value.length > 0 && input.value.length < 4
                    $(input).parents('div').next('.label').text('FILTRO NON PROCESSATO: ricerca inferiore a 4 caratteri')
                if json
                    if input.value.length > 0 && !json.query[input.name]
                        $(input).parents('div').next('.label').text('FILTRO NON PROCESSATO: nessun valore trovato')

        openAccountTabScheda: (e, tab) ->
            if e.currentTarget 
                el =  
                    id = $(e.currentTarget).attr('href').slice 1 #comes from event
            else 
                id = e  # comes as text  
            
            instance = 'tabScheda-' + id

            if Q.Accounts.Instances[instance]? 
                Q.Accounts.Instances[instance].view.setActive();
                return;
            
            Q.Accounts.Instances[instance] = 
                view: new ViewSchedaEdit
                    el: '#' + instance
                    uid: id
                    viewAccounts: @
                    collection: @.collection
                    tabActive: tab
            return  