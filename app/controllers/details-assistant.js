/* Copyright 2009 Palm, Inc.  All rights reserved. */

var DetailsAssistant = Class.create(
{	
	initialize : function(appId, packageId, appDetails, useSynergyStyles, promoValidTo)
	{
                if (appDetails)
		{
			this._appDetailsPassedIn = true; 
			this._appDetails = appDetails;
			this._appid = appDetails._appid;
			this._packageid = appDetails._packageid;
		}
		else
		{
			this._appid = appId;
			this._packageid = packageId;	
		}
        
        if (promoValidTo)
        {
        	// Come from main-assistant
            this._promoLink = true;
        }
        
		Mojo.Log.info("DetailsAssistant.initialize appId=%s, packageId", this._appid, this._packageid);

                this._synergySearch = (useSynergyStyles && useSynergyStyles === true) ? true : false;
                this._allowBackSwipe = true;
                this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},

	setup: function() 
	{
		Mojo.Log.info("DetailsAssistant.setup appId =" + this._appid);

    // Google Analytics tracking code
    this.appMetrics.trackNewScene("details/" + this._appid);

		this._spinner = new Spinner(this, 'spinner', false, 'large');
		
		// get Download object for this app and subscribe as a listener
		this._appDownload = Catalog.AppDownloadMngr.getAppDownload(this._packageid, this);
		
		//To check if the app is revertable system app
		this._revertable = Catalog.AppDownloadMngr.isRevertable(this._packageid);
		Mojo.Log.info("DetailsAssistant.setup appId = %s, is reveratble = %s" , this._packageid, this._revertable);
		// create new app details object that will be shared between
		// details & comments scenes, if one was not passed in
		if (this._appDetailsPassedIn) 
		{
			this._appDetails.attach(this);
			// defer updating the widgets until setup is complete
			// that is, update from ready()
		}
		else 
		{
			this._appDetails = new AppDetails(this._appid, this._packageid);
			
			// subscribe as a listener for details changes
			this._appDetails.attach(this);
			this._spinner.start();
			this._appDetails.getDetailsFromServer();
		}

		// setup the progress pill
		this.progressPillModel = {};
		this._updateProgressPillModel();
		this.controller.setupWidget('progressPill', {}, this.progressPillModel);
		
		this._seeReviews = this._seeReviews.bindAsEventListener(this);
		this._shareButton = this._shareButton.bindAsEventListener(this);
		this._followLink = this._followLink.bindAsEventListener(this);
		this._showThumbnail = this._showThumbnail.bindAsEventListener(this);
		this._showVideoPreview = this._showVideoPreview.bindAsEventListener(this);
		
		this._handleDownloadBar = this._handleDownloadBar.bindAsEventListener(this);
		this._progressCancelled = this._progressCancelled.bindAsEventListener(this);
		
		this._linkModel = { items: [] };
		this.controller.setupWidget('linkList',
			{
				itemTemplate: 'details/details-linklist'
			},
			this._linkModel
		);
		
		if (!this._revertable)
		{
			this._reviewButtonModel = {
				disabled: false,
				buttonClass: 'reviews-button',// FIX: 'details-add-review-button',
				buttonLabel: $L('Reviews')
			};
			this.controller.setupWidget('seeReviews', {}, this._reviewButtonModel);
			this._shareButtonModel = {
				buttonClass: 'reviews-button',
				buttonLabel: $L("Share")
			};
			this.controller.setupWidget('shareButton', {}, this._shareButtonModel);
		}
		// Create App Menu
		new Weave.Utilities.AppMenu(this)
			.addEdit()
			.addItem($L('Report a Problem'), this._handleInappropriate.bind(this))
			.addHelp('http://help.palm.com/app_catalog/index.html');
				
		this._detailsPage = this.controller.get('detailsPage');

		this.drawerModel = {open:false};
		this.controller.setupWidget('detailsDrawer', {modelProperty:'open', unstyled:true}, this.drawerModel);
		this.drawer = this.controller.get('detailsDrawer');
		
		this.thumbnailSlideshow = this.thumbnailSlideshow.bind(this);
		
		// Pop out promo code suggest dialog
		if(this._appDetails._promoCallbackStatus==true) {
			if(this._appDetails._promoCampaignStatus=="A" && this._appDetails._promoStatus=="A") {
				// Come from app-assistant
				this._promoLink = true;
				
				this.controller.showAlertDialog({
					title: "Promo Code",
					message: $L('You can download this app for free until #{promoExpiredDate}.').interpolate({
						promoExpiredDate: Utilities.Common.formatDateStr(this._appDetails._promoValidTo)}),
						choices: [{label: "OK", value: "ok"}]
				});
			}
			else {
				Utilities.Errors.displayPromoErrorDialog(this.controller, "invalid");
			}
		}
	
		if(this._promoLink) {
			// Transfer the _promoLink to appDownload for check the value in _handleVerifyPayment().
			this._appDownload.setPromoLink(this._promoLink);
		}
	},

	ready: function()
	{                             
	   	// we are ready to update widgets
		if (this._appDetailsPassedIn)
			this.updateDetails(true);
		
		// Look for a credit card in the background to save time later
		if (myProfile.validPayment === undefined)
		{
			Weave.Services.PaymentServer.verifyPaymentSetup(function(status, response)
			{
				if (status && response.OutGetPaymentInfos.ccPaymentInfos.length > 0)
				{
					myProfile.validPayment = response;
				}
			});
		}
		if(myProfile.isEmbargoed === undefined){
			Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response)
			{
				Mojo.Log.info("getEmbargoedCountryList %j myprofileEmail:%s", response, myProfile.email);
				if (status) {
					AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
					if(myProfile.email)
					{
						var ext = myProfile.email.substring(myProfile.email.lastIndexOf(".") + 1); 
						myProfile.isEmbargoed = AppAssistant.embargoedList.indexOf(ext) != -1;
						Mojo.Log.info("Main Assistant isEmbargoed%s", myProfile.isEmbargoed);
					} 
				}
			});
		}
	},
	
	cleanup: function() 
	{
		this._appDetails.detach(this);
		Catalog.AppDownloadMngr.releaseAppDownload(this._packageid, this);		
		this._removeListeners();
		this._spinner.stop();
	},

	activate: function() 
	{
                //Make some markup/style changes when coming from a synergy search
                if (this._synergySearch === true) {
                    //this.controller.stageController.document.body.className = 'palm-light';
                    this.controller.get("detailsPage").addClassName('synergy');
                } else {
                    //this.controller.stageController.document.body.className = 'palm-default';
                    this.controller.get("detailsPage").removeClassName('synergy');
                }

		// For the details scene, add the class "notreviewed" to the document 
		// body for web distributed apps or "beta" for beta apps. 	
		var programType = this._appDetails.getProgramType();
		if (programType == "W")
		{
			if (!this.controller.document.body.hasClassName("notreviewed"))
				this.controller.document.body.addClassName("notreviewed");
		}
		else if (programType == "B")
		{
			if (!this.controller.document.body.hasClassName("beta"))
				this.controller.document.body.addClassName("beta");
		}
			if (this.imageCount > 1)
                this.thumbnailSlideshow();
	},
	
	deactivate: function() 
	{
		// Remove beta & web distributed banner whenever we deactivate
		this.controller.document.body.removeClassName("beta");
		this.controller.document.body.removeClassName("notreviewed");   
		clearTimeout(this.slideshowTimer);
		clearTimeout(this.swapThumbTimer);
	},           
	
	toggleDrawer: function(e) {                                    
		this.controller.get('detailsDrawer').mojo.toggleState();
	},
	
	// Observer method for application details changes
	updateDetails: function(selfCalled)
	{
		Mojo.Log.info("DetailsAssistant.updateDetails");
		var details = this._appDetails.getDetails();
		if (details != null) 
		{
			this._spinner.stop();
			Mojo.Log.info("DetailsAssistant.updateDetails details %j", details);
			this._appDownload.updateFromServer(details);
			this._rebuildDetailsFromModel(details);
		}
		else if (selfCalled && this._appDetails.getError() != null)
		{
			// in case this is "app not found" error show a nice message
			Utilities.Errors.displayError(this._appDetails.getError());
		}
	},
	
	// Observer method for download state changes
	updateDownloadState: function() 
	{
                Mojo.Log.info("DetailsAssistant.updateDownloadState");

                //When launched from a Synergy search the scene will not
                //allow back swipes while an active install is in progress.
                if (this._synergySearch === true) {
                    var newState = this._appDownload.stateToString();
                    Mojo.Log.info("DetailsAssistant.updateDownloadState: new state %s", newState);

                    if (newState === 'installed') {
                        //when a synergy app is install we talk the user back to the
                        //scene prior to the search results (after verifying it exists)
                        var sceneStack = this.controller.stageController.getScenes();  
                        if (sceneStack && sceneStack.size() >= 3) {
                            var sceneName = sceneStack[sceneStack.size()-3].sceneName;

                            Mojo.Log.info("DetailsAssistant.updateDownloadState: popping scene to %s", sceneName);
                            Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_to", sceneName);
                            this.controller.stageController.popScenesTo(sceneName, { returnValue: true, publicApplicationId: this._packageid });
                        } else {
                            //originating scene not on the stack.  just re-enable the swipe.
                            this._allowBackSwipe = true;
                        }
                    } else if (newState === 'download' || newState.indexOf("failed") > -1) {
                        this._allowBackSwipe = true;
                    } else {
                        this._allowBackSwipe = false;
                    }
                }

		// update the progress pill
		this._updateProgressPillModel();
		this.controller.modelChanged(this.progressPillModel);
	},
	
	_deleteApplication: function()
	{
    this.appMetrics.trackEvent("delete", "application", this._appid);
		var details = this._appDetails.getDetails();
		var self = this;
		this.controller.showAlertDialog(
		{
	    	onChoose: function(value)
			{
				if (value == 'delete')
				{
					self._appDownload.uninstall();
				}
			},
		    message: $L("Are you sure you want to delete this from your phone?"), 
		    choices:
			[
				{label:$L('Delete'), value:'delete', type:'negative'},
	        	{label:$L("Cancel"), value:'cancel', type:'dismiss'},
		    ]
	  	});
	},
	
	_rebuildDetailsFromModel: function(model)
	{
		Mojo.Log.info("DetailsAssistant._rebuildDetailsFromModel %j", model);
		
		// Remove any listeners that currently exists - we're rebuilding the page
		this._removeListeners();

		model.formattedVersion = 'v' + model.version;
		model.formattedDate = Mojo.Format.formatDate(Utilities.UTCDate.parse(model.lastModifiedTime), { date: 'short' });
		
		// calculate the size in MB
		model.formattedAppSize = (model.installSize / (1024*1024)) + 1;
		//model.formattedAppSize = (Math.ceil(model.formattedAppSize*100)/100) + "M";
		model.formattedAppSize = Mojo.Format.formatNumber(model.formattedAppSize, {fractionDigits: 2}) + $L("M");
			
		// Web Application or beta app
		if (model.programType == "W")
		{
			if (!this.controller.document.body.hasClassName("notreviewed"))
				this.controller.document.body.addClassName("notreviewed");
		}
		else if (model.programType == "B")
		{
			if (!this.controller.document.body.hasClassName("beta"))
				this.controller.document.body.addClassName("beta");
		}
		
		var disclaimerDiv = this.controller.get('palm-disclaimer');
		if (model.releaseStatus == "final" && disclaimerDiv.hasClassName("beta"))
		{
			disclaimerDiv.removeClassName("beta");
		}
		else if (model.releaseStatus == "beta" && !disclaimerDiv.hasClassName("beta"))
		{
			disclaimerDiv.addClassName("beta");
		}
		
		// Rating
		var halfstars = Math.round(model.averageRating * 2);
		model.formattedStar1 = this._formatStar(halfstars, 0);
		model.formattedStar2 = this._formatStar(halfstars, 1);
		model.formattedStar3 = this._formatStar(halfstars, 2);
		model.formattedStar4 = this._formatStar(halfstars, 3);
		model.formattedStar5 = this._formatStar(halfstars, 4);
		model.pluralRating = model.cntRating; //Mojo.Format.formatChoice(model.cntRating, $L("1##{cntRating} rating|##{cntRating} ratings"), model);
		
		model.formattedIsRestrictedContent = false ? 'block' : 'none';
		
		// Location
		model.formattedIslocationbased = model.islocationbased ? 'block' : 'none';
		                                        
		// hide the row separator after the description if there's no row after
		model.descriptionNoSeparator = model.islocationbased ? "" : "no-separator";          
		
		model.notReviewed = false ? "block" : "none";
		
		this._linkModel.items = [];
		model.homeURL && this._linkModel.items.push(
		{
			name: $L('Developer Home'),
			url: model.homeURL
		});
		model.supportURL && this._linkModel.items.push(
		{
			name: $L('Support'),
			url: model.supportURL
		});                                           
		model.licenseURL && this._linkModel.items.push(
		{
			name: $L('License agreement'),
			url: model.licenseURL
		});
		this.controller.modelChanged(this._linkModel);
		                      
		this.imageCount = 0;
		// Fix images
		for (var k in { appScaledImage1: null, appScaledImage2: null, appScaledImage3: null, appScaledImage4: null, appScaledImage5: null })
   		// for (var k in { appScaledImage1: null}) 
		{                                                      
			var img = model[k];      
			Mojo.Log.info("img ", img);
			if (img == null || img.slice(-5) == '/null')
			{
				model[k+'Visible'] = 'none';
			}
			else
			{
				model[k+'Visible'] = 'block';
				new LazyLoadImage('', model[k+'Visible']);
				this.imageCount++;      
			}
		}
		model.touchableRows = 'rows-'+ Mojo.Environment.DeviceInfo.touchableRows;
		
		                             
		// Render
		this.controller.update(this._detailsPage, Mojo.View.render(
		{
			template: "details/details-all",
			object: model
		}));
		
		if (this._revertable) {
				this.controller.get('starRating').style.display = 'none';
				this.controller.get('ratingCount').style.display = 'none';
				this.controller.get('seeReviews').style.display = 'none';
				this.controller.get('shareButton').style.display = 'none';
			}

                //Account for longer titles
                if (model.title.length > 28 && model.title.length < 55) {
                    this.controller.get('detailHeaderWrapper').addClassName("large");
                } else if (model.title.length >= 55) {
                    this.controller.get('detailHeaderWrapper').addClassName("largest");
                }
		
                //display the icon for video if available
		if(model.mediaIcon && model.mediaLink && model.mediaIcon != "" && model.mediaLink != "" ){
			this.controller.get('videoPreview').addClassName('show');                  
			this.controller.get('videoPreview').down('.video-screencap').setStyle({backgroundImage:"url(" + model.mediaIcon +")"});
			this.controller.get('videoPreview').addEventListener(Mojo.Event.tap, this._showVideoPreview);
			}  
			   
		// Lazy load thumbnails (loading bad ones doesnt matter since they're hidden anyway)
		for (var k in { appScaledImage1: null, appScaledImage2: null, appScaledImage3: null, appScaledImage4: null, appScaledImage5: null })
		// for (var k in { appScaledImage1: null}) 		
		{                                                 
			// get the full-size version for now until we have the correct new size 
			if (model[k]) {                                                             
                // load the lowres of the first image to get a placeholder for the fullres version
				if (k == "appScaledImage1") 
					this.controller.get(k+'Img').setStyle({backgroundImage:"url("+model[k]+")"});

				var img = model[k].replace('/S/', '/L/');     
				new LazyLoadImage(img, this.controller.get(k+'Img')); 
			}
		}
		this.currentThumbnail = 1;
		
		// Attach handlers
		if(!this._revertable){
			this.controller.get('seeReviews').addEventListener(Mojo.Event.tap, this._seeReviews);
			this.controller.get('shareButton').addEventListener(Mojo.Event.tap, this._shareButton);
		}
		
		this.controller.get('linkList').addEventListener(Mojo.Event.listTap, this._followLink);
		this.controller.get('thumbnails').addEventListener(Mojo.Event.tap, this._showThumbnail);
		
		this._progress = this.controller.get('progressPill');
		this._progress.addEventListener(Mojo.Event.tap, this._handleDownloadBar);
		this._progress.addEventListener(Mojo.Event.progressIconTap, this._progressCancelled);
		
		                             
		// FIX: need to save this for the showThumbnail case?
		this._currentDetails = model;
 	   	
		// set up details drawer      
                this.controller.listen('detailHeader', Mojo.Event.tap, this.toggleDrawer.bind(this));

		// start thumbnail slideshow timer        
		if (this.imageCount > 1)
			this.slideshowTimer = setTimeout(this.thumbnailSlideshow, 8000);

                //Determine if we need to display the "works with" section
                this._showWorksWith = false;
                var appConnectors,
                    appProvides = model.attributes.provides;

                if (appProvides !== undefined) {
                    if (appProvides.connectors !== undefined) {
                        appConnectors = Object.isArray(appProvides.connectors) ? appProvides.connectors : [ appProvides.connectors ];

                        if (appConnectors.length > 0) {
                            this._showWorksWith = true;

                            //Show each section
                            var connectorDiv;
                            for(var i=0; i<appConnectors.length; i++) {
                                connectorDiv = this.controller.get("works-with-" + appConnectors[i].toLowerCase());
                                if (connectorDiv !== undefined) {
                                    connectorDiv.show();
                                }
                            }
                        }
                    }

                    if (appProvides.dockMode !== undefined && appProvides.dockMode === true) {
                        this._showWorksWith = true;
                        this.controller.get("works-with-dock").show();
                    }

                    if (appProvides.universalSearch !== undefined && appProvides.universalSearch === true) {
                        this._showWorksWith = true;
                        this.controller.get("works-with-search").show();
                    }
                }

                if (this._showWorksWith === true) {
                    this.controller.get("worksWithTable").show();
                    this.controller.get("worksWith").show();
                }
	},
	                                      
	// cycles through the thumbnails by fading the current one to 0 opacity then moving it to the 
	// bottom of the stack
	// in reality the DOM node is moved to the top for pseudo z-order
	thumbnailSlideshow: function() {      
		var oldThumbnail = this.currentThumbnail;
		
		this.currentThumbnail++;
		if (this.currentThumbnail > this.imageCount) {
			this.currentThumbnail = 1;
		}
		
		// don't have to wrap around yet so just fade the current one
		// to show the next one
                this.controller.get('appScaledImage1Img').show();
                this.controller.get('appScaledImage2Img').show();
		this.controller.get('appScaledImage3Img').show();
		this.controller.get('appScaledImage4Img').show();
		this.controller.get('appScaledImage5Img').show();
		this.controller.get('appScaledImage'+oldThumbnail+'Img').addClassName('fade');
		
		var swapThumbs = function() {                                        
                var parent = this.controller.get('appScaledImage1');
                var oldThumb = this.controller.get('appScaledImage'+oldThumbnail+'Img').remove();
        	oldThumb.removeClassName('fade');
			parent.insert({top:oldThumb}); 
		}.bind(this);                                                                                                                           
		this.swapThumbTimer = setTimeout(swapThumbs, 2000);

		this.slideshowTimer = setTimeout(this.thumbnailSlideshow, 5000);
	},
	
	_removeListeners: function()
	{
		var controller = this.controller;
		function removeListener(name, key)
		{
			var elem = controller.get(name);
			if (elem)
			{
				elem.removeEventListener(key);
			}
		}
		if (!this._revertable) {
			removeListener('seeReviews', Mojo.Event.tap);
			removeListener('linkList', Mojo.Event.listTap);
		}
		removeListener('thumbnails', Mojo.Event.tap);
		removeListener('progressPill', Mojo.Event.tap);
		removeListener('progressPill', Mojo.Event.progressIconTap);
		removeListener('videoPreview', Mojo.Event.tap);
	},
	
	_formatStar: function(halfstars, idx)
	{
		halfstars -= 2 * idx;
		if (halfstars > 0)
		{
			if (halfstars > 1)
			{
				return 'full';
			}
			else
			{
				return 'half';
			}
		}
		else
		{
			return 'empty';
		}
	},
	
	_followLink: function(event)
	{
		Mojo.Log.info("_followLink %j", event.item)
    this.appMetrics.trackEvent("follow", "link", event.item.url);
		Weave.Services.ApplicationManager.Browser.openPage(event.item.url);
	},
	
	_seeReviews: function(event)
	{
		var self = this;
		Mojo.Log.info("_seeReviews %s", self._appDetails._appid);
    this.appMetrics.trackEvent("see_reviews", self._appDetails._appid);
		Weave.Services.ApplicationServer.getMyComment(self._appDetails._appid, self._appDetails._packageid,function(status, review)
		{
			if (status)
			{
				self.controller.stageController.pushScene('comments', self._appDetails, review);
			}
			else{
				Utilities.Errors.displayError(review);
			}
		});
	},
	
	_shareButton: function(event)
	{
		var self = this;
		this.controller.popupSubmenu(
		{
                    onChoose: function(command) {
                        switch (command) {
                            case 'email':
                            case 'text':
                                // The share code needs to be extract from this scene and available through out the app
                                Utilities.Common.handleCommand({type: Mojo.Event.command, command: command}, self._appDetails);
                                break;
                            default:
                                break;
                        }
                    },
                    placeNear: event.target,
                    items: [
                        { label: $L('Email'), command: 'email' },
                        { label: $L('Text Message'), command: 'text' }
                    ],
                    popupClass: 'share-popup',
                    scrimClass: 'share-popup-scrim'
                }
            );

	},
	
	_showThumbnail: function(event)
	{
		var target = event.target;
		
		// if (target.className.indexOf('details-screenshot-downstate') != -1)
		// {
			var images = [];
						
			// Transform scaled image URLs to large image URLs
			var details = this._appDetails.getDetails();

			for (var k in { appScaledImage1: null, appScaledImage2: null, appScaledImage3: null, appScaledImage4: null, appScaledImage5: null })
			{
                                if (details[k])
				{

					images.push(details[k].replace('/S/', '/L/'));
				}
			}
			                              
			this.controller.stageController.pushScene('picture', images, 0);
		// }
	},
	
	_showVideoPreview: function(event)
	{   
		var details = this._appDetails.getDetails();
		var params = {};
		params.target = details.mediaLink;
		params.direct = true;
		Weave.Services.ApplicationManager.launchApplication('com.palm.app.youtube', params);
			
	},
	
	_handleInappropriate: function()
	{  
		var params = {};
		params.appDetails = {};
		params.appDetails.title = this._appDetails.getDetails().title;
		params.appDetails.creator = this._appDetails.getDetails().creator;
		params.appDetails.appIcon = this._appDetails.getDetails().appIcon;
		params.appDetails.appid = this._appDetails._appid;
		this.controller.stageController.pushScene('inappropriate', params);
	},

	_progressCancelled: function(event)
	{
		Mojo.Log.info("progress cancelled");
    this.appMetrics.trackEvent("download", "cancelled", this._appid);
		this._appDownload.cancelDownload();
	},
	
	_handleDownloadBar: function(event)
	{
    this.appMetrics.trackEvent("download", this._appid);
		Mojo.Log.info("DetailsAssistant._handleDownloadBar");
		this._appDownload.defaultAction();
	},
	
	_updateProgressPillModel: function()
	{
		var progressPillFields = this._appDownload.getProgressPillModel();
		this.progressPillModel.titleRight = progressPillFields.titleRight;
		this.progressPillModel.icon = progressPillFields.icon;
		this.progressPillModel.image = progressPillFields.image;
		this.progressPillModel.value = progressPillFields.value;
		this.progressPillModel.title = progressPillFields.title;
		
		Mojo.Log.info("AppDetails._updateProgressPillModel model %j", this.progressPillModel);
	},

        handleCommand: function(event)
	{
 		if (event.type == Mojo.Event.back)
		{
                        //When launched from a Synergy search the scene will not
                        //allow back swipes while an active install is in progress.
                        if (this._allowBackSwipe === false) {
                            event.stop();

                            Mojo.Log.info("DetailsAssistant.handleCommand: back swipe ignored during install!");
                        }
		}
 	}
});
