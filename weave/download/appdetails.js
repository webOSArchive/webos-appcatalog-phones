/* AppDetails
 * 
 * Stores details for a single application from the app store
 * 
 * Observer interface:
 * 
 * // called when this application's details change
 * updateDetails()
 * 
 */
var AppDetails = Class.create({
	
	initialize: function(appid, packageid) 
	{
		this._observers = new Array();
		// TLE these are no longer private
		this._appid = appid;
		this._packageid = packageid;
		this._details = null;
		this._error = null;
		//this._myRating = null;
	},
	
	getDetailsFromServer: function() 
	{
		var self = this;
		// testing
		//this._appid = 2008954;
		//this._packageid = "myfreekingapp";
		Weave.Services.ApplicationServer.getApplicationDetails(this._appid, this._packageid, 
			Mojo.Locale.getCurrentLocale(), function(status, details, myrating, country)
			{
				//status = false;
				if (status) 
				{
					myProfile.activationCountry = country;
					Mojo.Log.info("AppDetails.getDetailsFromServer details %j, myrating %j, activation country %s", details, myrating, myProfile.activationCountry);
					self._setError(null);
					self._setDetails(details);
					//self.getMyCommentFromServer();
				}
				else 
				{
					Mojo.Log.error("AppDetails.getDetailsFromServer failed to get details from the server error: ", details);
					self._setError(details);
					//self._setMyRating(null);
					self._setDetails(null);
					Utilities.Errors.displayError(details);
				}
			});
	},
	
	//Don't want to call getMyRating on every detail page
	/*getMyCommentFromServer: function() 
	{
		if (!this._details) return;
		
		var self = this;
		Weave.Services.ApplicationServer.getMyComment(this._details.id, function(status, review)
		{
			if (status && review)
			{
				self._setMyRating(review);
			}
			// Ignore server errors here
		});
	},*/
	
	_setDetails: function(details) 
	{
		// TLE maybe don't set it here
		if (details) 
		{
			this._appid = details.id;
			this._packageid = details.publicApplicationId;
		}
		
		this._details = details;
		
		// Go through the list of observers and notify them of the change
		// At that point observers can call getDetails() to get the changes
		// notify observers
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateDetails) 
			{
				this._observers[i].updateDetails(this);
			}
		}
	},
	
	getDetails: function() 
	{
		return this._details;
	},
	
	/*_setMyRating: function(rating) 
	{
		this._myRating = rating ? rating : null;
		
		// Go through the list of observers and notify them of the change
		for (var i = 0; i < this._observers.length; i++) 
		{
			if (this._observers[i].updateMyRating) 
			{
				this._observers[i].updateMyRating();
			}
		}
	},*/
	
	/*getMyRating: function() 
	{
		return this._myRating;
	},*/
	
	_setError: function(error) 
	{
		this._error = error;
	},
	
	getError: function() 
	{
		return this._error;
	},
	
	getProgramType: function() 
	{
		return this._details != null ? this._details.programType : null;
	},
	
	// adds observer to the list of observers
	attach: function(observer) 
	{
		this._observers.push(observer);
	},
	
	// removes observer from the list
	detach: function(observer) 
	{
		for (var i = 0; i < this._observers.length; i++)
		{
			if (this._observers[i] === observer)
			{
				this._observers.splice(i, 1);
			}
		}
	},
	
	setPromoInfo: function(promoInfo) {
		this._promoValidTo = promoInfo.validTo;
		this._promoCallbackStatus = promoInfo.callbackStatus;
		this._promoStatus = promoInfo.status;
		this._promoCampaignStatus = promoInfo.campaignStatus;
	}
});

