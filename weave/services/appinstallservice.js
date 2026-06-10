/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.AppInstallService = 
{
	_target: 'palm://com.palm.appInstallService',
	
	install: function(app, callback)
	{
		Weave.Services.AccountServices.getAccountToken(function(status, token, accountAlias)
		{
			Weave.Services.DeviceProfile.getDeviceId(function(status, id)
			{
				var transactionId = new Date().getTime();
				var params = 
				{
					catalogId: app.id,
					id: app.publicApplicationId,
					title: app.title,
					version: app.serverVersion,
					vendor: app.vendor,
					vendorUrl: app.vendorUrl,
					iconUrl: app.iconUrl,
					ipkUrl: app.packageUrl,
					authToken: token || 0,
					deviceId: id || 0,
					email: accountAlias || "",
					noApp: app.appType === "app"? false:true,
					services: app.services,
					accounts: app.accounts,
					dockMode: app.dockMode,
					universalSearch : app.universalSearch,
					loc_name: app.title,
					transactionId: '' + transactionId
				}
				Mojo.Log.info("Weave.Services.AppInstallService.install payload %j", params);
				var request = Weave.Services.request(Weave.Services.AppInstallService._target, 
				{
					method: 'install',
					parameters: params
				},
				function(response)
				{
					callback(true);
				},
				function(response)
				{
					Mojo.Log.error("Weave.Services.AppInstallService.install failed %s, %j", app.publicApplicationId, response);
					callback(false, response);
				});
			});
		});
	},
	
	status: function(callback)
	{
		Mojo.Log.info("Weave.Services.AppInstallService.status");
		var self = this;
		var request = Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'status',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.status response %j", response);
			if (response.status && response.status.apps)
			{
				callback(true, false, response.status.apps);
			}
			else if (response.id)
			{
				callback(true, true, [response]);
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.status failed %j", response);
		});
	},
	
	/*
	retryInstall: function(publicApplicationId)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'retryInstall',
			parameters: {"id": publicApplicationId},
		},
		function(response){},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.retryInstall failed %s, %j", publicApplicationId, response);
		});
	},
	*/
	
	pause: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'pause',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.pause failed %s, %j", publicApplicationId, response);
			callback(false, response);
		});
	},
	
	resume: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'resume',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.resume failed %s, %j", publicApplicationId, response);
			callback(false, response);
		});
	},
	
	installLocal: function(app, callback)
	{
		var self = this;
		var params = 
		{
					id: app.id,
					version: app.version,
					title: app.loc_name,
					ipkUrl: app.ipkgUrl,
					iconUrl:app.iconUrl,
					vendor:app.vendor
		}
		Mojo.Log.info("Weave.Services.AppInstallService.install payload %j", params);
		var request = Weave.Services.request(this._target, 
		{
			method: 'installLocal',
			parameters: params
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.install response %j", response);
			callback(true);
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.installLocal failed %s, %j", params.id, response);
			callback(false, response);
		});
	},
	
	cancel: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'cancel',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{ 
			callback(true); 
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.cancel failed %s, %j", publicApplicationId, response);
			callback(false, response); 
		});
	},
	
	remove: function(publicApplicationId, callback)
	{
		var self = this;
		var request = Weave.Services.request(this._target, 
		{
			method: 'remove',
			parameters: {"id": publicApplicationId}
		},
		function(response)
		{
			callback(true);
		},
		function(response)
		{
			callback(false, response); 
			Mojo.Log.error("Weave.Services.AppInstallService.remove failed %s, %j", publicApplicationId, response);
		});
	}
};
