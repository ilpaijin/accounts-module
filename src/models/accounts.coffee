modulejs.define 'ModelAccounts', ['Backbone'], (Backbone) ->
    ModelAccounts = Backbone.Model.extend
        idAttribute: "uid"
        defaults: 
            'qid': ''
            'nome': ''
            'cognome': ''
            'datacreazione': ''
            'accounts': 
              'ragione': ''
            'callcenter': []
            'indirizzo': ''
            'comune': ''
            'provincia': ''
            'regione': ''
            'paese': ''
            'status': ''
            'profilo': ''
            'stato': ''
            'telefono': ''
            'uid': ''
            'padre': 
                'idutente': ''
                'uid': ''
            'latlng': 
                'idref': ''
                'lat': ''
                'lng': ''
            'active': false
            'visibleInMaps': true