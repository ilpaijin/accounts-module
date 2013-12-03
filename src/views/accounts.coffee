modulejs.define 'ViewAccounts', [
    'Q'
    'jquery'
    'Backbone'
    'ViewSchedaEdit'
    'ViewTabMenuSchede'
], (Q,$,Backbone,ViewSchedaEdit, ViewTabMenuSchede) ->

    ViewAccounts = Backbone.View.extend
        events: 
            'click .aprischeda': 'openAccountTabScheda'

        initialize: ->
            _.bindAll @, 'render', 'addMapButton', 'mapView', 'renderInMap'
            @.listenTo @.collection, "reset" : -> @.renderDataTable()

            @.TabMenu = new ViewTabMenuSchede({collection: @.collection})

            return

        render: ->
            @.renderDataTable()
            @

        renderDataTable: ->
            self = @
            @.OdataTable = $(@.el).dataTable
                aLengthMenu: [[20, 50, 100, -1], [20, 50, 100, "All"]]
                iDisplayLength: 20
                aaData: @.collection.toJSON()
                bDeferRender: false
                bRetrieve: true
                bIgnoreEmpty: false
                oColumnFilterWidgets: 
                  "aiExclude": [1]
                aoColumns: do ->
                    aNewData = [
                        {'mData': (data, objs) ->
                            menuaddition = ''

                            if Q.paths.realm is "developer" or Q.paths.realm is 'amministrazione'
                                agente = if data.accounts.tipoutente is 'Agente' then 'active" style="opacity:0.2"' else '"'
                                agenzia = if data.accounts.tipoutente is 'Agenzia' then 'active" style="opacity:0.2"' else '"'
                                utente = if data.accounts.tipoutente is 'Utente' then 'active" style="opacity:0.2"' else '"'
                                poker = if data.accounts.tipoutente is 'Poker' then 'active" style="opacity:0.2"' else '"'

                                if data.accounts.nascosto is 'si'
                                    nascosto_class = 'active" style="opacity:0.3"'
                                    nascosto_label = 'nascosto'
                                    nascosto_value = 'no'
                                else 
                                    nascosto_class = '"'
                                    nascosto_label = 'nascondi'
                                    nascosto_value = 'si'

                                nascosto = if data.accounts.nascosto is 'si' then '<span class=>nascosto</span>' else '<span>nascondi</span>'
                                menuaddition = ' <a target="_blank" class="btn btn-mini btn-turgu ' + agente + ' href="' + (Q.Accounts.paths.api + 'tipoaccount/Agente/' + data.idutente) + '">Agente</a> ' + ' <a target="_blank" class="btn btn-mini btn-orange ' + agenzia + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Agenzia/' + data.idutente + '">Agenzia</a> ' + ' <a target="_blank" class="btn btn-mini btn-black ' + utente + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Utente/' + data.idutente + '">Utente</a> ' + ' <a target="_blank" class="btn btn-mini btn-boo ' + poker + ' href="' + Q.Accounts.paths.api + 'tipoaccount/Poker/' + data.idutente + '">Poker</a> ' + '<a target="_blank" class="btn btn-mini btn-red ' + nascosto_class + ' href="' + Q.Accounts.paths.api + 'nascosto/' + nascosto_value + '/' + data.idutente + '">' + nascosto_label + '</a>'
                            '<a class="btn btn-mini btn-yellow aprischeda" rel="' + (if typeof data.uid isnt 'undefined' then data.uid else data.ragione) + '" href="#' + data.uid + '"><i class="fontello-icon-accounts-scheda"></i>Vedi</a>' + menuaddition
                        },
                        {'mData': (data) -> data.idutente },
                        {'mData': (data) -> data.uid },
                        {'mData': (data) -> data.padre.uid},
                        {'mData': (data) -> data.accounts.ragione},
                        {'mData': (data) -> data.nome},
                        {'mData': (data) -> data.cognome },
                        {'mData': (data) -> if typeof data.accounts.comune isnt 'undefined' then data.accounts.comune else data.citta},
                        {'mData': (data) -> if typeof data.accounts.provincia isnt 'undefined' then data.accounts.provincia else data.provincia},
                        {'mData': (data) -> if typeof data.accounts.regione isnt 'undefined' then data.accounts.regione else data.regione},
                        {'mData': (data) -> data.accounts.qshop}
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
                aaSorting: [[2, 'asc']]
                sDom: "<'row-fluid' <'widget-header' <'span4'l> <'span8'<'table-tool-wrapper'><'table-tool-container'>> > > rti <'row-fluid' <'widget-footer' <'span6' <'table-action-wrapper'>> <'span6'p> >>"
                fnDrawCallback: (oSettings) ->
                    self.renderInMap(oSettings)
            .columnFilter
                sPlaceHolder: 'head:after'
            
            @.addMapButton()
            
        renderInMap: (oSettings) ->
            if @.OdataTable
                @.collection.forEach (model, index) ->
                    model.set 'visibleInMaps', false
                    return

                for i in oSettings.aiDisplay
                    model = @.OdataTable.fnGetData(i);
                    model = @.collection.get model.uid
                    model.set 'visibleInMaps': true
                
                @.mapView(); 
            return

        updateDataTable: ->
            @.OdataTable.fnSettings().aaData = @.collection.toJSON()
            @.OdataTable.fnReloadAjax(@.OdataTable.fnSettings())
            return

        openAccountTabScheda: (e, tab) ->
            if e.currentTarget 
                el =  
                    id = $(e.currentTarget).attr('href').slice 1 #comes from event
            else 
                id = e  # comes as text  
            
            instance = 'tabScheda-' + id

            # console.info instance
            # console.info Q.Accounts.Instances

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

        addMapButton: ->
            self = @
            $('#lista-' + Q.paths.currentpage + '_wrapper .table-action-wrapper').html('<a href="#tabMappa" data-toggle="tab" class="btn aprilistainmappa"><i class="fontello-icon-map"></i>Apri nella mappa</a>').find('.aprilistainmappa').on 'click', (e) ->
                $($(@).attr('href')).fadeIn()
                self.mapView()
                $('body').delegate '.apri-scheda-da-mappa', 'click', (e) ->
                    e.preventDefault();
                    self.openAccountTabScheda e
            return   

        mapView: ->
            el = document.getElementById("map-canvas-" + Q.paths.currentpage)
            mapOptions =
                center: new google.maps.LatLng 41.871, 12.567
                zoom: 6
                mapTypeId: google.maps.MapTypeId.ROADMAP
            map = new google.maps.Map el, mapOptions
            dataset = @.collection.filter (i) ->
                i.get('visibleInMaps') is true and i.get('latlng').idref isnt ''
            $('.mappa-accounts-valid span').html(dataset.length)
            
            for a in dataset
                if '' isnt a.get('latlng').idref
                    
                    imagemarker = if a.get('accounts').qshop is 'si' then 'qshop' else Q.paths.currentpage

                    marker = new google.maps.Marker
                        position: new google.maps.LatLng(a.get('latlng').lat, a.get('latlng').lng)
                        map: map
                        icon: Q.paths.assets + 'q-marker-' + imagemarker + '.png'
                        title: a.get('accounts').ragione
                        clickable: true
                marker.info = new google.maps.InfoWindow
                    content: '<div><h4>' + a.get('accounts').ragione + '</h4><p><small>Riferimento: </small><strong>' + a.get('nome') + ' ' + a.get('cognome') + '</strong></p><p><small>Master: </small>' + a.get('master') + '</p><p><a href="mailto:' + a.get('email') + '">' + a.get('email') + '</a></p></div>' + '<p><a class="apri-scheda-da-mappa" rel="' + a.get('uid') + '" href="#' + a.get('uid') + '">Apri scheda</a></p>' + '</div>'
                google.maps.event.addListener marker, 'click', ->
                    @.info.open map, @
                marker.setMap map
            window.scrollTo 0, ($('#tabMappa').position().top) - 80