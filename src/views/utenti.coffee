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

        initialize: ->
            _.bindAll @, 'render', 'addMapButton', 'mapView', 'renderInMap'
            # @.listenTo @.collection, "reset" : -> @.renderDataTable()

            @.renderDataTable()

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
                bProcessing: true,
                bServerSide: true,
                sAjaxSource: "/qoffice/api/accounts/dataTable/utenti"
                # aaData: @.collection.toJSON()
                bDeferRender: false
                bRetrieve: true
                bIgnoreEmpty: false
                oColumnFilterWidgets: 
                  "aiExclude": [1]
                aoColumns: do ->
                    aNewData = [
                        {'mData': (data, objs) ->
                            reg = ''
                            menuaddition = ''

                            if not data.accounts
                                reg = "<span class='fontello-icon-attention' style='padding-left:5px;'>isol</span>"

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
                sColumns: "Scheda,Idutente,Uid"
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
                fnDrawCallback: (oSettings) ->
                    # self.renderInMap(oSettings)
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