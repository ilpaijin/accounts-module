if Q.paths.currentpage in ['agenzie','agenti','poker']
	modulejs.require 'initAccounts'
else if Q.paths.currentpage in ['utenti']
	modulejs.require 'initUtenti'	
else 
	modulejs.require 'initFoglinotizia'