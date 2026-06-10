/*
 * AppDownload
 * 
 * represents a single app download. Each time details scene is pushed an instance of
 * AppDownload object is created (or an existing one is returned from myApps hash
 * maintained by the AppDownloadManager). Details scene listens for state changes
 * on this object to update the UI.
 * The most important property of AppDownload is _state which is always set to one
 * of the states defined in downloadstates.js (Catalog.appStates).
 * Behavior of the download object is entirely driven by the current state.
 * AppDownload defers almost all functionlaity to its current state object.
 * 
 * For example if details scene calls appDownload->cancelDownload()
 * the call will map to appDownload->_state->cancelDownload()
 * In some states one can not cancel a download, thus only some states 
 * define this method. Calling cancelDownload() while _state == "installed"
 * will do nothing since Catalog.appStates["installed"] doesn't define cancelDownload().
 * 
 */


var AppDownload = Class.create({
	
	_defaultState: "dummy",
	
	initialize: function() 
	{
		this._observers 		= new Array();
		this._progressPillModel = {};
		this._setState(this._defaultState);
	},
	
	/*
	 *  Update functions
	 *  
	 *  update application object from different sources
	 *  Each source names properties differently, we
	 *  need to "equalize" them before updating object
	 */
	
	// called when application details are pulled
	// from the server to update state. Mostly used to
	// figure out if software update is available
	updateFromServer: function(appDetails) 
	{
		var appType;
		if(appDetails.attributes && ! appDetails.attributes.provides.noApp)
				appType = "app"
		else
			appType = "other"
			
		var details = 
		{
			id: appDetails.id,
			publicApplicationId: appDetails.publicApplicationId,
			title: appDetails.title,
			iconUrl: appDetails.appIcon,
			purchasedVersion: appDetails.purchasedVersion,
			serverVersion: appDetails.version,
			packageSize: appDetails.appSize, 
			installSize: appDetails.installSize,
			isEncrypted: appDetails.isEncrypted,
			currency: appDetails.currency,
			priceType: appDetails.priceType, 
			price: appDetails.price,
			sku: appDetails.sku,
			paymentCategory: appDetails.paymentCategory,
			// install wants vendor and purchase vendorid
			vendor: appDetails.creator,
			vendorid: appDetails.vendorid,
			vendorUrl: appDetails.homeURL,
			vendorCity: appDetails.vendorCity,
			vendorRegion: appDetails.vendorRegion,
			vendorCountry: appDetails.vendorCountry,
			islocationbased: appDetails.islocationbased,
			packageUrl: appDetails.appLocation,
			"appType": appType,
			"services": appDetails.attributes.provides.services,
			"dockMode": appDetails.attributes.provides.dockMode,
			"universalSearch":  appDetails.attributes.provides.universalSearch,
			"accounts" : appDetails.attributes.provides.connectors
			
		}
		
		Object.extend(this, details); 
		
		Mojo.Log.info("AppDownload.updateFromServer updated: details %j", details);
		// delegate to state objects
		if (this._state.updateFromServer)
			this._state.updateFromServer(this);
	},
	
	// called from download manager when installed queue is created
	// at startup
	updateFromInstalledAppsList: function(appDetails)
	{
		var appType;
		var dockMode = false;
		var universalSearch = false;
		
		if (appDetails.apps && appDetails.apps.length > 0) {
			appType = "app";
			
			//if any app in package has dockMode support, the package as dockMode support
			for(i = 0; i < appDetails.apps.length; i++)
			{
				if(appDetails.apps[i].dockMode)
					dockMode = true;
				if(appDetails.apps[i].universalSearch)
					universalSearch = true;
			}
		}
		else 
			appType = "other";
		
		//keeping it compable with old model of information being in first app	
		var title =	appDetails.loc_name ? appDetails.loc_name : appDetails.apps.length > 0 ?appDetails.apps[0].title : undefined;
		var icon =	appDetails.icon ? appDetails.icon : appDetails.apps.length > 0 ?appDetails.apps[0].icon : undefined;
		var vendor =	appDetails.vendor ? appDetails.vendor : appDetails.apps.length > 0 ?appDetails.apps[0].vendor : undefined;
		
			
			
		var details = 
		{
			publicApplicationId: appDetails.id,
			title: title,
			installedVersion: appDetails.version,
			icon: icon ? icon : this.icon,
			"appType": appType,
			installSize: appDetails.size,
			vendor: vendor,
			services : appDetails.services,
			accounts : appDetails.accounts,
			dockMode: dockMode,
                        universalSearch: universalSearch
		}
				
		Object.extend(this, details);
		Mojo.Log.info("AppDownload.updateFromInstalledAppsList updated: %s", this.toString());
		
		if (this._state.updateFromInstalledAppsList)
			this._state.updateFromInstalledAppsList(this); 
	},
	
	// called when list of updatable apps is retrived 
	// from the server (My apps scene calls it)
	updateFromServerUpdatesList: function(appDetails)
	{
		var details = 
		{
			id: appDetails.id,
			serverVersion: appDetails.appVersion,
			packageUrl: appDetails.packageUrl,			
			vendor: appDetails.vendor,
			vendorUrl: appDetails.homeURL,
			iconUrl: appDetails.appIcon,
			packageSize: appDetails.appSize, 
			installSize: appDetails.installSize
		}
		
		Object.extend(this, details); 
		Mojo.Log.info("AppDownload.updateFromServerUpdatesList updated %s, from details: %j", this.toString(), details);
		
		// delegate to state objects
		if (this._state.updateFromServerUpdatesList)
			this._state.updateFromServerUpdatesList(this);
	},
	
	updateFromInstallNotification: function(appDetails)
	{
		///Forcing a refresh for including size. 
		if (appDetails.change == "added" ||
		(appDetails.change == "updated" && appDetails.version &&
		this.installedVersion != appDetails.version)) {
			if (!this.installSize) {
				var details = {
					installSize: appDetails.size
				}
			}
			Object.extend(this, details);
			Mojo.Log.info("AppDownload.updateFromInstallNotification changeDetails: %j, app: %s", appDetails, this.toString());
			this.setState(this._state.toString());
		}
		/*if (appDetails.change == "added" ||
			(appDetails.change == "updated" && appDetails.version && 
			this.installedVersion != appDetails.version)) 
		{
			var details = 
			{
				installSize: appDetails.size
			}
			Object.extend(this, details);
			
			Mojo.Log.info("AppDownload.updateFromInstallNotification changeDetails: %j, app: %s", appDetails, this.toString());
		}
		else if (appDetails.change == "removed" && !this.pendingRevert)
		{
			if (this._state._remove)
				this._state._remove(this);
			Mojo.Log.info("AppDownload.updateFromInstallNotification removed: %s", this.toString());
		}*/
	},
	
	/*to update on status return form appinstaller "installnoverify"
	 * SUCCESS means succesful install
	 * If status string contains "FAILED", would consider it a failure
	 * 
	 */
	updateFromInstallerStatus: function(installResponse)
	{
		/*if (installResponse.state) {
			Mojo.Log.info("AppDownload.updateFromInstallStatus setting to state: %s", installResponse.state);
			this.setState(installResponse.state);
			
			if (installResponse.state === "installed") {
				this.installedVersion = Catalog.AppDownloadMngr.getDetailsRevertableApp(this.publicApplicationId).version;
			}
			else if (installResponse.state === "install failed") {
					Utilities.Errors.displayError(null, {
							title : this.title
							}, "install_revert_failed");
				}
		}*/
	},
	
	/*
	  	"icon download current"
		"icon download complete"
		"icon download paused" - will also have "progress" 100
		"ipk download current" - will also have "progress" : 0-100
		"ipk download complete"
		"ipk download paused"  - will also have "progress" : 0-100
		
		"installing"
		"installed"
		"removing"
		"removed"
		"canceled"
		"download failed" - will also have "errorCode" : int and "reason" : string
		"install failed" - - will also have "errorCode" : int and "reason" : string
		"remove failed" - - will also have "errorCode" : int and "reason" : string
		"unknown"
	 * 
	 * 
	 * 
	 */
	updateFromStatus: function(id, appDetails)
	{
		var appType;
		var newState = appDetails.state;
		Mojo.Log.info("AppDownload.updateFromStatus newState: %s", newState);
		
		// removed & installed notifications are handled in updateFromInstallNotification
		// nothing to do for removing & unknown
		if (newState == "removing" || 
			newState == "unknown" )
		{
			return;
		}
		if(newState == "installed" )
		{
			var details = 
			{
				installedVersion: appDetails.version,
			}
			Object.extend(this, details);
			this.setState("installed");
			Mojo.Log.info("AppDownload.updateFromStatus changeDetails: %j, app: %s", appDetails, this.toString());
			return;
		}
		else if (newState =="removed" )
		{
			if (this._state._remove)
				this._state._remove(this);
			Mojo.Log.info("AppDownload.updateFromStatus removed: %s", this.toString());
			return;
		}
		
		
		// translate state
		if (newState == "icon download complete" ||
			newState == "icon download current")
		{
			appDetails.progress = 0;
			newState = "download progress";
		}				
		
		if (newState == "ipk download complete")
		{
			appDetails.progress = 100;
		}
	
		// translate state
		if (newState == "ipk download current" ||
			newState == "ipk download complete")
		{
			newState = "download progress";
		}
		else if (newState == "icon download paused" ||
				newState == "ipk download paused") 
		{
			newState = "paused";
		}
		
		// fix up error code
		if (newState == "install failed")
		{
			this.errorCode = appDetails.reason;
		}
		else if (newState == "download failed")
		{
			this.errorCode = appDetails.errorCode.toString();
		}
		else 
		{
			this.errorCode = appDetails.errorCode;
		}
		
		if(appDetails.noApp && appDetails.noApp === true)
			appType = "other";
		else
			appType = "app";
		var details = 
		{
			publicApplicationId: id,
			title: appDetails.title,
			progress: appDetails.progress,
			serverVersion: appDetails.version,
			vendor: appDetails.vendor,
			vendorUrl: appDetails.vendorUrl,
			icon: this.icon ? this.icon : appDetails.iconUrl,
			"appType": appType,
			dockMode : appDetails.dockMode,
			universalSearch : appDetails.universalSearch,
			services : appDetails.services,
			accounts : appDetails.accounts
		}
		Object.extend(this, details);
		Mojo.Log.info("AppDownload.updateFromStatus updated: %s, from details %j, appDetails %s", this.toString(), details, JSON.stringify(appDetails));
		
		if (newState == "canceled" || newState == "remove failed") 
		{
			if (this._state._reset)
				this._state._reset(this);
		}
		else 
		{
			if (this._state._allowTransition && !this._state._allowTransition(newState)) 
			{
				Mojo.Log.info("AppDownload.updateFromStatus disallow transition from %s to %s", this.stateToString(), newState);
				return;
			}
				
			Mojo.Log.info("AppDownload.updateFromStatus setting to state: %s", newState);
			this.setState(newState);
		}
	},
	
	// called from state objects when state changes
	setState: function(state, args) 
	{
		Mojo.Log.info("AppDownload.setState %s", state);
		this._setState(state, args);
		
		// notify observers
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateDownloadState) 
				this._observers[i].updateDownloadState(this);
		}
	},
	
	_setState: function(state, args) 
	{
		this._state = Catalog.appStates[state];
		this._state.init(this, args);
	},
	
	// returns progress pill model, called by observers
	// to update the UI in response to state changes
	getProgressPillModel: function()
	{
		Mojo.Log.info("AppDownload.getProgressPillModel %j", this._progressPillModel);
		return this._progressPillModel;
	},
	
	// returns formated price for this app
	getFormattedPrice: function() 
	{
		// NOTE: If app.price is a string, then the server *must* have localized it
		return parseFloat(this.price) != this.price ? this.price : 
			this.price === 0 ? $L("free") : Mojo.Format.formatCurrency(this.price, { fractionDigits: 2, countryCode: myProfile.activationCountry});
		//return parseFloat(this.price) != this.price ? this.price : 
		//	this.price === 0 ? $L("free") : this.currency + " " +Mojo.Format.formatNumber(this.price, { fractionDigits: 2});
	},
	
	// adds observer to the list of observers
	attach: function(observer) 
	{
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		Mojo.Log.info("AppDownload.detach");
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
				Mojo.Log.info("AppDownload.detach removed observer, left %d", this._observers.length);
			}
		}
	},
	
	// defer all actions to state objects, that is 
	// if action is defined for the current state 
	install: function()
	{
		if (this._state.install) 
			this._state.install(this);
	},
	
	// called when updates are installed in a bulk from MyApps scene
	// all checks (install capacity, network..) are done
	// once for the whole batch and are skipped at this time
	installUpdate: function()
	{
		Mojo.Log.info("AppDownload.installUpdate ", this.publicApplicationId);
		if (this._state.installUpdate) 
			this._state.installUpdate(this);
	},
	
	// used by myApps scene to distinguish 
	// apps that are ready to be updated
	canInstallUpdate: function()
	{
		if (this._state.installUpdate) 
			return true;
		else
			return false;
	},
	
	cancelDownload: function()
	{
		if (this._state.cancelDownload) 
			this._state.cancelDownload(this);
	},
	
	pauseDownload: function()
	{
		if (this._state.pauseDownload) 
			this._state.pauseDownload(this);
	},
	
	cancelPausedDownload: function()
	{
		if (this._state.cancelPausedDownload) 
			this._state.cancelPausedDownload(this);
	},
	
	resumeDownload: function()
	{
		if (this._state.resumeDownload) 
			this._state.resumeDownload(this);
	},
	
	launch: function()
	{
		if (this._state.launch) 
			this._state.launch(this);
	},
	
	uninstall: function()
	{
		if (this._state.uninstall) 
			this._state.uninstall(this);
	},
	
	defaultAction: function()
	{
		if (this._state.defaultAction)
			this._state.defaultAction(this);
	},
	
	// called from MyApps scene to perform 
	// default action based on the current state
	myAppsDefaultAction: function()
	{
		if (this._state.myAppsDefaultAction)
			this._state.myAppsDefaultAction(this);
	},
	
	isInstalled: function()
	{
		var app = Catalog.AppDownloadMngr.getInstalledApp(this.publicApplicationId);
		if (app) 
			return true;
		
		return false;
	},
	
	stateToString: function()
	{
		return this._state.toString();
	},
	
	// for debugging purposes
	toString: function()
	{
		return "id:" + this.id + ", publicApplicationId:" + this.publicApplicationId + ", state:" + this.stateToString() + ", title:" + this.title
		+ ", serverVersion:" + this.serverVersion + ", installedVersion:" + this.installedVersion + ", purchasedVersion:" + this.purchasedVersion
		+ ", errorCode:" + this.errorCode + ", icon:" + this.icon + ", updateClass:" + this.updateClass + ", activeClass:" + this.activeClass +
		", resumeClass:" + this.resumeClass + ", pauseClass:" + this.pauseClass + " warningClass:" + this.warningClass +
		", packageSize:" + this.packageSize + " installSize: " + this.installSize + " appType: " + this.appType + "services" + this.servcies 
		+ "accounts" + this.accounts + "dockMode" + this.dockMode + "universalSearch" + this.universalSearch;
	},
	
	// returns true if app should be saved to the global
	// downloads queue based on the current state
	saveToMyApps: function()
	{
		if (this._state.saveToMyApps)
			return this._state.saveToMyApps();
		
		return false;
	},
	
	// returns true if app should be removed from the global
	// downloads queue based on the current state
	removeFromMyApps: function()
	{
		Mojo.Log.info("AppDownload.removeFromMyApps");
		if (this._state.removeFromMyApps)
			return this._state.removeFromMyApps();
		
		return false;
	},

        //Used to construct an informative delete message
        getAppDeleteDialogInfo: function() {
                var deleteType,
                    deleteTitle,
                    deleteMessage,
					removable,
                    removedItems = [];

                if (this.appType !== undefined && this.appType == "app") {
                    deleteTitle = $L('Delete application?');
                    deleteType =  'application';
                } else {
                    deleteTitle = $L('Delete this item?');
                    deleteType =  'item';
                }
				if (Catalog.AppDownloadMngr.isRevertable(this.publicApplicationId) || this.removable === "false") {
					removable = false;
					if (deleteType === 'application') {
							deleteMessage = $L("This application cannot be deleted from your phone.");
						}
						else {
							deleteMessage = $L("This item cannot be deleted from your phone.");
						}
				}
				else
				{
					if (this.accounts !== undefined && this.accounts instanceof Array && this.accounts.length > 0) {
						removedItems[removedItems.length] = $L('•Related accounts & data');
					}
					
					if (this.dockMode !== undefined && this.dockMode === true) {
						removedItems[removedItems.length] = $L('•Dock components');
					}
					
					//TODO: revise check once API in place.  Docs not super clear on the exact value being passed (ie.) true, false, emopty string, etc.
					if (this.universalSearch !== undefined && this.universalSearch !== false && (this.universalSearch === true || this.universalSearch !== '')) {
						removedItems[removedItems.length] = $L('•Universal Search plugins');
					}
					
					if (removedItems.length < 1) {
						if (deleteType === 'application') {
							deleteMessage = $L("Are you sure you want to delete this application from your phone?");
						}
						else {
							deleteMessage = $L("Are you sure you want to delete this item from your phone?");
						}
						
					}
					else {
						removable = true;
						if (deleteType === 'application') {
							deleteMessage = $L("Deleting #{appName} also removes:").interpolate({
								appName: this.title
							}) + "<br>";
							for (var a = 0; a < removedItems.length; a++) {
								deleteMessage += removedItems[a] + "<br>";
							}
						}
						else {
							deleteMessage = $L("Deleting this item removes:") + "<br>";
							for (var a = 0; a < removedItems.length; a++) {
								deleteMessage += removedItems[a] + "<br>";
							}
						}
					}
				}

                return { "deleteTitle": deleteTitle, "deleteMessage": deleteMessage, "removable": removable};
        },
        
    setPromoLink: function(promoLink) {
		this.promoLink = promoLink;
	}
});


