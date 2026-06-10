/* Copyright 2009 Palm, Inc.  All rights reserved. */

var ErrorAssistant = Class.create({
    /*
     * error  - string indicating type of error (e.g.) offline
     * errorCode (optional) - string indicating the a specific reason if available (e.g.) DISC0012
     */
    initialize: function(error, errorCode)
	{
		Mojo.Log.error("ERROR", error);
		this._error = error;
                this._errorCode = errorCode || '';
                this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
    setup: function()
	{
		this.controller.document.body.removeClassName("prefs");
		switch (this._error)
		{
			case 'offline':
        // Google Analytics
        this.appMetrics.trackNewScene('error/network');
				this._selectError('network');
				
				// If the network is down, we wait for it to come up, then switch to the main scene.
				var self = this;
				Weave.Services.ConnectionManager.waitForOnline(function()
				{
					//enable pre menu
					Weave.Utilities.AppMenu.enablePref();
					
					//reset the payment server url so that it is initialized
					//payment server url when network connection is up
					Weave.Services.PaymentServer.resetServerUrl();
					self.controller.stageController.popScenesTo(null);
					self.controller.stageController.pushScene('main');
				});
				ConnectionWidget.connect({ type: 'data'}, this.controller.stageController);
				break;
				
			case 'invalidtoken':
				// If we receive a bad authentication token we must inform the system
        // Google Analytics
        this.appMetrics.trackNewScene('error/invalidtoken');
				var self = this;
				Weave.Services.AccountServices.notifyAuthenticationFailure(function()
				{
					self._selectError('badauth');
				});
				break;
				
			case 'appunavailable':
        // Google Analytics
        this.appMetrics.trackNewScene('error/appunavailable');
				this._selectError('appunavailable');
				break;
			case 'dplfailed':
        // Google Analytics
        this.appMetrics.trackNewScene('error/dlpfailed');
				this._selectError('dplfailed');
				break;	
			default:
        // Google Analytics
        this.appMetrics.trackNewScene('error');
				this._selectError('error');
				break;
		}
		
		this._showHelp = this._showHelp.bind(this);
		this._showHelpDplFailed = this._showHelpDplFailed.bind(this);
		
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);
    },

	activate: function()
	{
		//this.controller.document.body.className = 'palm-default'; //in case we got her during a synergy search

        this.controller.get('show_help').addEventListener(Mojo.Event.tap, this._showHelp);
		this.controller.get('show_dplfailed_help').addEventListener(Mojo.Event.tap, this._showHelpDplFailed);
        this._showErrorCode = this._showErrorCode.bind(this);
        this.controller.get('error').addEventListener(Mojo.Event.tap, this._showErrorCode);
	},
	
	deactivate: function()
	{
		this.controller.get('show_help').removeEventListener(Mojo.Event.tap, this._showHelp);
		this.controller.get('show_dplfailed_help').removeEventListener(Mojo.Event.tap, this._showHelpDplFailed);
                this.controller.get('error').removeEventListener(Mojo.Event.tap, this._showErrorCode);
	},
	
	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.back && this._error != 'appunavailable')
		{
			// We cannot escape this screen - let users go back
			// Event.stop(event);
		}
	},
	
	_showHelp: function() 
	{
		Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
		{
			target: 'no-network'
		});
	},

        _showErrorCode: function()
        {
                this.controller.get("app-catalog-down-code").show();
        },
	
	_showHelpDplFailed: function() 
	{
		Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
		{
			target: 'http://help.palm.com/app_catalog/appcatalog_download_error.html'
		});
	},
	
	_errorScreens: [ 'network', 'error', 'badauth', 'appunavailable','dplfailed', 'downformaintenance' ],
	
	_selectError: function(error)
	{
		if (error === 'error') {
                    if (this._errorCode === '') {
                        this.controller.get("app-catalog-down-code").innerHTML = $L("Additional information not available");
                    } else {
                        this.controller.get("app-catalog-down-code").innerHTML = this._errorCode;
                    }
                }
                
                for (var i = 0; i < this._errorScreens.length; i++)
		{
			var e = this._errorScreens[i];
			this.controller.get(e).style.display = (e == error ? 'block' : 'none');
		}
	}
});
