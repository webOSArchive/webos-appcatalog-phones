var Utilities = Utilities || {};

Utilities.Common = {
	
	handleCommand: function(event, app)
	{
 		if (event.type == Mojo.Event.command && event.command == 'email') 
 		{
 			var url = this._generateAppURL(app);
			if (url)
			{
				var params = 
				{
					summary: $L("Check out this HP webOS app"),
					text: this._generateEmailMessageText(app, url)
				}
				Weave.Services.ApplicationManager.launchApplication("com.palm.app.email", params);
			}
 		}
 		else if(event.type == Mojo.Event.command && event.command == 'text')
 		{
 			var url = this._generateAppURL(app);
			if (url)
			{
				var params = {
					messageText: this._generateSMSMessageText(app, url)
				}
				Weave.Services.ApplicationManager.launchApplication("com.palm.app.messaging", params)
			}
 		}
 	},
	
	_generateAppURL: function(app) 
	{
		var details = app.getDetails();
 		if (details && details.publicApplicationId && details.id) 
		{
			return "http://developer.palm.com/appredirect/?packageid=" + details.publicApplicationId + "&applicationid=" + details.id;
 		}
 		else 
		{
 			return null;
 		}
 	},
	
	_generateEmailMessageText: function(app, url) 
	{
		var details = app.getDetails();
		var shareData = {appURL: url};
		if (details && details.title)
		{
 			shareData.title = details.title;
		} 
		else
		{
 			shareData.title = url;
 		}
		return Mojo.View.render({object:shareData, template:'comments/share-template'});
	},
	
	_generateSMSMessageText: function(app, url)
	{
		var appTitle = url;
		var details = app.getDetails();
		if (details && details.title)
		{
 			appTitle = details.title;
		}
		
		return $L("Check out #{title}: #{url}").interpolate({title: appTitle, url: url});
	},
	
	doEmbargoCheck:function(edit, callback)
	{
		Mojo.Log.info("_doEmbargoCheck, profile address%s , embargoed", myProfile.email, myProfile.isEmbargoed);
		if (myProfile.isEmbargoed !== undefined) {
			this._handleEmbargoAcc(edit, callback);
		}
		else {
			var ext = myProfile.email.substring(myProfile.email.lastIndexOf(".") + 1);
			
			if (AppAssistant.embargoedList) {
				myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
				Mojo.Log.info("_doEmbargoCheck, isEmbargoed%s", myProfile.isEmbargoed);
				this._handleEmbargoAcc(edit, callback);
			}
			else {
				
				var self = this;
				Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
					Mojo.Log.info("getEmbargoedCountryList %j", response);
					if (status) {
						AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
						myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
						self._handleEmbargoAcc(edit, callback);
					}
					else {
						var err = response.errorCode ? response.errorCode : response;
						Utilities.Errors.displayError(err, {
							errCode: err
						}, "PMT_catchAll");
					}
				});
			}
		}
	},
	
	_handleEmbargoAcc: function(edit, callback)
	{
		var self = this;
		if (!edit && myProfile.isEmbargoed) 
		{
			Mojo.Log.info("PrefsAssistant, Email address Embargoed %s**",myProfile.email);
			Utilities.Errors.displayError("PMT_cant_download", {}, "PMT_cant_download", null, null, function(value)
			{
				if (value == 'help') 
				{
					Weave.Services.ConnectionManager.getStatus(function(online)
					{
						Weave.Services.ApplicationManager.openApplication('com.palm.app.help', 
						{
							target: online ? 'http://help.palm.com/app_catalog/appcatalog_download_error.html' : 'no-network'
						});
					});
				
				}
			});
		}
		else 
		{
			Mojo.Log.info("not embargoed***");
			callback(edit);
		}	
	},
	
	capWords: function(word){
   		var words = word.split(" "); 
   		for (var i=0 ; i < words.length ; i++){ 
      		words[i] = words[i].capitalize(); 
   		} 
   		return words.join(" "); 
	},
	
	filterSpace: function(value) {
		if(value === Mojo.Char.spaceBar) {
			return false;
		}			
		return true;
	},
	
	//check whether JSON object is empty
	isEmpty: function(jsonObj){
		for(prop in jsonObj){
			return false;
		}
		return true;
	},
	
	// Date formatter and timezone localization, for example: "20101230122331" --> "Dec 30, 2010"
	formatDateStr: function(dateRawStr) {
		if(!dateRawStr || dateRawStr.length<8) {
			return "";
		}
		
		var year = dateRawStr.substr(0,4);
		var month = dateRawStr.substr(4,2);
		var day = dateRawStr.substr(6,2);
		var hour = dateRawStr.substr(8,2);
		var min = dateRawStr.substr(10,2);
		var sec = dateRawStr.substr(12,2)
		var dateObj = new Date(year, month-1, day, hour, min, sec);
		var dateObjTime = dateObj.getTime();
		
		// change to local timezone
		var clDate = new Date();
		localOffset = clDate.getTimezoneOffset() * 60000;
		var ld = new Date(dateObjTime - localOffset);
		
		return Mojo.Format.formatDate(ld, $L("MMM d, yyyy"));
	}
};
