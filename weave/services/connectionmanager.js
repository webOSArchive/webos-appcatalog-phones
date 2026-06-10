/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ConnectionManager = {
    _target: 'palm://com.palm.connectionmanager',
    _online: undefined,
    _1x: undefined,
    _waiting: [],
    _started: false,
    
    _startup: function(callback){
        this._started = true;
        if (PalmSystem.version.match("desktop")) {
            // Simulator is always online
            this._stateChanged(true);
            callback && callback(this._online);
            callback = null;
        }
        else {
            var self = this;
            
            // register for entering msm notifications
            this._MSMrequest = Weave.Services.request('palm://com.palm.bus/signal', {
                method: 'addmatch',
                parameters: {
                    "category": "/storaged",
                    "method": "MSMProgress",
                    "subscribe": true
                }
            }, function(response){
                self._MSMnotification(response);
            }, function(response){
                Mojo.Log.error("ConnectionManager._startup MSM subscription request failed %j", response);
                self._MSMnotification(response);
            });
            
            this._getstatusreq = this.getConnectionStatus(function(response){
                Mojo.Log.info("ConnectionManager.connectionStatusNotification %j", response);
                self._1x = response.wan.network == "1x" && response.wifi.state != "connected";
				self.wanInterface = response && response.wan && response.wan.interfaceName;
                self._stateChanged((response.isInternetConnectionAvailable == true ? true : false));
                callback && callback(self._online);
                // callback = null;
            }, function(){
                self._stateChanged(false);
                callback && callback(self._online);
                // callback = null;
            }, true);
        }
    },
    
    getConnectionStatus: function(success, failure, subscribe){
        if (this.statusInc == undefined) {
            this.statusInc = 0;
        }
        this.statusInc += 1;
        var calltime = this.statusInc;
        return Weave.Services.request(this._target, {
            method: 'getstatus',
            parameters: {
                subscribe: subscribe
            }
        }, success, failure);
    },
    getDataService: function(){
        var self = this;
		Weave.Services.DeviceProfile.getCarrierIdentification(function(status, carrier){
			if (carrier.mcc == 310 && carrier.mnc == 410) {
				this.cellSvcConnectRequest = Weave.Services.request(self._target, {
					method: 'connectCellularDataService',
					parameters: {
						subscribe: true,
						service: "proxy"
					}
				}, function(results){
					if (results) {
						Mojo.Log.info("getDataService success2 response", Object.toJSON(results));
						if (undefined != results.returnValue) { //first response will have returnValue the rest don't unless wand goes away
							if (!results.returnValue) {
								self.isWanSvcConnected = false;
								self.ipAddress = null;
							// failure(); //only reason we would get false is if service originaly failed to connect or wand crashed
							}
						}
						else {
							if (results.status) {
								if ("connected" === results.status && results.ipAddress) {
									self.isWanSvcConnected = true;
									self.ipAddress = results.ipAddress;
								//  success();
								
								}
								else 
									if ("retrying" === results.status) {
										self.isWanSvcConnected = false;
										self.ipAddress = null;
									//   failure();
									}
									else 
										if ("disconnected" === results.status) {
											self.isWanSvcConnected = false;
											self.ipAddress = null;
										//  failure();
										}
							}
						}
					}
				}, function(results){
					self.isWanSvcConnected = false;
					self.ipAddress = null;
				// failure();
				});
			}
		});
    },
    
    disconnectDataService: function(){
        if (null !== this.cellSvcConnectRequest) {
            this.cellSvcConnectRequest.cancel();
            this.cellSvcConnectRequest = null;
        }
        else {
            Mojo.Log.info("wanDisconnectServiceRequest already disconnected");
        }
    },
    _MSMnotification: function(response){
        if (!response) 
            return;
        
        Mojo.Log.info("ConnectionManager._MSMnotification %j", response);
        if (response.stage == 'attempting') {
            Mojo.Log.info("ConnectionManager._MSMnotification: in MSM");
            this._MSMmodeActive = true;
            ConnectionWidget.cancel();
        }
    },
    
    _stateChanged: function(online){
        if (this._online != online) {
            this._online = online;
            var waiting = this._waiting;
            this._waiting = [];
            for (var i = 0; i < waiting.length; i++) {
                var wait = waiting[i];
                if (wait.online === undefined || wait.online === online) {
                    waiting[i].callback(online);
                }
                else {
                    this._waiting.push(wait);
                }
            }
        }
        
        if (online == false) {
            this.showConnectionError();
        }
        else {
            // if internet is available we are certainly not in MSM mode
            this._MSMmodeActive = false;
            ConnectionWidget.cancel();
        }
    },
    
    /*
     * Enable monitoring of network status.
     */
    monitor: function(){
        if (!this._started) {
            this._startup();
        }
    },
    
    getStatus: function(callback){
        if (this._online === undefined) {
            if (!this._started) {
                this._startup(callback);
            }
            else {
                this._waiting.push({
                    online: undefined,
                    callback: callback
                });
            }
        }
        else {
            callback(this._online);
        }
    },
    
    isOnline: function(){
        if (this._online === undefined) {
            throw new Error("ConnectionManager is not monitoring status");
        }
        else {
            return this._online;
        }
    },
    
    isOn1x: function(){
        return this._1x;
    },
    
    waitForOnline: function(callback){
        if (this._online === true) {
            callback();
            return undefined;
        }
        else {
            var wait = {
                online: true,
                callback: callback
            };
            this._waiting.push(wait);
            return wait;
        }
    },
    
    waitForOffline: function(callback){
        if (this._online === false) {
            callback();
            return undefined;
        }
        else {
            var wait = {
                online: false,
                callback: callback
            };
            this._waiting.push(wait);
            return wait;
        }
    },
    
    cancelWait: function(wait){
        var waiting = this._waiting;
        for (var i = 0; i < waiting.length; i++) {
            if (waiting[i] == wait) {
                waiting.splice(i, 1);
                break;
            }
        }
    },
    
    showConnectionError: function(){
        // don't show connection widget if we are in MSM mode
        if (this._MSMmodeActive) 
            return;
        
        var stage = Weave.System.Activator.getActiveStageController();
        if (!stage) 
            return;
        
        if (!stage.isActiveAndHasScenes()) 
            return;
        
        Mojo.Log.info("ConnectionManager.showConnectionError");
        var params = {
            type: "data",
            onSuccess: function(response){
            }
        };
        ConnectionWidget.connect(params, stage);
    },
    
    cleanup: function(){
        // close connection's widget stage if active
        ConnectionWidget.cancel();
		this.disconnectDataService();
        delete this._MSMrequest;
        delete this._getstatusreq;
    }
    
};
