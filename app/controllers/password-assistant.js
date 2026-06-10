/*
	Small controller class used to get password for the account
*/
var PasswordAssistant = Class.create(
{
	initialize: function(sceneAssistant, params)
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;	
		this._loginAttemptCount = 0;
		this._params = params;
		this._params.sceneAssistant = sceneAssistant;
		// Customer Service URL will be localized 
		this._custserviceurl = $L("http://www.palm.com/us/support/mobile/webos/contact.html");
	},
	
	setup : function(widget) 
	{
		Mojo.Log.info("--------setup");
		this.widget = widget;
		
		this.acctPasswordAttr = {
			hintText: $L("enter password"),
			modelProperty: 'original',
			autoFocus: true,
			maxLength: 20,
			changeOnKeyPress: true,
			requiresEnterKey: true,
			focusMode: Mojo.Widget.focusSelectMode,
			charsAllow: Utilities.Common.filterSpace.bind(this)
		};
		this.acctPasswordModel = {
			'original' : ''
		};

		this.controller.setupWidget('acctPassword', this.acctPasswordAttr, this.acctPasswordModel);
		this.controller.get('acctPassword').observe(Mojo.Event.propertyChange, this._passwordChanged.bind(this));
		
		this.buttonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.buttonModel = {
			disabled: true,
			buttonLabel : $L('Continue'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('submitPassword', this.buttonAttr, this.buttonModel);
		Mojo.listen(this.controller.get('submitPassword'), Mojo.Event.tap, this._isUserValid.bindAsEventListener(this));
		
		this.forgotButtonAttr = {
			disabledProperty: 'disabled'
		};
		
		this.forgotButtonModel = {
			disabled: false,
			buttonLabel : $L('Forgot password'),
			buttonClass: 'palm-button'
		};
		
		this.controller.setupWidget('forgotPasswordButton', this.forgotButtonAttr, this.forgotButtonModel);
		this.controller.listen('forgotPasswordButton', Mojo.Event.tap, this._forgotPassword.bindAsEventListener(this));
				
		this._getAccountToken();
		this.passwordField = this.controller.get("acctPassword");
	},
	
	activate: function() 
	{
		this.passwordField.mojo.focus();
	},
	
	_passwordChanged: function(event) 
	{
		// Enable/disable based on length of password
		if(this.acctPasswordModel.original.length > 0 && this._enableSubmit) 
	   	{
		  	this.buttonModel.disabled = false;
	   	} 
	   	else 
	   	{
	   		this.buttonModel.disabled = true;
		}
		this.controller.modelChanged(this.buttonModel);

		// If the password field has focus and Enter is pressed then simulate tapping on "next"
		if (Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			// If the submit button is enabled then create the account
			if (this.buttonModel.disabled == false) 
			{
				this.passwordField.mojo.blur();
				this._isUserValid();
				Event.stop(event);
			} 
			else 
			{
				this.passwordField.mojo.focus();
			}
		}
	},
	
	_getAccountToken: function() 
	{
		Mojo.Log.info("------------------- Get account token ------------------");
		var self = this;
		Weave.Services.AccountServices.getAccountToken(function(status, accountToken, accountAlias, accountState) 
		{
			if (status) 
			{
				if (accountAlias != undefined) 
				{
					myProfile.email = accountAlias;
					myProfile.state = accountState;
					self.controller.get('acctEmail').innerHTML = myProfile.email;
					self._enableSubmit = true;
					// Enable/disable based on length of password
					if(self.acctPasswordModel.original.length > 0) 
				   	{
					  	self.buttonModel.disabled = false;
				   	} 
				   	else 
				   	{
				   		self.buttonModel.disabled = true;
					}
					self.controller.modelChanged(self.buttonModel)
				} 
				else 
				{
					//TODO Handle missing account token case
					Mojo.Log.error("PasswordAssistant._getAccountToken: accountAlias == undefined: No account token");	
				}
			} else {
				Mojo.Log.error("No account token");	
			}
		});
	},
	
	_displayErrors: function(badpwdlen, badpwd)
	{
		this.controller.get('passwordLengthError').style.display = (badpwdlen ? null : "none");
		this.controller.get('passwordError').style.display = (badpwd ? null : "none");
	},

	_isUserValid: function() 
	{
		Mojo.Log.info("------------------- _isUserValid------------------");

		this._loginAttemptCount++;
		myProfile.password = this.acctPasswordModel.original;
		
		if ((myProfile.password.length < 6) || (myProfile.password.length > 20)) 
		{
			this._displayErrors(true, false);
			this.passwordField.mojo.focus.defer();
		}
		else if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			this._displayErrors(false, false);
			//Weave.Services.ConnectionManager.showConnectionError();
		}
		else 
		{
			this.buttonModel.disabled = true;
			this.controller.modelChanged(this.buttonModel);
			
			var self = this;
			Weave.Services.DeviceProfile.getDeviceId(function(status, devid)
			{
				if (status && devid) 
				{
					Weave.Services.AccountServices.isUserValid(myProfile.email, myProfile.password.replace(/ /g,""), devid, function(status, response)
					{
						if (status) 
						{
							Mojo.Log.info("Login attempt: " + self._loginAttemptCount);
							
							if (response.isValid == true) 
							{
								self._displayErrors(false, false);
								//This is the temp token used for preferences
								myProfile.idToken = response.idToken;
								self.widget.mojo.close();
								if (response.passwordResetFlag) 
								{
									self.controller.showDialog(
									{
										template: 'payment-setup/reset-password-dialog',
										assistant: new ResetPasswordAssistant(self, self._params)
									});
								}
								else 
								{
									Preferences.setLoginTime();
									self._params.onComplete(
									{
										passwordValid: true
									});
								}
							}
							else 
							{
								// If we have no security question, fetch it
								if (myProfile.questionId == -2) 
								{
									Weave.Services.AccountServices.getAccountSecurityQuestions(myProfile.email, Mojo.Locale.current, function(status, response)
									{
										if (status) 
										{
											if (response.id !== undefined) 
											{
												Mojo.Log.info("Got security question", response.id);
												myProfile.questionId = response.id;
												myProfile.questionText = response.question;
											}
											else 
											{
												myProfile.questionId = -1;
											}
										}
										else 
										{
											Mojo.Log.error("Error in getting account security question = %o", $H(response));
											myProfile.questionId = -1;
										}
										
										self._loginError();
									});
								}
								else 
								{
									self._loginError();
								}
							}
						}
						else 
						{
							if (response.errorCode && response.errorCode === "CONNECTION_ERROR") 
							{
								this.widget.mojo.close();
								//Weave.Services.ConnectionManager.showConnectionError();
							}
						}
					});
				}
				else 
				{
					Mojo.Log.error("Could not get device id %o", $H(response));
				}
			});
		}
	},
	
	/*
	 * Display login error and allow retries.
	 */
	_loginError: function () 
	{
		if (this._loginAttemptCount >= 3) 
		{
			if (myProfile.questionId >= 0) 
			{
				// Forgot password
				this._forgotPassword();
			}
			else 
			{
				Mojo.Log.info("sending password reset");
				var self = this;
				Weave.Services.AccountServices.requestPasswordResetEmail(myProfile.email, function(status, response)
				{
					if (status)
					{
						Mojo.Log.info("------------ resetEmailSuccess -----------------%o", $H(response));
						self.controller.showAlertDialog(
						{
						    onChoose: function(value) 
							{
								self.widget.mojo.close();
								self._params.onComplete({});
							},
						    title: $L("Password reset"),
						    message: $L('Follow the instructions we sent to <b>#{email}</b> to reset your password or <a href="#{url}">contact customer service.</a>').interpolate({email:myProfile.email, url:self._custserviceurl}),
							allowHTMLMessage: true,
						    choices:
							[
					        	{label: $L('Done'), value:'done', type:'color'}    
						    ]
					 	});	
					}
					else
					{
						Mojo.Log.error("could not send password reset email %o", $H(response));
					}
				});
			}
		}
		else 
		{
			Mojo.Log.info("Login attempt: ", this._loginAttemptCount);
			
			if (myProfile.questionId >= 0) 
			{
				this.controller.get('forgotPassword').show();
			}
			this._displayErrors(false, true);
			this.passwordField.mojo.focus();
		}
	},
	
	_forgotPassword: function()
	{
		this.widget.mojo.close();
		this.controller.showDialog(
		{
			template: 'payment-setup/security-question-dialog',
			assistant: new ForgotPasswordAssistant(this, this._params)
		});
	}
});
