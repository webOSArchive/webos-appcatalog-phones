/* Copyright 2009 Palm, Inc.  All rights reserved. */

var PaymentSetupAssistant = Class.create(
{	
    initialize: function(appid, onComplete)
	{
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
		this._appid = appid;
		this._onComplete = onComplete;
	},
	
    setup: function()
	{
    this.appMetrics.trackNewScene("payment/" + this._appid);
		this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");
        var self = this;
		
		self.controller.setupWidget("creditButton", {disabled:false,type:"default"},{buttonLabel:$L("Credit Card"), buttonClass:"primary", disabled:false});
		self.controller.listen("creditButton", Mojo.Event.tap, self.tappedCredit.bind(self));

		self.controller.setupWidget("carrierButton", {disabled:false,type:"default"},{buttonLabel:$L("Carrier Account"), buttonClass:"affirmative", disabled:false});
		self.controller.listen("carrierButton", Mojo.Event.tap, self.tappedCarrier.bind(self));

		if (myProfile.enableOB) {
			Mojo.Log.info("## Payment Setup: OB Enabled")
			// Offer both options
			self.controller.get("obInstructions").show();
			self.controller.get("ccInstructions").hide();
			self.controller.get("ccInstructions2").hide();

			Mojo.Log.info("## Payment Setup: creditButton %s", self.controller.get("creditButton"))
			Mojo.Log.info("## Payment Setup: tap %s", Mojo.Event.tap);
			Mojo.Log.info("## Payment Setup: tappedCredit %s", self.tappedCredit.bind(self));
			
		} else {
			// Allow CC only
			self.controller.get("obInstructions").hide();
			self.controller.get("ccInstructions").show();
			self.controller.get("ccInstructions2").show();
			self.controller.get("carrierButton").hide();
		}
		
		self.createAccount = self.createAccount.bind(self);
	},
	
	cleanup: function()
	{
		this._addedPrefs !== true && this.controller.document.body.removeClassName("prefs");
	},
	
	tappedCarrier: function() {
		this._getPassword("ob");
	},
	
	tappedCredit: function() {
		this._getPassword("cc");
	},
	
	_getPassword: function(accountType) 
	{
		if (Weave.Services.ConnectionManager.isOnline() === false) 
		{
			//Weave.Services.ConnectionManager.showConnectionError();
		} 
		else 
		{
			var self = this;
			this.controller.showDialog(
			{
				template: 'payment-setup/password-dialog',
				assistant: new PasswordAssistant(this, 
				{
					appid: this._appid, 
					onComplete: function(ret)
					{
						if (ret.passwordValid) 
						{
							self.createAccount(accountType);
							//self.controller.stageController.swapScene("create-account", { appid: self._appid, onComplete: self._onComplete });
						}
					}
				})
			});
		}	
	},
	createAccount: function(accountType){
		var self = this;
	
		if (accountType == "ob") {
			this.controller.stageController.swapScene('create-carrier', { 
				appid: self._appid,
				onComplete: self._onComplete,
				email: myProfile.email,
			});
			return;
		}

		this.controller.showAlertDialog({
			onChoose: function(value){
				switch (value) 
				{
					case "ok":
					
						this.controller.stageController.swapScene('create-account', { appid: self._appid, onComplete: self._onComplete });						
						break;
						
					case "change":
						this.controller.stageController.swapScene('change-email-address', { appid: self._appid, onComplete: self._onComplete });
						break;
						
					default:
						break;
				}
			},
			title: $L("Verify Email Address"),
			message: $L("When you purchase items, we'll send receipts to #{email}.").interpolate(myProfile),
			choices: [{
				label: $L("OK"),
				value: "ok",
				type: "primary"
			}, {
				label: $L('Change Email Address'),
				value: "change",
				type: "secondary"
			}, ]
		});
	}
});
