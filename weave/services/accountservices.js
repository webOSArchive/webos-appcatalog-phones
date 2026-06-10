/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.AccountServices = 
{
	_target: 'palm://com.palm.accountservices',
	
	getServerUrl: function(callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'getServerUrl',
			parameters: {}
		},
		function(response)
		{
			callback(true, response.serverUrl);
		},
		function()
		{
			callback(false);
		});
	},
	
	getPaymentServerUrl: function(callback)
	{
		/*
		 * e.g. http://148.92.248.80:8080/palmcsext/services/deviceJ/getPreferences
		 * Request : {"InPreferences":{"preferenceKey":"APPLICATIONS,PAYMENT"}}
		 * Response: {"OutParameterInfo":{"parameterInfos":{"category":"SETTINGS","key":"PAYMENT_URL","value":"http:\/\/148.192.248.80:8080\/palmcspmtext\/services\/paymentJ\/"},"size":1}}
		 */
		Weave.Services.request(this._target,
		{
			method: 'getPreferences',
			parameters: 
			{
				appName: "PAYMENT"
			}
		},
		function(response)
		{
			callback(true, response.parameterInfos.value);
		},
		function()
		{
			callback(false);
		});
	},

  getGoogleAnalyticsWebPropertyID: function(callback)
  {
		Weave.Services.request(this._target,
		{
			method: 'getPreferences',
			parameters: 
			{
				appName: ["APP_DISCO"]
			}
		},
    function(response)
    {
      // we default to appInfo.gaAccount
      var propertyID = Mojo.appInfo.gaAccount;

      // looking for the right setting
      for(var i = 0 ; i < response.size ; i++) 
      {
        if(response.parameterInfos[i]["key"] == "GOOGLE_ANALYTICS_WPID")
          propertyID = response.parameterInfos[i]["value"];
      }
      callback(true, propertyID);
    },
    function()
    {
      callback(false);
    });
  },
	
	getAccountToken: function(callback)
	{
		Mojo.Log.info("**** Trying to get Account Token");
		Weave.Services.request(this._target,
		{
			method: 'getAccountToken',
			parameters: {}
		},
		function(response)
		{
			Mojo.Log.info("**** Got account token %j", response);
			callback(true, response.token, response.accountAlias, response.accountState);
		},
		function(response)
		{
			Mojo.Log.error("**** error in obtaining token %j", response);
			callback(false);
		});
	},
	
	notifyAuthenticationFailure: function(callback)
	{
		// This request gets no rely - so send it and invoke the callback immediately
		Weave.Services.request(this._target,
		{
			method: 'notifyAuthenticationFailure',
			parameters: {
				trustedApp: true
			}
		});
		callback(true);
	},
	
	notifyUninstalledApplication: function(name, version, callback)
	{
		Weave.Services.request(this._target,
		{
			method: 'notifyUninstalledApplication',
			parameters: {
				name: name,
				version: version
			}
		},
		function()
		{
			callback(true);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAccountInfo: function(callback) 
	{
		// Possible to use the Weave.Services.request instead of a serviceRequest?
		Mojo.Log.info("** Getting account info");
		Weave.Services.request(this._target, 	
		{
			method: 'getAccountInfo',
			parameters:{}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	updateAccountInfo: function(myProfile, callback) 
	{
		Weave.Services.request(this._target, 
		{
			method: 'updateAccountInfo',
			parameters: 
			{
				'firstName': myProfile.firstName, 
				'lastName':myProfile.lastName,
				'password':myProfile.password, 
				'email':myProfile.email,
				'languageCode':myProfile.languageCode,
				'countryCode': myProfile.countryCode 
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	isUserValid: function(email, password, deviceId, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"isUserValid",
			parameters: 
			{
				'email':email, 
				'password':password, 
				"deviceId":deviceId
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getLocale: function(callback) 
	{
		Weave.Services.request('palm://com.palm.systemservice', 
		{
			method: 'getPreferences',
			parameters: 
			{
				"keys":["locale"]
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAllSecurityQuestions: function(userLocale, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"getAllSecurityQuestions",
			parameters: {subscribe: false, locale:userLocale}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	getAccountSecurityQuestions: function(email, locale, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"getAccountSecurityQuestion",
			parameters: {"email": email, "locale":locale}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});		
	},
	
	resendVerificationEmail: function(callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"requestResendVerificationEmail",
			parameters: {}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	requestPasswordResetEmail: function(emailAddress, callback)
	{
		Weave.Services.request(this._target,
		{
			method:"requestPasswordResetEmail",
			parameters: 
			{
				"email": emailAddress, "subscribe": false
			}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	authenticateAccountFromSecurityQuestion: function(email, questionId, response, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"authenticateAccountFromSecurityQuestion",
			parameters: {'email':email, 'questionId':questionId, 'response':response}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	changeEmail: function(email, callback) 
	{
		Weave.Services.request(this._target, 
		{
			method: 'changeEmail',
			parameters: {"email": email}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	changePassword: function(newPassword, questionId, answer, idToken, isResetPassword, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"changePassword",
  			parameters: {"newPassword": newPassword, "questionId":questionId, "answer":answer, "idToken":idToken, "isResetPassword":isResetPassword}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});
	},
	
	authenticateAccount: function(email, password, callback) 
	{
		Weave.Services.request(this._target,
		{
			method:"authenticateAccount",
 			parameters: {'email':email, 'password':password, 'application':'ASClient'}
		},
		function(response)
		{
			callback(true, response);
		},
		function()
		{
			callback(false);
		});			
	},
	isEmailAvailable: function(email, callback) 
	{		
		Weave.Services.request(this._target,
		{
			method:"isEmailAvailable",
 			parameters: {'email':email}
		},
		function(response)
		{
			Mojo.Log.info("response:" + Object.toJSON(response));
			callback(true, response);
		}
		);			
	}
};

