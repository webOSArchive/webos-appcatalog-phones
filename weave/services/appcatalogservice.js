/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.AppCatalogServer =
{
	_defaultRetries: 3,
	_defaultCallTimeout: 20.0,
	
	_cacheMaxTTL: 4*3600*1000,
	_baseAPIVersion: '2.0',
	_currentLocale: Mojo.Locale.current,
	_namespace: '/appcatalog',
	_domainUser: '/user',
	_domainApplications: '/apps',
	_subdomainCategories: '/categories',
	_queryFragment: '',
	_cacheDataDate: null,
	_appCatalogCategories: null,
	_queryButtons: null,
	_paymentSetupEnabled: null,
	
	// Base method
	$whenReadyAccountServerUrl: function(callback)
	{
		if (this._accountServerHostname) 
		{
			callback();
		}
		else 
		{
			// We need the server url and the carrier info
			var self = this;
			Weave.Services.AccountServices.getServerUrl(function(status, url)
			{
				self._accountServerUrl = status ? url : 'error:///';
				Mojo.Log.info("AppCatalogServer:Got Account server url %s", self._accountServerUrl);
				var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
				// Extract the hostname
				self._accountServerHostname = status ? url.match(re)[1].toString() : null;
				self._secureBaseURL = status ? "https://" + self._accountServerHostname : null;
				// SL: testing point to dev machine (HTTP)
				self._accountServerHostname = status ? "148.92.248.179/~chadauld" : null;
				self._secureBaseURL = status ? "http://" + self._accountServerHostname : null;
				// SL: Done DEV change
				Mojo.Log.info("AppCatalogServer:Generated _accountServerHostname [%s] and secureBaseURL [%s]", self._accountServerHostname, self._secureBaseURL);
				callback();
			});
		}
	},
	
	_setBaseLocations: function(baseLocation) {
		this._secureBaseURL = baseLocation.secure;
		this._baseURL = baseLocation.open;
		Mojo.Log.info("AppCatalogServer:setBaseLocation called: secureBase [%s] and plain [%s]", this._secureBaseURL, this._baseURL);
	},
	
	_setDeviceProperties: function ( dProperties) {
		this._country = dProperties.country;
		this._carrier = dProperties.carrier;
		this._osVersion = dProperties.osVersion;
		this._model = dProperties.model;
		this._queryFragment = "country=" + this._country + "&carrier=" + this._carrier + 
								"&osVersion=" + this._osVersion + "&model=" + this._model;
		Mojo.Log.info("AppCatalogServer:Device properties done. Query Fragment to be use: [%s]", this._queryFragment);
	},
	
	getBaseURLForDomain: function(domain, secure) {
		var self = this;
		secure = (secure == undefined) ? true : secure;
		var baseUrl = secure ? self._secureBaseURL : self._baseURL;
		return baseUrl + self._namespace + "/" + self._baseAPIVersion + "/" + self._currentLocale + domain;
		
	},
	getUserSessionURL: function() {
		var self = this;
		var uri = self.getBaseURLForDomain(self._domainUser, true) + "/session";
		// SL: dev
		uri = uri + ".json";
		Mojo.Log.info("AppCatalogServer:getUserSessionURL [%s]", uri);
		return uri;
	},
	getUserAppsURL : function() {
		var self = this;
		var uri = self.getBaseURLForDomain(self._domainApplications, true) + "/";

                Mojo.Log.info("AppCatalogServer:getUserAppsURL [%s]", uri);
		return uri;
	},
	getUserAppsCategoriesURL: function() {		
		var self = this;
		var uri = self.getBaseURLForDomain(self._domainApplications, true) + self._subdomainCategories + "/";
		Mojo.Log.info("AppCatalogServer:getUserAppsCategoriesURL [%s]", uri);
		return uri;
	},
	 
	_whenReadySecurityToken: function(callback)
	{
		var self = this;
		var calledCallback = undefined;
		function ready()
		{		
			return (self._token != undefined && self._deviceid != undefined && self._email != undefined && self._carrier != undefined) ;
		}
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
	
	_callServer: function(uri, body, callback, extraHeaders, retries, sendToken)
	{
		var self = this;
		retries = (retries == undefined || retries === null) ? this._defaultRetries : retries;
		sendToken = (sendToken == undefined || sendToken === null) ? true : sendToken;

		var timeout = 0;
		var id = Weave.Services.ConnectionManager.waitForOffline(function()
		{
			timeout++;
			if (!timeout) 
			{
				Mojo.Log.info("Offline");
				callback(false, 'offline'); // do not localize
			}
		});
		if (id) 
		{
			Mojo.Log.info("Ajax.Request");
			if (sendToken) {
				// Prepare custom headers
				customRequestHeaders = { "Authorization": "PalmAuth token=" + self._token, 
							"X-Palm-Device-Id": self._deviceid, 
							"X-Palm-Profile-Email": self._email};
			} else {
				customRequestHeaders = {};
			}
			// Add accept headers
			customRequestHeaders["Accept"] = "application/json;charset=UTF-8";
			if (extraHeaders) {
				// Merge with the custom ones
				for(var property in extraHeaders) {
					customRequestHeaders[property] = extraHeaders[property];
				}
			}
			// Determine the method type
			var methodType = (body == undefined || body === null) ? 'GET' : 'POST';
			// Prepare extra query parameters
			var separator = uri.indexOf('?') < 0 ? '?' : '&';
			var queryParameter = this._queryFragment.length > 0 ? separator + this._queryFragment : "";
			Mojo.Log.info("AppCatalogServer: Ajax.Request [%s] final URI: [%s]", methodType, uri + queryParameter);
			new Ajax.Request(uri + queryParameter,  
			{
				method: methodType,
				contentType: 'application/json',
				postBody: Object.toJSON(body),
				evalJSON: 'force',
				requestHeaders: customRequestHeaders,
				onSuccess: function(response)
				{
					if (!timeout++) 
					{
						response = response.responseJSON;
						if (!response) 
						{
							Mojo.Log.info("AppCatalogServer: callSever empty reply !!!!");
							callback(true); // Empty replies are okay
						}
						else 
						{
							var exception = response.JSONException;
							if (exception) 
							{
								Mojo.Log.error("AppCatalogServer._callServer %j", exception);
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
					timeout++;
					if (!timeout) 
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
							self._callServer(uri, body, callback, extraHeaders, retries - 1, sendToken);
						}
					}
				},
				on0: function(response)
				{
					// If we fail to connect to the network for some reason, then we get a status == 0 which would normally
					// go into onSuccess.  We define a specific error handler here to avoid this.
					// When we fail and can no longer retry, we either report offline or failure depending on the current
					// connection manager status.
					timeout++;
					if (!timeout) 
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
							self._callServer(uri, body, callback, extraHeaders, retries - 1, sendToken);
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
						self._callServer(uri, body, callback, extraHeaders, retries - 1, sendToken);
					}
				}
				Weave.Services.ConnectionManager.cancelWait(id);
			}).delay(self._defaultCallTimeout);
		}
	},
	
	callGETServer : function( uri, callback, extraHeaders, sendToken) {
		this._callServer(uri, undefined, callback, extraHeaders, undefined, sendToken);
	},
	
	callPOSTServerWithBody: function( uri, body, callback, extraHeaders, sendToken) {
		this._callServer(uri, body, callback, extraHeaders, undefined, sendToken);
	},
	
	// Callback format: callback(status, useCacheData)
	getUserSession: function(callback)
	{
		var self = this;
		// Load if we don't have any cache or the cache is more than 4hrs old
		// FIXME : SL : need to have a constant for the refresh
		var shouldLoad = self._cacheDataDate === null || (new Date().getTime() - self._cacheDataDate.getTime()) > self._cacheMaxTTL;
		if (shouldLoad) {
			self.resetCachedData();
			Mojo.Log.info("AppCatalogServer:getUserSession:shouldLoad:true");
			self.$whenReadyAccountServerUrl(function() {
				Mojo.Log.info("AppCatalogServer:$whenReadyAccountServerUrl done");
				// Be sure we have a token before we go further
				self._whenReadySecurityToken(function() {
					var url = self.getUserSessionURL();
					// Push local application eTag
					var myHeader = { "X-Palm-InstalledApps-ETag" : Weave.Services.ApplicationManager.getServerApplicationsETag() };
					self.callGETServer(url,
							function(status, response) {
								Mojo.Log.info("AppCatalogServer:getUserSession: status: " + status);
								if (status) {
									// Remember the date
									_cacheDataDate = new Date();
									// Capture our internal information
									self._setBaseLocations(response.baseLocation);
									self._setDeviceProperties(response.deviceProperties);
									self.setAppCatalogCategories(response.categories);
									self.setQueryButtons(response.queryButtons);
									self.setPaymentSetupEnabled(response.userAppCatFlags.enablePaymentSetup);
									Weave.Services.ApplicationManager.setServerApplications(response.applications);
									// Finally execute the callback with the internal data
									callback(true, false);
								} else {
									callback(false, false);
								}
							}, myHeader, true);
			});});			
		} else {
			Mojo.Log.info("AppCatalogServer:getUserSession:shouldLoad:false: using cache");
			// Trigger callback and indicate we did use the cache 
			callback(true, true);
		}
	},

	// Callback format: callback(status, tiles, applications) where applications is an array of dictionary
	getAppsForQueryFragment: function(queryIds, callback) {
		var self = this;
		if (queryIds != undefined && queryIds !== null) {
			if (typeof queryIds == "string") {
				queryIds = [queryIds];
			}
		} else {
			queryIds = [];
		}
		var parameters = queryIds.length > 0 ? '?' + queryIds.join('&') : "";
		// var url = self.getUserAppsURL() + "/" + parameters;
		// SL: dev
		var filename = queryIds.length > 0 ? "queryFragment.json" : "index.json";
		var url = self.getUserAppsURL() + filename + parameters;
		self.callGETServer(url, 
				function(status, response) {
					Mojo.Log.info("AppCatalogServer:getAppsForQueryFragment: status: " + status);
					if (status) {
						callback(true, response.tiles, response.applists);
					} else {
						callback(false, null, null);
					}
				}
		);
	},
	
	getContentForHomeScene: function(callback) {
		this.getAppsForQueryFragment(null, callback);
	},
	
	getTileDetail: function( qFragment, callback) {
		var self = this;
		if (!qFragment) {
			callback(false, null, null);
			return;
		}
		this.getAppsForQueryFragment(qFragment, callback);
	},
	
	// parameter: categoryId : ID for the category to lookup
	// Callback format: callback(status, tiles, applications) where applications is an array of dictionary
	getApplicationsForCategory: function(categoryId, callback) {
		var self = this;
		var url = self.getUserAppsCategoriesURL() + categoryId;
		// SL: dev
		url += ".json";
		self.callGETServer(url, 
				function(status, response) {
					Mojo.Log.info("AppCatalogServer:getApplicationsForCategory: status: " + status);
					if (status) {
						callback(true, response.tiles, response.applists);
					} else {
						callback(false, null, null);
					}
				}
		);
	},
	
	// parameter: appIdh : public app package ID for the app to lookup
	// Callback format: callback(status, appDetail) where appDetail is the dictionary describing the application
	getApplicationDetail : function(appId, callback) {
		var self = this;
		var url = self.getUserAppsURL() + appId;
		// SL: dev
		url = url + ".json";
		self.callGETServer(url, 
				function(status, response) {
					Mojo.Log.info("AppCatalogServer:getApplicationDetail: status: " + status);
					if (status) {
						callback(true, response);
					} else {
						callback(false, null);
					}
				}
		);
	},
	
	validateSort: function(sortValue) {
		// Return true if the value used for sorting is supported
		return sortValue && (sortValue == 'TOP_DESC' || sortValue == 'DATE_DESC' || sortValue == 'RATING_DESC' || sortValue == 'NAME_ASC');
	},
	
	// callback(status, tiles, applists)
	searchApplications: function(searchCriteria, callback, start, count, sort) {
		if (!searchCriteria) {
			callback(false, null, null);
			return;
		}
		var self = this;
		var parameters = "?q=" + searchCriteria;
		if (start) { parameters += "&start="+start; }
		if (count) { parameters += "&count="+count; }
		if (self.validateSort(sort)) { parameters += "&sort=" + sort; }
		// var url = self.getUserAppsURL() + "/" + parameters;
		// SL: dev
		var url = self.getUserAppsURL() + "search.json" + parameters;
		self.callGETServer(url, 
				function(status, response) {
					Mojo.Log.info("AppCatalogServer:searchApplications: status: " + status);
					if (status) {
						callback(true, response.tiles, response.applists);
					} else {
						callback(false, null, null);
					}
				}
		);
	},

	// callback(categories)
	getAppCatalogCategories: function(callback) {
		var self = this;
		self.getUserSession(function(status,useCache) {
			Mojo.Log.info("AppCatalogServer:getAppCatalogCategories:"+self._appCatalogCategories);
			callback(self._appCatalogCategories);
		});
	},
	
	setAppCatalogCategories: function(categories) {
		var self = this;
		Mojo.Log.info("AppCatalogServer:setAppCatalogCategories:"+categories);
		self._appCatalogCategories = categories;
	},
	
	// callback(queryButtons)
	getQueryButtons: function(callback) {
		var self = this;
		self.getUserSession(function(status,useCache) {
			callback(self._queryButtons);
		});
	},
	
	setQueryButtons: function(buttons) {
		var self = this;
		self._queryButtons = buttons;
		Mojo.Log.info("AppCatalogServer:setQueryButtons");
	},
	
	setPaymentSetupEnabled: function(state) {
		var self = this;
		self._paymentSetupEnabled = state;
		Mojo.Log.info("AppCatalogServer:setPaymentSetupEnabled");
	},
	
	// callback(paymentEnabled)
	getPaymentSetupEnabled: function(callback) {
		var self = this;
		self.getUserSession(function(status,useCache) {
			callback(self._paymentSetupEnabled);
		});
	},
	
	resetCachedData: function() {
		// empty cached data
		var self = this;
		self._cacheDataDate = null;
		self._paymentSetupEnabled = null;
		self._queryButtons = null;
		self._appCatalogCategories = null;
	},
	
	// callback(status, arrayOfApps)
	getApplicationsLatestVersion: function(applicationIds, callback) {
		var self = this;
		try {
		Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion [%j]", applicationIds);
		if (applicationIds === null || applicationIds.length === 0) {
			// If no app don't bother calling the server
			Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion empty nothing to check");
			callback(true, []);
			return;
		}
		if (typeof applicationIds == "string") {
			Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion transforming string to array");
			applicationIds = [applicationIds];
		}
		var appsRequested = { pid: applicationIds};
		Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion appsRequested [%j]",appsRequested);
		var uri = this.getUserAppsURL() + "versions/";
		// SL: dev 
		uri += "index.json";
		Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion will use dev URL [%s]", uri);
		// finally trigger the server call with the body with all the apps
		self.callPOSTServerWithBody(uri, appsRequested, 
				function(status, response) {
					Mojo.Log.info("AppCatalogServer:getApplicationsLatestVersion: status " + status);
					if (status) {
						callback(true, response.apps);
					} else {
						callback(false, null);
					}
				}, null, true);
		} catch (exception) {
			Mojo.Log.error("AppCatalogServer:getApplicationsLatestVersion exception raised: [%j]", exception);
		}

	}
};
