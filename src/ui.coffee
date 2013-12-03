$ -> 
# 
# AGENZIE/AGENTI FORM select indirizzo
# 
	$("#page-content").delegate '.comune','keyup', (e) ->

		if $(this).data('active') then return
		
		$('.autocomplete-location').addClass('hidden')

		val = e.currentTarget.value
		me = $(this)
		citiesUl = me.parents('.controls').siblings('.cities-list')

		if val.length < 3 then return

		citiesUl.empty()

		$.ajax
			url: Q.paths.base+'api/rest/getComune/'+val
			beforeSend: ->
				me.data('active', true)
				return
			success: (data) ->

				data = JSON.parse(data)
				frag = document.createDocumentFragment()

				for d in data
					li = document.createElement("li")
					li.className = 'option_comune'
					li.setAttribute('data-prov', d.cod_provincia)
					li.setAttribute('data-istat', d.cod_istat)
					li.textContent = d.comune
					frag.appendChild(li)

				citiesUl.append(frag).fadeIn(200)

				me.data('active', false)
				return

	$(document).on 'mouseover', '.option_comune', (e) ->
		$("form .comune").data('valid','valid').val($(this).text())

	$("#page-content").delegate '.comune','focus', ->
		$(this).val('')

	$("#page-content").delegate '.comune','blur', ->

		citiesList = $('.cities-list')
		self = $(this)

		if self.val() is '' or (self.data('valid') isnt 'valid') 
			self.val($(this).attr('title'))
			$('.autocomplete-location').addClass('hidden').find('input').val('')
			citiesList.empty().fadeOut(10)
			return

		target = citiesList.find('li').filter ->
			$(this).text() == self.val()

		istat = target.attr('data-istat')
		prov = target.attr('data-prov')

		$.ajax
			url: Q.paths.base+'api/rest/getfulllocations/'+target.text()+'/'+prov+'/'+istat
			success: (data) ->
				data = JSON.parse(data)
				holder = $('.autocomplete-location')
				holder.removeClass('hidden')
				holder.find('.provincia').val(data[0].provincia)
				holder.find('.regione').val(data[0].regione)
				holder.find('.cap').val(data[0].cap)
				return

		citiesList.empty().fadeOut(10)
# 
# Show/hide sidebar 
# 
	$("#btnToggleSidebar").click ->
		$(this).toggleClass('fontello-icon-resize-full-2 fontello-icon-resize-small-2')
		$(this).toggleClass('active')
		$('#main-sidebar, #footer-sidebar').animate width: 'toggle', 0
		
		if $('body').hasClass('sidebar-hidden')
			$('body').removeClass('sidebar-hidden')
		else 
			$('body').addClass('sidebar-hidden')
# 
# Show/hide scrollup button 
# 

	$(window).scroll ->

		if $(this).scrollTop() > 100
	    	$('#btnScrollup').fadeIn('slow')
	   	else 
	   	   	$('#btnScrollup').fadeOut(600)

	$('#btnScrollup').click ->
		$("html, body").animate({ scrollTop: 0 }, 500)

		return false;


	$(document).on 'click', '.chiudi-tabscheda', (e) ->
		$('.scheda-'+$(this).attr('rel')).detach()
		$('#lista-tab').find('a').trigger('click')
		$('#tabLista').addClass('fade in')

# 
# Button radio data toggle
# 
	$('body').delegate '.btn-group > .btn, .btn[data-toggle="button"]', 'click', (e) ->

		$(this).parent().siblings('#'+$(this).parent().attr('data-target')).val($(this).val())

		if $(this).attr('class-toggle') isnt undefined and not $(this).hasClass('disabled')

			btnGroup = $(this).parent('.btn-group')

			if btnGroup.attr('data-toggle') is 'buttons-radio'

				btnGroup.find('.btn').each ->

					$(this).removeClass $(this).attr('class-toggle')

				$(this).addClass $(this).attr('class-toggle')

			if btnGroup.attr('data-toggle') is 'buttons-checkbox' or $(this).attr('data-toggle') is 'button'   
				if $(this).hasClass('active')
					$(this).removeClass $(this).attr('class-toggle')
				else 
					$(this).addClass $(this).attr('class-toggle')						
		return             	