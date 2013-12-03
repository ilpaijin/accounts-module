modulejs.define 'ViewTabMenuSchede', ['Q','jquery','Backbone', 'ViewSchedaNew'], (Q,$,Backbone,ViewSchedaNew) ->
    ViewTabMenuSchede = Backbone.View.extend
        ViewsSchede : []
        el: '#tabMenu'

        events:
          'click #nuovo-tab': 'schedaNew'
          'click .chiudi-tabscheda' : 'chiudiScheda'

        initialize: ->
            _.bindAll @, 'render'
            return

        render: ->
            return
        
        addTabScheda: (id, viewCaller)->

            if @.$el.find('#scheda-' + id).length then false

            liFrag = document.createDocumentFragment()
            li = document.createElement("li")
            li.id = 'scheda-' + id
            li.className = 'scheda-' + id
            li.innerHTML = '<a href="#tabScheda-' + id + '" data-toggle="tab"><span class="title">' + id + '</span> <span rel="' + id + '" class="chiudi-tabscheda fontello-icon-cancel-circle-3"></span></a>';
            liFrag.appendChild(li)
            @.el.appendChild(liFrag)

            @.ViewsSchede[id] = viewCaller
            return     

        setTabSchedaAsActive: (id)->
            @.$el.find('#scheda-' + id).siblings().removeClass('active in').end().addClass('active in')
            return

        chiudiScheda: (e) ->
            id = e.currentTarget.attributes[0].nodeValue
            @.ViewsSchede[id].removeScheda(id)
            return

        triggerTabClick: (id) ->
            @.$el.find('#scheda-' + id).find('a').trigger('click')
            return

        schedaNew: (e) ->
            new ViewSchedaNew
                el: $(e.currentTarget).find('a').attr('href')
                tabellaView: fogliView
                collection: @.options.collection
            return    