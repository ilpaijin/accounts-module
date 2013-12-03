modulejs.define('SpecModelAccounts', ['Backbone','ModelAccounts'], function(Backbone, ModelAccounts)
{
	describe('ModelAccounts', function()
	{
		describe('Creation', function()
		{
			it('Can be created with default attributes', function()
			{
				var ma = new ModelAccounts();

				expect(ma.idAttribute).toBe('uid');
				expect(ma.get('nome')).toBe('');
				expect(ma.get('active')).toBe(false);
				expect(ma.get('nome')).not.toBe(false);
			});
		});

		describe('Initialization', function()
		{
			it('It contains valid attribute', function()
			{
				var ma = new ModelAccounts();

				ma.set({'nome': 'Paio'});
				ma.set({'active': true});
				ma.set({'visibleInMaps': true});

				expect(ma.idAttribute).toBe('uid');
				expect(ma.get('nome')).toBe('Paio');
				expect(ma.get('active')).toBe(true);
				expect(ma.get('visibleInMaps')).not.toBe(false);
			});
		});

	});
});

modulejs.require('SpecModelAccounts')