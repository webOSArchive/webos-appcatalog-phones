/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.PaymentServer = new (Class.create(Weave.Services.CatalogServer, {
    $whenReadyServerUrl: function(callback){
        if (this._serverUrl) {
            callback();
        }
        else {
            // We need the payment server url and the carrier info
            var self = this;
            Weave.Services.AccountServices.getPaymentServerUrl(function(status, url){
                self._serverUrl = status ? url : 'error:///';
                callback();
            });
        }
    },
    
    resetServerUrl: function(callback){
        this._serverUrl = undefined;
    },
    
    getCCTypes: function(binCountry, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var ingetCCTypes = {
                InGetCCTypes: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    billToCountry: binCountry
                }
            };
            self._callServer('getCCTypes', ingetCCTypes, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    setDefaultPaymentInfo: function(infoId, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inSetDefault = {
                InSetDefaultPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: infoId
                }
            };
            self._callServer('setDefaultPaymentInfo', inSetDefault, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    setInvoiceEmail: function(emailAdd, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var insetUserInfo = {
                InSetUserInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    invoiceEmail: emailAdd
                }
            };
            self._callServer('setUserInfo', insetUserInfo, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    getPaymentTypes: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            // Get carrier details
            
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
            
                // Cache for later use
                myProfile.mcc = carrier.mcc;
                myProfile.mnc = carrier.mnc;
                
                var inGetPaymentTypes = {
                    InGetPaymentTypes: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        mcc: carrier.mcc, // 310 works
                        mnc: carrier.mnc, // 0 works
                        carrier: carrier.qOperatorShortName // "sprint" works
                    }
                };
                
                Mojo.Log.info("## paymentTypes queried with: %s", Object.toJSON(inGetPaymentTypes));
                
                self._callServer('getPaymentTypes', inGetPaymentTypes, function(status, response, extra){
                    Mojo.Log.info("## paymentTypes returned with: %s - %s - %j", status, Object.toJSON(response), extra);
                    
                    if (status) {
                        callback(true, response, token);
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
        
    },
    getBillToCountries: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var ingetBillToCountries = {
                InGetBillToCountries: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getBillToCountries', ingetBillToCountries, function(status, response, extra){
                if (status) {
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    verifyPaymentSetup: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inGetPaymentInfos = {
                InGetPaymentInfos: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getPaymentInfos', inGetPaymentInfos, function(status, response, extra){
                Mojo.Log.info("#### getPaymentInfos call returned %j", response);
                
                if (status) {
                    if (!response.OutGetPaymentInfos.invoiceEmail) 
                        response.OutGetPaymentInfos.invoiceEmail = token.email;
                    callback(true, response);
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    addAccount: function(address, ccInfo, callback){
        // Adds a Credit Card account
        
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InAddCCPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    billTo: address,
                    creditCard: ccInfo
                }
            };
            
            
            self._callServer('addCCPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutAddCCPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    addOBAccount: function(address, callback){
        // Adds an Operator Billing account
        var self = this;
        
        this.getSecurityToken(function(token){
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
                var accountInfo = {
                    InAddOBPaymentInfo: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        address: address,
                        mcc: carrier.mcc,
                        mnc: carrier.mnc,
                        carrier: carrier.qOperatorShortName
                    }
                };
                
                Mojo.Log.info("### Adding carrier info with: %j", accountInfo);
                
                self._callServer('addOBPaymentInfo', accountInfo, function(status, response, extra){
                    Mojo.Log.info("### Added carrier info with: %j", response);
                    
                    if (status) {
                        if (response.OutAddOBPaymentInfo) {
                            callback(true, response);
                        }
                        else {
                            callback(false, 'badresponse');
                        }
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
        
    },
    
    getOBCountries: function(callback){
        // Gets which countries support operator billing for this phone
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InGetOBCountries: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getOBCountries', accountInfo, function(status, response, extra){
                Mojo.Log.info("### Got OB Countries with: %j - %j", response, extra);
                
                if (status) {
                    if (response.OutGetOBCountries) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
    
    updateAccount: function(address, ccInfo, callback){
        var self = this;
        
        this.getSecurityToken(function(token){
            ccInfo.email = token.email;
            var accountInfo = {
                InUpdateCCPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: ccInfo.paymentInfoId,
                    billTo: address,
                    creditCard: ccInfo
                }
            };
            
            self._callServer('updateCCPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutUpdateCCPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
            
        });
    },
    
    updateOBAccount: function(address, paymentInfoId, callback){
        var self = this;
        
        this.getSecurityToken(function(token){
            var accountInfo = {
                InUpdateOBPaymentInfo: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    paymentInfoId: paymentInfoId,
                    address: address
                }
            };
            
            Mojo.Log.info("### updating OB info using %j", accountInfo);
            
            self._callServer('updateOBPaymentInfo', accountInfo, function(status, response, extra){
                if (status) {
                    if (response.OutUpdateOBPaymentInfo) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    getOBInfos: function(callback){
        // Gets the URL to call for Operator Billing
        
        var self = this;
        
        this.getSecurityToken(function(token){
            Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
                var accountInfo = {
                    InGetOBInfos: {
                        authToken: token.token,
                        accountAlias: token.email,
                        deviceId: token.deviceId,
                        mcc: carrier.mcc,
                        mnc: carrier.mnc,
                        carrier: carrier.qOperatorShortName
                    }
                };
                
                self._callServer('getOBInfos', accountInfo, function(status, response, extra){
                    if (status) {
                        if (response.OutGetOBInfos) {
                            callback(true, response);
                        }
                        else {
                            callback(false, 'badresponse');
                        }
                    }
                    else 
                        if (response == "jsonexception") {
                            callback(false, extra);
                        }
                        else {
                            callback(false, {
                                errorCode: response
                            });
                        }
                });
            });
        });
    },
    
    removeAccount: function(paymentInfoId, isCC, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inputMethod = isCC ? "InRemoveCCPaymentInfo" : "InRemoveOBPaymentInfo";
            var outputMethod = isCC ? "OutRemoveCCPaymentInfo" : "OutRemoveOBPaymentInfo";
            var inputCall = isCC ? "removeCCPaymentInfo" : "removeOBPaymentInfo";
            var inputPayload = {
                authToken: token.token,
                accountAlias: token.email,
                deviceId: token.deviceId,
                paymentInfoId: paymentInfoId
            }
            
            var accountInfo = {};
            accountInfo[inputMethod] = inputPayload;
            
            Mojo.Log.info("### Calling %s with %j", inputCall, accountInfo);
            
            self._callServer(inputCall, accountInfo, function(status, response, extra){
                Mojo.Log.info("### Called %s and got %j", inputCall, response);
                
                if (status) {
                    if (response[outputMethod]) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
            
        });
    },
    
    capturePayment: function(orderObj, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var orderInfo = {
                InCapturePayment: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    order: orderObj
                }
            };
            Mojo.Log.info("## Calling capturePayment with %j", orderInfo);
            
            self._callServer('capturePayment', orderInfo, function(status, response, extra){
                if (status) {
                    if (response.OutCapturePayment) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    getOrderStatus: function(orderNo, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var orderInfo = {
                InGetOrderStatus: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    orderNo: orderNo
                }
            };
            
            Mojo.Log.info("## Calling getOrderStatus with %j", orderInfo);
            
            self._callServer('getOrderStatus', orderInfo, function(status, response, extra){
                if (status) {
                    if (response.OutGetOrderStatus) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    initOBSession: function(obInfos, callback, retries){
        // This hits an XML API on the aggregator's servers
        // Since we can't use weave, we need to do our own call and management.
        
        if (typeof retries == "undefined") {
            retries = 3;
        }
        
        Mojo.Log.info("## Will initialize OB Session with %j retrynumber%s", obInfos, retries);
                if (obInfos.wapProxy) {
                    // Use proxy for WAP
					this._getproxy(obInfos, retries, callback);
                }
                else {
					
                    this._getWanInterface(obInfos, retries, callback);
                }
    },
    
	_getWanInterface: function(obInfos, retries, callback){
		var self = this;
		if (Weave.Services.ConnectionManager.wanInterface) {
			var customRequestHeaders = {
				"X-webOS-NetworkInterface": Weave.Services.ConnectionManager.wanInterface
			};
			self._callInitSession(obInfos, retries, callback, customRequestHeaders);
		}
		else {
                if (retries == 0) {
                    callback(false, 'nowan');
                }
                else {
                    Mojo.Log.info("## Retrying");
                    // Try again in 100ms
                    setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
                }
            }
	},
    _getproxy: function(obInfos, retries, callback){
        var self = this;
        Mojo.Log.info("isWanSvcConnected %s, ipAddress %s", Weave.Services.ConnectionManager.isWanSvcConnected, Weave.Services.ConnectionManager.isAddress);
        if (Weave.Services.ConnectionManager.isWanSvcConnected && Weave.Services.ConnectionManager.ipAddress) {
        
            customRequestHeaders = {
                "X-webOS-NetworkInterface": Weave.Services.ConnectionManager.ipAddress
            };
            var proxyAddr = obInfos.wapProxy;
            var reg = /^http:\/\/([A-Za-z0-9\.-]+):([0-9]+)$/; // look for domain and port
            var matches = reg.exec(proxyAddr);
            customRequestHeaders["X-webOS-proxyaddr"] = matches[1];
            customRequestHeaders["X-webOS-proxyport"] = matches[2];
            Mojo.Log.info("## Making request with headers: %j", customRequestHeaders);
            self._callInitSession(obInfos, retries, callback, customRequestHeaders);
        }
        else {
            if (retries == 0) {
                callback(false, 'nowan');
            }
            else {
                Mojo.Log.info("## Retrying");
                // Try again in 100ms
                setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
            }
        }
    },
    _callInitSession: function(obInfos, retries, callback, customRequestHeaders){
        var self = this;
        var request = new Ajax.Request(obInfos.initSession.URL, {
            method: obInfos.initSession.submitMethod,
            contentType: 'application/xml',
            evanJSON: false,
            requestHeaders: customRequestHeaders,
            onSuccess: function(response){
                Mojo.Log.info("## Initializing OB Session: onSuccess");
                var text = response.responseText;
                response = response.responseXML;
                if (!response) {
                    Mojo.Log.info("## Initializing OB Session: empty reply");
                    callback(true); // Empty replies are okay
                }
                else {
                    var exception = response.XMLException;
                    if (exception) {
                        Mojo.Log.error("## Initializing OB Session: %s", exception);
                        callback(false, 'xmlexception', exception);
                    }
                    else {
                        Mojo.Log.info("## Initializing OB Session: success %s", text);
                        callback(true, response);
                    }
                }				
            },
            onFailure: function(response){
                Mojo.Log.info("## Initializing OB Session: onFailure");
                if (response.responseXML && response.responseXML.XMLException) {
                    Mojo.Log.error("## Initializing OB Session: exception %s", exception);
                    callback(false, 'xmlexception', response.responseXML.XMLException);
                }
                else 
                    if (response.responseXML) {
                        var x = response.responseText;
                        Mojo.Log.error("## Initializing OB Session Failure: status %s xml %s", response.status, x);
                        
                        callback(false, response.responseXML, response.status); // do not localize
                    }
                    else {
                        Mojo.Log.error("## Initializing OB Session Failure: status %s response %s", response.status, response.responseText);
                        callback(false, "failure", response.status); // do not localize
                    }
            },
            on0: function(response){
                Mojo.Log.error("## Initializing OB Session over WAN: on0/offline");
                
                if (retries == 0) {
                    callback(false, 'nowan', response.status);
                }
                else {
                    Mojo.Log.info("## Retrying");
                    // Try again in 100ms
                    setTimeout(self.initOBSession.bind(self, obInfos, callback, (retries - 1)), 500);
                }
                
            }
        });
    },
    getEmbargoedEmailExtensions: function(callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inGetEmbargoedEmailExtensions = {
                InGetEmbargoedEmailExtensions: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId
                }
            };
            
            self._callServer('getEmbargoedEmailExtensions', inGetEmbargoedEmailExtensions, function(status, response, extra){
                if (status) {
                    if (response.OutGetEmbargoedEmailExtensions) {
                        //callback(true,{"OutGetEmbargoedEmailExtensions":{"embargoedEmailExtensions":["cu", "ir", "kp", "sd", "sy"]}});
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    // promo code: getCodeType from server
    getCodeInfos: function(promocode, callback){
        Mojo.Log.info("paymentserver.getCodeInfos# promocode:[%s]", promocode);
        
        var self = this;
        this.getSecurityToken(function(token){
            var inGetPromoCodeInfos = {
                InGetPromoCodeInfos: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    code: promocode
                }
            };
            
            Mojo.Log.info("paymentserver.getSecurityToken, inGetPromoCodeInfos.promoCode:[%s]", inGetPromoCodeInfos.InGetPromoCodeInfos.code);
            
            // response stub
            //			var response = 
            //			{
            //				"OutGetPromoCodeInfos":
            //				{
            //					"campaignType": "GP",
            //					"validFrom": "20101115122133", 
            //					"validTo": "20101230122133",
            //					"amount": "100.87",
            //					"status": "A",
            //					"campaignStatus": "A",
            //					"items": [{"id":"com.engineequalscar.games.mines","version":"0.9.5"}]
            //				}
            //			}
            //			Mojo.Log.info("paymentserver getCodeInfos, outGetCodeInfos.promoType:%s, outGetCodeInfos.paid:%s", 
            //					response.OutGetPromoCodeInfos.campaignType, response.OutGetPromoCodeInfos.items[0].id);
            //			callback(true, response);
            
            self._callServer('getPromoCodeInfos', inGetPromoCodeInfos, function(status, response, extra){
                if (status) {
                    if (response.OutGetPromoCodeInfos) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
    },
    
    checkPromoCodeStatus: function(code, appid, version, callback){
        var self = this;
        this.getSecurityToken(function(token){
            var inCheckPromoCodeStatus = {
                InCheckPromoCodeStatus: {
                    authToken: token.token,
                    accountAlias: token.email,
                    deviceId: token.deviceId,
                    code: code,
                    id: appid,
                    version: version
                }
            };
            
            //test begin            
            //            var resp =
            //            {"OutCheckPromoCodeStatus":
            //                {"valid":"true", "campaignStatus":"E", "status":"R"}
            //            };
            //            callback(true, resp);
            //            return;
            //test end
            
            self._callServer('checkPromoCodeStatus ', inCheckPromoCodeStatus, function(status, response, extra){
                if (status) {
                    if (response.OutCheckPromoCodeStatus) {
                        callback(true, response);
                    }
                    else {
                        callback(false, 'badresponse');
                    }
                }
                else 
                    if (response == "jsonexception") {
                        callback(false, extra);
                    }
                    else {
                        callback(false, {
                            errorCode: response
                        });
                    }
            });
        });
        
    },
	
	_releaseHandle: function(request){
		if (request) {
				Mojo.Log.info("## releasing data servcie handle");
				request.cancel();
			}
	}
}));
