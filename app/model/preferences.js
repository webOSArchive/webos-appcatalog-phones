var Preferences =
{
	_timeout: 4 * 60 * 60 * 1000, // 4 hours
	
	getPaymentLogin: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref")).get() || {};
		Mojo.Log.info("getPaymentLogin %j", cookie);
		return cookie.paymentPref || "timeout"; 
	},
	
	setPaymentLogin: function(val)
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref");
		var cookie = cookieJar.get() || {};
		Mojo.Log.info("setPaymentLogin %j %s", cookie, val);
		cookie.paymentPref = val;
		cookieJar.put(cookie);
	},
	
	setLoginTime: function()
	{
		var cookieJar = new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref");
		var cookie = cookieJar.get() || {};
		Mojo.Log.info("setLoginTime %j", cookie);
		cookie.loginTime = new Date().getTime();
		cookieJar.put(cookie);
	},
	
	isLoginTimedOut: function()
	{
		var cookie = (new Mojo.Model.Cookie("com.palm.app.findapps.paymentPref")).get() || { loginTime: 0 };
		var now = new Date().getTime();
		Mojo.Log.info("now %d then %d timeout %d diff %d", now, cookie.loginTime, this._timeout, now - cookie.loginTime);
		if (now - cookie.loginTime > this._timeout || cookie.paymentPref == "every")
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};
