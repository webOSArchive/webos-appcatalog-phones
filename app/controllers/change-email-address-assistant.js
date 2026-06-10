var ChangeEmailAddressAssistant = Class.create(
{
	initialize: function(params)
	{
		this._params = params;
		this._emailAddress = { email1: "", email2: "" };
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup: function()
	{
    // Google Analytics
    this.appMetrics.trackNewScene('change_email_address');

		this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");
		
		this._validateEmail = this._validateEmail.bindAsEventListener(this);
		
		this.controller.setupWidget("emailAddress1",
		{
			hintText: $L('Enter your address'),
			modelProperty: "email1",
			maxLength: 100, 
			textReplacement: false,
			focusMode: Mojo.Widget.focusInsertMode
		}, this._emailAddress);
		
		this.controller.setupWidget("emailAddress2",
		{
			hintText: $L('Enter it again'),
			modelProperty: "email2",
			maxLength: 100, 
			textReplacement: false,
			focusMode: Mojo.Widget.focusInsertMode
		}, this._emailAddress);

		this.controller.listen('okButton', Mojo.Event.tap, this._validateEmail);
	},
	
	cleanup: function(){
        this._addedPrefs !== true && this.controller.document.body.removeClassName("prefs");
    },
	
	_validateEmail: function()
	{ 
		if (this._emailAddress.email1.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1)
		{
			this._setErrors(2);
		}
		else if (this._emailAddress.email1 == this._emailAddress.email2) 
		{
			/*this._setErrors(0);
			Weave.Services.AccountServices.isEmailAvailable(this._emailAddress.email1, this._changeEmail.bind(this));*/
			
			var ext = this._emailAddress.email1.substring(this._emailAddress.email1.lastIndexOf(".") + 1);
			
			if (AppAssistant.embargoedList.indexOf(ext) != -1)
			{
				Mojo.Log.info("embargoed**");
				this._setErrors(3);
				this.controller.get("emailAddress1").focus();
					
			}
			else 
			{
				this._changeEmail();
			}	
		}
		else 
			this._setErrors(1);
		
	},
	
	_changeEmail: function()
	{
		var self = this;
		Weave.Services.PaymentServer.setInvoiceEmail(this._emailAddress.email1, function(){});
		this._params.invoiceEmail = this._emailAddress.email1;
		this.controller.stageController.popScene();
		this.controller.stageController.pushScene('create-account', self._params);
    Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_from", "change_email_address");
    Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_to", "create_account");
		
		//commenting out as no need for alert 		
		/*self.controller.showAlertDialog({
			onChoose: function(value){
				if (value == "ok") {
					this.controller.stageController.popScene();
					this.controller.stageController.pushScene('create-account', self._params);
				}
			},
			title: $L("Confirmation Email"),
			message: $L("We sent an email message to #{email1}. You must tap the link in the email to complete the email address change.").interpolate(this._emailAddress),
			choices: [{
				label: $L("OK"),
				value: "ok"
			}]
		});*/
		
	},
	
	_setErrors: function(errno)
	{
		switch (errno)
		{
			case 0:
				this.controller.get("emailNotSameError").hide();
				this.controller.get("emailNotValidError").hide();
				this.controller.get("palmProfileExistsError").hide();
				break;
			case 1:
				this.controller.get("emailNotSameError").show();
				this.controller.get("emailNotValidError").hide();
				this.controller.get("embargoedAddError").hide();
				break;
			case 2:
				this.controller.get("emailNotSameError").hide();
				this.controller.get("emailNotValidError").show();
				this.controller.get("embargoedAddError").hide();
				break;
			case 3:
			this.controller.get("emailNotSameError").hide();
			this.controller.get("emailNotValidError").hide();
			this.controller.get("embargoedAddError").show();
			break;
			default:
				break;
		}
	}
});
