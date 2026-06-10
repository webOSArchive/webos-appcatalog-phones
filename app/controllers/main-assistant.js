/* Copyright 2009 Palm, Inc.  All rights reserved. */

var MainAssistant = Class.create(
{
	initialize : function(params)
	{
		Mojo.Log.info("MainAssistant.initialize");
		if(params) {
			Mojo.Log.info("MainAssistant.initialize with params, promoExpiredDate:%s, promoAmount:%s", 
					params.promoExpiredDate, params.promoAmount);
            // Promo 
			this.promoCallbackStatus=params.callbackStatus;
			this.promoStatus = params.status;
			this.promoCampaignStatus=params.campaignStatus;
			if(this.promoCampaignStatus=="A" && this.promoStatus=="A") {
				this.promoExpiredDate = params.promoExpiredDate;
				this.promoAmount = params.promoAmount;
			}
			this.promoLaunchError = params.promoLaunchError;
		}

                this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;

                this._searchTermCookie = new Mojo.Model.Cookie("com.palm.app.findapps.searchTerm");

                this._sort  = 'RATING_DESC';
		this._query = '';
                this._queryFragment = '';
                this._qid = 'Blowfish2Query1';
                this._connectors = '';
		this._installedApps = {};
                this._commandMenuReady = false;
                this._justTypeTimer = null;
                this._searchInProgress = false;

		this.searchFieldModel = {
                    'original': ''
		};

                this._scrollerInfo = {
                    position: 0,
                    minScrollPositionOfInterest: 0, //top of list
                    maxScrollPositionOfInterest: -130,
                    customHeight: (Mojo.Environment.DeviceInfo.screenHeight - 135) + 'px'
                };

                this._featureTileInfo = {
                    minDivHeight: 0,
                    maxDivHeight: 115,
                    containerDiv: null,
                    tiles: [],
                    active: true
                };

                //Category setup
                this._appCategoriesHelper = new Weave.Utilities.AppCategoriesHelper();
                this._categoryInfo = this._appCategoriesHelper.categoryInfo;
                this._appCategoriesHelper.updateCategorySelector(); //Fill this._categoryInfo.items
                this._categorySelectorFadeStatus = 0;
	},

	setup: function()
	{
		Mojo.Log.info("MainAssistant.setup");
    // Google Analytics
    this.appMetrics.trackNewScene("main");

                this._searchItemsCallback = this._searchItemsCallback.bind(this);
		this._gotoApp = this._gotoApp.bindAsEventListener(this);
		this._searchAppsKey = this._searchAppsKey.bindAsEventListener(this);
		this._searchApps = this._searchApps.bindAsEventListener(this);
                this._openFeatureTile = this._openFeatureTile.bind(this);

		// Set up the attributes & prepare this widget for lazy loading of data
		this._searchListAttr =
		{
			itemTemplate: 'main/main-appsummary',
			dividerTemplate: 'main/main-appdivider',
			itemsCallback: this._searchItemsCallback.bind(this),
			formatters: {
				dummy: this._formatAppSummary.bind(this)
			},
			onItemRendered: this._renderedAppSummary.bind(this),

			// These values have been set after a lot of experimentation
			// with the list scrolling performance. Since list is loading
			// more items as user scrolls it is critical to get these numbers
			// right. Don't change before carefully reevaluating scrolling perf.
			// also update this.listRerenderCount
			renderLimit: 40,
			lookahead: 50,
			scrollThreshold: 600
		};

		this.listRerenderCount = 140; // 2*lookahead + renderLimit

		// setup search field
		this.searchFieldModel.attributes = {
                        hintText: $L(" Search App Catalog..."),
	  		enterSubmits: true,
                        focus: true,
			multiline: false,
			modelProperty: 'original',
			modifierState: Mojo.Widget.steModeSentenceCase,
			focusMode: Mojo.Widget.focusSelectMode,
			autoReplace: false,
			requiresEnterKey: true,
			changeOnKeyPress: true
                };
                this.controller.setupWidget(
			'in-fa-search-text',
			this.searchFieldModel.attributes,
			this.searchFieldModel
		);

                //Searchbar
		this._appsSearch =
		{
			widget: this.controller.get('in-fa-search-text'),
                        barText: this.controller.get('app-search-bar-text'),
                        barIcon: this.controller.get('app-search-bar-icon'),
			button: this.controller.get('searchResultsModified'),
                        inactiveSearchBar: this.controller.get("app-search-bar-inactive"),
                        activeSearchBar: this.controller.get("app-search-bar-active"),
                        searchScrim: this.controller.get("app-search-bar-scrim"),
                        inSearchMode: false
		};
                this._updateSearchBarIndicators();

                //Scroller
                this._scrollerModel = {
                    mode: 'vertical',
                    weight: 'light',
                    friction: 'low'
                };
                this.controller.setupWidget('applist-scroller', {}, this._scrollerModel);
                this._scroller = this.controller.get("applist-scroller");
                //Dynamically adjust custom scroller height based on available screen real estate
                //this._scroller.style.height = this._scrollerInfo.customHeight;
        		this.scalingFactor = this.controller.window.zoomFactor || 1;
        		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
        		Mojo.Log.error("Scaled Height: " + this.scaledHeight);
        		this._scroller.style.height = this.scaledHeight+"px";

                this.controller.setupWidget(
			'dv-fa-appslist',
			this._searchListAttr,
			{}
		);
		this._appsListWidget = this.controller.get('dv-fa-appslist');
                this._appListDefaultMessage = this.controller.get('dv-fa-appslist-message-default');
                this._appListMessage = this.controller.get('dv-fa-appslist-message');

                //Featured Apps
                this._featureTileInfo.containerDiv = this.controller.get("featured-app-tiles");
                this._featureTileInfo.tiles[0] = {"tileNode": this.controller.get("feature_tile__0")};
                this._featureTileInfo.tiles[1] = {"tileNode": this.controller.get("feature_tile__1")};

		//Category Selector
                this._categorySelector = this.controller.get("categorySelector");
                this._categorySelectorPlacementAnchor = this.controller.get("categorySelectorPlacementAnchor");
                this._categorySelectorFade = this.controller.get("category-selector-fade");

                //Display feature tiles div if needed
                if (this._featureTileInfo.active === true) {
                    this._featureTileInfo.containerDiv.show();
                } else {
                    this._featureTileInfo.containerDiv.hide();
                }

                // Set up a command menu
                this._queryItems =
                {
                    items: QueryButtons.getQueryButtonsForCategory(this._categoryInfo.category),
                    toggleCmd: this._qid
                };

                this._queryMenu =
                {
                        visible: false, //wait to show until after we have verified the paid icon
                        items: [
                                {},
                                this._queryItems,
                                {}
                        ]
                };
                this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this._queryMenu);

		// Menus
		Weave.Utilities.AppMenu.useDefault(this);

		this._spinner = new Spinner(this, 'spinner', true, 'large');

		// get notified when installed applications change
		Catalog.AppDownloadMngr.attach(this);
		
		// show promo pop up dialog
		if(this.promoCallbackStatus==true) {
			if(this.promoCampaignStatus=="A" && this.promoStatus=="A") {
				this.controller.showAlertDialog({
					title: "Promo Code",
					message: $L('You can download one app for free up to $#{promoAmount} until #{promoExpiredDate}.').interpolate({
						promoAmount: this.promoAmount, 
						promoExpiredDate: Utilities.Common.formatDateStr(this.promoExpiredDate)}),
						choices: [{label: "OK", value: "ok"}]
				});
			}
			else {
				Utilities.Errors.displayPromoErrorDialog(this.controller, "invalid");
			}
		}
		else if(this.promoCallbackStatus==false) {
			Utilities.Errors.displayPromoErrorDialog(this.controller, "fail");
		}
	},

	cleanup: function()
	{
		Catalog.AppDownloadMngr.detach(this);
	},

	activate: function()
	{
		Mojo.Log.info("MainAssistant.activate");

                this._doCustomSearch = this._doCustomSearch.bind(this);
                this._justTypeKeydownHandler = this._justTypeKeydownHandler.bind(this);

		this._appsListWidget.addEventListener(Mojo.Event.listTap, this._gotoApp);
		this._appsSearch.widget.addEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.addEventListener(Mojo.Event.tap, this._doCustomSearch);
                this._appsSearch.inactiveSearchBar.addEventListener(Mojo.Event.tap, this._showCustomSearchBar.bind(this));
                this._appsSearch.searchScrim.addEventListener(Mojo.Event.tap, this._hideCustomSearchBar.bind(this));
                this._categorySelector.addEventListener(Mojo.Event.tap, this._showCategoryPopup.bind(this));
                this.controller.sceneElement.addEventListener(Mojo.Event.keydown, this._justTypeKeydownHandler);

                //Applist Scroller Events
                // Bind response handler once here, instead of repeatedly in each listener
                this._scrollStarting = this._scrollStarting.bind(this);
                this.moved = this._scrollerMoved.bind(this);
                // Thrown when scroller starts or stops
                this._scroller.addEventListener(Mojo.Event.scrollStarting, this._scrollStarting.bind(this));

                //Feature tile event handlers
                this._featureTileInfo.tiles[0].tileNode.addEventListener(Mojo.Event.tap, this._openFeatureTile);
                this._featureTileInfo.tiles[1].tileNode.addEventListener(Mojo.Event.tap, this._openFeatureTile);

                //Grab cookie data so that we can restore most recent search term
                this._searchTermCookieData = this._searchTermCookie.get();

                //When returning from the search scene we need to pull down the scrim
                this._hideCustomSearchBar();
                
                if(this.promoLaunchError) {
        			Utilities.Errors.displayPromoErrorDialog(this.controller, "invalid");
        			this.promoLaunchError = false;
                }
	},

	deactivate: function()
	{
		Mojo.Log.info("MainAssistant.deactivate");

		this._appsListWidget.removeEventListener(Mojo.Event.listTap, this._gotoApp);
		this._appsSearch.widget.removeEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.removeEventListener(Mojo.Event.tap, this._searchApps);
                this._appsSearch.inactiveSearchBar.removeEventListener(Mojo.Event.tap, this._showCustomSearchBar);
                this._appsSearch.searchScrim.removeEventListener(Mojo.Event.tap, this._hideCustomSearchBar);
                this._categorySelector.removeEventListener(Mojo.Event.tap, this._showCategoryPopup);
                this._scroller.removeEventListener(Mojo.Event.scrollStarting, this._scrollStarting);
                this.controller.sceneElement.removeEventListener(Mojo.Event.keyup, this._justTypeKeydownHandler);

                this._featureTileInfo.tiles[0].tileNode.removeEventListener(Mojo.Event.tap, this._openFeatureTile);
                this._featureTileInfo.tiles[1].tileNode.removeEventListener(Mojo.Event.tap, this._openFeatureTile);
	},

        //Supports "Just Type"
        _justTypeKeydownHandler: function(event) {
            if (event.originalEvent.keyCode !== 27) {
                var self = this;

                if (this._justTypeTimer !== null) {
                    //Typing has started (resumed) clear out timer as needed
                    window.clearTimeout(self._justTypeTimer);
                }

                if (this._searchInProgress === false && this._appsSearch.inSearchMode === false) {
                    //User has started typing and custom search bar is not currently open
                    this._showCustomSearchBar(event, false);
                }

                //If backspacing and we've reached the end trigger close of the search bar
                if (event.originalEvent.keyCode === 8 && this._appsSearch.widget.mojo.getValue().length <= 1) {
                    //Pause for a moment before closing in case they just wanted to start over
                    this._justTypeTimer = window.setTimeout(function() {
                                                self._appsSearch.widget.mojo.blur();
                                                self._hideCustomSearchBar();
                                          }, 750);
                }
            }
        },

        _setupExtraSearchOptions: function()
        {
            Mojo.Log.info("_setupExtraSearchOptions");

            if (this._featureTileInfo.active === true) {
                this._featureTileInfo.containerDiv.show();
                this._categorySelector.show();
                this.scalingFactor = this.controller.window.zoomFactor || 1;
        		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
        		Mojo.Log.error("Scaled Height: " + this.scaledHeight);
                this._scroller.style.height = this.scaledHeight+"px";
            } else {
                this._featureTileInfo.containerDiv.hide();
                this._categorySelector.show();
            }
        },

        _openFeatureTile: function(event) {
            Mojo.Log.info("_openFeatureTile: %s", event.currentTarget.id);

            var searchParams,
                selectedTileId            = parseInt(event.currentTarget.id.split("__")[1], 10),
                selectedTileType          = this._featureTileInfo.tiles[selectedTileId].tileType,
                selectedTileQueryFragment = this._featureTileInfo.tiles[selectedTileId].queryFragment,
                selectedTileLabel         = this._featureTileInfo.tiles[selectedTileId].label,
                selectedTileAppId         = this._featureTileInfo.tiles[selectedTileId].appId,
                selectedTilePublicAppId   = this._featureTileInfo.tiles[selectedTileId].publicApplicationId;

            if (selectedTileType === 'app') {
                this.controller.stageController.pushScene("details", selectedTileAppId, selectedTilePublicAppId, 
                		null,null, this.promoExpiredDate);
            } else if (selectedTileType === 'list') {
                searchParams = {
                    "type": "queryFragment",
                    "customListLabel": selectedTileLabel,
                    "search": selectedTileQueryFragment,
                    "featureTile": true,
                    "promoExpiredDate": this.promoExpiredDate
                };

                this.controller.stageController.pushScene({name: "search", disableSceneScroller: true}, searchParams);
            }
        },

        _doCustomSearch: function()
        {
            Mojo.Log.info("_doCustomSearch");

            var crtSearchTerm = this._appsSearch.widget.mojo.getValue(),
                searchParams = {
                    "type": "query",
                    "search": crtSearchTerm
                };

            this._searchTermCookie.put({ "latestSearchTerm":  crtSearchTerm });
            this.controller.stageController.pushScene({name: "search", transition: Mojo.Transition.none, disableSceneScroller: true}, searchParams);
        },

        _showCustomSearchBar: function(event, restorePreviousTerm)
        {
            Mojo.Log.info("_showCustomSearchBar");
            event.stopPropagation(); //needed for focus

            //Turn search on
            this._appsSearch.inSearchMode = true;

            //Restore previous search term
            if (this._searchTermCookieData  && (restorePreviousTerm !== false)) {
                if (this._searchTermCookieData.latestSearchTerm !== undefined) {
                    this._appsSearch.widget.mojo.setValue(this._searchTermCookieData.latestSearchTerm);
                }
            }

            //Activate search bar
            this._appsSearch.inactiveSearchBar.hide();
            this._appsSearch.activeSearchBar.show();
            this._appsSearch.searchScrim.show();
            this._appsSearch.widget.mojo.focus();
        },

        _hideCustomSearchBar: function()
        {
            Mojo.Log.info("_hideCustomSearchBar");

            //Prevent scrim from being dismissed during search
            if (this._searchInProgress === true) return;

            //Turn search off
            this._appsSearch.inSearchMode = false;

            //Deactivate search bar
            this._appsSearch.activeSearchBar.hide();
            this._appsSearch.inactiveSearchBar.show();
            this._appsSearch.searchScrim.hide();

            //Clear unsearched term.  Previous search will be restored later as needed.
            this._appsSearch.widget.mojo.setValue("");
            this._appsSearch.widget.mojo.blur();
        },

	handleCommand: function(event)
	{
		if (event.type === Mojo.Event.back) {
                    if (this._appsSearch.inSearchMode === true) {
                        //A back swipe with the search open reverts the search state
                        event.stop();
                        this._hideCustomSearchBar();
                        this._setupExtraSearchOptions();
                    } else if (this._categoryInfo.category !== null) {
                        //A back swipe when the category selector is open and home isn't selected
                        //reverts to home state
                        event.stop();
                        this._updateSearchBarIndicators();
                        this._popupCategorySelected('__home');
                    }
                } else if (event.type == Mojo.Event.command) {
        	// Google Analytics tracking Search bar labels
        	this.appMetrics.trackEvent(QueryButtons.getSearchBarLabelForQid(event.command));
			switch (event.command)
			{
				case 'Blowfish2Query1':
				case 'Blowfish2Query2':
				case 'Blowfish2Query3':
				case 'Blowfish2Query4':
				case 'Blowfish2Query5':
                                case 'Blowfish2Query6':
                                case 'Blowfish2Query7':
                                case 'Blowfish2Query8':
                                        //Sorted queries, except for those used on the search
                                        //scene, should not have these override params
                                        this._query = '';
                                        this._queryFragment = '';

					this._qid = event.command;
                                        this._updateSearchBarIndicators();
					this._searchApps();
					break;

				default:
					break;
			}
		}
	},

	// observer method for notifications from AppDownloadMngr
	// called when apps installed on the system change
	updateInstalledApps: function()
	{
		Mojo.Log.info("SearchAssistant.updateInstalledApps");
		if (this._appsListWidget && this._appsListWidget.mojo)
		{
			var range = this._appsListWidget.mojo.getLoadedItemRange();
			this._appsListWidget.mojo.noticeUpdatedItems(range.offset, this._appsListWidget.mojo.getItems(range.offset, range.limit));
		}
	},

	_getApplicationInstalledState: function(summary)
	{
		var app = Catalog.AppDownloadMngr.getInstalledApp(summary.publicApplicationId);
		if (app)
		{
			Mojo.Log.info("versions: installed %s download %s", app.installedVersion, summary.appVersion);
			if (Utilities.VersionCheck.compare(app.installedVersion, summary.appVersion) != -1)
			{
				return 'installed';
			}
			else
			{
				return 'update';
			}
		}
		return 'notinstalled';
	},

        _showCategoryPopup: function(event)
        {
            Mojo.Log.info('_showCategoryPopup');

            this.controller.popupSubmenu({
                onChoose:  this._popupCategorySelected.bind(this),
                placeNear: this._categorySelectorPlacementAnchor,
                items: this._categoryInfo.items,
                popupClass: 'category-popup',
                scrimClass: 'category-popup-scrim'
            });
        },

        _swapQueryButtons: function()
        {
            Mojo.Log.info("_swapQueryButtons");

            //We need to keep the same icon position selected while swapping buttons
            //but update the underlying qid & toggleCmd at the same time
            var newQid = QueryButtons.updateQidForCategory(this._categoryInfo.category, this._qid);

            this._qid = newQid;
            this._queryItems.items = QueryButtons.getQueryButtonsForCategory(this._categoryInfo.category);
            this._queryItems.toggleCmd = newQid;

            this.controller.modelChanged(this._queryMenu);
        },

        _updateQueryButton: function(position, pathToIcon, buttonCommand) {
            if (buttonCommand === undefined) {
                //modelChange requires us to set this again, but in most cases
                //we just want it to remain as is.
                buttonCommand = this._queryItems.items[position].command;
            }

            this._queryItems.items[position] = {
                iconPath: pathToIcon,
                command: buttonCommand
            }

            this.controller.modelChanged(this._queryMenu);
        },

        _popupCategorySelected: function(value)
        {
            Mojo.Log.info('_popupCategorySelected: updating categories');

            if (value !== undefined) {
                var catSelectorText,
                    catDetails       = value.split("__"),
                    isParentCategory = false;

                //Keep the prev cat before updating.  When subcat is selected the cat
                //list is refreshed with the parent just to updated the chosen value.
                this._categoryInfo.prevParentCategory = this._categoryInfo.category;
                this._categoryInfo.prevParentCategoryName = this._categoryInfo.name;

                //If the new cat selection matches the prev one used to search stop here.  No change.
                if (this._categoryInfo.categoryToSearch === catDetails[1]) return;

                this._categoryInfo.name = catDetails[0];
                this._categoryInfo.category = catDetails[1];
                catSelectorText = this._categoryInfo.name;
                isParentCategory = this._appCategoriesHelper.isParentCategory(this._categoryInfo.category);

                //The category value is manipulated in certain cases to properly display
                //parent/subcategory selections.  Thus we need to keep track of the actual
                //category selected for searches independent of the one used for category selector puposes.
                this._categoryInfo.categoryToSearch = catDetails[1];

                //Selecting Home while Home is already selected should be avoided
                if (this._categoryInfo.category === 'all' && this._categoryInfo.prevParentCategory === null)
                    return;

                this._swapQueryButtons();
                Mojo.Log.info('Selected category info, id: %s / name: %s', this._categoryInfo.category, this._categoryInfo.name);

                // Google Analytics
                this.appMetrics.trackEvent("category_selected", this._categoryInfo.name);

                if (this._categoryInfo.category === 'home') {
                    this._categoryInfo.prevParentCategory = null;
                    this._categoryInfo.category = null;
                    catSelectorText = this._categoryInfo.toplevelSelectorLabel;
                } else if (isParentCategory === true) {
                    //Parent category selected
                    this._categoryInfo.prevParentCategory = null;
                    //catSelectorText = $L('All ') + catSelectorText;
					catSelectorText = $L("All #{category}").interpolate({category: catSelectorText});
                } else {
                    //Sub-category selected
                }
                //Update the visual category indicators and refresh cat list as needed
                this._categorySelector.innerHTML = catSelectorText;

                if (this._categoryInfo.category === null || isParentCategory === true) {
                    //The category search bar is not refreshed during a sub-category selection
                    this._updateSearchBarIndicators();
                }

                this._appsSearch.widget.mojo.setValue(''); //Clear search condition before browsing
                this._searchApps();                
                this._appCategoriesHelper.updateCategorySelector();
            }
        },

        //Used to update the search bar text & icon when a new category or command menu item is selected
        _updateSearchBarIndicators: function() {
            var searchBarText;

            if (this._categoryInfo.category === null) {
                //For the "Home" (default) category we apply custom label which
                //correspond to the commandmenu (stored query) buttons
                searchBarText = QueryButtons.getSearchBarLabelForQid(this._qid);
            } else {
                searchBarText = this._categoryInfo.name;
            }

            this._appsSearch.barText.innerHTML = searchBarText;
            this._appsSearch.barIcon.src = this._appCategoriesHelper.getCategoryIconForSearchBar(this._categoryInfo.category);
        },

        /*
         * A scroller will package a scroller property and an addListener method onto the event that is passed here.
         * Note: event.scroller.addListener === event.addListener
         * the addListener functions accept an object with a .moved() method that gets passed
         * true or false while the scroller is moving, indicating whether or not the scroller has stopped yet.
         */
        _scrollStarting: function(event) {
                Mojo.Log.info("scrollStarting");

                event.scroller.addListener(this); //Pass 'this' as the object with the listener to the "move" method"
                Mojo.Log.info(new Date(), "scroll starting");
        },

        _scrollerMoved: function(stopping) {
                //Mojo.Log.info("_scrollerMoved");

                if (stopping) {
                    Mojo.Log.info("Scroller stopping");
                } else if (this._featureTileInfo.active === true && this._appsSearch.inSearchMode === false) {
                    this.doFeatureTileScroll();
                } else if (this._featureTileInfo.active === false) {
                    //We need to hide/show the top scroll fade.  This is done in
                    //doFeatureTileScroll when tiles are present.  When tiles are present
                    //then we handle here.
                    var crtTopScrollPos = this._scroller.mojo.getScrollPosition().top;

                    if (this._categorySelectorFadeStatus === 0 && crtTopScrollPos < 0) {
                        this._categorySelectorFadeStatus = 1;
                        this._categorySelectorFade.show();
                    } else if (this._categorySelectorFadeStatus === 1 && crtTopScrollPos === 0) {
                        this._categorySelectorFadeStatus = 0;
                        this._categorySelectorFade.hide();
                    }
                }
        },

        _setupFeatureTilesForCategory: function(tiles)
        {
            Mojo.Log.info("_setupFeatureTilesForCategory");

            if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                Mojo.Log.info("_setupFeatureTilesForCategory");
                
                for (var i=0; i<2; i++) { //Two tile limit
                    //Replace tile image
                    this._featureTileInfo.tiles[i].tileNode.src = tiles[i].imageUrl;

                    //Store/update tile info so we know how to respond to future onTap events
                    this._featureTileInfo.tiles[i].tileType            = tiles[i].type || '';
                    this._featureTileInfo.tiles[i].imageUrl            = tiles[i].imageUrl || '';
                    this._featureTileInfo.tiles[i].queryFragment       = tiles[i].queryFragment || '';
                    this._featureTileInfo.tiles[i].appId               = tiles[i].appId || '';
                    this._featureTileInfo.tiles[i].publicApplicationId = tiles[i].publicApplicationId || '';
                    this._featureTileInfo.tiles[i].label               = tiles[i].label || '';
                }

                //Display fully expanded tiles
                this._featureTileInfo.containerDiv.style.height = this._featureTileInfo.maxDivHeight + 'px';
                this._featureTileInfo.containerDiv.show();
                this._featureTileInfo.active = true;
            } else {
                this._featureTileInfo.containerDiv.hide(); //This category has no tiles
                this._featureTileInfo.active = false;
            }
        },

        doFeatureTileScroll: function() {
                //Mojo.Log.info("doFeatureTileScroll");

                var featureTileInfo      = this._featureTileInfo, //localizing scope to cutdown the lookup time
                    scrollerInfo         = this._scrollerInfo, //localizing scope to cutdown the lookup time
                    crtTopScrollPos      = this._scroller.mojo.getScrollPosition().top,
                    crtFeatureTileHeight = parseInt(this._featureTileInfo.containerDiv.style.height, 10) || 0,
                    newHeight            = crtFeatureTileHeight,
                    featuredAppStyleProp = this._featureTileInfo.containerDiv.style;

                //Only modify the feature tiles section when user is scrolling near the top of the scroller (i.e.) POI
                if (crtTopScrollPos < scrollerInfo.minScrollPositionOfInterest) {
                        //Mojo.Log.info('Scrolling up');
                        if (crtTopScrollPos < scrollerInfo.position) {
                                if (crtFeatureTileHeight > featureTileInfo.minDivHeight) {
                                        newHeight = (crtFeatureTileHeight - 50);
                                }
                        }
                } else if (crtTopScrollPos > scrollerInfo.maxScrollPositionOfInterest) {
                        //Mojo.Log.info('Scrolling down');
                        if (crtTopScrollPos > scrollerInfo.position) {
                                if (crtFeatureTileHeight < featureTileInfo.maxDivHeight) {
                                        newHeight = (crtFeatureTileHeight + 50);
                                }
                        }
                } else {
                    return; //Not within a scroll area of interest
                }

                //Don't let new height violate FT divs min/max values
                if (newHeight > featureTileInfo.maxDivHeight) {
                        newHeight = featureTileInfo.maxDivHeight;
                } else if (newHeight < featureTileInfo.minDivHeight) {
                        newHeight = 0;
                }

                //Hide/show FT div as needed based on newHeight
                if (crtFeatureTileHeight === 0 && newHeight > 0) {
                        featuredAppStyleProp.display = 'block';
                        this._categorySelectorFadeStatus = 0;
                        this._categorySelectorFade.hide();
                } else if (newHeight <= 0) {
                        featuredAppStyleProp.display = 'none';
                        newHeight = 0;
                        this._categorySelectorFadeStatus = 1;
                        this._categorySelectorFade.show();
                }

                //Avoid touching the DOM if there is no real change
                if (newHeight !== crtFeatureTileHeight) {
                    featuredAppStyleProp.height = newHeight + 'px';
                }

                scrollerInfo.position = crtTopScrollPos;
        },

	_searchItemsCallback: function(widget, offset, count)
	{
		Mojo.Log.info('_searchItemsCallback');

                this._searchInProgress = true; //prevent scrim from being dismissed during search
                
		// do this only before we get the first batch of results back
		if (widget.mojo.getLength() === 0) {
			Mojo.Log.info("_searchItemsCallback & start spinner");
                        this._appsSearch.searchScrim.show();
			this._spinner.start();

                        if (this._commandMenuReady === true) {
                            this._setEnableQueryMenu(false);
                        }
		}

		var self = this;

		Mojo.Log.info("_searchItemsCallback requesting offset: %d count: %d", offset, count);
		Weave.Services.ApplicationServer.searchForApplications(this._query, this._queryFragment, this._qid, this._categoryInfo.categoryToSearch, offset, count, this._sort,
			Mojo.Locale.current, this._connectors, function(status, apps, total, country, tiles){
                                //Update feature tiles div as needed
                                if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                                    self._setupFeatureTilesForCategory(tiles);
                                } else {
                                    self._setupFeatureTilesForCategory(null);
                                }

				Mojo.Log.info("CB offset %d, requestedCount %d, status %d, total %d", offset, count, status, total);

				// do this only when we get the first batch of results back
				if (widget.mojo.getLength() === 0) {
					Mojo.Log.info("CB listLen is 0 stop the spinner");

                                        if (self._commandMenuReady === true) {
                                            self._setEnableQueryMenu(true);
                                        }

					self._spinner.stop();
                                        self._searchInProgress = false;
                                        self._appsSearch.searchScrim.hide();
                                        self._setupExtraSearchOptions();
				}

				if (status)
				{
                                        Mojo.Log.info("CB listLen before the update %d", widget.mojo.getLength());
					myProfile.activationCountry = country;
					Mojo.Log.info("Main-Assistant: Activation country %s", myProfile.activationCountry);

                                        //The first time through we can setup the command menu once we know the activation country
                                        if (self._commandMenuReady === false) {
                                            self._updateQueryButton(1, QueryButtons.getCurrencyIconForActivationCountry(country));
                                            self._setVisibilityQueryMenu(true);
                                            self._commandMenuReady = true;
                                        }

                                        var oldLen = widget.mojo.getLength();
					widget.mojo.noticeUpdatedItems(offset, apps);

					// set list len to total results
					if (oldLen === 0) {
						widget.mojo.setLength(total);
					}

					Mojo.Log.info("CB listLen after update %d", widget.mojo.getLength());

                                        if (total === 0) {
                                            // No applictions found - display no app message
                                            self._scroller.hide();
                                            if ((tiles !== undefined && tiles !== null) && tiles.length > 0) {
                                                //Use the default message div if we have feature tiles to display
                                                //because we have less vertical space to work with
                                                self._appListDefaultMessage.show();
                                            } else {
                                                self._appListMessage.show();
                                            }
                                        } else {
                                            //Our custom scroller needs over 300px of content before it
                                            //will cause the scroll event to fire.
                                            var appsListWidgetComputedDimensions = self._appsListWidget.getDimensions();
                                            if (total > 2 && appsListWidgetComputedDimensions.height <= 300) {
                                                self._appsListWidget.style.height = '300px';
                                            } else if (self._appsListWidget.style.height !== '') {
                                                //Clear out any previously forced height and let auto-size as normal
                                                self._appsListWidget.style.height = '';
                                            }
                                            
                                            self._appListMessage.hide();
                                            self._appListDefaultMessage.hide();
                                            self._scroller.show();
                                        }
				}
				else
				{
					// Error
					Utilities.Errors.displayError(apps);
				}
		});
	},

	_formatAppSummary: function(dummy, model)
	{
		model.formattedPrice = (model.price === 'Free' || model.price == 0) ? $L("free") : Mojo.Format.formatCurrency(model.price, {fractionDigits: 2, countryCode: myProfile.activationCountry});
		model.formattedFree = ((model.price === 'Free' || model.price == 0) ? 'free' : '');
		model.formattedAverageRating = ('' + (Math.round(model.averageRating * 2) / 2)).replace(/\./, '');
		model.formattedUpdate = (this._getApplicationInstalledState(model) == 'update' ? 'has-update' : '');
		// HACK - author fixup
		model.author = (model.author ? model.author : '&nbsp;');

                //Limit title size displayed in app list view
                if (model.title && model.title.length > 30) {
                    model.title = model.title.substring(0, 27) + '...';
                }
	},

	_renderedAppSummary: function(widget, model, node)
	{
		new LazyLoadImage(model.appIcon, node.querySelector('.loadingicon'));
	},

	_gotoApp: function(event)
	{
		this.controller.stageController.pushScene("details", event.item.id, event.item.publicApplicationId,
				null,null, this.promoExpiredDate);
	},

	_searchApps: function()
	{
		this._appsListWidget.mojo.setLength(0);
		//this.controller.getSceneScroller().mojo.revealTop(0);
		this._appsListWidget.mojo.revealItem(0, true);

		// We fire the search by hand, rather than invalidating the list, to avoid the list putting
		// visual junk on the screen while it's updating.
		this._searchItemsCallback(this._appsListWidget, 0, this.listRerenderCount);
	},

	_searchAppsKey: function(event)
	{
		//Mojo.Log.info("_searchAppsKey", event.value, event.originalEvent.type, event.originalEvent.keyCode);
		this._query = event.value;
		if (event.originalEvent !== undefined && event.originalEvent.type === 'keyup' && event.originalEvent.keyCode == Mojo.Char.enter)
		{
			this._doCustomSearch();
		}
	},

        _setEnableQueryMenu: function(enable)
	{
		var items = this._queryMenu.items[1].items;
		if (items)
		{
			for (var i = 0; i < items.length; i++)
			{
				items[i].disabled = !enable;
			}
			this.controller.modelChanged(this._queryMenu);
		}
	},

        _setVisibilityQueryMenu: function(visible)
	{
		this._queryMenu.visible = visible;
                this.controller.modelChanged(this._queryMenu);
	},
	
	_markPromoInfo: function(promoInfo) {
		Mojo.Log.info("MainAssistant._markPromoInfo# promoInfo:%j", promoInfo);
		this.promoExpiredDate = promoInfo.validTo;
	}
});
