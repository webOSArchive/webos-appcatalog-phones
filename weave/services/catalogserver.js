/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.CatalogServer = Class.create(
{
	_defaultRetries: 3,
	_defaultCallTimeout: 20.0,
	
	$whenReadyServerUrl: function(callback)
	{
		if (this._serverUrl) 
		{
			callback();
		}
		else 
		{
			// We need the server url and the carrier info
			var self = this;
			Weave.Services.AccountServices.getServerUrl(function(status, url)
			{
				self._serverUrl = status ? url : 'error:///';
				callback();
			});
		}
	},
	
	$whenReadyServerUrlCarrier: function(callback)
	{
		if (this._serverUrl && this._carrier) 
		{
			callback();
		}
		else 
		{
			// We need the server url and the carrier info
			var self = this;
			this.$whenReadyServerUrl(function()
			{
				self._carrier && callback();
			});
			this._carrier || Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
			{
				self._carrier = status ? carrier : 'ROW';
				self._serverUrl && callback();
			});
		}
	},
	
	_whenReadySecurityToken: function(callback)
	{
		var self = this;
		var calledCallback = undefined;
		function ready()
		{		
			return (self._token != undefined && self._deviceid != undefined && self._email != undefined && self._carrier != undefined) ;
		};
		if (ready())
		{
			calledCallback = true;
			callback();
		}
		else 
		{
			this._token || Weave.Services.AccountServices.getAccountToken(function(status, token, email)
			{
				Mojo.Log.info("Token:", status, token);
				self._token = status ? token : 'ERROR';
				self._email = status ? email : 'ERROR';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
			this._deviceid || Weave.Services.DeviceProfile.getDeviceId(function(status, id)
			{
				Mojo.Log.info("DeviceId:", id);
				self._deviceid = status ? id : 'ERROR';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
			this._carrier || Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
			{
				Mojo.Log.info("Carrier:", carrier);
				self._carrier = status ? carrier : 'ROW';
				if (ready() && !calledCallback) 
				{
					calledCallback = true;
					callback();
				}
			});
		}
	},
	
	getSecurityToken: function(callback)
	{
		var self = this;
		this._whenReadySecurityToken(function()
		{
			callback(
				{
					token: self._token,
					deviceId: self._deviceid,
					email: self._email,
					carrier: self._carrier
				}
			);
		});
	},
	
	invalidateSecurityToken: function()
	{
		delete this._token;
	},
        _isDownForMaintenance: function(response) {
            var maintenanceMode = response.getHeader("X-Palm-AppCat-Maintenance-Mode"),
                maintenanceCode = response.getHeader("X-Palm-AppCat-Maintenance-Code");

            if (maintenanceMode !== null && parseInt(maintenanceMode, 10) === 1) {
                if (maintenanceCode === null || maintenanceCode === '') {
                    //In maint mode but no code given.  Default to generic error.
                    maintenanceCode = 'DISC9999';
                }
                return maintenanceCode;
            } else {
                return false;
            }
        },
	
	_callServer: function(path, body, callback, retries)
	{
		//Mojo.Log.info("_callServer %s %s %j", this._serverUrl, path, body);
		retries = (retries == undefined ? this._defaultRetries : retries);
		var self = this;
		this.$whenReadyServerUrl(function()
		{
			Mojo.Log.info("ServerURL ready");
			var timeout = 0;
			var id = Weave.Services.ConnectionManager.waitForOffline(function()
			{
				if (!timeout++) 
				{
					Mojo.Log.info("Offline");
					callback(false, 'offline'); // do not localize
				}
			});
			if (id) 
			{
				Mojo.Log.info("Ajax.Request");
				new Ajax.Request(self._serverUrl + path, 
				{
					method: 'POST',
					contentType: 'application/json',
					postBody: Object.toJSON(body),
					evalJSON: 'force',
					onSuccess: function(response)
					{
						if (!timeout++) 
						{
							//Mojo.Log.info("onSuccess %j", response);
							response = response.responseJSON;
							if (!response) 
							{
								callback(true); // Empty replies are okay
							}
							else 
							{
								var exception = response.JSONException;
								if (exception) 
								{
									Mojo.Log.error("CatalogServer._callServer %j", exception);
									callback(false, 'jsonexception', exception);
								}
								else 
								{
									callback(true, response);
								}
							}
						}
					},
					onFailure: function(response)
					{
						if (!timeout++) 
						{
							Mojo.Log.info("onFailure %j", response);
							if (retries < 1) 
							{
								if (response.responseJSON && response.responseJSON.JSONException) 
								{
									callback(false, 'jsonexception', response.responseJSON.JSONException);
								}
								else 
								{
									callback(false, 'failure', response.status); // do not localize
								}
							}
							else 
							{
								self._callServer(path, body, callback, retries - 1);
							}
						}
					},
					on0: function(response)
					{
						// If we fail to connect to the network for some reason, then we get a status == 0 which would normally
						// go into onSuccess.  We define a specific error handler here to avoid this.
						// When we fail and can no longer retry, we either report offline or failure depending on the current
						// connection manager status.
						if (!timeout++) 
						{
							Mojo.Log.info("on0 %j", response);
							if (retries < 1) 
							{
								Weave.Services.ConnectionManager.getStatus(function(online)
								{
									callback(false, online ? 'failure' : 'offline', response.status); // do not localize
								});
							}
							else 
							{
								self._callServer(path, body, callback, retries - 1);
							}
						}
					}
				});
				(function()
				{
					if (!timeout++) 
					{
						Mojo.Log.info("Timeout");
						if (retries < 1) 
						{
							callback(false, 'timeout'); // do not localize
						}
						else 
						{
							self._callServer(path, body, callback, retries - 1);
						}
					}
					Weave.Services.ConnectionManager.cancelWait(id);
				}).delay(self._defaultCallTimeout);
			}
		});	
	}
});
