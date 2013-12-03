modulejs.define 'CollectionFoglinotizia', [
	'Q'
	'Backbone'
	'ModelFoglinotizia'
], 
(
	Q,Backbone,ModelFoglinotizia
) ->

	CollectionFoglinotizia = Backbone.Collection.extend
	    model: ModelFoglinotizia
	    url: location.origin + "/qoffice/api/accounts/lista/" + Q.paths.currentpage
	    initialize: ->
	        @.fetch reset: true
	        return