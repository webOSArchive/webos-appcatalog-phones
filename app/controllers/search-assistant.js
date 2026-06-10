/* Copyright 2009 Palm, Inc.  All rights reserved. */

var SearchAssistant = Class.create(
{
        /**
         * @params
         *
         * params format:
         * {
         *       "type": "connector", //(e.g.) category, query, queryFragment, qid, connector, tag, sort
         *       "search": "",
         *       "connectorInfo": {
         *           "types": [
         *               "contacts",
         *               "calendar"
         *           ],
         *           "searchBarIcon": "http://fully/qualified/path/to/icon/file.png", //32x32
         *           "searchBarTitle": "Your Custom Title"
         *       }
         *   }
         */
	initialize : function(params)
	{
		Mojo.Log.info("SearchAssistant.initialize %j", params);
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;

                this._params = params;
                this._promoExpiredDate = params.promoExpiredDate;
		this._tag = '';
		this._query = '';
                this._queryFragment = '';
                this._qid = 'Blowfish2Query5'; //all
		this._sort = 'RATING_DESC';
		this._installedApps = {};
                this._connectors = '';
                this._customListSearch = false;
                this._customListLabel = '';
                this._commandMenuReady = false;

                this._scrollerInfo = {
                    customHeight: (Mojo.Environment.DeviceInfo.screenHeight - 135) + 'px',
                    customSearchViewHeight: (Mojo.Environment.DeviceInfo.screenHeight - 90) + 'px'
                };

                //When a feature tile search is being requested we do not include
                //the default qid since ACS uses qid as an override.
                if (params.featureTile === true) {
                    this._qid = '';
                }

                //This scene allows for cross scene pushes to conduct synergy searches
                this._synergySearch = (params.type === 'connector') ? true : false;

                if (this._synergySearch === true) {
                    this._qid = ''; //Remove default.  Will be a provides query.

                    //Build a synergy connector string
                    this._connectorInfo = params.connectorInfo;
                    if (this._connectorInfo && this._connectorInfo.types) {

                        //We must prepend "connector/" to all connector strings for ACS
                        for(var i=0; i<this._connectorInfo.types.length; i++) {
                            var ct = this._connectorInfo.types[i];
                            if (ct !== 'noApp' && ct !== 'dockMode' && ct !== 'universalSearch') {
                                this._connectorInfo.types[i] = 'connector/' + this._connectorInfo.types[i].toUpperCase();
                            }
                        }

                        this._connectors = this._connectorInfo.types.join(",");
                    }
                } else {
                    this['_' + params.type] = decodeURIComponent(params.search);
                }

                //Query fragments are used to support custom lists via feature tiles.  The UI is
                //slightly diferent for these searches (i.e.) no search button, cat selector, command menu
                if (this._queryFragment !== '') {
                    this._customListSearch = true;

                    if (params.customListLabel !== undefined && params.customListLabel !== '') {
                        this._customListLabel = params.customListLabel;
                    } else {
                        this._customListLabel = $L('Custom Application List');
                    }
                }

		this.searchFieldModel = {
                    'original': params.type === 'query' ? decodeURIComponent(params.search) : ''
		};

                this._searchTermCookie = new Mojo.Model.Cookie("com.palm.app.findapps.searchTerm");

                //Category setup
                var categoryInfoOverrideParams = {
                    toplevelSelectorLabel: $L('All Categories')
                };
                this._appCategoriesHelper = new Weave.Utilities.AppCategoriesHelper(categoryInfoOverrideParams);
                this._categoryInfo = this._appCategoriesHelper.categoryInfo;
                this._appCategoriesHelper.updateCategorySelector(); //Fill this._categoryInfo.items
                this._categorySelectorFadeStatus = 0;
	},

	setup: function()
	{
		Mojo.Log.info("SearchAssistant.setup");

                this._spinner = new Spinner(this, 'spinner', true, 'large');

		this._searchItemsCallback = this._searchItemsCallback.bind(this);
		this._gotoApp = this._gotoApp.bindAsEventListener(this);
		this._searchAppsKey = this._searchAppsKey.bindAsEventListener(this);
		this._searchApps = this._searchApps.bindAsEventListener(this);

                //Category Selector
                this._categorySelector = this.controller.get("categorySelector");
                this._categorySelectorPlacementAnchor = this.controller.get("categorySelectorPlacementAnchor");
                this._categorySelectorFade = this.controller.get("category-selector-fade");

		// Set up the attributes & prepare this widget for lazy loading of data
		this._searchListAttr =
		{
			itemTemplate: 'search/search-appsummary',
			dividerTemplate: 'search/search-appdivider',
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

                this._appsSearch = {
                        widget: this.controller.get('in-fa-search-text'),
                        results: this.controller.get('searchResults'),
                        button: this.controller.get('searchResultsModified'),
                        inactiveSearchBar: this.controller.get("app-search-bar-inactive"),
                        inactiveSearchBarText: this.controller.get('app-search-bar-text'),
                        inactiveSearchBarIcon: this.controller.get('app-search-bar-icon'),
                        activeSearchBar: this.controller.get("app-search-bar-active"),
                        searchScrim: this.controller.get("app-search-bar-scrim")
                };

                //Some widgets aren't enabled when doing a synergy or customList search
                if (this._synergySearch === true) {
                    this.controller.get("synergySearchHeader").up().removeClassName("has-search-bar-top");
                    this.controller.get("searchBar").hide();
                    this.controller.get("defaultSearchHeader").hide();

                    this._sort = 'NAME_ASC'; //synergy searches have a different default sort

                    //Setup custom header
                    if (this._connectorInfo !== undefined) {
                        var sbt = this._connectorInfo.searchBarTitle,
                            sbi = this._connectorInfo.searchBarIcon,
                            synergySearchTitle,
                            synergySearchIcon;

                        synergySearchTitle = (sbt !== undefined && sbt !== '') ? sbt : 'Synergy Services';
                        synergySearchIcon  = (sbi !== undefined && sbi !== '') ? sbi :  'images/appcatalog.png';

                        this.controller.get("synergySearchTitle").innerHTML = synergySearchTitle;
                        this.controller.get("synergySearchIcon").src = synergySearchIcon;
                    }

                    this.controller.get("synergySearchHeader").show();
                } else if (this._customListSearch === true) {
                    this._appsSearch.inactiveSearchBarIcon.hide();
                    this._appsSearch.inactiveSearchBarText.addClassName('custom-app-list');
                    this._appsSearch.inactiveSearchBarText.innerHTML = this._customListLabel;
                    this._hideCustomSearchBar();

                    //We need to adjust the scroller height to account for the removal of the cat selector
                    this.scalingFactor = this.controller.window.zoomFactor || 1;
            		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
                    this._scrollerInfo.customHeight = this.scaledHeight+"px";
                } else {
                    this._showCustomSearchBar();
                    this._categorySelector.show();

                    // Set up a command menu (only for general search requests)
                    this._queryItems =
                    {
                        items: QueryButtons.getQueryButtonsForCategory("all"),
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
                    //this.controller.setupWidget(Mojo.Menu.commandMenu, {menuClass: 'no-fade'}, this._queryMenu);
                    this.controller.setupWidget(Mojo.Menu.commandMenu, {}, this._queryMenu);
                }

                //Scroller
                this._scrollerModel = {
                    mode: 'vertical',
                    weight: 'light',
                    friction: 'low'
                };
                this.controller.setupWidget('applist-scroller', {}, this._scrollerModel);
                this._scroller = this.controller.get("applist-scroller");
                //Dynamically adjust custom scroller height based on available screen real estate
                this.scalingFactor = this.controller.window.zoomFactor || 1;
        		this.scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / this.scalingFactor)-135;
                this._scroller.style.height = this.scaledHeight+"px";

                //Applist
                this.controller.setupWidget(
			'dv-fa-appslist',
			this._searchListAttr,
			{}
		);
		this._appsListWidget = this.controller.get('dv-fa-appslist');
                this._appListMessage = this.controller.get('dv-fa-appslist-message');

		// Menus
                if (this._synergySearch === true) {
                    //We need to build a basic menu for this cross-scene push.
                    //No default in place.
                    new Weave.Utilities.AppMenu(this)
			.addEdit()
			.addHelp('http://help.palm.com/app_catalog/index.html');
                } else {
                    Weave.Utilities.AppMenu.useDefault(this);
                }

		// get notified when installed applications change
		Catalog.AppDownloadMngr.attach(this);
	},

	cleanup: function()
	{
		Catalog.AppDownloadMngr.detach(this);
	},

	activate: function()
	{
		Mojo.Log.info("SearchAssistant.activate");

		this._appsListWidget.addEventListener(Mojo.Event.listTap, this._gotoApp);

                if (this._synergySearch === true) {
                    //We need to apply the mojo default skin (removes palm-default)
                    //this.controller.document.body.className = 'palm-light';
                    this._appsListWidget.addClassName('synergy');
                    this.controller.get("palm-fullscreen-cont").addClassName('synergy');

                    //TODO: Remove the fade?  Or should we use others?  HI question....
                    //this.controller.get("topFade").remove();
                    //this.controller.get("bottomFade").remove();
                } else {
                    this._appsSearch.widget.addEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
                    this._appsSearch.button.addEventListener(Mojo.Event.tap, this._searchApps);
                    this._categorySelector.addEventListener(Mojo.Event.tap, this._showCategoryPopup.bind(this));

                    //Applist Scroller Events
                    // Bind response handler once here, instead of repeatedly in each listener
                    this._scrollStarting = this._scrollStarting.bind(this);
                    this.moved = this._scrollerMoved.bind(this);
                    // Thrown when scroller starts or stops
                    this._scroller.addEventListener(Mojo.Event.scrollStarting, this._scrollStarting.bind(this));

                    // Refocus search field
                    this._appsSearch.widget.mojo.focus();
                }
	},

	deactivate: function()
	{
		Mojo.Log.info("SearchAssistant.deactivate");

		this._appsListWidget.removeEventListener(Mojo.Event.listTap, this._gotoApp);

                if (this._synergySearch === false) {
                    this._appsSearch.widget.removeEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
                    this._appsSearch.button.removeEventListener(Mojo.Event.tap, this._searchApps);
                    this._categorySelector.removeEventListener(Mojo.Event.tap, this._showCategoryPopup);
                    this._scroller.removeEventListener(Mojo.Event.scrollStarting, this._scrollStarting);
                }
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
                } else {
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

                Mojo.Log.info('Selected category info, id: %s / name: %s', this._categoryInfo.category, this._categoryInfo.name);
                
                this.appMetrics.trackEvent("category_selected", this._categoryInfo.name);

                if (this._categoryInfo.category === 'home') {
                    this._categoryInfo.prevParentCategory = null;
                    this._categoryInfo.category = null;
                    this._categoryInfo.name = $L('Home');
                    catSelectorText = this._categoryInfo.toplevelSelectorLabel;
					this._categorySelector.innerHTML = $L("In #{category}").interpolate({ category: catSelectorText });
                } else if (isParentCategory === true) {
                    //Parent category selected
                    this._categoryInfo.prevParentCategory = null;
					this._categorySelector.innerHTML = $L('In All #{category}').interpolate({ category: catSelectorText });
                } else {
					this._categorySelector.innerHTML = $L("In #{category}").interpolate({ category: catSelectorText });
                    //Sub-category selected
                }

                //Update the visual category indicators and refresh cat list as needed
                //this._categorySelector.innerHTML = $L('in ') + catSelectorText;

                this._searchApps();
                this._appCategoriesHelper.updateCategorySelector();
            }
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

        _showCustomSearchBar: function()
        {
            Mojo.Log.info("_showCustomSearchBar");

            //Activate search bar
            this._appsSearch.inactiveSearchBar.hide();
            this._appsSearch.activeSearchBar.show();
        },

        _hideCustomSearchBar: function(event)
        {
            Mojo.Log.info("_hideCustomSearchBar");
            if (event) {
                event.stopPropagation(); //needed for focus
            }

            //Prevent scrim from being dismissed during search
            if (this._searchInProgress === true) return;

            //Deactivate search bar
            this._appsSearch.activeSearchBar.hide();
            this._appsSearch.inactiveSearchBar.show();
            this._appsSearch.searchScrim.hide();
        },

	handleCommand: function(event)
	{
        	
        	
		if (event.type === Mojo.Event.back && this._synergySearch === false) {
			
                    event.stop();
            
                    if (this._categoryInfo.category !== null) {
            
                        //A back swipe when the category selector is open and home isn't selected
                        //reverts to home state
                        this._popupCategorySelected('__home');
                    } else {
            
                        var mainSceneExists = false,
                            sceneStack      = this.controller.stageController.getScenes();

                        if (sceneStack) {
            
                            for (var index = sceneStack.size()-1; index >= 0; index--) {
                                var scene = sceneStack[index];
                                if (scene.sceneName === "main") {
                                	Mojo.Log.info("main scene exists");
                                    mainSceneExists = true;
                                    break;
                                }
                            }
                        }

                        if (!mainSceneExists) {
            
                            this.controller.stageController.swapScene({name: "main", disableSceneScroller: true});
                        } else {
            
                            this.controller.stageController.popScenesTo("main");
                        }
                        
                         Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_from", "search");
                        Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_to", "main");
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
					this._qid = event.command;
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

	_searchItemsCallback: function(widget, offset, count)
	{
		Mojo.Log.info('_searchItemsCallback');

                this._searchInProgress = true; //prevent scrim from being dismissed during search

		// do this only before we get the first batch of results back
		if (widget.mojo.getLength() === 0) {
			Mojo.Log.info("_searchItemsCallback start spinner");
                        this._appsSearch.searchScrim.show();
			this._spinner.start();

                        if (this._synergySearch === false && this._customListSearch === false && this._commandMenuReady === true) {
                            this._setEnableQueryMenu(false);
                        }
		}

		var self = this;

		Mojo.Log.info("_searchItemsCallback requesting offset: %d count: %d", offset, count);
    this.appMetrics.trackNewScene("search?q=" + this._query);
		Weave.Services.ApplicationServer.searchForApplications(this._query, this._queryFragment, this._qid, this._categoryInfo.categoryToSearch, offset, count, this._sort,
			Mojo.Locale.current, this._connectors, function(status, apps, total, country, tiles){

				Mojo.Log.info("CB offset %d, requestedCount %d, status %d, total %d", offset, count, status, total);

				// do this only when we get the first batch of results back
				if (widget.mojo.getLength() === 0) {
					Mojo.Log.info("CB listLen is 0 stop the spinner");
					self._spinner.stop();
                                        self._searchInProgress = false;
                                        self._appsSearch.searchScrim.hide();

                                        if (self._synergySearch === false && self._customListSearch === false && self._commandMenuReady === true) {
                                            self._setEnableQueryMenu(true);
                                            self._appsSearch.widget.mojo.focus();
                                        }
				}

				if (status) {
                                        Mojo.Log.info("CB listLen before the update %d", widget.mojo.getLength());
					myProfile.activationCountry = country;
					Mojo.Log.info("Search-Assistant: Activation country %s", myProfile.activationCountry);

                                        //The first time through we can setup the command menu once we know the activation country
                                        if (self._synergySearch === false && self._customListSearch === false && self._commandMenuReady === false) {
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
                                            // No applictions found - display default message
                                            self._scroller.hide();
                                            self._appListMessage.show();
                                        } else {
                                            self._appListMessage.hide();
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
		model.formattedPrice = (model.price === 'Free' || model.price == 0) ? $L("free") : Mojo.Format.formatCurrency(model.price, { fractionDigits: 2, countryCode: myProfile.activationCountry});
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

	_removeOldDividers: function()
	{
		var divs = this.controller.get('div-fa-search').querySelectorAll('table.palm-list-section-label');
		var len = divs.length;
		for (var i = 0; i < len; i++)
		{
			divs[i].parentNode.removeChild(divs[i]);
		}
	},

	_renderedAppSummary: function(widget, model, node)
	{
		new LazyLoadImage(model.appIcon, node.querySelector('.loadingicon'));
	},

	_gotoApp: function(event)
	{
                this.controller.stageController.pushScene("details", event.item.id, event.item.publicApplicationId, null, this._synergySearch, this._promoExpiredDate);
	},

	_searchApps: function()
	{
                //Keep track of the search term so that we can restore in the main scene later for convenience
		this._appsSearch.widget.mojo.blur();
                this._searchTermCookie.put({ "latestSearchTerm":  this._appsSearch.widget.mojo.getValue() });

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
		if (event.originalEvent.type == 'keyup' && event.originalEvent.keyCode == Mojo.Char.enter)
		{
			this._searchApps();
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
	}
});
