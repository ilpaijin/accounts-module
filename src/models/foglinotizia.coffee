modulejs.define 'ModelFoglinotizia', ['Backbone'], (Backbone) ->
    ModelFoglinotizia = Backbone.Model.extend
        defaults:
            'id': ""
            'master': ""
            'ragione': ""
            'nome': ""
            'cognome': ""
            'indirizzo': ''
            'comune': ''
            'provincia': ''
            'regione': ''
            'paese': ''
            'status': ''
            'created_at': ''
            'apertura': ''
            'email': ''
            'telefono': ''
            'note': ''
            'lat': ''
            'lng': ''
            'active': false