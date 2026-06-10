/*
	Small controller class used to input and display promo code
*/
var PromoCodeAssistant = Class.create(
{
	initialize: function(sceneAssistant, params)
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;	
		this._verifyAttemptCount = 0;
		this._params = params;
		this._params.sceneAssistant = sceneAssistant;
		// Customer Service URL will be localized 
		this._custserviceurl = $L("http://www.palm.com/us/support/mobile/webos/contact.html");
	},
	
	setup : function(widget) 
	{
		Mojo.Log.info("-------------------PromoCodeAssistant setup------------------");
		this.widget = widget;
		
		this.usePromoCodeButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.usePromoCodeButtonModel = {
			disabled: false,
			buttonLabel : $L('Use Promo Code'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('usePromoCodeButton', this.usePromoCodeButtonAttr, this.usePromoCodeButtonModel);
		Mojo.listen(this.controller.get('usePromoCodeButton'), Mojo.Event.tap, this._isCodeValid.bindAsEventListener(this));
		
		this.cancelButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.cancelButtonModel = {
			disabled: false,
			buttonLabel : $L('Cancel'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('cancelButton', this.cancelButtonAttr, this.cancelButtonModel);
		this.controller.listen('cancelButton', Mojo.Event.tap, this._cancelButton.bindAsEventListener(this));
		
		this.promoCodeAttr = {
				hintText: $L("Promo Code"),
				modelProperty: 'original',
				autoFocus: true,
				maxLength: 256,
				changeOnKeyPress: true,
				requiresEnterKey: true,
				focusMode: Mojo.Widget.focusSelectMode,
			};
	    this.promoCodeModel = {
				'original' : '',
				disabled: false
			};
			
		this.promoCodeModel.original = this._params.promoCode;
	        				
		this.controller.setupWidget('promoCode', this.promoCodeAttr, this.promoCodeModel);
		this.controller.get('promoCode').observe(Mojo.Event.propertyChange, this._promoCodeChanged.bind(this));
		
		this.promoCodeField = this.controller.get("promoCode");
	},
	
	activate: function() 
	{
		Mojo.Log.info("------------------- PromoCodeAssistant activate ------------------");
		
		this.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: this._params.title});
		
		if ((this._params.errCode) && (this._params.errCode!="")) {
			this._displayErrors(true, this._params.errCode);
		}
		
		if(this.promoCodeModel.original.length > 0)			
	   	{
		  	this.usePromoCodeButtonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.usePromoCodeButtonModel.disabled = true;
		}
		this.controller.modelChanged(this.usePromoCodeButtonModel);
		
		this.promoCodeField.mojo.focus();
	},
	
	_promoCodeChanged: function(event) 
	{
		Mojo.Log.info("------------------- _promoCodeChanged ------------------");
		
		// Enable/disable based on length of promo code
		if(this.promoCodeModel.original.length > 0)			
	   	{
		  	this.usePromoCodeButtonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.usePromoCodeButtonModel.disabled = true;
		}
		this.controller.modelChanged(this.usePromoCodeButtonModel);
		// If the promoCode field has focus and Enter is pressed then simulate tapping on "Use Promo Code"
		if (Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			// If the submit button is enabled then create the account
			if (this.usePromoCodeButtonModel.disabled == false) 
			{
				this.promoCodeField.mojo.blur();
				this._isCodeValid();
				Event.stop(event);
			} 
			else 
			{
				this.promoCodeField.mojo.focus();
			}
		}
	},
	
	_displayErrors: function(show,errorCode)
	{		
		var errMessage;
		var errorMessages = {"INVALID": $L("This promo code is invalid."),
		"PMTPROMO70101": $L("This promo code has reached its limit and is no longer valid."),
		"PMTPROMO70102": $L("This promotion has been cancelled."),
		"PMTPROMO70103": $L("This promo code has expired."),
		"PMTPROMO70104": $L("This promotion has been cancelled."),
		"PMTPROMO70105": $L("This promotion has not started yet. Please try again later."),
		"PMTPROMO70106": $L("This promo code cannot be used in your country."),
		"PMTPROMO70107": $L("This promo code cannot be used with <CARRIER NAME>."),
		"PMTPROMO70108": $L("This app's price is higher than the value of the promo code."),
		"PMTPROMO70109": $L("This promo code is not valid for this app or version."),
		"PMTPROMO70110": $L("This promo code is not valid for this app or version."),
		"PMTPROMO70010": $L("This promo code is invalid.")};
				
		Mojo.Log.info("errorCode: %s" + errorCode);
		//errorCode = "PMTPROMO70107";// test
		//errorCode = "error";
		if (show) {
			if (errorCode == "PMTPROMO70107" ){
				// Get carrier id first for show
				var self = this;
				Weave.Services.Preferences.SystemProperties.getCarrier(function(status, carrier)
						{
							Mojo.Log.info("Carrier:", carrier);
							var _carrier = status ? carrier : 'ROW';
							errMessage = $L('This promo code cannot be used with #{carrierName}.').interpolate({carrierName: _carrier});
							self.controller.get('Error').style.display = "";
					        self.controller.get('ErrorMessage').innerHTML = errMessage;
						});
			}else {
			    errMessage = errorMessages[errorCode];
			    if (errMessage) {
					// Show inline message
			        this.controller.get('Error').style.display = "";
			        this.controller.get('ErrorMessage').innerHTML = errMessage;
			        
				}
			}
			
		}else {
			this.controller.get('Error').style.display = "none";
		}
		
	},

	_isCodeValid: function() 
	{
		Mojo.Log.info("------------------- _isCodeValid------------------");
		this._verifyAttemptCount++;
		promoCode = this.promoCodeModel.original;
		// Filter space
		promoCode = promoCode.replace(/ /g, '');
		appid = this._params.appid;
		version = this._params.version;
		
		Mojo.Log.info("promoCode: " + promoCode + " appid: " + appid + "version: " + version);
		
		if ((promoCode.length < 1) || (promoCode.length > 64)) 
		{
			this._displayErrors(true, "INVALID");
		}
		else if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			this._displayErrors(false);
			
		}
		else 
		{
			this.usePromoCodeButtonModel.disabled = true;
			this.controller.modelChanged(this.usePromoCodeButtonModel);
			
			var self = this;
			Weave.Services.PaymentServer.checkPromoCodeStatus(promoCode, appid, version, function(status, response)
			{			
				if (status) 
				{
					Mojo.Log.info("Verify attempt: " + self._verifyAttemptCount);
					
					if (response.OutCheckPromoCodeStatus.valid == "true") 
					{
						self._displayErrors(false);
						
						self.widget.mojo.close();
						self._params.onComplete(
								{
									promoCodeValid: true,
									status: response.OutCheckPromoCodeStatus.status,
									promoCode: promoCode
								});
					}
					else if (response.OutCheckPromoCodeStatus.valid == "false")
					{
						// invalid code error
						self.usePromoCodeButtonModel.disabled = false;
					    self.controller.modelChanged(self.usePromoCodeButtonModel);
						self.promoCodeModel.disabled = false;
						self.controller.modelChanged(self.promoCodeModel);
						self.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: self._params.title});
						
						if (response.OutCheckPromoCodeStatus.errorCode)
						{
							self._displayErrors(true,response.OutCheckPromoCodeStatus.errorCode);
						}else {
							self._displayErrors(true,"INVALID");
						}
						
						self.promoCodeField.mojo.focus();
						
					}
				}
				else 
				{				
					self.usePromoCodeButtonModel.disabled = false;
					self.controller.modelChanged(self.usePromoCodeButtonModel);
					if(response.errorCode && response.errorCode === "PMTPROMO70010"){ 
                        // invalid code error		
                        self.promoCodeModel.disabled = false;
						self.controller.modelChanged(self.promoCodeModel);
						self.controller.get('promoCodeDiscript').innerHTML = $L('Enter promo code to download #{title}.').interpolate({title: self._params.title});						
						self._displayErrors(true,response.errorCode);						
						self.promoCodeField.mojo.focus();

					}else if (response.errorCode) {
						var err = response.errorCode;
		                Utilities.Errors.displayError(err, {
		                    errCode: err
		                }, "PMT_catchAll");
					}
					
				}
			});
		}
	},
	
	_cancelButton: function()
	{
		this.widget.mojo.close();
	}
	
	
});
