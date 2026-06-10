/* Copyright 2009 Palm, Inc.  All rights reserved. */

var PrefsAssistant = Class.create(
{
    initialize: function()
	{
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
		this._ccInfos = [];
		
	},
	
    setup: function()
	{
    this.appMetrics.trackNewScene("preferences");
		this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");
		
		this._spinner = new Spinner(this, 'spinner', true, 'large');
		this.invoiceEmailContainer = this.controller.get("invoiceEmailContainer");
		
		this.createAccount = this.createAccount.bind(this);
		this.addAccount = this.addOrEdit.bindAsEventListener(this, false, this.createAccount);
		this.editAccount = this.addOrEdit.bindAsEventListener(this, true, this.createAccount);

		this.createCarrier = this.createCarrier.bind(this);
		this.addCarrier = this.addOrEdit.bindAsEventListener(this, false, this.createCarrier);
		this.editCarrier = this.addOrEdit.bindAsEventListener(this, true, this.createCarrier);

		this.saveInvoiceEmailHandler = this.handleSaveInvoiceEmail.bind(this);
		//this._handleEmbargoAcc = this._handleEmbargoAcc.bind(this);
		//this._doEmbargoCheck = this._doEmbargoCheck.bind(this);
		
		this._passwordModel = {passwordReq: Preferences.getPaymentLogin() };
		this._passwordTypes = 
		[
			{label: $L('Once every 4 hours'), value:'timeout'},
			{label: $L('Every Purchase'), value:'every'}
		];

		// Payment types: This should only be shown if both types are set up
		
		var ccDefault = this._ccinfos && this._ccinfos[0] && this._ccinfos[0]["default"];
		var obDefault = this._obinfos && this._obinfos["default"];
		
		this.paymentTypes = { items : [
				{title:$L("Carrier Account"), code:"carrier", value:obDefault},
				{title:$L("Credit Card"), code:"cc", value:ccDefault},
			]
		};
		
		this.controller.setupWidget('paymentTypeList', {
       		itemTemplate: 'prefs/payment-type',
		}, this.paymentTypes);
		
		this._paymentTypeList = this.controller.get("paymentTypeList");
		
		this.controller.listen("paymentTypeList", Mojo.Event.listTap, this.handlePaymentTypeTap.bind(this));

		this.controller.setupWidget('passwordReqSelector', {label: "", choices: this._passwordTypes, modelProperty:'passwordReq'}, this._passwordModel);
		this.controller.listen('passwordReqSelector', Mojo.Event.propertyChange, this.handlePasswordSelected);
	
		this.controller.listen("addAccountButton", Mojo.Event.tap, this.addAccount);
        this.controller.listen("currentAccount", Mojo.Event.tap, this.editAccount);

		this.controller.listen("addCarrierButton", Mojo.Event.tap, this.addCarrier);
        this.controller.listen("currentCarrier", Mojo.Event.tap, this.editCarrier);

		this.invoiceEmailAttr = {
			multiline: false,
			focus: false,
			limitResize: false,
			enterSubmits: false,
			textCase: Mojo.Widget.steModeLowerCase,
			changeOnKeyPress: false
		};
		this.invoiceEmailModel = {
		 	value : ""
		};
		this.controller.setupWidget('invoiceEmail', this.invoiceEmailAttr, this.invoiceEmailModel);
	},

	handlePasswordSelected:function(ev) 
	{
		Preferences.setPaymentLogin(ev.value);
	},
	
	_verifyPaymentSetup: function()
	{		
		var self = this;	
		
		Mojo.Log.info("## verifyPaymentSetup with myProfile: %s", Object.toJSON(myProfile));
		
		// We only run the spinner the first time we enter this scene, so we dont start it here - but we always stop it (does no harm)
		Weave.Services.PaymentServer.verifyPaymentSetup(function(status, response)
		{
			Mojo.Log.info("## verifyPaymentSetup returned %j", response);

			if (!status) {
				Mojo.Log.error("## verifyPaymentSetup failed with %j", response);
				var err = (response && response.errorCode) ? response.errorCode : response;
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
				return;
			}

			self._spinner.stop();			
			
			Mojo.Log.info("status, response: (%j, %j)", status, response);
			self._invoiceEmail = "";
			
			myProfile.validPayment = undefined;
			
			self._obinfos = null;
			self._ccinfos = null;

			// Get OB info, if any
			if (status && response.OutGetPaymentInfos.obPaymentInfos.length > 0) 
			{	
				myProfile.validPayment = response;
				
				self._obinfos = response.OutGetPaymentInfos.obPaymentInfos[0];
				
				self.controller.get('addCarrierButton').hide();
				self.controller.get('currentCarrier').show();
				
				var userCountry = self._obinfos.address.country;
				var userState = self._obinfos.address.state;
			}
			else
			{
				self.controller.get('addCarrierButton').show();
				self.controller.get('currentCarrier').hide();
			}
			
			// Get CC info, if any
			if (status && response.OutGetPaymentInfos.ccPaymentInfos.length > 0) 
			{
				myProfile.validPayment = response;
				self._ccinfos = response.OutGetPaymentInfos.ccPaymentInfos;
				var ccType = self._ccinfos[0].creditCard.type;
				var ccNum = self._ccinfos[0].creditCard.number;
				
				var creditCardTypeAndLast4digits = ccType + " " + ccNum.substring(ccNum.length - 5);
				
				var userName = self._ccinfos[0].billTo.firstName +
				" " +
				self._ccinfos[0].billTo.lastName;
				self.controller.get('addAccountButton').hide();
				self.controller.get('currentAccount').show();
				
				self.controller.get('creditCardTypeAndLast4digits').update(creditCardTypeAndLast4digits);
				self.controller.get('userName').update(userName);
			}
			else
			{
				if (!status) 
				{
					var err = response.errorCode ? response.errorCode : response;
					if(err == "PMT04800")
						err = "dplfailed";
					Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
				}
				myProfile.validCC = undefined;
				self.controller.get('addAccountButton').show();
				self.controller.get('currentAccount').hide();
			}
			
			if (status) {
				if(response.OutGetPaymentInfos.invoiceEmail) {
					self._invoiceEmail = response.OutGetPaymentInfos.invoiceEmail;
				}
			} else {
				var err = (response && response.errorCode) ? response.errorCode : response;
				if(err == "PMT04800")
					err = "dplfailed";
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
			}
			
			self._setupInvoiceEmail();

			var offerOB = myProfile.enableOB;
		
			if (self._obinfos && self._ccinfos && offerOB) {
				Mojo.Log.info("## Showing default selection.");
				// Both payment types are set up
				self.controller.get('defaultGroup').show();
			
				var defaultType = "";
				if (self._obinfos["default"]) {
					defaultType = "carrier";
				} else if (self._ccinfos[0]["default"]) {
					defaultType = "cc";
				}
			
				// Check the appropriate checkbox
				for (var i = 0; i < self.paymentTypes.items.length; i++) {
					checked = (self.paymentTypes.items[i].code == defaultType);
					self.paymentTypes.items[i].value = checked;
				}
		
				self._paymentTypeList.mojo.noticeUpdatedItems(0, self.paymentTypes.items);
			} else {
				Mojo.Log.info("## Hiding default selection.");
				self.controller.get('defaultGroup').hide();
			}
		
			if (offerOB) {
				self.controller.get('descriptionOB').show();
				self.controller.get('descriptionCC').hide();
			} else {
				self.controller.get('carrierGroup').hide();
				self.controller.get('descriptionCC').show();
				self.controller.get('descriptionOB').hide();
			}
		});
	},
	
	//invoice email field is only set up if there is existing account
	_setupInvoiceEmail: function() {
		Mojo.Log.info("_setupInvoiceEmail for email %s", this._invoiceEmail);
		if (this._invoiceEmail) {
			Mojo.Log.info("showing email");
			this.invoiceEmailModel.value = this._invoiceEmail;
			this.controller.modelChanged(this.invoiceEmailModel, this);
			this.controller.listen("invoiceEmail", Mojo.Event.propertyChange, this.saveInvoiceEmailHandler);
			this.invoiceEmailContainer.show();
		}
		else{
			Mojo.Log.info("hiding email");
			if (this.saveInvoiceEmailHandler)
				this.controller.stopListening("invoiceEmail", Mojo.Event.propertyChange, this.saveInvoiceEmailHandler);
			this.invoiceEmailContainer.hide();
		}
	},
	
	handlePaymentTypeTap: function(event){
		for (var i = 0; i < this.paymentTypes.items.length; i++) {
			if (event.index == i) {
				this.paymentTypes.items[i].value = true; // Set checkbox
				
				var paymentInfoId;
				if (this.paymentTypes.items[i].code == "carrier") {
					// Operator Billing
					paymentInfoId = this._obinfos.paymentInfoId;
				} else {
					// CC
					paymentInfoId =  this._ccinfos[0].paymentInfoId;
				}
				
				myProfile.validPayment = undefined; // clear cache

				Weave.Services.PaymentServer.setDefaultPaymentInfo(paymentInfoId, function(status, response) {
					if (status) {
						Mojo.Log.info("## Set default payment with status, response: (%j, %j)", status, response);
					} else {
						Mojo.Log.error("## setDefaultPaymentInfo failed with %j", response);
						var err = (response && response.errorCode) ? response.errorCode : response;
						Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
					}
				});
			} else {
				this.paymentTypes.items[i].value = false;
			}
		}
    
    this._paymentTypeList.mojo.noticeUpdatedItems(0, this.paymentTypes.items);
	},

	handleSaveInvoiceEmail: function(event){
		this.controller.get("embargoedAddError").hide();
		this.controller.get("emailNotValidError").hide();
		Mojo.Log.info("handleSaveInvoiceEmail Email:%sAddress", event.value);
			
			Event.stop(event);
			var self =  this;
			var ext = event.value.substring(event.value.indexOf(".") + 1);
			if (event.value.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1)
			{
				this.controller.get("emailNotValidError").show();
				this.controller.get("invoiceEmail").focus();
			}
			else{
				this._doEmbargoCheck(event.value, function(status){
					
					if(status){
						Mojo.Log.info("embargoed**");
						self.controller.get("embargoedAddError").show();
						self.controller.get("invoiceEmail").focus();
					}
					else
					{
						self._invoiceEmail = event.value;
						Weave.Services.PaymentServer.setInvoiceEmail(event.value, function(status, response) {
							if (status) {
								Mojo.Log.info("## Set Invoice Email.");
							} else {
								Mojo.Log.error("## setInvoiceEmail failed with %j", response);
								var err = (response && response.errorCode) ? response.errorCode : response;
								Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
							}
						});
					}
				});
			}
	},
	
	activate: function()
	{
		//update the account list
		this._verifyPaymentSetup();
	},
	
	cleanup: function()
	{
		this._addedPrefs !== true && this.controller.document.body.removeClassName("prefs");
		this.controller.stopListening("addAccountButton", Mojo.Event.tap, this.addAccount);
		this.controller.stopListening("currentAccount", Mojo.Event.tap, this.editAccount);
		this.controller.stopListening("addCarrierButton", Mojo.Event.tap, this.addCarrier);
		this.controller.stopListening("currentCarrier", Mojo.Event.tap, this.editCarrier);
		this.controller.stopListening('passwordReqSelector', Mojo.Event.propertyChange, this.handlePasswordSelected);
		this.controller.stopListening("invoiceEmail", Mojo.Event.propertyChange, this.saveInvoiceEmailHandler);
	},
	
	
	addOrEdit:function(event, edit, callback)
	{
		// have the user login first
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
					onComplete: function(ret)
					{
						if (ret.passwordValid)
						{
							Utilities.Common.doEmbargoCheck(edit, callback);
							
						}
					}
				})
			});
		}
	},
	
	createCarrier: function(edit) {
	
		Mojo.Log.info("## ")
	
		var params = {
					edit: edit,
					obInfos: this._obinfos ? this._obinfos : undefined,
					appid: this._appid,
					email: (this._invoiceEmail || myProfile.email),
					onComplete: function(results){
						Mojo.Log.info("--------------- carrier returned %s", results.accountName);
						//this.controller.stageController.popScenesTo("prefs");
					}
				};

		Mojo.Log.info("## this._invoiceEmail: %s myProfile.email: %s", this._invoiceEmail, myProfile.email);
		Mojo.Log.info("## Opening create-carrier with params %j", params);

		this.controller.stageController.pushScene('create-carrier', params);
	},

	createAccount: function(edit){
		var params = {
					edit: edit,
					ccInfos: this._ccinfos ? this._ccinfos[0] : undefined,
					appid: this._appid,
					onComplete: function(){
						this.controller.stageController.popScenesTo("prefs");
            Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_from", "account");
            Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_to", "prefs");
					}
				};
		if (edit) 
			this.controller.stageController.pushScene('create-account', params);
		else {
			var currentEmail = {"email": (this._invoiceEmail || myProfile.email)};
		
			this.controller.showAlertDialog({
				onChoose: function(value){
					switch (value) 
					{
						case "ok":
							this.controller.stageController.pushScene('create-account', params);
							break;
						case "change":
							this.controller.stageController.pushScene('change-email-address', params);
							break;
							
						default:
							break;
					}
				},
				title: $L("Verify Email Address"),
				message: $L("When you purchase items, we'll send receipts to #{email}.").interpolate(currentEmail),
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
		
	},
	
	_doEmbargoCheck:function(email, callback)
	{
		Mojo.Log.info("Prefs-assistant, doEmbargoCheck, new address%s", email);
		
		var ext = email.substring(email.lastIndexOf(".") + 1);
		
		if (AppAssistant.embargoedList) {
			if( AppAssistant.embargoedList.indexOf(ext) != -1)
				callback(true);
			else
				callback(false);
		}
		else {
			
			var self = this;
			Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
				Mojo.Log.info("getEmbargoedCountryList %j", response);
				if (status) {
					AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
					if( AppAssistant.embargoedList.indexOf(ext) != -1)
						callback(true);
					else
						callback(false);
				}
				else {
					var err = (response && response.errorCode) ? response.errorCode : response;
					Utilities.Errors.displayError(err, {
						errCode: err
					}, "PMT_catchAll");
				}
			});
		
		}
	}
	
	
});
