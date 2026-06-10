var TermsOfUse =
{
	_TOSDate: "7th Aug 2009",
	
	isAccepted: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.terms")).get() || {};
		return cookie.termsOfUseAccepted == this._TOSDate;
	},
	
	setAccepted: function()
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.terms");
		var cookie = cookieJar.get() || {};
		cookie.termsOfUseAccepted = this._TOSDate;
		cookieJar.put(cookie);
	}
};