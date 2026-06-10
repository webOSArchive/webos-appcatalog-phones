/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.DeviceProfile = 
{
	_target: 'palm://com.palm.deviceprofile',
	
	getDeviceId: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'getDeviceId',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("**** Got deviceId %j", response);
			callback(true, response.deviceId);
		},
		function(response)
		{
			Mojo.Log.error("**** Error in obtaining deviceId %j", response);
			callback(false);
		});
	},
	
	getCarrierIdentification: function(callback)
	{
		Weave.Services.request('palm://com.palm.db',
		{
			method: 'find',
			parameters: {"query":{"from":"com.palm.carrierdb.settings.current:1"}}
		},
		function(response)
		{
			callback(true, response.results[0]);
		},
		function()
		{
			callback(false);
		});
	}
};
