/* Catalog.appStates
 * 
 * Global objects that represent all possible states for
 * a catalog application's download process.
 * 
 * State and Flyweight patterns combined.
 * That is, State objects are flyweight.
 * 
 * All per-download information like application id, price, location etc
 * is saved in an instance of appdownload object. State objects are shared
 * between all appdownload instances. They contain no extrinsic state.
 * 
 * Client (e.g. details scene) obtains an instance of appdownload object 
 * from the appdownloadmanager. This will be either an existing download or 
 * new download object. Client then makes calls on this download object for example:
 * 
 * appdownload->install
 * 
 * appdownload object delegates the call to it's current state passing 
 * itself as an argument:
 * 
 * appdownload::install 
 * {
 * 		this->_currentState->install(this);
 * }
 * 
 * 
 * Client subscribes as a listener on appdownload object.
 * When state of the download changes, appdownload object notifies 
 * all its current listeners which can then update their UI from the 
 * download object model.
 * 
 * 
 * State interface:
 * 
 * 
 * 
	// initializes app's internal data based on the current state
	// for example, progress pill model and css classes used in MyApps scene 
	// are changed with every state change 
	init(app)
	
	// updates internal data from app details
	// returned from the server. For example: if app is currently in
	// installed state, refreshing data from the server might cause it
	// to switch to "installed update available" state if server's version is 
	// higher 
	updateFromServer(app)
	
	// updates internal state from app details
	// returned from palm://com.palm.applicationManager/listApps. 
	// For example: if app was in "dummy" state this will cause it
	// to switch to "installed" state 
	updateFromInstalledAppsList(app)
	
	// called by details scene when user taps the progress pill.
	// Each state defines this method and depending on the current state 
	// of the object different thing will happen. If app is installed, 
	// it will be launched, if it's downloading it will be paused etc 
	defaultAction(app)
	
	// called by myapps scene when user taps the list item icon.
	// Each state defines this method and depending on the current state 
	// of the object different thing will happen. if app is downloading 
	// it will be paused etc 
	myAppsDefaultAction(app)
	
	// canceles download
	// only some states define this method (e.g "download progress")
	cancelDownload: function(app)
	
	// uninstalls the application
	// only some states define this method, (e.g "installed" state)
	uninstall: function(app)
	
	// resets the state of the object usually on error
	// it will forget about the current error and return the object back to
	// "download", "purchased" or "installed" state
	_reset: function(app)
	
	// resets the state of the object upon uninstalled notification
	_remove: function(app)
	
	// installs the application
	install: function(app)
	
	// returns true if download object in the current state should
	// be saved to myapps list maintained by appdownloadmanager.
	// appdownloadmanager listens for state changes on all existing
	// download objects and decides which ones should be saved to myApps list.
	// The general rule is: any downloads in progress + installed applications
	saveToMyApps: function()
	
	// returns true if download object in the current state should
	// be removed from myapps list maintained by appdownloadmanager.
	// appdownloadmanager listens for state changes on all existing
	// download objects and decides which ones should be saved/removed to/from myApps list.
	// The general rule is: any downloads in progress + installed applications
	// if user decides to give up on a download (due to an error for example)
	// app will be reset back to "download" state and removed from myApps list
	removeFromMyApps: function()
	
	// returns current state's string identifier
	toString: function()
	
	
*/


var Catalog 		= Catalog || {}; 
Catalog.appStates 	= Catalog.appStates || new Array();


// common functions, can be called from multiple states
Catalog.appStatesCommon = {
						
	_1xCarrierDialog: 
	{
		"sprint": {title: $L("No 3G Data Network"), message: $L("You will be unable to receive phone calls while the application is downloading."), choices: [{label: $L("Cancel"), value: "cancel", type: 'secondary'}, { label: $L("Download"), value: "download", type: 'primary'}]},
		"default": {title: $L("No 3G Data Network"), message: $L("The app will download slowly because a high-speed network is not available. You can download later when you have a 3G or wifi data connection. If you paid for the app, you will not be charged again."), choices: [{label: $L("Download Later"), value: "cancel", type: 'secondary'}, { label: $L("Download Now"), value: "download", type: 'primary'}]}
	},
		
	_verifyPaymentSetup: function(callback)
	{
		if (myProfile.validPayment !== undefined)
		{
			callback(true, myProfile.validPayment);
		}
		else
		{
			// another state while checking payment setup?
			// but that step is not very critical, so what if we check it twice
			Weave.Services.PaymentServer.verifyPaymentSetup(function(status, response)
			{
				if (status) 
				{
					myProfile.validPayment = response;
				}
				callback(status, response);
			});
		}
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	_getPromoFromDBExt: function(callback) {
		var self = this;
		
		if(!self._promoDB) {
			self._promoDB = new Mojo.Depot({
				name:"promoDB", version:1, estimatedSize: 500, replace: false},
				function() {
					Mojo.Log.info("PromoDB load/create done!");
				},
				function(result) {
					Mojo.Log.error("PromoDB load/create failed: ", result);
				}
			);
		}
		
		self._promoDB.get("promoCode", 
				function(pc) { 
					callback(true,pc);
					Mojo.Log.info("promoDB code get done, pc:%s", pc);
				},
				function(result) { 
					callback(false);
					Mojo.Log.error("promoDB code get fail: ", result); 
				}
		);
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	_savePromoFromDBExt: function(promoCode, callback) {
		var self = this;
		
		if(!self._promoDB) {
			self._promoDB = new Mojo.Depot({
				name:"promoDB", version:1, estimatedSize: 500, replace: false},
				function() {
					Mojo.Log.info("PromoDB load/create done!");
				},
				function(result) {
					Mojo.Log.error("PromoDB load/create failed: ", result);
				}
			);
		}
		
		self._promoDB.add("promoCode", promoCode,
				function() { 
			        callback(true);
					Mojo.Log.info("promoDB code save done, promocode:%s", promoCode);
				},
				function(result) { 
					callback(false);
					Mojo.Log.error("promoDB code save fail: ", result); 
				}
		);
	},
	
	// To purchase the application with promo code then start download
	_purchaseWithPromoCode: function(app, code, response, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon._purchaseWithPromoCode: purchasing %s, %s", app.title, app.id)
		// User has validate the purchase - we make it now.
		var d = app;
		var now = new Date();
		var ms = '' + now.getMilliseconds() ;
		while (ms.length < 3) { // pad out to 3 places
		    ms = '0' + ms;
	    }

		var timestamp = Mojo.Format.formatDate(now, {format: 'yyyyMMddHHmmss'}) + ms; // Format yyyyMMddHHmmssSSS

		var orderObj =
		{
			timestamp: timestamp, 
			currency: d.currency,
			items:
			[{
				type: d.priceType,
				promoCode: code,
				quantity: "1",
				sku: d.sku,
				unitPrice: d.price
			}]
		};
		
		app.setState("purchasing");
		Mojo.Log.info("Order Object: %j", orderObj.items[0]);
		Weave.Services.PaymentServer.capturePayment( orderObj, function(status, response)
		{
			if (status)
			{
				// Payment successful - download
				Mojo.Log.info("Catalog.appStatesCommon._purchaseWithPromoCode: purchased");
				app.setState("purchased", {version: app.serverVersion, transitional: true});
				callback(true);
				
				if(response.OutCapturePayment.promoCodeStatus=="R") {
					// If promo code status is "Redeemed", to delete promo code from database.
					Catalog.appStatesCommon._savePromoFromDBExt("",function(status){});
					// Use cookie to replace deposit for synchronization
					var cookiePC = new Mojo.Model.Cookie("PromoCode");
					cookiePC.put("");
					Mojo.Log.info("DownloadState, promocode cookie store for redeemed code:[empty]");
				}
			}
			else
			{
				Mojo.Log.error("Catalog.appStatesCommon._purchaseWithPromoCode: purchase failed %j", response);
				var err = (response && response.errorCode) ? response.errorCode : response;
				app.setState("purchase_failed", {errorCode: err});
			}
		});
	},
	
	// To go to promo code dialog to let user edit the promo code
	_gotoPromoCodeDialog: function(app, pcode, eCode, response, callback)
	{
		var stage = Weave.System.Activator.getActiveStageController();
		if (stage && stage.topScene()) 
		{
			stage.topScene().showDialog(
			{
				template: 'payment-setup/promocode-dialog',
				assistant: new PromoCodeAssistant(stage.topScene().assistant, 
				{
					appid: app.publicApplicationId, 
					version: app.serverVersion,
					title: app.title,
					promoCode: pcode,
					errCode: eCode,
					onComplete: function(info)
					{
						Mojo.Log.info("Catalog.appStatesCommon._gotoPromoCodeDialog promo code valid: %s ,promo code is:%s", info.promoCodeValid,info.promoCode);
						
						if (info.promoCodeValid)
						{
							Catalog.appStatesCommon._purchaseWithPromoCode(app, info.promoCode, response, callback);
						}
						else
						{
							Catalog.appStatesCommon._makePurchase(app, response, callback);
						}
					}
				})
			});
		
	    }
	},
	
	// To verify the promo code then start download
	_verifyPromoCode: function(app, response, callback)
	{
		var gotoPromoCodeEditor = false;
		var delPromoCode = false;
		var errorCode = "";
		var promoCode = "";
		// Get promo code from database
		Catalog.appStatesCommon._getPromoFromDBExt(function(status,code){
        	Mojo.Log.info("promoDB code get done, pc:%s", code);
        	promoCode = code;
        	//test
        	//promoCode = "";
        	//promoCode = undefined;
        	
        	if (status && (promoCode != undefined) && (promoCode != "")) {
        	
        		// Check promo code status
        		Weave.Services.PaymentServer.checkPromoCodeStatus(promoCode, app.publicApplicationId, app.serverVersion, function(status, response)
        		{			
        			if (status) 
        			{		
        				if (response.OutCheckPromoCodeStatus.valid == "true") 
        				{
        					// Promo code is valid, start to purchase 
        					Catalog.appStatesCommon._purchaseWithPromoCode(app, promoCode, response, callback);
        				}
        				else if (response.OutCheckPromoCodeStatus.valid == "false")
        				{
        					// Promo code is invalid, go to editor
        					gotoPromoCodeEditor = true;
        					errorCode = response.OutCheckPromoCodeStatus.errorCode;
        					if ((errorCode == "PMTPROMO70101")||(errorCode == "PMTPROMO70102")||(errorCode == "PMTPROMO70103")||(errorCode == "PMTPROMO70104")) 
        					{
        						// If error is redeemed, revoked, expired,suspended,to delete the promo code from database.
        						delPromoCode = true;
        					}
        				}
        			}
        			else 
        			{				
        				// Promo code is invalid, go to editor
        				gotoPromoCodeEditor = true;
        				errorCode = response.errorCode;
        				// If error is invalid, to delete the promo code from database.
        				delPromoCode = true;
        			}
        			
        			Mojo.Log.info("Catalog.appStatesCommon._verifyPromoCode promoCode:%s, errorCode:%s", promoCode,errorCode);
        			if (gotoPromoCodeEditor) 
        			{        				
        				// Promo code is invalid, go to editor
        				Catalog.appStatesCommon._gotoPromoCodeDialog(app, promoCode, errorCode, response, callback);
        			}
        			
        			if (delPromoCode) 
        			{
        				Catalog.appStatesCommon._savePromoFromDBExt("",function(status){});
        			}
        		});
        	}else {
        		// Promo code is empty, go to editor
        		promoCode = "";
        		errorCode = "";
				Catalog.appStatesCommon._gotoPromoCodeDialog(app, promoCode, errorCode, response, callback);
        	}
		});

	},
	_makePurchase: function(app, response, force, callback) 
	{
		var self = this;
		
		Mojo.Log.info("## _makePurchase with callback %s", callback);

		// response is from getPaymentInfos
	
		var cc = response.OutGetPaymentInfos.ccPaymentInfos.length ? response.OutGetPaymentInfos.ccPaymentInfos[0] : null;
		var ob = response.OutGetPaymentInfos.obPaymentInfos.length ? response.OutGetPaymentInfos.obPaymentInfos[0] : null;

		if (force) {
			// Forcing a payment type
	
			// Null out the other
			if (force == "cc") {
				ob = null;
			} else {
				cc = null;
			}
		}
	
		if (cc && ob) {
			// Both types of payment are set up: choose the default by nulling the other
			if (cc["default"]) {
				ob = null;
			} else {
				cc = null;
			}
		}
	
		if (cc) {
			app.paymentType = "cc";
		} else if (ob) {
			app.paymentType = "ob";
		} else {
			Mojo.Log.error("## Making purchase with no valid payment method.")

			app.setState("download");
			callback(false);
			return;	
		}
	
		Mojo.Log.info("## _makePurchase using %s", app.paymentType);

		if (!Weave.Services.ConnectionManager.isOnline()) 
		{
			app.setState("download");
			callback(false);
			return;	
		}
	
		var stage = Weave.System.Activator.getActiveStageController();
		if (stage && stage.topScene()) 
		{
			var accountName = (cc ? $L("credit card") : $L("carrier account"));

			stage.topScene().showAlertDialog(
			{
				allowHTMLMessage: true,
				message: $L('Purchase #{title}?<br/><br/>Your #{account} will be charged.').interpolate({title: app.title, account: accountName}),
				choices:
				[
					{ label: $L("Purchase"), value: "ok", type: 'affirmative' }, 
					{ label: $L("Use Promo Code"), value: "promo"},
					{ label: $L("Cancel"), value: "cancel", type: 'dismiss'}
				],
				onChoose: function(value)
				{
					if (value == "ok") 
					{
						Mojo.Log.info("Catalog.appStatesCommon._makePurchase: purchasing %s, %s", app.title, app.id)

						// User has validate the purchase - we make it now.
						// Set the state as "purchasing"
					    app.setState("purchasing");

						if (ob) {
							self._startOBPayment(app, ob, callback);
						} else {
							self._capturePayment(app, cc, callback);
						}
					}
					else if (value == "promo") 
					{
						Catalog.appStatesCommon._verifyPromoCode(app, response, callback);
					}
					else 
					{
						app.setState("download");
						callback(false);
					}
				}
			});
		}
		else
		{
			app.setState("download");
			callback(false);	
		}
	},
	
	_startOBPayment: function(app, ob, callback) {
		Mojo.Log.info("## _startOBPayment called");
		var self = this;
		// getOBInfos gets a URL
		// initSession hits that URL and gets a sessionID
		// Capturepayment sends the sessionID

		Weave.Services.PaymentServer.getOBInfos(function(status, response) {
			Mojo.Log.info("## getOBInfos returned %j", response);
			
			/* Sample: 
			{"OutGetOBInfos": {"devicePoll": {"period": 1, "timeout": 5}, "initSession": {"submitMethod": "POST", "URL": "http://payment-cie.openmarket.com/appbilling/v1/session"}}}
			*/

			if (status) {
				var obInfos = response.OutGetOBInfos;
				
				Weave.Services.PaymentServer.initOBSession(obInfos, function(status, response) {
					if (status) {

						Mojo.Log.info("## Handling initOBSession success with %s", response);
						/* Sample:
						<?xml version="1.0" encoding="UTF-8" standalone="yes"?><session xmlns="http://payment.openmarket.com/appbilling/v1" state="ACTIVE" phoneNumber="14084314136" id="YEp10McY27uY4038ar08"><carrier id="383">ATT</carrier></session>
						*/
					
						// Get ID from XML and add to paymentInfo
						ob.obSessionId = response.getElementsByTagName("session")[0].getAttribute("id");
					
						// Add polling info to ob info
						ob.devicePoll = obInfos.devicePoll;

						self._capturePayment(app, ob, callback);
					} else {
						Mojo.Log.info("## Handling initOBSession failure with %s", response);
						
						var errorCode;
						var err;

						if (response && response.getElementsByTagName && response.getElementsByTagName("error")) {
							Mojo.Log.info("## Setting initOBSession error code from Open Market");
							errorCode = response.getElementsByTagName("error")[0].getAttribute("code");
						}
						
						if (errorCode == 2045 || errorCode == 2126) {
							// Use PMT05213, carrier not supported for these OpenMarket errors
							err = "PMT05213";
						} else {
							err = errorCode ? ("PMTINIT" + errorCode) : response;
						}
						
						app.setState("purchase_failed", {errorCode: err});
					}
				});
			} else {
				Mojo.Log.info("## getOBInfos failed with %s", response);

				var err = (response && response.errorCode) ? response.errorCode : response;
				app.setState("purchase_failed", {errorCode: err});
			}
		});	
	},
	
	_capturePayment: function(app, paymentInfo, callback) {
		var self = this;
		
		var d = app;
		var now = new Date();
		var ms = '' + now.getMilliseconds() ;
		while (ms.length < 3) { // pad out to 3 places
		    ms = '0' + ms;
	    }

		var timestamp = Mojo.Format.formatDate(now, {format: 'yyyyMMddHHmmss'}) + ms; // Format yyyyMMddHHmmssSSS

		var orderObj =
		{
			paymentInfoId: paymentInfo.paymentInfoId,
			obSessionId: paymentInfo.obSessionId,
			timestamp: timestamp, 
			currency: d.currency,
			items:
			[{
				type: d.priceType,
				quantity: "1",
				sku: d.sku,
				unitPrice: d.price
			}]
		};
		
		Mojo.Log.info("## Order Object: %j", orderObj.items[0]);
		
		Weave.Services.PaymentServer.capturePayment(orderObj, function(status, response)
		{
			// testing
			// status = false; 
			// response.errorCode = "PMT04004";
			
			if (status)
			{
				// Payment successful - download
				if (paymentInfo.devicePoll)
				{
					// We need to poll for order completion
					Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase pending %j", response);
					/* Sample: {"OutCapturePayment": {"orderNo": 427}} */
					var orderNo = response.OutCapturePayment.orderNo;
					var pollingEnds = new Date().getTime() + (paymentInfo.devicePoll.timeout * 1000);
					var pollingInterval = (paymentInfo.devicePoll.period * 1000);
					
					self._pollForOrderStatus(app, orderNo, pollingEnds, pollingInterval, callback);
				}
				else
				{
					// Order successful
					Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase succeeded %j", response);
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					callback(true);
				}
			}
			else
			{
				Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: purchase failed %j", response);
				var err = (response && response.errorCode) ? response.errorCode : response;
				if (err == "PMT03037") { // You have already purchased this app
					Mojo.Log.info("## Item already purchased. Downloading now.");
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					app.install();
					Utilities.Errors.displayError(err);
				} else {
					app.setState("purchase_failed", {errorCode: err});
				}
			}
		});	
	},
	
	_pollForOrderStatus: function(app, orderNo, pollingEnds, pollingInterval, callback) {
		Mojo.Log.info("## _pollForOrderStatus with interval %s", pollingInterval);
		var self = this;
		
		Weave.Services.PaymentServer.getOrderStatus(orderNo, function(status, response)
		{
			Mojo.Log.info("## Catalog.appStatesCommon._makePurchase: purchase polled %j", response);
			if (status)
			{
				if (response.OutGetOrderStatus.status == "NEW" 
					|| response.OutGetOrderStatus.status == "RENEWED") {
					// More polling	
					if (new Date().getTime() < pollingEnds) {
						setTimeout(self._pollForOrderStatus.bind(self, app, orderNo, pollingEnds, pollingInterval, callback), pollingInterval);
					} else {
						// Timed out
						Mojo.Log.info("## makePurchase: OB purchase timed out.")
						app.setState("purchase_pending", {errorCode: "inprogress"});
					}
				} else if (response.OutGetOrderStatus.status == "CLOSED") {
					// Success
					app.setState("purchased", {version: app.serverVersion, transitional: true});
					callback(true);
				} else if (response.OutGetOrderStatus.status == "DECLINED") {
					// Declined
					Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase declined %j", response);
					var err = (response.OutGetOrderStatus.code || response);
					app.setState("purchase_failed", {errorCode: err});
				} else {
					// Undefined behaviour
					Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase failed %j", response);
					app.setState("purchase_pending", {errorCode: "inprogress"});
				}
			}
			else
			{
				// Failure
				Mojo.Log.error("## Catalog.appStatesCommon._makePurchase: OB purchase failed with status %j", response);
				app.setState("purchase_pending", {errorCode: "inprogress"});
			}
		});
	},
	
	// set only the current state of this function, "validating_cc"
	// in case of error it's up to the caller to restore previous state
	_handleVerifyPayment: function(app, valid, force, callback)
	{	
		Catalog.appStatesCommon._verifyPaymentSetup(function(status, response) 
		{
			if (status) 
			{
				Mojo.Log.info("## Called verifyPaymentSetup and got response %j", response);
				
				if (response.OutGetPaymentInfos.ccPaymentInfos.length > 0
					|| response.OutGetPaymentInfos.obPaymentInfos.length > 0) 
				{	
					// check if user needs to enter password
					if (!valid) 
					{	
						var stage = Weave.System.Activator.getActiveStageController();
						if (stage && stage.topScene()) 
						{
							stage.topScene().showDialog(
							{
								template: 'payment-setup/password-dialog',
								assistant: new PasswordAssistant(stage.topScene().assistant, 
								{
									appid: app.id, 
									onComplete: function(info)
									{
										Mojo.Log.info("Catalog.appStatesCommon._handleVerifyPayment password valid: ", info.passwordValid);
										if (info.passwordValid)
										{
											Catalog.appStatesCommon._makePurchase(app, response, force, callback);
										}
										else
										{
											callback(false);
										}
									}
								})
							});
						}
						else
						{
							callback(false);
						}
					}
					else 
					{
						Catalog.appStatesCommon._makePurchase(app, response, null, callback);
					}
				} 
				else 
				{
					// forward to set up account
					Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment no payment set up");
					var stage = Weave.System.Activator.getActiveStageController();
					if (stage) 
					{
						Mojo.Log.info("Catalog.appStatesCommon._handleVerifyPayment app.promoLink:%s",app.promoLink);
						if (app.promoLink) {
							if (stage.topScene())
							{
								stage.topScene().showAlertDialog(
										{
											allowHTMLMessage: true,
											title: $L("Promo Code"),
											message: $L('Before you can use a promo code, you must first set up payment information.'),
											choices:
											[
												{ label: $L("OK"), value: "ok" }
											],
											onChoose: function(value)
											{
												if (value == "ok") 
												{
													stage.pushScene("payment-setup", app.id, function(ret)
															{
																Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment payment setup callback ret %j", ret);
																if (ret.accountValid) 
																{
																	Catalog.appStatesCommon._handleVerifyPayment(app, true, null, callback);
																}
																else 
																{
																	callback(false);
																}
															});
												}
											}
											
										});		
							}
						}else {
						
						stage.pushScene("payment-setup", app.id, function(ret)
						{
							Mojo.Log.info("## Catalog.appStatesCommon._handleVerifyPayment payment setup callback ret %j", ret);
							if (ret.accountValid) 
							{
								Catalog.appStatesCommon._handleVerifyPayment(app, true, null, callback);
							}
							else 
							{
								callback(false);
							}
						});
						}
					}
					else 
					{
						callback(false);
					}
				}
			} 
			else 
			{
				callback(false);
				Mojo.Log.error("Error retrieving payment setup");
				Utilities.Errors.displayError(response.errorCode, {errCode: response.errorCode}, "PMT_catchAll");
			}
		});				
    },
	
	_validateRegion: function(app) 
	{
		Mojo.Log.info("Catalog.appStatesCommon._validateRegion uscarrier: ", myProfile.uscarrier)
		if (app.price > 0 && !myProfile.uscarrier)
		{
			var stage = Weave.System.Activator.getActiveStageController();
			if (stage && stage.topScene()) 
			{
				stage.topScene().showAlertDialog({
					title: $L('Sorry, Application Unavailable'),
					message: $L('This application is not available in your region.'),
					choices: [{
						label: $L("OK"),
						value: true,
						type: 'primary'
					}, ]
				});
			}
			return false;
		}
		return true;
	},
	
	_handleEmbargoAcc: function(app ,callback){
		if(myProfile.isEmbargoed)
		{
			if (app.price > 0)
			{
				Utilities.Errors.displayError("PMT_cant_purchase", {}, null, null, null, function(value)
				{
	                if (value == 'help') {
	                    Weave.Services.ConnectionManager.getStatus(function(online){
	                        Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
	                            target: online ? 'http://help.palm.com/app_catalog/appcatalog_download_error.html' : 'no-network'
	                        });
	                    });
	                    
	                }
	            });
			}
			else
				Utilities.Errors.displayError("PMT_cant_download_encrypted");
			callback(false);
		}
		else
			callback(true);
	},
	
	_checkNotEmbargoed: function(app, callback)
	{
		if (app.price > 0 || app.isEncrypted) {
			if (myProfile.isEmbargoed !== undefined) {
				this._handleEmbargoAcc(app, callback);
			}
			else {
				var ext = myProfile.email.substring(myProfile.email.lastIndexOf(".") + 1);
				
				if (AppAssistant.embargoedList) {
					myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
					this._handleEmbargoAcc(app, callback);
				}
				else {
					var self = this;
					Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
						Mojo.Log.info("getEmbargoedCountryList %j", response);
						if (status) {
							AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
							myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
							self._handleEmbargoAcc(app, callback);
						}
						else {
							var err = (response && response.errorCode) ? response.errorCode : response;
							Mojo.Log.error("Error retrieving embargoed ext");
							Utilities.Errors.displayError(err, {
								errCode: err
							}, "PMT_catchAll");
						}
					});
				}
			}
		}
		else
			callback(true);
	},
	
	_forcePaymentType: function(app, type, callback) {
		var self = this;
		
		var callback = function(status) {
			if (status) 
			{
				Catalog.appStatesCommon._install(app);
			}
			else 
			{
				// reset back in case of error
				app.setState("download");
			}
		};

		app.setState("download");
		
		if (type == "cc") {
			if (myProfile.validPayment.OutGetPaymentInfos.ccPaymentInfos.length) {
				// Have a valid CC
				self._makePurchase(app, myProfile.validPayment, "cc", callback) 
			} else {
				// Set up CC			
				var stage = Weave.System.Activator.getActiveStageController();
				stage.pushScene('create-account', { appid: app.id, onComplete: function() {
					self._handleVerifyPayment(app, true, "cc", callback);					
				}});						
			}
		} else { // type == "ob"
			if (myProfile.validPayment.OutGetPaymentInfos.obPaymentInfos.length) {
				// Have a valid OB
				self._makePurchase(app, myProfile.validPayment, "ob", callback) 
			} else {
				// Set up OB
				var stage = Weave.System.Activator.getActiveStageController();

				stage.pushScene('create-carrier', { appid: app.id, email: myProfile.email, onComplete: function() {
					self._handleVerifyPayment(app, true, "ob", callback);					
				}});						
			}
		}
	},
	
	_handleLocationServices: function(app, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon._handleLocationServices app.islocationbased", app.islocationbased);
		if (app.islocationbased)
		{
			var stage = Weave.System.Activator.getActiveStageController();
			if (stage && stage.topScene()) 
			{
				stage.topScene().showAlertDialog({
					onChoose: function(value) {
						if (value == "continue") {
							callback(true);
						}
						else {
							callback(false);
						}
					},
					title: $L('Location Services'),
					message: $L('This application will request your current location for some functions.'),
					choices: [{
						label: $L("Don't Download"),
						value: "cancel",
						type: 'dismiss'
					}, {
						label: $L("Continue"),
						value: "continue",
						type: 'affirmative'
					}]
				});
			}
			else
			{
				callback(false);
			}
		}
		else
		{
			callback(true);
		}
	},
	
	validateInstallSpace: function(app, showError, callback)
	{
		Mojo.Log.info("Catalog.appStatesCommon.validateInstallSpace");
		
		Weave.Services.ApplicationInstaller.validateInstall(app.publicApplicationId, app.packageSize, app.installSize, function(status, response)
		{
			if (status == true)
			{
				callback(true);
			}
			else
			{
				Mojo.assert(response && response.spaceNeededInKB, "Catalog.appStatesCommon.validateInstallSpace validateInstall failed but spaceNeededInKB is not defined");

				var totalInstallSize;
				if (response && response.spaceNeededInKB) 
				{
					totalInstallSize = parseInt(response.spaceNeededInKB);
					totalInstallSize = totalInstallSize >= 1024 ? Mojo.Format.formatNumber(totalInstallSize/1024, {fractionDigits: 2}) + $L("M") : totalInstallSize + $L("K");
				}
				else 
				{
					totalInstallSize = $L("unknown MB");
				}
			
				Utilities.Errors.displayError("dummy", {installSize: totalInstallSize}, showError, null, null, function(value)
				{
                	if (value == 'help')
                    {
                        Weave.Services.ConnectionManager.getStatus(function(online)
                        {
                            Weave.Services.ApplicationManager.openApplication('com.palm.app.help',
                            {
                                target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
                            });
                        });
                    }
	        	});
				
				callback(false);
			}
		});
	},
	
	validateDownloadConnection: function(callback)
	{
		if (Weave.Services.ConnectionManager.isOn1x()) 
		{
			Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection connection is 1x");
			if (Catalog.AppDownloadMngr.canAllow1xDownload())
			{
				// user already decided to allow 1x download
				Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection canAllow1xDownload == true")
				callback(true);
			}
			else 
			{
				Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection prompt user for 1x permission")
				var stage = Weave.System.Activator.getActiveStageController();
				if (stage && stage.topScene()) 
				{
					// get correct dialog based on carrier
					var dialog = Catalog.appStatesCommon._1xCarrierDialog[myProfile.carrier];
					if (!dialog) 
						dialog = Catalog.appStatesCommon._1xCarrierDialog["default"];
						
					stage.topScene().showAlertDialog(
					{
						onChoose: function(value) 
						{
							if (value == "cancel") 
							{
								callback(false);
							}
							else if (value == "download") 
							{
								Catalog.AppDownloadMngr.allow1xDownload(true, function(status)
								{
									Mojo.Log.info("Catalog.appStatesCommon.validateDownloadConnection allow1xDownload returned status %s", status)
									callback(status);	
								});
							}
						},
						title: dialog.title,
						message: dialog.message,
						choices: dialog.choices
					});
				}
				else 
				{
					callback(false);
				}
			}
		}
		else if (Weave.Services.ConnectionManager.isOnline())
		{
			callback(true);
		}
		else 
		{
			callback(false);
		}
	},
	
	_install: function(app)
	{
		Catalog.appStatesCommon.validateDownloadConnection(function(status)
		{ 
			var oldState = app.stateToString();
			if (status)
			{
				app.setState("fake progress");
				
				Mojo.Log.info("Catalog.appStatesCommon._install: ", app.publicApplicationId);
				Weave.Services.AppInstallService.install(app, function(status, response)
				{
					if (!status)
					{
						Mojo.Log.error("Catalog.appStatesCommon._install failed %s: %j, returing to state %s", app.publicApplicationId, response, oldState);
						// if we are still waiting revert to old state
						if (app.stateToString() == "fake progress")
							app.setState(oldState);
					}
				});
			}
			/*
			else 
			{
				// force refresh
				if (app.stateToString() == oldState)
					app.setState(oldState);
			}
			*/
		});
	},
	
	_revert: function(app, revertableApp)
	{
		Mojo.Log.info("Catalog.appStatesCommon._revert: ", revertableApp.id);
		Weave.Services.AppInstallService.installLocal(revertableApp, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._install failed %s: %j", revertableApp.id, response);
				
			}
		});
	},
	
	_pause: function(app)
	{
		var oldState = app.stateToString();
		app.setState("pausing");
				
		Mojo.Log.info("Catalog.appStatesCommon._pause: ", app.publicApplicationId);
		Weave.Services.AppInstallService.pause(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._pause failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "pausing")
					app.setState(oldState);
			}
		});
	},
	
	_resume: function(app)
	{
		Catalog.appStatesCommon.validateDownloadConnection(function(status)
		{
			if (status)
			{
				var oldState = app.stateToString();
				app.setState("resuming");
				
				Mojo.Log.info("Catalog.appStatesCommon._resume: ", app.publicApplicationId);
				Weave.Services.AppInstallService.resume(app.publicApplicationId, function(status, response)
				{
					if (!status)
					{
						Mojo.Log.error("Catalog.appStatesCommon._resume failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
						// if we are still waiting revert to old state
						if (app.stateToString() == "resuming")
							app.setState(oldState);
					}
				});
			}
		});
	},
	
	_cancel: function(app)
	{
		var oldState = app.stateToString();
		app.setState("canceling");
		
		Mojo.Log.info("Catalog.appStatesCommon._cancel: ", app.publicApplicationId);
		Weave.Services.AppInstallService.cancel(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._cancel failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "canceling")
					app.setState(oldState);
			}
		});	
	},
	
	_uninstall: function(app)
	{
		var oldState = app.stateToString();
		app.setState("removing");
		
		Mojo.Log.info("Catalog.appStatesCommon._uninstall: ", app.publicApplicationId);
		Weave.Services.AppInstallService.remove(app.publicApplicationId, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.appStatesCommon._uninstall failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
				// if we are still waiting revert to old state
				if (app.stateToString() == "removing")
					app.setState(oldState);
			}
		});
	},
	_restore: function(app)
	{
		if (app.errorCode == "FAILED_IPKG_INSTALL") {
			var oldState = app.stateToString();
			Mojo.Log.info("Catalog.appStatesCommon._restore: ", app.publicApplicationId);
			Weave.Services.AppInstallService.remove(app.publicApplicationId, function(status, response){
				if (!status) {
					Mojo.Log.error("Catalog.appStatesCommon._restore (removing) failed %s, %j, returing to state %s", app.publicApplicationId, response, oldState);
					// if we are still waiting revert to old state
					if (app.stateToString() == "install failed") 
						app.setState(oldState);
				}
			});
		}
		else{
			Catalog.appStatesCommon._cancel(app);
		}
	},
	
	_reset: function(app)
	{	 if (app.installedVersion)
		{
			// we were installing an update
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState("installed");
			}
		}
		else if (app.price && app.price > 0) 
		{
			app.setState("purchased");
		}
		else
		{
			app.setState("download");
		}
	},
	
	_remove: function(app)
	{
		app.installedVersion = null;
		if (app.pendingRevert) {
			Mojo.Log.info("starting Revert");
			app.pendingRevert = false;
			app.setState("download");
			// var newapp = null; //Catalog.AppDownloadMngr.getAppDownload(app.publicApplicationId);
			Catalog.appStatesCommon._revert(null, Catalog.AppDownloadMngr.getDetailsRevertableApp(app.publicApplicationId));
		}
		else {
			//app.icon = null;
			if (app.price && app.price > 0) {
				app.setState("purchased");
			}
			else {
				app.setState("download");
			}
		}
	}
};

// use dummy until we find out the correct state
Catalog.appStates["dummy"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Getting data...');
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		this._update(app);
	},
	
	updateFromInstalledAppsList: function(app)
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		var state = "download";
		
		if (app.purchasedVersion)
		{
			state = 'purchased';
		}
		
		if (app.installedVersion) 
		{
			state = 'installed';
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				state = "installed update available";
			}
		}
		
		app.setState(state);
	},
	
	toString: function()
	{
		return "dummy";
	}
};

/*
 * Transitional states
 * 
 * object is in a transitional state while we
 * are waiting for a response from appInstallService. While object is in
 * these states user can't perform almost any action (except deleting an app)
 * transitional states: pausing, deleting, resuming, canceling, fake progress
 *  
 */
Catalog.appStates["fake progress"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'action-icon';
		app._progressPillModel.image = 'images/download-icon.png';
		app._progressPillModel.title = $L('Downloading...');
		app._progressPillModel.value = 0;
		
		app.disabledClass = "disabled";
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},

	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "fake progress";
	}
};

Catalog.appStates["pausing"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Pausing...');
		
		app.disabledClass = "disabled";
	},
	
	// after we send pause request we are in 
	// "pausing..." state, at that point we ignore additional 
	// progress updates that come before the final "paused" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "pausing";
	}
};

Catalog.appStates["resuming"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Resuming...');
		
		app.disabledClass = "disabled";
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "resuming";
	}
};

Catalog.appStates["removing"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Deleting...');
		app._progressPillModel.value = 1;
		
		app.disabledClass = "disabled";
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	// after we send remove request we are in 
	// "removing..." state, at that point we ignore additional 
	// progress updates from appInstallService 
	// that come before the final "removed" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "removing";
	}
};

Catalog.appStates["canceling"] = {
	
	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Canceling...');
		
		app.disabledClass = "disabled";
	},
	
	// after we send cancel request we are in 
	// "canceling..." state, at that point we ignore additional 
	// progress updates that come before the final "canceled" state
	_allowTransition: function(newState)
	{
		if (newState == "download progress")
			return false;
		
		return true;
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "canceling";
	}
};



// default / starting state for all apps
// once we obtain app details from the server
Catalog.appStates["download"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon	= 'download-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Download for #{price}').interpolate({price:app.getFormattedPrice()});
		
		// check code status from cookie store
		var cookiePC = new Mojo.Model.Cookie("PromoCode");
		var cookieStoredPC = cookiePC.get();
		Mojo.Log.info("DownloadState, promocode cookie retrieve:[%s]", cookieStoredPC);
		
		// set promo tag on download button
		Mojo.Log.info("DownloadState.appStates[download]# promoLink:%s, price:%s, cookieStorePC:%s", 
				app.promoLink, app.price, cookieStoredPC);
		if(app.promoLink && app.price!=0 && cookieStoredPC && cookieStoredPC.length>0) {
			Mojo.Log.info("promo tag set.");
//			app._progressPillModel.title = $L("Download for #{price} FREE!").interpolate({price:app.getFormattedPrice()});
			app._progressPillModel.icon	= 'download-app-promo-icon';
			app._progressPillModel.image = 'images/download-icon.png';
		}
		
		if (app.price == 0){
			app._progressPillModel.title = $L('Download for free');
		}
		
		
		app.progress = 0;
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromInstalledAppsList: function(app)
	{
		if (app.installedVersion) 
		{
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState("installed");	
			}
		}
	},
	
	updateFromServer: function(app) 
	{	
		var state = "download";
		if (app.purchasedVersion)
		{
			state = 'purchased';
		}
		
		if (app.installedVersion) 
		{
			state = 'installed';
			if (Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				state = "installed update available";
			}
		}
		
		app.setState(state);
	},
	
	removeFromMyApps: function()
	{
		return true;
	}, 
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	install: function(app) 
	{
		Catalog.appStatesCommon._checkNotEmbargoed(app, function(status)
		{
			if(status)
			{
				Catalog.appStatesCommon._handleLocationServices(app, function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
						{
							if (status) 
							{
								Catalog.appStatesCommon.validateDownloadConnection(function(status)
								{
									if (status)
									{ 
										if (app.price > 0) 
										{
											Catalog.appStatesCommon._handleVerifyPayment(app, !Preferences.isLoginTimedOut(), null, function(status)
											{
												Mojo.Log.info("Catalog.appStates[download].download _handleVerifyPayment returned");
												if (status) 
												{
													Mojo.Log.info("Catalog.appStates[download].download _handleVerifyPayment status=true download app");
													Catalog.appStatesCommon._install(app);
												}
												else 
												{
													// reset back in case of error
													app.setState("download");
												}
											});
										}
										else 
										{
											Catalog.appStatesCommon._install(app);
										}
									}
									else 
									{
										app.setState("download");
									}
								});
							}
							else 
							{
								app.setState("download");
							}
						});
					}
					else 
					{
						app.setState("download");
					}
				});
			}
			else 
			{
				app.setState("download");
			}
		});
	},
	
	toString: function()
	{
		return "download";
	}
};

// Entered when download manager send the first 
// valid progress amount and active until download is active
// that is, we receive progress updates
Catalog.appStates["download progress"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'action-icon';
		app._progressPillModel.image = 'images/download-icon.png';
		app._progressPillModel.title = $L('Downloading...');
		app._progressPillModel.value = app.progress/100;
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = "show";
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		// force a refresh
		app.setState("download progress");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("download progress");	
	},
	
	defaultAction: function(app) 
	{
		this.pauseDownload(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this.pauseDownload(app);
	},
	
	pauseDownload: function(app)
	{
		Catalog.appStatesCommon._pause(app);	
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "download progress";
	}
};

Catalog.appStates["paused"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.value = app.progress/100;
		app._progressPillModel.image = undefined;
		app._progressPillModel.title = $L('Resume Downloading...');
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = "show";
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{	
		// force a refresh
		app.setState("paused");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("paused");	
	},
	
	myAppsDefaultAction: function(app)
	{
		app.resumeDownload();
	},
	
	defaultAction: function(app) 
	{
		app.resumeDownload();
	},
	
	resumeDownload: function(app)
	{
		Catalog.appStatesCommon._resume(app);
	},
	
	cancelPausedDownload: function(app)
	{
		Mojo.Log.info("Catalog.appStates.paused.cancelPausedDownload")
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	toString: function()
	{
		return "paused";
	}
};

Catalog.appStates["download failed"] = {
	
	init: function(app) 
	{
		Mojo.Log.error("Catalog.download failed.init error: ", app.errorCode);
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Download failed');
		app.progress = 0;
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "warning"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = "show";
	},
	
	updateFromServer: function(app) 
	{
		// force a refresh
		app.setState("download failed");
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("download failed");	
	},
	
	defaultAction: function(app) 
	{
		this._defaultAction(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this._defaultAction(app);
	},
	
	_defaultAction: function(app) 
	{
		Utilities.Errors.displayError(app.errorCode, {errCode: app.errorCode}, "download_default", null, null, 
		function(value)
		{
			if (value == "retry") 
			{
				app.install();
			}
			else if (value == "cancel") 
			{
				Catalog.appStatesCommon._cancel(app);
			}
		});
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	install: function(app)
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
		
		Weave.Services.ApplicationServer.getApplicationDetails(app.id, app.publicApplicationId, Mojo.Locale.getCurrentLocale(), 
		function(status, details)
		{
			if (status) 
			{
				Mojo.Log.info("DownloadStates.download failed.getDetailsFromServer details %j", details);
				app.updateFromServer(details);
				
				Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateDownloadConnection(function(status)
						{ 
							if (status)
							{
								Mojo.Log.info("DownloadStates.download failed install: ", app.publicApplicationId);
								Weave.Services.AppInstallService.install(app, function(status, response)
								{
									if (!status)
									{
										Mojo.Log.error("DownloadStates.download failed: install failed %s: %j", app.publicApplicationId, response);
										if (app.stateToString() == "fake progress")
											app.setState(oldState);
									}
								});
							}
							else
							{
								app.setState(oldState);
							}
						});
					}
					else
					{
						app.setState(oldState);
					}
				});
			}
			else 
			{
				Mojo.Log.error("DownloadStates.download failed.getDetailsFromServer failed to get details from the server error: ", details);
				app.setState(oldState);
				Utilities.Errors.displayError(details);
			}
		});
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "download failed";
	}
};

Catalog.appStates["purchasing"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Purchasing...');
	},
	
	toString: function()
	{
		return "purchasing";
	}
};

Catalog.appStates["purchased"] = {
	
	init: function(app, args) 
	{
		if (!args || (args && !args.transitional)) 
		{
			app._progressPillModel.titleRight = undefined;
			app._progressPillModel.icon = 'download-app-icon';
			app._progressPillModel.image = undefined;
			app._progressPillModel.value = undefined;
			app._progressPillModel.title = $L('Download for free');
		}
		
		app.progress = 0;
		
		if (args && args.version)
			app.purchasedVersion = args.version;
	},
	
	updateFromServer: function(app) 
	{	
	},
	
	updateFromInstalledAppsList: function(app)
	{
		if (app.installedVersion) 
		{
			if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
			{
				app.setState("installed update available");
			}
			else 
			{
				app.setState('installed');	
			}
		}
	},
	
	removeFromMyApps: function()
	{
		return true;
	}, 
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	install: function(app)
	{
		Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
		{
			if (status) 
				Catalog.appStatesCommon._install(app);
		});
	},
	
	toString: function()
	{
		return "purchased";
	}
};

Catalog.appStates["purchase_failed"] = {
	
	init: function(app, args) 
	{
		Mojo.Log.error("Catalog.purchase_failed.init %j", args);
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Purchase failed');
		
		if (args) 
		{
			app.errorCode = args.errorCode.toString();
			Mojo.Log.error("Catalog.appStates[purchase_failed].init error: %s", app.errorCode);
		}
	},
	
	updateFromServer: function(app) 
	{	
	},
	
	
	defaultAction: function(app) 
	{
		var self = this;
		var failover;
		if (app.paymentType == "cc") {
			failover = "ob";
		} else if (app.paymentType == "ob") {
			failover = "cc";
		}
		
		Utilities.Errors.displayError(app.errorCode, 
			{errCode: app.errorCode, failover:failover},
			"PMT_purchase_default", null, null, function(value)
		{
			if (value == "cc") {
				Mojo.Log.info("## Trying credit card now.");
				Catalog.appStatesCommon._forcePaymentType(app, "cc");				
			} else if (value == "ob") {
				Mojo.Log.info("## Trying operator billing now.");
				Catalog.appStatesCommon._forcePaymentType(app, "ob");				
			} else {
				self._reset(app);
			}
		});
	},
	
	_reset: function(app)
	{
		app.setState("download");
	},
	
	_remove: function(app)
	{
		app.setState("download");
	},
	
	toString: function()
	{
		return "purchase_failed";
	}
};

// Base Purchase Pending on Purchase Failed, but with new message
Catalog.appStates["purchase_pending"] = {};
Object.extend(Catalog.appStates["purchase_pending"], Catalog.appStates["purchase_failed"]);

Catalog.appStates["purchase_pending"].init = function(app, args) {
	Mojo.Log.error("Catalog.purchase_pending.init %j", args);
	app._progressPillModel.titleRight = undefined;
	app._progressPillModel.icon = 'failed-app-icon';
	app._progressPillModel.image = undefined;
	app._progressPillModel.value = undefined;
	app._progressPillModel.title = $L('Purchase Pending');
		
	if (args) 
	{
		app.errorCode = args.errorCode.toString();
		Mojo.Log.error("Catalog.appStates[purchase_pending].init error: %s", app.errorCode);
	}

	this.defaultAction(app);
};

Catalog.appStates["purchase_pending"].defaultAction = function(app) {
	// Just show error again
	Utilities.Errors.displayError(app.errorCode);
};
	
Catalog.appStates["purchase_pending"].toString = function() {
	return "purchase_pending";
};


Catalog.appStates["installing"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'none';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = 1;
		app._progressPillModel.title = $L('Installing...');
		app.progress = 100;
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "active"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force a refresh
		app.setState("installing");
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "installing";
	}
};

Catalog.appStates["installed"] = {
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'launch-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Tap to launch');	
		Mojo.Log.info("Catalog.appStates[installed].init installedVersion=%s", app.installedVersion);
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	updateFromServer: function(app) 
	{
		this._update(app);
	},

	updateFromServerUpdatesList: function(app) 
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		Mojo.assert(app.installedVersion, "ERROR: app.installedVersion undefined when app is in installed state");
		// See if update is available
		if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
		{
			app.setState("installed update available");
		}
		else
		{
			// force a refresh
			app.setState("installed");
		}
	},
	
	saveToMyApps: function()
	{
		return true;
	},

	defaultAction: function(app) 
	{
		app.launch();
	},
	
	launch: function(app)
	{
		Weave.Services.ApplicationManager.openApplication(app.publicApplicationId, undefined, true);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	toString: function()
	{
		return "installed";
	}
};

Catalog.appStates["installed update available"] = {	
	
	init: function(app, args) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'update-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Update Available');
		
		app.disabledClass = null;
		app.updateClass = "update";
		app.activeClass = null; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = null;
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	defaultAction: function(app) 
	{
		app.install();
	},
	
	myAppsDefaultAction: function(app)
	{
		app.install();
	},
	
	install: function(app) 
	{
		Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
		{
			if (status) 
			{
				Catalog.appStatesCommon._install(app);
			}
			else 
			{
				app.setState("installed update available");
			}
		});
	},
	
	// called when updates are installed in a bulk
	// all checks (install capacity, network..) are done
	// once for the whole batch
	installUpdate: function(app) 
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
				
		Mojo.Log.info("Catalog.installed update available.installUpdate: ", app.publicApplicationId);
		Weave.Services.AppInstallService.install(app, function(status, response)
		{
			if (!status)
			{
				Mojo.Log.error("Catalog.installed update available.installUpdate failed %s: %j, returing to state %s", app.publicApplicationId, response, oldState);
				if (app.stateToString() == "fake progress")
					app.setState(oldState);
			}
		});
	},
	
	updateFromInstalledAppsList: function(app)
	{
		this._update(app);
	},
	
	updateFromServerUpdatesList: function(app) 
	{
		this._update(app);
	},
	
	_update: function(app)
	{
		Mojo.assert(app.installedVersion, "ERROR: app.installedVersion undefined when app is in installed state");
		if (app.serverVersion && Utilities.VersionCheck.compare(app.installedVersion, app.serverVersion) == -1) 
		{
			// force a refresh
			app.setState("installed update available");
		}
		else 
		{
			app.setState("installed");
		}
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	toString: function()
	{
		return "installed update available";
	}
};

Catalog.appStates["install failed"] = {

	init: function(app) 
	{
		app._progressPillModel.titleRight = undefined;
		app._progressPillModel.icon = 'failed-app-icon';
		app._progressPillModel.image = undefined;
		app._progressPillModel.value = undefined;
		app._progressPillModel.title = $L('Install failed');
		Mojo.Log.error("Catalog.appStates[install failed].init error: %s", app.errorCode);
		
		app.disabledClass = null;
		app.updateClass = null;
		app.activeClass = "warning"; 
		app.resumeClass = null;
		app.pauseClass = null;
		app.warningClass = "show";
	},
	
	updateFromServer: function(app) 
	{	
		// do nothing, let user retry to install
	},
	
	updateFromInstalledAppsList: function(app)
	{
		// force refresh
		app.setState("install failed");
	},
	
	defaultAction: function(app) 
	{
		this._defaultAction(app);
	},
	
	myAppsDefaultAction: function(app)
	{
		this._defaultAction(app);	
	},
	
	_defaultAction: function(app)
	{
		// TODO Add retryInstall back once NOV-83315 is implemented and there
		// is an "intelligent" retry, for now always download from scratch
		var totalInstallSize;
		if (app.installSize) 
		{
			totalInstallSize = (app.installSize / (1024 * 1024)) + 1;
			//totalInstallSize = (Math.ceil(totalInstallSize * 100) / 100) + "M";
			totalInstallSize = Mojo.Format.formatNumber(totalInstallSize, {fractionDigits: 2}) + $L("M");
		}
		else 
		{
			totalInstallSize = $L("unknown MB");
		}
		
		var revertableApp = Catalog.AppDownloadMngr.getDetailsRevertableApp(app.publicApplicationId);
		
		if (revertableApp) {
			Utilities.Errors.displayError(app.errorCode, {
				installSize: totalInstallSize,
				title : app.title
			}, "install_revert_default", null, null, function(value){
				if (value == "retry") {
					app.install();
				}
				else 
					if (value == "cancel") {
						Catalog.appStatesCommon._cancel(app);
					}
					else 
						if (value == "help") {
							Weave.Services.ConnectionManager.getStatus(function(online){
								Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
									target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
								});
							});
						}
						else 
							if (value == "revert") {
								app.pendingRevert = true;
								Catalog.appStatesCommon._restore(app);
							}
			});
		}
		else {
			Utilities.Errors.displayError(app.errorCode, {
				installSize: totalInstallSize
			}, "install_default", null, null, function(value){
				if (value == "retry") {
					app.install();
				}
				else 
					if (value == "cancel") {
						Catalog.appStatesCommon._cancel(app);
					}
					else 
						if (value == "help") {
							Weave.Services.ConnectionManager.getStatus(function(online){
								Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
									target: online ? 'http://help.palm.com/basics/manage_applications/basics_delete_app_from_launcher.html' : 'no-network'
								});
							});
						}
			});
		}
	},
	
	cancelDownload: function(app)
	{
		Catalog.appStatesCommon._cancel(app);
	},
	
	uninstall: function(app)
	{
		Catalog.appStatesCommon._uninstall(app);
	},
	
	_reset: function(app)
	{
		Catalog.appStatesCommon._reset(app);
	},
	
	_remove: function(app)
	{
		Catalog.appStatesCommon._remove(app);
	},
	
	install: function(app)
	{
		var oldState = app.stateToString();
		app.setState("fake progress");
		
		// refetch data from the server
		Weave.Services.ApplicationServer.getApplicationDetails(app.id, app.publicApplicationId, Mojo.Locale.getCurrentLocale(), 
		function(status, details)
		{
			if (status) 
			{
				Mojo.Log.error("DownloadStates.install failed.getDetailsFromServer details %j", details);
				app.updateFromServer(details);
				
				Catalog.appStatesCommon.validateInstallSpace(app, "validate_space_default_single", function(status)
				{
					if (status) 
					{
						Catalog.appStatesCommon.validateDownloadConnection(function(status)
						{ 
							if (status)
							{
								Mojo.Log.error("DownloadStates.install failed install: ", app.publicApplicationId);
								Weave.Services.AppInstallService.install(app, function(status, response)
								{
									if (!status)
									{
										Mojo.Log.error("DownloadStates.install failed: install failed %s: %j", app.publicApplicationId, response);
										if (app.stateToString() == "fake progress")
											app.setState(oldState);
									}
								});
							}
							else
							{
								app.setState(oldState);
							}
						});
					}
					else
					{
						app.setState(oldState);
					}
				});
			}
			else 
			{
				Mojo.Log.error("DownloadStates.install failed.getDetailsFromServer failed to get details from the server error: ", details);
				app.setState(oldState);
				Utilities.Errors.displayError(details);
			}
		});
	},
	
	saveToMyApps: function()
	{
		return true;
	},
	
	toString: function()
	{
		return "install failed";
	}
};

