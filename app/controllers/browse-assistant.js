var BrowseAssistant = Class.create({

	initialize : function(category, toApps) 
	{
		this._category = category;
		this._toApps = toApps;
		
		this.searchFieldModel = {
			'original': ''
		};
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},

	setup: function() {
		Mojo.Log.info("BrowseAssistant.setup");
    // Google Analytics
    this.appMetrics.trackNewScene("categories/" + this._category);

		this._browseItemsCallback = this._browseItemsCallback.bind(this);
		this._gotoCategory = this._gotoCategory.bindAsEventListener(this);
		this._searchAppsKey = this._searchAppsKey.bindAsEventListener(this);
		this._searchApps = this._searchApps.bindAsEventListener(this);
		this._formatCategoryDivider = this._formatCategoryDivider.bind(this);
		this._focusSearch = this._focusSearch.bindAsEventListener(this);

		this._browseListAttr =
		{
			itemTemplate: 'browse/browse-categorysummary', 
			dividerTemplate: 'browse/browse-categorydivider',
			itemsCallback: this._browseItemsCallback.bind(this),
			dividerFunction: this._formatCategoryDivider
		};
		this.controller.setupWidget(
			'dv-fa-categorylist', 
			this._browseListAttr,
			{}
		);
		this._categoriesListWidget = this.controller.get('dv-fa-categorylist');
		
		// setup search field
		this.searchFieldModel.attributes = {
      		hintText: $L('Search...'),
			focus: false,
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
		this._appsSearch = 
		{
			widget: this.controller.get('in-fa-search-text'),
			results: this.controller.get('searchResults'),
			button: this.controller.get('searchResultsModified')
		};

        this._cmdMenu = 
		{
			items: [
				{},
				{
		            items: [
						{
			                icon: "app-icon-category-list",
			                command: 'browse'
			            },
						{
			                icon: "app-icon-catgory-tag-cloud",
			                command: 'tagcloud'
			            },
					],
					toggleCmd: 'browse'
				},
				{}
			]
		};
		this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this._cmdMenu);
		
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);
		
		this._spinner = new Spinner(this, 'spinner', true, 'large');
		
	},
	
	cleanup: function() 
	{
		Mojo.Log.info("BrowseAssistant.cleanup");
	},
	
	activate: function() 
	{
		Mojo.Log.info("BrowseAssistant.activate");
		
		this._categoriesListWidget.addEventListener(Mojo.Event.listTap, this._gotoCategory);
		this._appsSearch.widget.addEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.addEventListener(Mojo.Event.tap, this._searchApps);
		
		this.controller.document.addEventListener(Mojo.Event.tap, this._focusSearch);
		this.controller.get('in-fa-search-text').mojo.focus();
	},

	deactivate: function() 
	{
		Mojo.Log.info("BrowseAssistant.deactivate");
		
		this._categoriesListWidget.removeEventListener(Mojo.Event.listTap, this._gotoCategory);
		this._appsSearch.widget.removeEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.removeEventListener(Mojo.Event.tap, this._searchApps);
		this.controller.document.removeEventListener(Mojo.Event.tap, this._focusSearch);
	},

	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.command)
		{
			switch (event.command)
			{
				case 'tagcloud':
					this.controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name: "tagcloud"}, this._category, this._toApps);
					break;
					
				default:
					break;
			}
		}
	},
	
	_browseItemsCallback: function(widget, offset, count)
	{
		Mojo.Log.info('_categoryItemsCallback');

		this._spinner.start();
		var self = this;
		Weave.Services.ApplicationServer.getCategories(this._category, function(status, categories)
		{
			Mojo.Log.info("callback %d %j", status, categories);
			self._spinner.stop();
			if (status)
			{
				// Create the 'All' item for subcategories
				if (self._toApps) 
				{
					var count = 0;
					for (var i = 0; i < categories.length; i++) 
					{
						count += categories[i].count;
					}
					categories.unshift(
					{
						id: self._category,
						count: count,
						name: $L("All")
					});
				}
				widget.mojo.noticeUpdatedItems(0, categories);
				if (widget.mojo.getLength() != categories.length)
				{
					widget.mojo.setLength(categories.length);
				}
				// No applictions found - display default message
				self.controller.get('dv-fa-categorylist-message').style.display = (categories.length == 0 ? 'block' : 'none');
			}
			else
			{
				// Error
				Utilities.Errors.displayError(apps);
			}
		});
	},
	
	_formatCategoryDivider: function(model)
	{
		return this._toApps ? $L("Subcategories") : $L('Categories');
	},
	
	_gotoCategory: function(event)
	{
		Mojo.Log.info("_gotoCategory %j", event.item);
		if (this._toApps) 
		{
                        var params = {
                            "type": "category",
                            "search": event.item.id
                        };
			this.controller.stageController.pushScene("search", params);
		}
		else 
		{
			this.controller.stageController.pushScene("browse", event.item.id, true);
		}
	},
	
	_searchApps: function()
	{
                var params = {
                    "type": "query",
                    "search": this.controller.get('in-fa-ma-search-text').mojo.getValue()
                };
		this.controller.stageController.pushScene("search", params);
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
	
	_focusSearch: function()
	{
		this.controller.get('in-fa-search-text').mojo.focus.defer();
	}
});
