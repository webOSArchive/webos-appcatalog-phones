var ForgotPasswordAssistant = Class.create({
	
	initialize: function(sceneAssistant, params) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
		this.attemptCount = 1;
		this._params = params;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup : function(widget) 
	{
    // Google Analytics
    this.appMetrics.trackNewScene("forgot_password");
		this.widget = widget;
		this._clearErrorMessages();
		
		this.controller.get("questionText").update(myProfile.questionText);
						
		this.responseAttributes = {
			modelProperty: 'response',
			multiline: false,
			maxLength: 50, 
			textReplacement: false,
			focusMode: Mojo.Widget.focusInsertMode,
			changeOnKeyPress: true,
			requiresEnterKey: true
		};
		this.responseModel = {
			'response' : '',
			disabled: false
		};
		
		this.controller.setupWidget('response', this.responseAttributes, this.responseModel);
		this.controller.get('response').observe(Mojo.Event.propertyChange, this.responseTextChanged.bind(this));
		
		this.buttonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.buttonModel = {
			disabled: true,
			buttonLabel : $L('Done'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('submitAnswer', this.buttonAttr, this.buttonModel);
		this.controller.listen('submitAnswer', Mojo.Event.tap, this.submitAnswer.bindAsEventListener(this));
	},
	
	activate: function() 
	{
		this.controller.get("response").mojo.focus();
	},
	
	toggleDisabled: function() 
	{
		
       if(this.responseModel.response.length > 0) {
		  	this.buttonModel.disabled = false;
			this.controller.modelChanged(this.buttonModel);
	   } else {
	   		this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
	   }
    },
	
	responseTextChanged: function(event) 
	{
	 	this.responseModel.response = event.value;
		this.controller.modelChanged(this.responseModel, this);
		this.toggleDisabled();
		if (event && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) {
			// If the submit button is enabled then submit answer
			if (this.buttonModel.disabled == false) {
				this.submitAnswer();
				Event.stop(event);
			} 
		}
	},
	
	_clearErrorMessages: function()
	{
		this.controller.get("noResponseMessage").hide();
		this.controller.get("wrongResponse").hide();
	},
	
	submitAnswer: function() 
	{
		this.response = this.responseModel.response;
		this._clearErrorMessages();
		if(this.response == "" || this.response == undefined) 
		{
			this.controller.get('noResponseMessage').show();
			return;
		}

		if (Weave.Services.ConnectionManager.isOnline() === false) {
			//Weave.Services.ConnectionManager.showConnectionError();
			return;
		}

		this.buttonModel.disabled = true;
		this.controller.modelChanged(this.buttonModel);
		this.attemptCount++;
		
		var self = this;
		Weave.Services.AccountServices.authenticateAccountFromSecurityQuestion(myProfile.email, myProfile.questionId, this.response, function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("authenticate successful: %o", $H(response));
				if(response.returnValue == true) 
				{
					myProfile.idToken = response.idToken;
					self.widget.mojo.close();		
					self.controller.showDialog(
					{
						template: 'payment-setup/reset-password-dialog',
						assistant: new ResetPasswordAssistant(self, self._params)
					});	
				}
			}
			else
			{
				self._clearErrorMessages();
				Mojo.Log.error("changePassword error = %o", $H(response));
				if (self.attemptCount <= 3) 
				{
					self.controller.get('wrongResponse').show();
					self.controller.get('response').mojo.focus();
				} 
				else 
				{
					Weave.Services.AccountServices.requestPasswordResetEmail(myProfile.email, function(status, response)
					{
						if (status)
						{
							self.widget.mojo.close();		
							self.controller.showDialog(
							{
								template: 'payment-setup/reset-email-dialog',
								assistant: new ResetEmailAssistant(self)
							});	
						}
						else
						{
							self.widget.mojo.close();
							Mojo.Controller.errorDialog($L("We could not send an email to reset your password. Visit palm.com/support for more help."));
						}
					});
				}	
			}
		});
	}

});
