/* AppDownloadManager
 * 
 * Keeps a queue of active downloads. On launch, it gets active downloads 
 * from appInstallerService/status method and initializes the queue. It then queries 
 * the system for the list of installed apps and adds them to myApps as well.
 * When client request the download object (e.g details scene)
 * dm will either return an existing one, or create a new one.
 * DM is listening for state changes on all download objects, in case that
 * download becomes active and needs to be stored in the myApps queue. 
 * MyApps are installations in progress, failed installations and installed apps.
 * Other downloads are stored in _activeQueue until user initiates the install
 * at which point appDownload object is moved to myApps queue and appears 
 * in the list on MyApps scene.
 * 
 * Sample flow:
 * 
 * User opens a details scene of some new app "com.company.myapp". 
 * AppDownloadManager creates a new AppDownload object and stores it in _activeQueue hash.
 * AppDownloadManager & current details scene both subscribe as listeners on this object 
 * to be notified of state changes. When user taps "download app" install is initiated 
 * and state of the object starts changing with updates from appInstallService/status method
 * (_appInstallServiceStatusCB). When state changes AppDownloadManager is notified through 
 * updateDownloadState() observer method and it then decides if AppDownload should be added
 * to myApps queue. If state became "download progress" for example, app is added to myApps hash.
 * It's similar with details scene. When state of AppDownload changes details scene's 
 * updateDownloadState method is called to update the UI (progress pill). 
 * 
 * 
 * Observers on AppDownloadManager can subscribe to be notified of these changes:
 * 
 * 1) changes to installed applications list
 * current observers: main scene, search scene...
 * observer needs to implement 
 * 
 * updateInstalledApps(AppDownloadManager_instance, updateReason);
 * 
 * 
 * 2) changes to the myApps queue, sent when app is added/deleted/updated from the queue
 * current observers: myApps scene.
 * observer needs to implement  
 * 
 * updateMyApps(updateReason, app);
 * 
 * updateReason: one of: APP_ADDED, APP_DELETED, APP_UPDATED
 * MYAPPS_ALL - sent when myApps queue is populated 
 *             (from appInstallService/status + installed app from /listApps)
 * 
 * app: instance of AppDownload that changed
 * 
 */

var AppDownloadManager = Class.create({
	
	APP_ADDED: 		0,
	APP_DELETED: 	1,
	APP_UPDATED:	2,
	MYAPPS_ALL:		3,
	UPDATELIST_ALL:		4,
	
	initialize: function() 
	{
		this._myApps = new Object();
		this._revertableApps = new Object();
		this._activeQueue = new Object();
		this._observers = new Array();
		this._allow1xDownload = false;
		// two things need to happen before myApps list is ready:
		// get all apps in progress and all installed apps
		this._myAppsListIsReady = 2;
	
		this._appInstallerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.appInstallService'
			},
			onSuccess: this._appInstallerServiceSignalCB.bind(this)
		});
		
		this._appManagerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.applicationManager'
			},
			onSuccess: this._appManagerServiceSignalCB.bind(this)
		});
		
		this._downloadManagerService = new Mojo.Service.Request('palm://com.palm.bus/signal', {
			method: 'registerServerStatus',
			parameters: {
				'serviceName':'com.palm.downloadmanager'
			},
			onSuccess: this._appDownloadServiceSignalCB.bind(this)
		});
	},
	
	start: function()
	{
		Mojo.Log.info("AppDownloadManager.start");
		
		this._myApps = new Object();
		this._revertableApps = new Object();
		this._myAppsListIsReady = 2;
		
		// get installed apps and subscribe for status
		this._getInstalledApps();
		
	},
	
	_appInstallerServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			Mojo.Log.info("AppDownloadManager._appInstallerServiceSignal is back on the bus, starting");
			this.start();
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appInstallerServiceSignal is gone from the bus");
		}
	},
	
	_appManagerServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			// subscribe for app install/uninstall notifications
			var self = this;
			var cb = function(status, response) {
				Mojo.Log.info("AppDownloadManager.launchPointChanges callback %j", response);
				self._updateInstalledQueue(response);
			};
			Weave.Services.ApplicationManager.launchPointChanges(cb);
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appManagerServiceSignalCB is gone from the bus");
		}
	},
	
	_appDownloadServiceSignalCB: function(response)
	{
		if (response.connected == true)
		{
			// if we need to allow 1x, reissue the command
			if (this._allow1xDownload)
				this.allow1xDownload(true);
		}
		else if (response.connected == false)
		{
			Mojo.Log.error("AppDownloadManager._appDownloadServiceSignalCB is gone from the bus");
		}
	},
	
	_getInstalledApps: function()
	{
		var self = this;
		Weave.Services.ApplicationManager.getInstalledApplications_V2(function(status,  packages)
		{
			Weave.Services.AppInstallService.status(self._appInstallServiceStatusCB.bind(self));
			Mojo.Log.info("AppDownloadManager._getInstalledApps installed app: ", packages);
			var packages = status ? packages : [];
			var loadedInfo = Mojo.loadJSONFile("/usr/palm/ipkgs/manifest.json") ||[] ;
            Mojo.Log.info("manifest file %j", loadedInfo);
			for (var i = 0; i < loadedInfo.length; i++) 
			{
				self._revertableApps[loadedInfo[i].id] = loadedInfo[i];
				Mojo.Log.info("_revertableApps[%s] %j", loadedInfo[i].id, self._revertableApps[loadedInfo[i].id]);
			}			
			for (var i = 0; i < packages.length; i++)
			{
				if ((packages[i].userInstalled ||(packages[i].apps[0] && packages[i].apps[0].userInstalled)) || self._revertableApps[packages[i].id])
				{
					Mojo.Log.info("AppDownloadManager._getInstalledApps installed app: %j", packages[i]);
					// update app from this payload
					// this might change the state of the app which will 
					// cause it to be added to _myApps
					var app = self.getAppDownload(packages[i].id);
					app.updateFromInstalledAppsList(packages[i]);
				}
			}
			self._sendMyAppsListIsReady();
			
			Mojo.Log.info("AppDownloadManager._getInstalledApps sending updateInstalledApps");
			for (var i = 0; i < self._observers.length; i++) 
			{
				if (self._observers[i].updateInstalledApps) 
					self._observers[i].updateInstalledApps();
			}
		});
	},
	
	// returns true if myApps list has been populated
	// from both sources: /status call - apps in progress
	// and /listApps call - installed applications
	myAppsListIsReady: function()
	{
		return (this._myAppsListIsReady == 0);
	},
	
	// Send MYAPPS_ALL notification when myApps list is populated
	// two things need to happen before myApps list is ready:
	// 1) get all apps in progress
	// 2) get all installed apps
	_sendMyAppsListIsReady: function()
	{
		this._myAppsListIsReady--;
		
		if (this._myAppsListIsReady == 0)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateMyApps) 
					this._observers[i].updateMyApps(null, this.MYAPPS_ALL);
			}
		}
	},
	
	// return app download with specified id
	// will attach listener to returned app object
	// called from details scene assistant
	getAppDownload: function(appId, listener) 
	{
		// queues have priority, we first return app from downloadQ if present and so on
		var app = this._myApps[appId];
		if (!app) app = this._activeQueue[appId];
		if (!app)
		{
			Mojo.Log.info("AppDownloadManager.getAppDownload  creating new with id %s", appId);
			// create a new one and add ourselfs as listener
			// we listen for state changes so that we can add it 
			// to the downloads queue if download starts 
			app = new AppDownload();
			app.attach(this);
			this._activeQueue[appId] = app;
		}
		
		if (listener) 
			app.attach(listener);
		 
		return app;
	},
	
	// releases appDownload obj. If we are the last listener
	// and this app is in active queue, delete it from the queue
	// since it is no longer needed
	releaseAppDownload: function(appId, listener)
	{
		var app = this._myApps[appId];
		if (!app) app = this._activeQueue[appId];
		
		app.detach(listener);
		
		if (app == this._activeQueue[appId] && app._observers.length == 1)
		{
			Mojo.Log.info("AppDownloadManager.releaseAppDownload deleting from activeQueue %s", appId);
			delete this._activeQueue[appId];	
		}
	},
	
	_updateInstalledQueue: function(updateReason)
	{
		Mojo.Log.info("AppDownloadManager._updateInstalledQueue updateReason: %j", updateReason);
		
		// if app was deleted notify the server
		if (updateReason && (updateReason.change == "added" || 
			updateReason.change == "removed" || updateReason.change == "updated"))
		{
			var app = this._myApps[updateReason.packageId];
			if (app)
			{
				app.updateFromInstallNotification(updateReason);
			
				var self = this;
				var f = function()
				{
					Mojo.Log.info("AppDownloadManager._updateInstalledQueue sending updateInstalledApps");
					for (var i = 0; i < self._observers.length; i++) 
					{
						if (self._observers[i].updateInstalledApps) 
							self._observers[i].updateInstalledApps();
					}
				}
				// delay until myApps queue is updated
				f.delay(2);
			}
		}
	},
	
	// returns installed app if found or null
	getInstalledApp: function(id) 
	{
		var app = this._myApps[id];
		if (app && app.installedVersion)
		{
			return app;
		}
		return null;
	},
	
	getMyApps: function()
	{
		return this._myApps;
	},
	
	// adds observer to the list
	attach: function(observer) 
	{
		//Mojo.Log.info("AppDownloadManager.attach");
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		Mojo.Log.info("AppDownloadManager.detach");
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
				Mojo.Log.info("AppDownloadManager.detach removed observer, left %d", this._observers.length);
			}
		}
	},
	
	
	// Observer method for app download state changes
	// Here we decide if this app should be added/removed from
	// the myApps queue. If app is in the queue and has changed state
	// we send the "update" event APP_UPDATED.
	updateDownloadState: function(app) 
	{
		Mojo.Log.info("AppDownloadManager.updateDownloadState ", app.publicApplicationId, app.stateToString());
		Mojo.Log.info("AppDownloadManager.updateDownloadState this._myApps[%s]: %s", app.publicApplicationId, this._myApps[app.publicApplicationId]);

		var updateType = null;
		
		if (app.saveToMyApps() && !this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_ADDED ", app.publicApplicationId, app.stateToString());
			this._myApps[app.publicApplicationId] = app;
			updateType = this.APP_ADDED;
			
			Mojo.assert(this._activeQueue[app.publicApplicationId], "AppDownloadManager.updateDownloadState added to MyApps but app wasn't in the activeQ");
			delete this._activeQueue[app.publicApplicationId];
		}
		else if (app.removeFromMyApps() && this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_DELETED ", app.publicApplicationId, app.stateToString());
			delete this._myApps[app.publicApplicationId];
			updateType = this.APP_DELETED;
			
			// move it to active queue if we are not the only observer
			if (app._observers.length > 1) 
			{
				this._activeQueue[app.publicApplicationId] = app;
			}
		}
		else if (this._myApps[app.publicApplicationId])
		{
			Mojo.Log.info("AppDownloadManager.updateDownloadState APP_UPDATED ", app.publicApplicationId, app.stateToString());
			updateType = this.APP_UPDATED;
		}
			
		// app is updated, notify observers
		if (updateType != null)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateMyApps)
					this._observers[i].updateMyApps(app, updateType);
			}
		}
	},	
	
	_appInstallServiceStatusCB: function(status, singleUpdate, apps)
	{
		Mojo.Log.info("AppDownloadManager._appInstallServiceStatusCB singleUpdate:%s, apps: %j", singleUpdate, apps);
		if (!status) return;
		
		for (var i = 0; i < apps.length; i++)
		{
			var app = this.getAppDownload(apps[i].id);
			app.updateFromStatus(apps[i].id, apps[i].details);
		}
		
		// on first response, when we get the entire list
		// of active apps send "ready" update
		if (!singleUpdate)
		{
			this._sendMyAppsListIsReady();
		}
	},
	
	
	isRevertable: function(id){
		Mojo.Log.info("AppDownloadMgr::isRevertable%s,  %s", id, this._revertableApps[id]);
		
		if(this._revertableApps[id])
			return true;
		else
			return false;
	},
	
	getDetailsRevertableApp: function(id){
		Mojo.Log.info("AppDownloadMgr::isRevertable%s,  %s", id, this._revertableApps[id]);
		return this._revertableApps[id];
	},
	
	allow1xDownload: function(allow, callback)
	{
		var self = this;
		Weave.Services.request("palm://com.palm.downloadmanager", 
		{
			method: 'allow1x',
			parameters: {"value": allow}
		},
		function(response)
		{
			self._allow1xDownload = allow;
			callback && callback(true);
		},
		function(response)
		{
			Mojo.Log.error("AppDownloadManager.allow1xDownload failed %j", response);
			callback && callback(false);
		});	
	},
	
	canAllow1xDownload: function()
	{
		return this._allow1xDownload;
	},
	
	cleanup: function()
	{
		Mojo.Log.info("AppDownloadManager.cleanup");
		if (this._allow1xDownload)
			this.allow1xDownload(false);
			
		// this is just causing errors 
		// "could not find call XXX to cancel"
		//delete this._appInstallerService;
		//delete this._appManagerService;
		//delete this._downloadManagerService;
	}
		
});


var Catalog 			= Catalog || {}; 
Catalog.AppDownloadMngr = Catalog.AppDownloadMngr || new AppDownloadManager;
Catalog.AppLists = Catalog.AppLists || new AppLists;



