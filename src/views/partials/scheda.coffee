modulejs.define 'ViewPartialsScheda', [
	'Q'
	'jquery'
	'ViewPartialsFactory'
], (Q,$,ViewPartialsFactory) ->
	ViewPartialsScheda = ViewPartialsFactory.extend
		events:
			"change input" :"inputIsChanged"
			"click button" :"inputIsChanged"
			"click input[type='submit']": "save"

		initialize: ->
			@.init(@.options.active)

		setAjaxUrl: -> 
			Q.Accounts.paths.api + 'partial/'+@.options.name + '/'+@.options.model.id+'/'+Q.paths.currentpage

		render: ->
			@.$el.html @.templateTab 
				'account' : @.options.model.toJSON()

			return @

		save: (e) -> 
			e.preventDefault()
			me = @
			# me.isProcessing = false
			$.ajax
				url: Q.Accounts.paths.api + 'salva/'+Q.paths.currentpage+'/'+ @.options.name
				type: 'POST'
				dataType: 'html'
				async: false
				data: @.$el.find('form').serialize()
				beforeSend: ->
					# if me.isProcessing then return
					# me.isProcessing = true
					me.$el.removeClass "active"

				success: (response) ->
					if JSON.parse(response).saved
						me.$el.addClass "active in"
						me.modelIsSaved()
					return	

					# me.$el.addClass('active in')  
			return	

		showMap: ->
	        activeAccount = @.model.toJSON()

	        if activeAccount.latlng.lat.length is 0 then return false
	        
	        mapOptions = 
	            center: new google.maps.LatLng(activeAccount.latlng.lat,activeAccount.latlng.lng)
	            zoom: 15
	            mapTypeId: google.maps.MapTypeId.ROADMAP


	        map = new google.maps.Map(document.getElementById("usermap"), mapOptions)

	        marker = new google.maps.Marker
	            position: new google.maps.LatLng(activeAccount.latlng.lat,activeAccount.latlng.lng)
	            map: map
	            title: activeAccount.ragione
	            clickable: true

	        marker.info = new google.maps.InfoWindow
	            content: '<div><h4>'+activeAccount.ragione+'</h4><p><small>Riferimento: </small><strong>'+activeAccount.nome+' '+activeAccount.cognome+'</strong></p><p><small>Master: </small>'+activeAccount.master+'</p></div>'

	        google.maps.event.addListener marker, 'click', ->
	            @.info.open(map,@)

	        marker.setMap(map)

		inputIsChanged: (e) ->
			@.tempModel.attributes.accounts[e.currentTarget.name] = e.currentTarget.value		

			return

		modelIsSaved: -> 	
			@.model.set @.tempModel.attributes
			@.model.trigger "saved"