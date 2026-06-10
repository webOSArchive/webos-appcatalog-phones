/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationManager =
{	
	_target: 'palm://com.palm.applicationManager',
	
	getInstalledApplications: function(callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'listApps',
			parameters: {}
		},
		function(response)
		{
			//Mojo.Log.info("GET INSTALLED APPLICATIONS %j", response);
			var apps = response.apps;
			callback(true, !apps ? [] : Object.isArray(apps) ? apps : [ apps ]);
		},
		function()
		{
			callback(false);
		});
	},
	getInstalledApplications_V2: function(callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'listPackages',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("GET INSTALLED APPLICATIONS %j", response);
			var packages = response.packages;
			callback(true, !packages ? [] : Object.isArray(packages) ? packages : [ packages ]);
		},
		function()
		{
			callback(false);
		});
	},
	
	openApplication: function(name, passedParams, launchinnewgroup)
	{
		var appParams  = passedParams
		if(!appParams)
			appParams = {};
		appParams.launchinnewgroup = launchinnewgroup
		
		var params = {
				id: name,
				params: appParams
			};
		Mojo.Log.info("Open App params %j", params);
		Weave.Services.request(this._target, 
		{
			method: 'open',
			parameters: params
			
		});
	},

	launchApplication: function(name, params)
	{
		Weave.Services.request(this._target, 
		{
			method: 'launch',
			parameters: 
			{
				id: name,
				params: params
			}
		});
	},
	
	launchPointChanges: function(callback)
	{
		Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'launchPointChanges'
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	}
	
	/*
	getSizeOfApps: function(apps, callback)
	{
		Weave.Services.request(this._target, 
		{
			method: 'getSizeOfApps',
			parameters: 
			{
				appIds : apps
			}
		},
		function(response)
		{
			var total = 0;
			for (var x in response)
			{
				if (x != "subscribed" && x != "returnValue")
				{
					Mojo.Log.error("response X: ", response[x]);
					total += response[x];
				}
			}
			callback(total);
		},
		function()
		{
			Mojo.Log.info("getSizeOfApps failed");
		});
	},
	*/
};
