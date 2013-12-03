modulejs.define('SpecCollectionsAccount', ['Q','CollectionAccounts'], function(Q,CollectionAccounts)
{
	describe("CollectionsAccount", function()
	{
		beforeEach(function()
		{
			this.ca = new CollectionAccounts();

		});

		afterEach(function()
		{
			this.ca = null;
		});

		describe('Creation', function()
		{
			it("Should be defined", function()
			{
				expect(this.ca).toBeDefined();
			});

			it("Should not have models in", function()
			{
				expect(this.ca.length).toBe(0);
			});

			it("Should have url defined", function()
			{
				expect(this.ca.url).toBe(Q.Accounts.paths.api + "lista/" + Q.paths.currentpage);
			});
		});

		describe('Initialization', function()
		{
			it("Should contains 1 model", function()
			{
				var m = {
			        'qid': '',
			        'nome': '',
			        'cognome': '',
			        'datacreazione': '',
			        'accounts': {
			          'ragione': ''
			        },
			        'callcenter': [],
			        'indirizzo': '',
			        'comune': '',
			        'provincia': '',
			        'regione': '',
			        'paese': '',
			        'status': '',
			        'profilo': '',
			        'stato': '',
			        'telefono': '',
			        'uid': '',
			        'padre': {
			          'idutente': '',
			          'uid': ''
			        },
			        'latlng': {
			          'idref': '',
			          'lat': '',
			          'lng': ''
			        },
			        'active': false,
			        'visibleInMaps': true
			      }
				this.ca.add(m);
				expect(this.ca.length).toBe(1);
			});
		});
	});

});

modulejs.require('SpecCollectionsAccount');