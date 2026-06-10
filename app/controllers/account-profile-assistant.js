var AccountProfileAssistant = Class.create(
{
	initialize: function(params) 
	{
		if(myProfile.email == "" || myProfile.state == "")
		{
			myProfile.state="NoToken";	
		}
		this._params = params;
	},
	
	setup: function() 
	{
		this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");

		this._spinner = new Spinner(this, 'spinner', false, 'large');

		this.firstNameAttributes = {
			modelProperty: 'firstName',
			multiline: false,
			maxLength: 50, 
			textReplacement: true
		};
		this.firstNameModel = {
			'firstName' :  '',
			disabled: false
		};

		this.controller.setupWidget('firstName', this.firstNameAttributes, this.firstNameModel);
		
		this.lastNameAttributes = {
			modelProperty: 'lastName',
			multiline: false,
			textReplacement: true,
			enterSubmits:false,
			maxLength: 50
		};
		this.lastNameModel = {
			'lastName' : '',
			disabled: false
		};

		this.controller.setupWidget('lastName', this.lastNameAttributes, this.lastNameModel);
		
		this.controller.get('firstName').observe(Mojo.Event.propertyChange, this.firstNameChanged.bind(this));
		this.controller.get('lastName').observe(Mojo.Event.propertyChange, this.lastNameChanged.bind(this));	
		
		this.emailAttributes = {
			modelProperty: 'emailAddress',
			multiline: false,
			maxLength: 100, 
			textReplacement: false,
			focusMode: Mojo.Widget.focusInsertMode
		};
		this.emailModel = {
			'emailAddress' : '',
			disabled: false
		};

		this.controller.setupWidget('emailAddress', this.emailAttributes, this.emailModel);
		this.controller.listen('emailAddress', Mojo.Event.propertyChange, this.emailChanged.bind(this));
		
		this._getAccountInfo();

		this.securityQuestions = [{"label":$L("Select a question"), "value":"-1"}];
				
		this.questionsModel = {selectedQuestion: this.securityQuestions[0].label, choices: this.securityQuestions};
		this.controller.setupWidget('questionSelector', {modelProperty: 'selectedQuestion'}, this.questionsModel);	
		this.controller.listen('questionSelector', Mojo.Event.propertyChange, this.questionChanged.bindAsEventListener(this));

		// $('questionSelector').observe(Mojo.Event.propertyChange, this.questionChanged.bindAsEventListener(this));
		this.initializeQuestions();
		
		this.answerAttributes = {
			modelProperty: 'answer',
			multiline: false,
			maxLength: 50, 
			textReplacement: false,
			changeOnKeyPress: true,
			requiresEnterKey: true
		};
		
		this.answerModel = {
			'answer' : '',
			disabled: false
		};
		
		this.controller.setupWidget('answer', this.answerAttributes, this.answerModel);

		// $('answer').observe(Mojo.Event.propertyChange, this.answerAdded.bind(this));
		this.controller.listen('answer', Mojo.Event.propertyChange, this.answerAdded.bind(this));
		
		this.controller.listen('continueButton', Mojo.Event.tap, this.saveAccount.bindAsEventListener(this));
		this.controller.listen('resendEmail', Mojo.Event.tap, this.resendVerificationEmail.bindAsEventListener(this));
		this.controller.listen('answer', Mojo.Event.tap, this.answerChanged.bindAsEventListener(this));
		
	},
	
	ready: function() 
	{
		if(myProfile.state == 'B') 
		{
			this.controller.get('accountState').hide();
		} 
		else 
		{
			this.controller.get('accountState').show();
		}
	},
	
	firstNameChanged: function(event) 
	{
	 	this.firstNameModel.firstName = event.value.capitalize();
		this.controller.modelChanged(this.firstNameModel, this);
		this.controller.get('firstNameError').hide();
	},
	
	lastNameChanged: function(event) 
	{
		this.lastNameModel.lastName = event.value.capitalize();
		this.controller.modelChanged(this.lastNameModel, this);
		this.controller.get('lastNameError').hide();
	},
	
	emailChanged: function(event) 
	{
		$('emailError').hide();
	 	this.emailModel.emailAddress = event.value;
		this.controller.get('emailEmptyError').hide();
	},
	
	answerAdded: function(event) 
	{
	 	this.answerModel.answer = event.value;	
		if (event && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) 
		{
			this.changePassword();
			Event.stop(event); 
		}
	},
	
	handleCommand: function(event) 
	{	
		if (event.type == Mojo.Event.back)
		{
			this._addedPrefs !== true && Element.removeClassName.defer(this.controller.document.body, "prefs");
		}
		else if (event.type == Mojo.Event.command && event.command == Mojo.Menu.helpCmd)  
		{
            Mojo.Log.info("------------------ Launch Help -------------------------");
			this.launchHelp();
        }
        else if (event.type == Mojo.Event.commandEnable && event.command == Mojo.Menu.helpCmd)  
		{
            event.stopPropagation();
        }
	},
	
	areAllFieldsFilled: function () 
	{
		this.controller.get('firstNameError').hide();
		this.controller.get('lastNameError').hide();
		this.controller.get('emailEmptyError').hide();
		this.controller.get('answerError').hide();
				
		if (this.firstNameModel.firstName.empty()) {
			this.controller.get('firstNameError').show();
			return false;
		} 
		
		if (this.lastNameModel.lastName.empty()) {
			this.controller.get('lastNameError').show();
			return false;
		} 
		
		if (this.emailModel.emailAddress.empty()) {
			this.controller.get('emailEmptyError').show();
			return false;
		}
		
		if ((this.selectedQuestionId != -1) && (this.answerModel.answer.empty())) {
			this.controller.get('answerError').show();
			return false;
		}
		 
		return true;
	},

	showEmailError: function () 
	{
		$('emailError').show();
		this.controller.showAlertDialog({
	    	onChoose: function(value) {
				if("cancel" == value) {
					Mojo.Controller.stageController.swapScene("backup");
				} else {
					
				}
			},
		    title: $L("Invalid email address"),
		    message: $L("You must use a valid email address format."),
		    choices:[
	        	{label:$L('Edit Address'), value:"edit"},  
	        	{label:$L("Don't Update"), value:"cancel"}    
		    ]
	  });
	},
	
	launchHelp: function() 
	{
		var openParams = {  scene: 'page', url: "http://help.palm.com/palm_acct/index.html"};
		return new Mojo.Service.Request('palm://com.palm.applicationManager', {
        				method: 'open',
		      			parameters: { id: 'com.palm.app.browser',
						              params: openParams }
   		 });
	},
		
	resendVerificationEmail: function () 
	{
		Mojo.Log.info("Resending verification");
		var self = this;
		Weave.Services.AccountServices.resendVerificationEmail(function(status, response)
		{
			if (status)
			{
				var confirmText = $L("A verification email was sent to #{email}.").interpolate({
					email: myProfile.email
				});
				self.controller.showAlertDialog({
					onChoose: function(value){},
					title: $L('Email Sent'),
					message: confirmText,
					choices: 
					[{
						label: $L('Done'),
						value: 'next',
						type: 'color'
					}]
				});
			}
			else
			{
				if(response.JSONException && response.JSONException.errorCodes === "PAMS1114") 
				{
					$('accountState').hide();
				}
				else if (response.errorText && response.errorText === "No response") 
				{
					self.controller.showAlertDialog(
					{
						onChoose: function(value)
						{
							if("help" == value) 
							{
								this.launchHelp();
							}
						},
						title: $L('No Internet Connection'),
						message: $L('We will send your confirmation email as soon as you have an internet connection.'),
						choices: [{
							 choices:[
								{label:$L('Help'), value:"help", type: 'color'},
					        	{label:$L('OK'), value:"ok", type: 'color'} 
						    ]
						}]
					});
				}		
			}
		});
	},
		
	initializeQuestions: function() 
	{
		Mojo.Log.info("Get questions");
		Mojo.Log.info("this.controller = ",this.controller);
		this.questionId = "";
		this.getUserLocale();
	},
		
	getUserLocale: function () 
	{
		var self = this;
		Weave.Services.AccountServices.getAllSecurityQuestions(Mojo.Locale.current, function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("Challenge Qs = ",response.challengeQuestions);
				myProfile.securityQuestions = response.challengeQuestions;
				
				self.getQuestionForAccount();
			}
			else
			{
				Mojo.Log.error("error in getting sec questions %o", $H(response));
				// FIX
				// AppAssistant.accountService.getAllSecurityQuestions(
				// 							this.getSecurityQuestions.bind(this), 
				// 							this.errorSecurityQuestions.bind(this), this.controller);
			}
		});
	},
	
	getQuestionForAccount: function () 
	{
		var self = this;
		this._spinner.start();
		Weave.Services.AccountServices.getAccountSecurityQuestions(myProfile.email, Mojo.Locale.current, function(status, response)
		{
			self._spinner.stop();
			if (status)
			{
				Mojo.Log.info("Account sec question = %o", $H(response));
				if (response.id) 
				{
					myProfile.questionId = response.id;
					Mojo.Log.info("Account sec question = " , response.id);
					myProfile.questionText = response.question;
				}	
				Mojo.Log.info("myProfile.questionId = ",myProfile.questionId);
				if (myProfile.questionId != -2) 
				{
					self.answerModel.answer = "*******";
					self.controller.modelChanged(self.answerModel); 
				}	
				self.setSecurityQuestions();
			}
			else
			{
				Mojo.Log.error("Error in getting account security question = %o", $H(response));
			}
		});
	},
	
	setSecurityQuestions: function() 
	{
		var index = -1;
		var questions = 
		[
			{
				label: $L("Select a question"),
				value: index
			}
		];

		Mojo.Log.info("Questions Model= ",this.questionsModel.choices);
		
		if (myProfile.securityQuestions == undefined) 
		{
			Mojo.Log.info("no security questions");
		} 
		else 
		{	
			var i = 0;
			for (var i = 0; i < myProfile.securityQuestions.length; i++)
			{
				var question = myProfile.securityQuestions[i];
				if (myProfile.questionId === question.id) 
				{
					index = i;
				} 
				questions.push(
				{
					label: question.question,
					value: question.id
				});	
			}
		}
				
		this.securityQuestions = questions;
		this.selectedIndex = index;
		Mojo.Log.info("Selected index = ", this.selectedIndex);
				
		if (this.selectedIndex == -1) 
		{
			this.selectedQuestionId = -1;
		} 
		else 
		{
			this.selectedQuestionId = this.securityQuestions[this.selectedIndex].value;
			this.questionsModel.selectedQuestion = this.securityQuestions[this.selectedIndex].value;
		}	
		this.questionsModel.choices = this.securityQuestions;
		myProfile.selectedQuestionId = this.selectedQuestionId;
		this.controller.modelChanged(this.questionsModel, this);
	},
	
	questionChanged: function(event) 
	{
		var newId = this.questionsModel.selectedQuestion;
		if(newId != this.selectedQuestionId) 
		{
			Mojo.Log.info("Question is changed");
			this.selectedQuestionId = newId;
		}
	},
	
	answerChanged: function(event) 
	{
		if (this.selectedQuestionId == -1) 
		{
			this.controller.showAlertDialog(
			{
				onChoose: function(value){},
				title: $L("Error"),
				message: $L("Please select a security question"),
				choices: 
				[{
					label: $L('Continue'),
					value: 'next',
					type: 'color'
				}]
			});
			return;
		}
		this.answerModel.answer = "";
		this.controller.modelChanged(this.answerModel, this);
		
		this.newAnswer = true;
	},
	
	
	_getAccountInfo: function() 
	{
		Mojo.Log.info("Getting account info");
		var self = this;
		Weave.Services.AccountServices.getAccountInfo(function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("Got account info");
				self.firstNameModel.firstName = response.firstName;
				self.controller.modelChanged(self.firstNameModel, self);
				
				self.lastNameModel.lastName = response.lastName;
				self.controller.modelChanged(self.lastNameModel, self);
				
				self.emailModel.emailAddress = response.email;
				self.controller.modelChanged(self.emailModel, self);
										
				myProfile.firstName =  response.firstName;
				myProfile.lastName =  response.lastName;
				myProfile.email = response.email;
			}
			else
			{
				Mojo.Log.error("_getAccountInfo: error occured: "+$H(response).inspect());
			}
		});
	},
	
	cleanup: function() 
	{
		Mojo.Log.info("&&&&&&&&&&&&&&&&&&&&&& clean up called");
	},
		
	saveAccount: function() 
	{
		this.previousEmail = myProfile.email;
		Mojo.Log.info("saving ---------------");

		if (this.areAllFieldsFilled()) 
		{
			if (!this.validateEmail()) 
			{
				this.showEmailError();
			}
			else if (Weave.Services.ConnectionManager.isOnline() === false) 
			{
				Mojo.Log.info("show connection error ---------------");
				//Weave.Services.ConnectionManager.showConnectionError();
			}
			else 
			{
				this.lockEditMode();
				this.checkNameChange();
				this.checkEmailChange();
				this.checkSecurityChange();
				
				this.controller.stageController.pushScene("create-account", 
				{
					appid: this._params.appid,
					onComplete: this._params.onComplete
				});
			}
		}	
	},
		
	lockEditMode: function() 
	{
        $$('#editProfile input:focus').each(function(element){
            element.blur();
        });
    },
	
	checkNameChange: function() 
	{
		Mojo.Log.info("check name change");
		if((myProfile.firstName != this.firstNameModel.firstName) ||
			(myProfile.lastName != this.lastNameModel.lastName))	{
			Mojo.Log.info("Name changed - call update info");	
			myProfile.firstName =this.firstNameModel.firstName;
			myProfile.lastName = this.lastNameModel.lastName;
			myProfile.email = this.emailModel.emailAddress;

			Weave.Services.AccountServices.updateAccountInfo(myProfile, function(status, response)
			{
				if (status)
				{
					Mojo.Log.info("Name change success: %o", $H(response));
				}
				else
				{
					Mojo.Log.error("Name change error: %o", $H(response));
				}
			});	
		}
	},
	
	validateEmail: function () 
	{
		var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
		
		if(this.emailModel.emailAddress == "" || this.emailModel.emailAddress == undefined) 
		{
			return false;
		} 
		else 
		{
			return (this.emailModel.emailAddress.search(emailRegEx) != -1);
		} 
	},
	
	checkEmailChange: function() 
	{	
		if(this.previousEmail != this.emailModel.emailAddress)	
		{
			Mojo.Log.info("Email changed - change email");	
			
			myProfile.email = this.emailModel.emailAddress;
			this.previousEmail = myProfile.email;

			Weave.Services.AccountServices.changeEmail(myProfile.email, function(status, response)
			{
				if (status)
				{
					Mojo.Log.info("Email change success: %o", $H(response));
				}
				else
				{
					Mojo.Log.error("Email change error: %o", $H(response));
				}
			});
		}
	},
	
	checkSecurityChange: function() 
	{
		if (this.selectedQuestionId != -1 && (myProfile.selectedQuestionId != this.selectedQuestionId || this.newAnswer)) 
		{
			if (myProfile.idToken != undefined) 
			{
				Mojo.Log.info("answer value ---------------- ",this.answerModel.answer.empty());
				if (this.answerModel.answer.empty()) 
				{
					// Do we remind the user to set answer?
					return;
				}	

				Weave.Services.AccountServices.changePassword(
								myProfile.password, 
								this.selectedQuestionId, 
								this.answerModel.answer, 
								myProfile.idToken,
								false,
								function(status, response)
				{
					if (status)
					{
						Mojo.Log.info("successSecurityChange: %o", $H(response));
					}
					else
					{
						Mojo.Log.error("errorSecurityChange: %o", $H(response));
					}
				});
			} 
			else 
			{
				Mojo.Log.info("No id token ");
				//TODO Authenticate user again
			}				
		}
	}	
});
