modulejs.define 'ViewSchedaNew', ['Q','jquery','Backbone'], (Q,$,Backbone) ->
    ViewSchedaNew = Backbone.View.extend
        events:
            'submit .form-account-new': 'refreshScheda'

        initialize: ->
            _.bindAll @, 'render', 'refreshScheda'
            @.collection.bind("reset", @.updateCollection, @)
            @.render()
            return

        render: ->
          @

        refreshScheda: (e) ->
            console.info 'refresh scheda'
            e.preventDefault()
            self = @
            me = $(@.el)
            formAccount = $('.form-account')
            $.ajax
                url: location.origin + '/qoffice/api/acocunts/salva/' + BetuniQ.Qoffice.page
                type: 'POST'
                dataType: 'html'
                data: formAccount.serialize()
                success: (response) ->
                    if $(response).length is 3 then me.html(response)
                    else self.collection.fetch reset: true

                    self.settings = self.options.tabellaView.OdataTable.fnSettings()
                    self.response = response
                    return 

        updateCollection: ->
            @.settings.aaData = @.collection.toJSON()
            @.options.tabellaView.OdataTable.fnReloadAjax(@.settings)

            id = $(@.response).find('form').find('input[name="id"]').val()
            handler = @.options.tabellaView.$el.find('a[href="#' + id + '"]')
            @.remove();
            @.unbind();
            @.collection.unbind();
            new BetuniQ.Qoffice.View.SchedaAccountEdit
                handlerId: id
                handlerTabTitle: handler.attr('rel')
                tabellaView: @.options.tabellaView.OdataTable
                collection: agenzieCollection
            return     
