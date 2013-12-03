modulejs.define 'ViewPartialsFactory', [
	'Q'
	'jquery'
	'Backbone'
], (Q,$,Backbone) ->

	ViewPartialsFactory = Backbone.View.extend
		init: (render = false) ->
			_.bindAll @, 'render'
			@.ajaxUrl = @.setAjaxUrl()
			@.loaded = render
			@.tempModel = @.options.model.clone()
			@.appendMenuItem()
			return

		setAjaxUrl: -> 
			Q.Accounts.paths.api + 'partial/'+@.options.name + '/'+@.options.model.id	

		appendMenuItem: ->
			liFrag = document.createDocumentFragment()
			li = document.createElement("li")
			li.className = 'accounts-partials-'+@.options.name+'-menutab ' + if @.loaded then 'active'
			li.innerHTML = '<a href="#tab-' +@.options.name+'-'+@.model.get("uid") + '" data-toggle="tab"></span> <i class="fontello-icon-accounts-'+@.options.name+'"></i> '+@.options.name+'</a>';
			liFrag.appendChild(li)
			@.options.mainView.find('.nav-tabs').append(liFrag)

			@.options.mainView.delegate '.accounts-partials-'+@.options.name+'-menutab', 'click', (el) =>
				if not $(el.currentTarget).hasClass('active') and not @.loaded
					@.loaded = true
					@.fetchData()
			
			if @.loaded then @.fetchData()

		fetchData: ->
			me = @
			$.ajax
				url: @.ajaxUrl
				async: false
				success: (data) ->
					me.$el.detach()
					me.appendTo(JSON.parse(data))
			return

		appendTo: (data) ->
			@.options.mainView.find('.tab-content').append(data.tab)
			@.createTemplate()
			return

		createTemplate: (mainView)->	
			@.$el = @.options.mainView.find '#tab-'+@.options.name+'-'+@.options.model.id
			@.$el.addClass(if @.loaded then 'active' else '')
			@.templateTab = _.template(@.$el.find(".template-tab-"+@.options.name).html())
			@.render()
			@.delegateEvents();
			return