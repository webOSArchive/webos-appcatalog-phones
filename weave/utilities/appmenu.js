/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppMenu = Class.create(
{
	initialize: function(scene, inherit)
	{
		this._scene = scene;
		this._items = inherit ? inherit._items : [];
		if (scene) 
		{
			this._oldHandleCommand = scene.handleCommand;
			scene.handleCommand = this._handleCommand.bind(this);
			if (scene.controller.setupWidget) 
			{
				scene.controller.setupWidget(Mojo.Menu.appMenu, 
				{
					omitDefaultItems: true
				}, 
				{
					items: this._items
				});
			}
		}
	},
	
	addItem: function(label, callback, enabled)
	{
		this._items.push({ label: label, command: 'cmd' + this._items.length + 1, checkEnabled: (enabled ? true : false), _callback: callback, _enabled: enabled });
		return this;
	},
	
	addEdit: function()
	{
		this._items.push(Mojo.Menu.editItem);
		return this;
	},
	
	addHelp: function(url, enabled)
	{
		if (url) 
		{
			this._items.push(Object.extend(
			{
				_callback: function()
				{
					Weave.Services.ConnectionManager.getStatus(function(online)
					{
						Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
						{
							target: online ? url : 'no-network'
						});
					});
				},
				_enabled: enabled ? enabled : function(event)
				{
					event.stopPropagation();
					return true;
				}
			}, Mojo.Menu.helpItem));
		}
		else
		{
			this._items.push(Mojo.Menu.helpItem);
		}
		return this;
	},
	
	addPreferences: function(callback, enabled)
	{
		if (callback) 
		{
			this._items.push(Object.extend(
			{
				_callback: callback,
				_enabled: enabled ? enabled : function(event)
				{
					event.stopPropagation();
					return true;
				}
			}, Mojo.Menu.prefsItem));
		}
		else
		{
			this._items.push(Mojo.menu.prefsItem);
		}
		return this;
	},
	
	addPreferencesAndAcc: function(sceneController)
	{
		this.addItem($L('Preferences & Accounts'), 
				function()
				{
					sceneController.pushScene("prefs");
				},
				function()
				{
					return myProfile.enableAcc;
				})
		return this;
	},

        addSoftwareManager: function()
	{
		this.addItem(
                                $L('Software Manager'),
                                function() {
                                    Weave.Services.ApplicationManager.launchApplication('com.palm.app.swmanager', '');
                                },
                                function() {
                                    return true;
                                }
                            );
		return this;
	},
	
	_handleCommand: function(event)
	{
		if (event.type == Mojo.Event.commandEnable)
		{
			for (var i = 0; i < this._items.length; i++)
			{
				if (this._items[i].command == event.command)
				{
					if (this._items[i]._enabled && !this._items[i]._enabled(event)) 
					{
						event.stopPropagation();
						event.preventDefault();
					}
					break;
				}
			}
		}
		else if (event.type == Mojo.Event.command)
		{
			for (var i = 0; i < this._items.length; i++)
			{
				if (this._items[i].command == event.command)
				{
					this._items[i]._callback && this._items[i]._callback(event);
					break;
				}
			}
		}
		this._oldHandleCommand && this._oldHandleCommand.call(this._scene, event);
	}
	
});

Object.extend(Weave.Utilities.AppMenu,
{
	setDefault: function(menu)
	{
		Weave.Utilities.AppMenu.defaultMenu = menu;
	},
	
	useDefault: function(scene)
	{
		new Weave.Utilities.AppMenu(scene, Weave.Utilities.AppMenu.defaultMenu);
	},
	
	enablePref: function(menu){
		Mojo.Log.info("## Startup: enablePref");
	
		// Check what billing type is supported is supported

		Weave.Services.PaymentServer.getPaymentTypes(function(status, response, token) {			
      myProfile.carrier = token.carrier.toLowerCase();
			myProfile.email = token.email;

			var billingEnabled = false;
			var anyBillingEnabled = false;

			if (status) {
				response.OutGetPaymentTypes.paymentTypes.each(function(t) {
					billingEnabled = true;

					if (t.code == "OB") {
						operatorBillingEnabled = true;
					}
				});
			} else {
				Mojo.Log.error("## Initial getPaymentTypes failed with %j", response);
				var err = response.errorCode ? response.errorCode : response;
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
			}

			myProfile.enableAcc = billingEnabled;
			myProfile.enableOB = operatorBillingEnabled;
		});
	}
});
