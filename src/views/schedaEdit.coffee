modulejs.define 'ViewSchedaEdit', [
	'Q'
	'jquery'
	'Backbone'
	'ViewPartialsAssegni'
	'ViewPartialsCallcenter'
	'ViewPartialsDocumenti'
	'ViewPartialsGallery'
	'ViewPartialsIsolutions'
	'ViewPartialsQpoints'
	'ViewPartialsQshop'
	'ViewPartialsScheda'
], 
(
	Q
	$
	Backbone
	ViewPartialsAssegni
	ViewPartialsCallcenter
	ViewPartialsDocumenti
	ViewPartialsGallery
	ViewPartialsIsolutions
	ViewPartialsQpoints
	ViewPartialsQshop
	ViewPartialsScheda
) ->

	ViewSchedaEdit = Backbone.View.extend
		partialsPrefix: 'ViewPartials'
		initialize: ->
			_.bindAll @, 'render', 'load', 'updateCollection'
			@._setModelAndActiveIt()
			@.listenTo @.collection, "reset" : -> @.updateCollection()
			@.load()
			return

		_setModelAndActiveIt: ->
			@.model = @.collection.get @.options.uid
			@.model.set 'active': true
			@.model.on
				"saved": @.updateCollection
			return

		setActive: ->
			@.options.viewAccounts.TabMenu.setTabSchedaAsActive @.model.id 
			@.$el.siblings().removeClass('active in').end().addClass('active in')
			return	

		loadPartials: ->
			s = @
			if not s.options.tabActive then s.options.tabActive = 'scheda'
			for c in @.partials
				fn = eval(@.partialsPrefix+c)
				s.partials[c] = new fn
					mainView : s.$el
					model: s.model
					name: c.toLowerCase()
					collection: s.collection
					active: if s.options.tabActive is c.toLowerCase() then true else false
			return

		render: ->
			me = @;
			id = me.model.id

			$.ajax
				url: Q.Accounts.paths.api + 'scheda/' + Q.paths.currentpage + '/' + id

				beforeSend: ->
					me.$el = $('<div>').attr('id', 'tabScheda-' + id).attr('class', 'scheda-' + id + ' scheda-account tab-pane fade in')
					return	

				success: (response) ->
					$('#page-content').append(me.$el.html(response))

					window.scrollTo 0, 100

					me.options.viewAccounts.TabMenu.triggerTabClick id

					me.loadPartials()
				
					return
			return @

		load: ->
			@.options.viewAccounts.TabMenu.addTabScheda(@.model.id, @)
			@.render()

			return 

		removeScheda: () ->
			delete Q.Accounts.Instances[@.options.el.substring(1)]
			@.undelegateEvents()
			@.$el.removeData().unbind()
			@.unbind()
			Backbone.View.prototype.remove.call(@)
			@.collection.unbind()
			root = $('#main-container')
			root.find('.scheda-' + @.options.uid).detach()
			# root.find('#lista-tab').find('a').trigger('click')
			root.find('#tabLista').addClass('fade in')
			if @ isnt null then @.remove()
			return	

		updateCollection: (m) ->
			@.options.viewAccounts.updateDataTable()
			return	