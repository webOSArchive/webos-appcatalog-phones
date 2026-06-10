var AppLists = Class.create({
		ADDED: 		0,
		DELETED: 	1,
		UPDATED:	2,
		MYAPPS_ALL:		3,
		UPDATELIST_ALL:		4,
		
	  initialize: function()
	{
		this._apps = new Object();
		this._other = new Object();
		this._updates = new Object();
		this._myUpdates = new Object();
		this._observers = new Array();
		Catalog.AppDownloadMngr.attach(this);
		this._allListsReady =1;
		this._updateListReady =1;
	},
	_initMyApps: function()
	{
		this._other.items = [];
		this._apps.items = [];
		this._myUpdates.items = [];

		if (!Catalog.AppDownloadMngr.myAppsListIsReady()) return;

		this._myAppsHash = Catalog.AppDownloadMngr.getMyApps();
		for (var x in this._myAppsHash)
		{
			if(this._myAppsHash[x].appType === "app")
				this._apps.items.push(this._myAppsHash[x])
			else
				this._other.items.push(this._myAppsHash[x])
			
		}
		
		Mojo.Log.info("AppLists._initMyApps apps len: %d", this._apps.items.length);
		Mojo.Log.info("AppLists._initMyApps other len: %d", this._other.items.length);

		// sort apps alphabetically
		this._apps.items.sort(function(a, b) {
			if (a.title.toLowerCase() == b.title.toLowerCase()) {
				return 0;
			} else {
				return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
			}
		});
		
		// sort apps alphabetically
		this._other.items.sort(function(a, b) {
			if (a.title.toLowerCase() == b.title.toLowerCase()) {
				return 0;
			} else {
				return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
			}
		});
		this._sendAllListsReady();
		// fetch updates
		this._fetchUpdates();
	},
	
	allListsReady: function()
	{
		return (this._allListsReady == 0);
	},
	
	updateListReady: function()
	{
		Mojo.Log.info("AppLists.updateListReady %s ", this._updateListReady);
		return (this._updateListReady == 0);
	},
	getAppsList: function()
	{
		return this._apps;
	},
	
	getOtherList: function()
	{
		return this._other;
	},
	getUpdatesList: function()
	{
		return this._myUpdates;
	},
	
	_sendAllListsReady: function()
	{
		this._allListsReady--;
		
		if (this._allListsReady == 0)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateLists) 
					this._observers[i].updateLists(null, this.MYAPPS_ALL);
			}
		}
	},
	
	_sendUpdateListReady: function()
	{
		Mojo.Log.info("AppLists._sendUpdateListReady");
		this._updateListReady--;
		
		if (this._updateListReady == 0)
		{
			for (var i = 0; i < this._observers.length; i++) 
			{
				if (this._observers[i].updateLists) 
					this._observers[i].updateLists("updates", this.UPDATELIST_ALL);
			}
		}
	},
	
	_fetchUpdates: function()
	{
		var installedAppsPackageIds = new Array();

		for (var x in this._myAppsHash)
		{
			if (this._myAppsHash[x].isInstalled())
				installedAppsPackageIds.push(x);
		}

		if (installedAppsPackageIds.length == 0) return;

		var self = this;
                
        Weave.Services.ApplicationServer.getAppListForUpdates(installedAppsPackageIds, function(status, apps) 
		{
			if (status) 
			{
				Mojo.Log.info("AppLists._fetchUpdates server returned apps: %j", apps);
				for (var i = 0; i < apps.length; i++) 
				{
					if (self._myAppsHash[apps[i].publicApplicationId]) 
					{
						Mojo.Log.info("AppLists._fetchUpdates updating: %j", apps[i].publicApplicationId);
						self._myAppsHash[apps[i].publicApplicationId].updateFromServerUpdatesList(apps[i]);
					}
				}
				self._sendUpdateListReady();
			}
			else 
			{
                                Mojo.Log.error("AppLists._fetchUpdates: %s", status);
				Utilities.Errors.displayError(apps);
			}
		});
                
                /*
		Weave.Services.ApplicationServer.getAppListForUpdates(installedAppsPackageIds, function(status, apps)
		{
			if (status)
			{
				Mojo.Log.info("MainAssistant._fetchUpdates server returned apps: %j", apps);
				for (var i = 0; i < apps.length; i++)
				{
					if (self._myAppsHash[apps[i].publicApplicationId])
					{
						Mojo.Log.info("MainAssistant._fetchUpdates updating: %j", apps[i].publicApplicationId);
						self._myAppsHash[apps[i].publicApplicationId].updateFromServerUpdatesList(apps[i]);
					}
				}
			}
			else
			{
		this._updates = new Object();
				Utilities.Errors.displayError(apps);
			}
		});
                */
	},
	// Observer method to add/remove/update myapps changes
	updateMyApps: function(app, updateReason)
	{
		// Optimization:
		// don't process any updates until myApps list is populated
		if (!Catalog.AppDownloadMngr.myAppsListIsReady()) return;

		Mojo.Log.info("AppLists.updateMyApps app %s, updateReason %s", (app? app.toString() : undefined), updateReason);
		if (updateReason == Catalog.AppDownloadMngr.APP_ADDED)
		{
			if(app.appType == "app")
			 	this.addApp(app,this._apps,  "app");
			else
				this.addApp(app,this._other, "other");
		}
		else if (updateReason == Catalog.AppDownloadMngr.APP_DELETED)
		{
			if(app.appType == "app")
			 	this.deleteApp(app,this._apps,  "app");
			else
				this.deleteApp(app,this._other,"other");
		}
		else if (updateReason == Catalog.AppDownloadMngr.APP_UPDATED)
		{
			Mojo.Log.info("AppLists.updateMyApps UPDATED");
			if(app.appType == "app")
			 	this.updateApp(app,this._apps, "app");
			else
				this.updateApp(app,this._other, "other");
		}
		else if (updateReason == Catalog.AppDownloadMngr.MYAPPS_ALL)
		{
			Mojo.Log.info("AppLists.updateMyApps MYAPPS_ALL");
			this._initMyApps();
		}
	},
	
	addApp: function(app, list,  name){
		var index = this.binarySearch(list.items, app, true);
			Mojo.Log.info("AppLists.updateMyApps APP_ADDED at index %d, %s", index, list.items.length);
			
			if (list.items.length == index || list.items[index].publicApplicationId != app.publicApplicationId) {
				list.items.splice(index, 0, app);
				for (var i = 0; i < this._observers.length; i++) {
					if (this._observers[i].updateLists) 
						this._observers[i].updateLists(name, Catalog.AppLists.ADDED, app, index);
				}
			}
			/*if (widget.mojo)
				widget.mojo.noticeAddedItems(index, [app]);

			this._updateNoAppsDiv();
			this._updateMyUpdatesQueue(app);*/
	},
	
	deleteApp: function(app, list,name){
		// delete this app from myApps array
			var index = this.binarySearch(list.items, app, false);
			Mojo.assert(index >= 0, "AppLists.updateMyApps app can't be deleted since index < 0");

			if (index >= 0)
			{
				list.items.splice(index, 1);
				for (var i = 0; i < this._observers.length; i++) 
				{
					if (this._observers[i].updateLists)
						this._observers[i].updateLists(name, Catalog.AppLists.DELETED, app, index);
				}
				/*if (widget.mojo)
					widget.mojo.noticeRemovedItems(index, 1);*/
			}
			/*else
			{
				// binary search is fixed, but why not have a fallback :-)
				// debug binary search for fantom error print array and search key
				Mojo.Log.error("MainAssistant.updateMyApps binary search failed for %s, %s", i, app.publicApplicationId, app.title);
				for (var i = 0; i < list.items.length; i++)
					Mojo.Log.error("MainAssistant.updateMyApps binary search failed in this._myApps.items[%d]=%s, %s", i, this._myApps.items[i].publicApplicationId, this._myApps.items[i].title);

				index = this.serialSearch(list.items, app);
				if (index >= 0)
				{
					Mojo.Log.error("MainAssistant.updateMyApps serial search found item at index %d", index);
					list.items.splice(index, 1);
					if (widget.mojo)
						widget.mojo.noticeRemovedItems(index, 1);
				}*/
			//}
			if(name != "updates")
				this._updateMyUpdatesQueue(app);
	},
	
	updateApp: function(app, list,  name){
		Mojo.Log.info("AppLists updateApp start");
		var index = this.binarySearch(list.items, app, false);
		Mojo.Log.info("AppLists updateApp index %s" , index);
		Mojo.assert(index >= 0, "AppLists.updateMyApps app can't be updated since index < 0");
			for (var i = 0; i < this._observers.length; i++) 
				{
					if (this._observers[i].updateLists)
						this._observers[i].updateLists(name, Catalog.AppLists.UPDATED, app, index);
				}
			if(name != "updates")
				this._updateMyUpdatesQueue(app);
	},
	
	binarySearch: function(o, v, insert)
	{
	    var u = o.length - 1;
		var l = 0;
		var m;
		var searchTitle = v.title.toLowerCase();

	    while (l <= u)
		{
			m = (l + u) >> 1;

			if (o[m].title.toLowerCase() < searchTitle)
			{
				l = m + 1;
			}
			else if (o[m].title.toLowerCase() == searchTitle)
			{
				// make sure that ids are the same as well
				if (o[m].publicApplicationId == v.publicApplicationId)
					return m;

				// serial search down
				var i = m - 1;
				while (i >= 0 && o[i].title == v.title)
				{
					if (o[i].publicApplicationId == v.publicApplicationId)
						return i;
					i--;
				}

				// serial search up
				var i = m + 1;
				while (i < o.length && o[i].title == v.title)
				{
					if (o[i].publicApplicationId == v.publicApplicationId)
						return i;
					i++;
				}

				if (insert)
					return m;
				else
					return -1;
			}
			else
			{
				u = m - 1;
			}
		}

		if (insert)
			return l;
		else
			return -1;
	},


	// TODO remove this when fantom binary search bug is found, that is if it exists
	serialSearch: function(arr, app)
	{
		for (var i = 0; i < arr.length; i++)
		{
			if (arr[i].publicApplicationId == app.publicApplicationId)
				return i;
		}
	},
	// updates the list of active updates
	_updateMyUpdatesQueue: function(app)
	{
		var state = app.stateToString();
		var index = this.binarySearch(this._myUpdates.items, app, false);
			Mojo.Log.info("AppLists._updateMyUpdatesQueue index %s", index);
		Mojo.Log.info("AppLists._updateMyUpdatesQueue id %s state %s: ", app.publicApplicationId, state);
		if (app.canInstallUpdate() && index  < 0)
		{
			Mojo.Log.info("AppLists._updateMyUpdatesQueue added update to _myUpdates: ", app.publicApplicationId);
			this.addApp(app,this._myUpdates,  "updates");
			
		}
		// if this app does not have an update we delete the hash value
		else if (index >= 0 &&(state == "installed" || state == "install failed" || state == "download failed" || state == "download"))
		{
			Mojo.Log.info("AppLists._updateMyUpdatesQueue added deleted to _myUpdates: ", app.publicApplicationId);
			this.deleteApp(app,this._myUpdates,"updates");
			
		}
		else if (index >= 0){
			this.updateApp(app,this._myUpdates,"updates");
		}
	},
	/*_countAllUpdates: function()
	{
		Mojo.Log.info("_countAllUpdates*******");
		// Calculate required space
		var updateApps = [];

		// loop over my apps and find the ones with updates
		for (var i = 0; i < this._apps.items.length; i++)
		{
			Mojo.Log.info("apps._countAllUpdates loop this._myApps.items[%d]=%s, %s", i, this._apps.items[i].publicApplicationId, this._apps.items[i].stateToString());
			if (this._apps.items[i].canInstallUpdate())
			{
				Mojo.Log.info("apps._countAllUpdates loop added to updateApps this._myApps.items[%d]=%s, %s", i, this._apps.items[i].publicApplicationId, this._apps.items[i].stateToString());
				updateApps.items.splice(index, 0, this._apps.items[i]);
			}
		}
		
		// loop over my apps and find the ones with updates
		for (var i = 0; i < this._other.items.length; i++)
		{
			Mojo.Log.info("apps._countAllUpdates loop this._myApps.items[%d]=%s, %s", i, this._other.items[i].publicApplicationId, this._other.items[i].stateToString());
			if (this._other.items[i].canInstallUpdate())
			{
				Mojo.Log.info("apps._countAllUpdates loop added to updateApps this._myApps.items[%d]=%s, %s", i, this._other.items[i].publicApplicationId, this._other.items[i].stateToString());
				updateApps.items.splice(index, 0, this._apps.items[i]);
			}
		}

		// make sure we have some updates before proceeding
		if (updateApps.length > 0){
			this._updates = updateApps;
			for (var i = 0; i < this._observers.length; i++) 
				{
					if (this._observers[i].updateLists)
						this._observers[i].updateLists("update", "UpdateAvailable", this._updates);
				}
		}
	},*/
	// adds observer to the list
	attach: function(observer) 
	{
		//Mojo.Log.info("AppLists.attach");
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		Mojo.Log.info("AppLists.detach");
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
				Mojo.Log.info("AppLists.detach removed observer, left %d", this._observers.length);
			}
		}
	}
});
