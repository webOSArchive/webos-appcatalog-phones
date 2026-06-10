/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.Preferences = Weave.Services.Preferences || {};
Weave.Services.Preferences.SystemProperties = 
{
	_target: 'palm://com.palm.preferences/systemProperties',
	
	getCarrier: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'Get',
			parameters: { key: 'com.palm.properties.DMCARRIER' }
		},
		function(response)
		{
			callback(true, response['com.palm.properties.DMCARRIER']);
		},
		function()
		{
			callback(false);
		});
	}
};