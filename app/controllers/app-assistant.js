/* Copyright 2009 Palm, Inc.  All rights reserved. */

var AppAssistant = Class.create({
	
	_name: 'findapps',
	
	initialize: function()
	{
		Mojo.Log.info("AppAssistant::initialize");
	    Weave.Services.ConnectionManager.monitor();
		Weave.Services.ConnectionManager.getDataService();
    this.depot = new Mojo.Depot({ name: Mojo.appInfo.id, version: 1, replace: false});
    this.appMetrics = new AppMetrics(null, this.depot);
	},
	
 // adding google analytics specific objects
  setupGoogleAnalytics: function(gaAccount) {
    var self = this;
    this.appMetrics.setAccountId(gaAccount);
    // google analytics connection status setup
    Weave.Services.ConnectionManager.getStatus(function(online) {
                                                 self.appMetrics.setInternetConnection(online);
                                              });
    this.appMetrics.trackLaunch(Mojo.appInfo.version);
    this.appMetrics.trackRegistration(Mojo.appInfo.version);
  },

	setup: function()
	{
		Mojo.Log.info("AppAssistant::setup");

		
		var self = this;		
    // getting Google Analytics Property ID from App Catalog Server
    Weave.Services.AccountServices.getGoogleAnalyticsWebPropertyID(function(success, accountId) {
                                                  Mojo.Log.info("Google Analytics API RESPONSE: "+success+" value is: "+accountId);
                                                  self.setupGoogleAnalytics(accountId);
                                                });

		Weave.System.Activator.addInterface('main',
		{
			_defaultStage: "default",
			
			init: function(target)
			{
				var me = this;
				Weave.System.Activator.open(this._defaultStage, "DefaultStageAssistant", function(stage)
				{
					me.start(stage, me._defaultStage);
				});
			},
			
			start: function(stage, stageName)
			{
				Mojo.Log.info("AppAssistant(main) start");
				if (!TermsOfUse.isAccepted())
				{
					stage.controller.pushScene('terms', function(accepted)
					{
						if (accepted) 
						{
							stage._gotoMain();
						}
						else 
						{
							Weave.System.Activator.close(stageName);
						}
					});
				}
				else
				{
					stage._gotoMain();
				}
				//stage.controller.activate();
				
				// is this needed?
				// Delay starting up to try to let the card come up a bit faster
				/*(function()
				{
					stage._gotoMain();
					stage.controller.activate();
				}).delay(1);
				*/
			}
		});
		
		Weave.System.Activator.addInterface('myapps',
		{
			_defaultStage: "default",
			
			init: function(target)
			{
				var me = this;
				Weave.System.Activator.open(this._defaultStage, "DefaultStageAssistant", function(stage)
				{
					me.start(stage, me._defaultStage);
				});
			},
			
			start: function(stage, stageName)
			{
				Mojo.Log.info("AppAssistant(myapps) start");
				
				var top = stage.controller.topScene();
				if (!top || top.sceneName != "myapps") 
				{
					stage.controller.pushScene('myapps');	
				}
				//stage.controller.activate();
			}
		});
		
		Weave.System.Activator.addInterface('target',
		{
			_defaultStage: "default",
			_webDistributedStage: "webDistributed",
			
			// perform any initialization determine which stage to open
			init: function(target)
			{
				Mojo.Log.info("AppAssistant(target).init target %s", target);
				
				// promo code parse from target url firstly
				var promoCode = self._parsePromoCode(target);
				if(!promoCode || promoCode=="") { // if promo code not exists, parse appid or packageid as original
					Mojo.Log.info("Not promo");
					
					var ids = self._findAppAndPackageId(target);
					
					// call server to find out the type of this application
					var appDetails = new AppDetails(ids.applicationId, ids.packageId);
					appDetails.attach(this);
					appDetails.getDetailsFromServer();
				} else { // promo code exists, go on
					Mojo.Log.info("promo. Check network online status firstly to avoid _callServer on offline track.[NOV-122941]");
					var me = this;
					Weave.Services.ConnectionManager.getStatus(function(online){
                    	if(online) {
                    		Mojo.Log.info("AppAssistant.target_promo.init# online, _handlePromo.");
                    		self._handlePromo(promoCode, me);
                    	}
                    	else {
                    		Mojo.Log.info("AppAssistant.target_promo.init# offline, gotoMain for show default error!");
                    		Weave.System.Activator.open(
                				"default", 
                				"DefaultStageAssistant", 
                				function(stage) {
                					stage._gotoMain();
                				}
                    		);
//            				Utilities.Errors.displayError("failure", null, "offline");
                    	}
                    });
				}
				
			},
			
			updateDetails: function(app)
			{
				var stageName = this._defaultStage;
				var stageAssistantName = "DefaultStageAssistant";
				
				var programType = app.getProgramType();
				Mojo.Log.info("AppAssistant(target).updateDetails programType %s", programType);
				
				// figure out which stage to push
				if (programType && (programType == "W" || programType == "B"))
				{
					stageName = this._webDistributedStage + (new Date()).getTime();
					stageAssistantName = "WebDistributedStageAssistant"
				}
				
				var me = this;				
				Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
				{
					me.target(app, stage, stageName);
				})
			},
			
			target: function(app, stage, stageName)
			{
				Mojo.Log.info("AppAssistant(target).target id:%j", app._packageid);
				app.detach(this);
				
				if (!TermsOfUse.isAccepted())
				{
					stage.controller.pushScene('terms', function(accepted)
					{
						if (accepted) 
						{
							stage.controller.swapScene('details', null, null, app);
						}
						else 
						{
							Weave.System.Activator.close(stageName);
						}
					});
				}
				else
				{
					stage.controller.pushScene('details', null, null, app);
				}
				//stage.controller.activate();
			}
		});

                Weave.System.Activator.addInterface('common',
                {
                        _defaultStage: "default",
                        _webDistributedStage: "webDistributed",

                        // perform any initialization determine which stage to open
                        init: function(params)
                        {
                                Mojo.Log.info("AppAssistant(target).init params %j, %s ", params, params.sceneType);

                                this.sceneType = params.sceneType;

                                if (this.sceneType != "search") {
                                        var id = params.id;
                                        // call server to find out the type of this application
                                        var appDetails = new AppDetails("", id);
                                        appDetails.attach(this);
                                        appDetails.getDetailsFromServer();
                                }
                                else{
                                        this.showSearch(params);
                                }
                        },

                        //support cross launching to search scene
                        showSearch: function(args)
                        {
                                Mojo.Log.info("AppAssistant showSearch %s", args.search);
                                var self               = this,
                                    passedParams       = args.params,
                                    stageName          = this._defaultStage,
                                    stageAssistantName = "DefaultStageAssistant";

                                Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
                                {
                                        self.pushScene(stage, self.sceneType, passedParams);
                                });
                        },

                        /*
                         * pushes the scene with given params. Check whether terms are accepted.
                         * otherwise first pushes term scene
                         */
                        pushScene: function(stage, sceneType, params){
                                if (!TermsOfUse.isAccepted())
                                        {
                                                stage.controller.pushScene('terms', function(accepted)
                                                {
                                                        if (accepted)
                                                        {
                                                                stage.controller.swapScene(sceneType, params);
                                                        }
                                                        else
                                                        {
                                                                Weave.System.Activator.close(stageName);
                                                        }
                                                });
                                        }
                                        else
                                        {
                                                stage.controller.pushScene(sceneType, params);
                                        }
                        },

                        //support cross launching to details, review or inapproprite scene
                        updateDetails: function(app)
                        {
                                var stageName = this._defaultStage;
                                var stageAssistantName = "DefaultStageAssistant";

                                var programType = app.getProgramType();
                                Mojo.Log.info("AppAssistant(target).updateDetails programType %s", programType);

                                // figure out which stage to push
                                if (programType && (programType == "W" || programType == "B"))
                                {
                                        stageName = this._webDistributedStage + (new Date()).getTime();
                                        stageAssistantName = "WebDistributedStageAssistant"
                                }

                                var me = this;
                                Weave.System.Activator.open(stageName, stageAssistantName, function(stage)
                                {
                                        me.target(app, stage, stageName);
                                })
                        },

                        target: function(app, stage, stageName)
                        {
                                Mojo.Log.info("AppAssistant(target).target id:%j", app._packageid);
                                app.detach(this);
                                this.pushScene(stage, this.sceneType, app);
                        }
                });
	},

	
	cleanup: function()
	{
		Mojo.Log.info("AppAssistant.cleanup");
		if (Catalog && Catalog.AppDownloadMngr)
			Catalog.AppDownloadMngr.cleanup();
			
		Weave.Services.ConnectionManager.cleanup();
	},
	
	handleLaunch: function(params)
    {
		Mojo.Log.info("AppAssistant::handleLaunch params *%j*", params);
		var processedParams = this._processParams(params);
		
		Weave.System.Activator.run(params);
    },
	
	_processParams: function(params){
		var processedParams = {};
		if (!params || params == "") 
			processedParams = {
				main: ""
			};
		else {
			for (var k in params) {
				Mojo.Log.info("AppAssistant::params[%s]", k);
				if (k.charAt(0) !== '$') {
					processedParams[k] = params[k];
				}
			}
			if(Utilities.Common.isEmpty(processedParams)){
				processedParams = {
					main: ""
				};
			}
		}
		Mojo.Log.info("AppAssistant::_processedParams %j", processedParams);
		return processedParams;
	},
	
	_findAppAndPackageId: function(target)
	{
		Mojo.Log.info("AppAssistant::_findAppAndPackageId target", target);
		var matches = /[?&]packageid=([^&]*)(?:&applicationid=(\d*)){0,1}/.exec(target);
		return matches ? { packageId: matches[1], applicationId: matches[2] } : {};
	},
	
	/*** promo code support */
	// Get promo code from target url, exp:
	// 	url - "http://developer.palm.com/appredirect/?promocode=ABCXYZ"
	// 	promocode - "ABCXYZ" 
	_parsePromoCode: function(target) {
		var promoCode = "";
		var matches = /[?&]promocode=([^&]*){0,1}/.exec(target);
		promoCode = matches ? matches[1] : "";
		
		return promoCode;
	},
	
	// launch appropriate page based on the promo code type
	// save promo code into database
	_handlePromo: function(promoCode, context) {
		Mojo.Log.info("_handlePromo, promoCode:%s", promoCode);
		
		var self = this;
		Weave.Services.PaymentServer.getCodeInfos(promoCode, function(status, response) {
			Mojo.Log.info("AppAsistant._handlePromo.getCodeInfos# status[%s], response[%j]", status, response);
			var promoInfo = {};
			if(status) {
				var outGetCodeInfos = response.OutGetPromoCodeInfos;
				promoInfo.callbackStatus = true;
				promoInfo.status = outGetCodeInfos.status;
				promoInfo.campaignStatus = outGetCodeInfos.campaignStatus;
				promoInfo.validTo = outGetCodeInfos.validTo;
				promoInfo.type = outGetCodeInfos.campaignType;		// should be GP/A*
				var isValidType = false;
				if(promoInfo.type == "GP") {
					Mojo.Log.info("_handlePromo, GP, go to main!");
					promoInfo.amount = outGetCodeInfos.amount;
					isValidType = true;
					// get into main page
					Weave.System.Activator.open(
							"default", 
							"DefaultStageAssistant", 
							function(stage) {
								if (!TermsOfUse.isAccepted()) {
									stage.controller.pushScene('terms', function(accepted) {
										if (accepted) {
											stage._gotoMain(promoInfo);
										}
										else {
											Weave.System.Activator.close("default");
										}
									});
								}
								else {
									stage._gotoMain(promoInfo);
								}
							}
					);
				}
				else if(promoInfo.type == "AP" || 
						promoInfo.type == "AJ" || 
						promoInfo.type == "AD") {
					promoInfo.publicApplicationId = outGetCodeInfos.items[0].id;
					Mojo.Log.info("_handlePromo, A*, ptype:%s, paid:%s", 
							promoInfo.type, promoInfo.publicApplicationId);
					isValidType = true;
					// get into app detail page
					var appDetails = new AppDetails("", promoInfo.publicApplicationId);
					appDetails.setPromoInfo(promoInfo);
					appDetails.attach(context);
					appDetails.getDetailsFromServer();
				}
				else {
					Mojo.Log.error("_handlePromo, invalid promotype:%s", promoInfo.prototype);
				}
				
				var promoCode4Store = "";
				if(isValidType && promoInfo.campaignStatus=="A" && promoInfo.status=="A") {
					// Save promo code to depot for promo code view retrieve
					self._savePromoToDB(promoCode, promoInfo.type);
					promoCode4Store = promoCode;
				}
				// Save promo code to cookie for synchronized retrieve when 
				// display the promo tag on download button
				var cookiePC = new Mojo.Model.Cookie("PromoCode");
				cookiePC.put(promoCode4Store);
				Mojo.Log.info("AppAssistant, promocode cookie store:[%s]", promoCode4Store);
			}
			else {
				Mojo.Log.error("getCodeInfos from server fail, status:%s, response:%j", status, response);
				promoInfo.callbackStatus = false;
//				Weave.System.Activator.open(
//						"default", 
//						"DefaultStageAssistant", 
//						function(stage) {
//							stage._gotoMain(promoInfo);
//						}
//				);
////				Utilities.Errors.displayPromoErrorDialog();
				var err = response.errorCode ? response.errorCode : response;
				Mojo.Log.info("AppAssistant._handlePromo# err:[%j]", err);
				Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");

			}
		});
		
	},
	
	// Save promo code into on-device database
	_savePromoToDB: function(promoCode, promoType) {
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
					Mojo.Log.info("promoDB code save done, promocode:%s, promotype:%s", promoCode, promoType);
					self.getPromoFromDBExt(function(promocode){
						Mojo.Log.info("promoDB code get done, promocode:%s", promoCode);
					});
				},
				function(result) { 
					Mojo.Log.error("promoDB code save fail: ", result); 
				}
		);
	},
	
	// Get promo code from on-device database: 'promoDB'
	// callback: function(promocode)
	getPromoFromDBExt: function(callback) {
		var self = this;
		
		self._promoDB.get("promoCode", 
				function(pc) { 
					callback(pc)
					Mojo.Log.info("promoDB code get done, pc:%s", pc);
				},
				function(result) { 
					Mojo.Log.error("promoDB code get fail: ", result); 
				}
		);
	}
	/*** promo code support end */
});

var DefaultStageAssistant = Class.create(
{	
	setup: function()
	{
		// Default AppMenu
		var self = this;
		var menu = new Weave.Utilities.AppMenu()
			.addEdit()
			.addPreferencesAndAcc(self.controller)
                        .addSoftwareManager()
			.addHelp('http://help.palm.com/app_catalog/index.html');
		Weave.Utilities.AppMenu.setDefault(menu);
		Weave.Utilities.AppMenu.enablePref(menu);
	},
	
	_gotoMain: function(promoInfo)
	{
		Mojo.Log.info("_gotoMain, promoInfo:%j", promoInfo);
		var mainSceneExists = false;
		var mainScene;
		var sceneStack = this.controller.getScenes();
		if (sceneStack) 
		{
			for (var index = sceneStack.size()-1; index >= 0; index--) 
			{
				var scene = sceneStack[index];
				if (scene.sceneName == "main") 
				{
					Mojo.Log.info("got main scene");
					mainSceneExists = true;
					mainScene = scene;	// hold the main scene in stack for further promo pop up 
					break;
				}
			}
		}
			
		// If we're on the main screen, stay there, otherwise pop all the scenes to main
		var top = this.controller.topScene();
		if (top && top.sceneName != "main") 
		{
			Mojo.Log.info("pop scene to main");
			this.controller.popScenesTo("main");
		}
		
		if (!mainSceneExists) {
			Mojo.Log.info("AppAssistant._gotoMain# main page not in stack, push into stack");
			// Invoke from promo code links
			if(promoInfo) { // push main scene with promoInfo params for show pop up dialog in MainAssistant's setup()
				this.controller.pushScene({name: "main", disableSceneScroller: true}, 
						{callbackStatus: promoInfo.callbackStatus, 
						status: promoInfo.status, 
						campaignStatus: promoInfo.campaignStatus, 
						promoExpiredDate: promoInfo.validTo, 
						promoAmount: promoInfo.amount});
			}
			else {
				this.controller.pushScene({name: "main", disableSceneScroller: true});
			}
		}
		else {
			Mojo.Log.info("AppAssistant._gotoMain# main page already in stack and have pop to top");
			if(promoInfo) { // show pop up dialog on top(main)
				Mojo.Log.info("main already there, plan to show promo popup, stageController.activeScene().sceneName:%s", 
						this.controller.activeScene().sceneName);
				
				if(promoInfo.callbackStatus) {
					if(promoInfo.campaignStatus=="A" && promoInfo.status=="A") {
						var stageController = this.controller;
						mainScene.showAlertDialog({
							onChoose: function(value) {
								// set the promoExpiredDate on MainAssistant for further show promo tag in detail page
								stageController.delegateToSceneAssistant("_markPromoInfo", promoInfo);
							},
							title: "Promo Code",
							message: $L('You can download one app for free up to $#{promoAmount} until #{promoExpiredDate}.').interpolate({
								promoAmount: promoInfo.amount, 
								promoExpiredDate: Utilities.Common.formatDateStr(promoInfo.validTo)}),
								choices: [{label: "OK", value: "ok"}]
						});
					}
					else {
						Utilities.Errors.displayPromoErrorDialog(mainScene, "invalid");
					}
				}
				else {
					Utilities.Errors.displayPromoErrorDialog(mainScene, "fail");
				}
			}
		}
	}
});

var WebDistributedStageAssistant = Class.create(
{	
	setup: function()
	{
		// Default AppMenu
		var self = this;
		var menu = new Weave.Utilities.AppMenu()
			.addEdit()
			.addPreferencesAndAcc(self.controller)
			.addHelp('http://help.palm.com/app_catalog/index.html');
		Weave.Utilities.AppMenu.setDefault(menu);
		Weave.Utilities.AppMenu.enablePref(menu);
	},
	
	/**********************************************
    * Global data
    ***********************************************/
	
	embargoedCounrtyList: undefined
});
