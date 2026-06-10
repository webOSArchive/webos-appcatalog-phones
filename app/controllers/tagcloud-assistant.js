/* Copyright 2009 Palm, Inc.  All rights reserved. */

var TagcloudAssistant = Class.create({
	
	initialize : function(category, toApps) 
	{
		Mojo.Log.info("TagcloudAssistant.initialize");
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
		
		//this._filter = null;
		this._category = category;
		this._toApps = toApps;
		this.searchFieldModel = {
			'original': ''
		};
	},

	setup: function() 
	{
		Mojo.Log.info("TagcloudAssistant.setup");
    this.appMetrics.trackNewScene("tag_cloud_assistant");
		
		this._tagSelected = this._tagSelected.bindAsEventListener(this);
		//this._filterKey = this._filterKey.bindAsEventListener(this);
		this._searchAppsKey = this._searchAppsKey.bindAsEventListener(this);
		this._searchApps = this._searchApps.bindAsEventListener(this);
		this._focusSearch = this._focusSearch.bindAsEventListener(this);
		
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

/*		
		this.controller.setupWidget('filterField', {}, {});
		
		this._filterField = this.controller.get('filterField');
*/
		this._tagCloud = this.controller.get('div-fa-tu-cloud');
       
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
					toggleCmd: 'tagcloud'
				},
				{}
			]
		};
		this.controller.setupWidget(Mojo.Menu.commandMenu, { menuClass: 'no-fade' }, this._cmdMenu);
		
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);
		
		this._spinner = new Spinner(this, 'spinner', true, 'large');
		
		this._displayTagCloud();
	},
	
	cleanup: function() 
	{
		Mojo.Log.info("TagcloudAssistant.cleanup");
	},

	activate: function() 
	{
		Mojo.Log.info("TagcloudAssistant.activate");
		
		this._tagCloud.addEventListener(Mojo.Event.tap, this._tagSelected);
		//this._filterField.addEventListener(Mojo.Event.filter, this._filterKey);
		this._appsSearch.widget.addEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.addEventListener(Mojo.Event.tap, this._searchApps);
		
		this.controller.document.addEventListener(Mojo.Event.tap, this._focusSearch);
		this.controller.get('in-fa-search-text').mojo.focus();
	},

	deactivate: function() 
	{
		Mojo.Log.info("TagcloudAssistant.deactivate");
		
		this._tagCloud.removeEventListener(Mojo.Event.tap, this._tagSelected);
		//this._filterField.removeEventListener(Mojo.Event.filter, this._filterKey);
		this._appsSearch.widget.removeEventListener(Mojo.Event.propertyChange, this._searchAppsKey);
		this._appsSearch.button.removeEventListener(Mojo.Event.tap, this._searchApps);
		this.controller.document.removeEventListener(Mojo.Event.tap, this._focusSearch);
	},
	
	_tagGroups:
	[
		{ end: 9, cls: 'tagcloud-group-7' },
		{ end: 34, cls: 'tagcloud-group-6' },
		{ end: 59, cls: 'tagcloud-group-5' },
		{ end: 84, cls: 'tagcloud-group-4' },
		{ end: 119, cls: 'tagcloud-group-3' },
		{ end: 159, cls: 'tagcloud-group-2' },
		{ end: 99999999, cls: 'tagcloud-group-1' },
	],
	
	_displayTagCloud: function()
	{
		var self = this;
		Weave.Services.ApplicationServer.getCategories(this._category, function(status, tags)
		{
			self._spinner.stop();
			if (status)
			{
				var len = tags.length;
				var scale = (len > 0 && len < 200 ? 200 / len : 1);
				
				// algorithm assumes that tags are sorted in 
				// decreasing popularity order (by "count")
				tags.sort(function(a, b)
				{
					return a.count > b.count ? -1 : a.count == b.count ? 0 : 1;
				});
				
				// Label the tags with their popularity group class
				var gidx = 0;
				var group = self._tagGroups[gidx];
				var gend = group.end / scale;
				for (var i = 0; i < len; i++)
				{
					tags[i]._group = group.cls;
					if (i >= gend)
					{
						group = self._tagGroups[++gidx];
						gend = group.end / scale;
					}
				}
				
				// While we get the most popular tags, we display them alphabetically - so we need to sort them
				tags.sort(function(a, b)
				{
					return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
				});
				
				// Remember tags for filtering
				self._currentTags = tags;
				
				self._buildTagCloud(tags, null);
			}
			else
			{
				// Error
				Utilities.Errors.displayError(tags);
			}
		});
	},
	
	_buildTagCloud: function(tags, filter)
	{
		var cloud = this._tagCloud;
		cloud.innerHTML = ''; // A rather hacky way to clear out the cloud.
		
		var search = filter ? new RegExp('^' + Weave.Utilities.RegExp.escape(filter), 'i') : null;

		var count = 0;
		var len = tags.length;
		for (var i = 0; i < len; i++)
		{
			var tag = tags[i];
			var name = tag.name;
			if (!search || name.match(search)) 
			{
				var span = document.createElement('span');
				span.setAttribute('x-mojo-touch-feedback', 'delayed');
				span.setAttribute('x-id', tag.id);
				span.innerText = name + ' ';
				span.addClassName(tag._group);
				cloud.appendChild(span);
				count++;
			}
		}
		
		if (count == 0)
		{
			// No tags
			cloud.innerHTML = "<span class='tagcloud-empty'>" + $L("No categories found") + "</span>";
		}
		//this._filterField.mojo.setCount(count);
	},
	
	_tagSelected: function(event)
	{
		Mojo.Log.info("tagSelected"/*, event.target.getAttribute("x-id")*/);
		if (event.target.tagName == "SPAN") 
		{
			if (this._toApps) 
			{
				this.controller.stageController.pushScene('search', 'category', event.target.getAttribute("x-id"));
			}
			else
			{
				this.controller.stageController.pushScene('tagcloud', event.target.getAttribute("x-id"), true);
			}
		}
	},
	
	_filterKey: function(event)
	{
		this._buildTagCloud(this._currentTags, event.filterString);
	},
	
	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.command)
		{
			switch (event.command)
			{
				case 'browse':
					this.controller.stageController.swapScene({transition: Mojo.Transition.crossFade, name: "browse"}, this._category, this._toApps);
					break;
					
				default:
					break;
			}
		}
	},
	
	_searchApps: function()
	{
                var params = {
                    "type": "tag",
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
	},
});
