/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppCategoriesHelper = Class.create(
{
        initialize: function(categoryInfoOverrideParams) {
            this._dbMaxCacheTimeAllowed = 86400000; //24 hrs
            this._db = this._dbSetup();

            this.categoryInfo = {
                category: null,
                categoryToSearch: null,
                prevParentCategory: null,
                name: null,
                prevParentCategoryName: null,
                toplevelSelectorLabel: $L('Browse Categories'),
                actualLocaleUsed: null,
                items: [{label: '', command: ''}],
                parentCategoryList: []
            }

            var prop = null;
            for (prop in categoryInfoOverrideParams) {
                if (this.categoryInfo[prop] !== undefined) {
                    this.categoryInfo[prop] = categoryInfoOverrideParams[prop];
                }
            }
        },

        setup: function(){},

        _fetchCategoriesFromServer: function(categoryCacheKey, categoryFilter, isParentCategory) {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._fetchCategoriesFromServer %j", this.categoryInfo);

            var self = this;

            Weave.Services.ApplicationServer.getCategories(categoryFilter, function(status, categories, actualLocaleUsed)
            {
                Mojo.Log.info("callback %d %j", status, categories);

                if (status) {
                    //If there is no localized version of the categories (invalidlocale) we default to English.
                    self.categoryInfo.actualLocaleUsed = actualLocaleUsed;

                    self._dbCacheCategories(categoryCacheKey, categories);
                    self._setupCategoryMenuItems(categoryFilter, isParentCategory, categories);
                } else {
                    // Error
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._fetchCategoriesFromServer failed!");
                    Utilities.Errors.displayError(categories);
                }
            });
        },

        _setupCategoryMenuItems: function(categoryFilter, isParentCategory, categories) {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._setupCategoryMenuItems %j", categories);

            var categoryItems    = null,
                parentCatChoices = [],
                catChoices       = [];

                for (var i=catChoices.length; i<categories.length; i++) {
                    //Only top level categories have icons
                    var categoryIcon = (categoryFilter === undefined && categories[i].iconLocation !== undefined) ? 'images/' + categories[i].iconLocation + 'category-selector.png' : '';

                    catChoices[catChoices.length] = {
                        label: categories[i].name,
                        secondaryIconPath: categoryIcon,
                        command: categories[i].name + '__' + categories[i].id,
                        chosen: (this.categoryInfo.category == categories[i].id) ? true : false
                    };

                    //The first time through we save these off as the parent category list
                    if (this.categoryInfo.parentCategoryList.length === 0) {
                        parentCatChoices[parentCatChoices.length] = {
                            "id": categories[i].id,
                            "name": categories[i].name,
                            "iconLocation": categoryIcon
                        }
                    }
                }
				catChoices.sort(function(a,b){return a.label.localeCompare(b.label);});
                //The first time through we save these off as the parent category list
                if (this.categoryInfo.parentCategoryList.length === 0) {
                    this.categoryInfo.parentCategoryList = parentCatChoices;
                }

                //Update first entry placeholder
                //We must use the English placeholder for the default first entry in case of invalidlocale, not the localized version.
                var firstEntryPlaceholder,
                    additionalCatChoices = [];

                if (isParentCategory === true) {
                    //firstEntryPlaceholder = (this.categoryInfo.actualLocaleUsed.toLowerCase() === 'en_us') ? 'All Categories' : $L('All Categories');
                    //additionalCatChoices[additionalCatChoices.length] = {label: firstEntryPlaceholder, command: '__home'};

                    additionalCatChoices[additionalCatChoices.length] = {label: $L('All #{category}').interpolate({category: this.categoryInfo.name}), command: this.categoryInfo.name + "__" + this.categoryInfo.category, chosen: true};
                } else if (categoryFilter === undefined) {
                    //If there is no localized version of the categories (invalidlocale) we default to English.
                    //In this case we must use the English placeholder for the default first entry, not the localized version.
                    if ((this.categoryInfo.actualLocaleUsed !== undefined && this.categoryInfo.actualLocaleUsed !== null) && this.categoryInfo.actualLocaleUsed.toLowerCase() === 'en_us') {
                        firstEntryPlaceholder = 'Home'; //Do not localize
                    } else {
                        firstEntryPlaceholder = $L('Home');
                    }

                    additionalCatChoices[additionalCatChoices.length] = {label: firstEntryPlaceholder, command: '__all', secondaryIconPath: "images/category-icons/home/category-selector.png", chosen: true};
                } else {
                    additionalCatChoices[additionalCatChoices.length] = {label: $L('All #{category}').interpolate({category: this.categoryInfo.prevParentCategoryName}), command: this.categoryInfo.prevParentCategoryName + "__" + this.categoryInfo.prevParentCategory};
                }

                //Override values for popup display when a subcat was selected
                if (isParentCategory === false) {
                    this.categoryInfo.category = this.categoryInfo.prevParentCategory;
                    this.categoryInfo.name = this.categoryInfo.prevParentCategoryName;
                }

                categoryItems = additionalCatChoices.concat(catChoices);
                this.categoryInfo.items = categoryItems;
        },

        updateCategorySelector: function()
	{
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper.updateCategorySelector");

            var categoryCacheKey = this.categoryInfo.category,
                categoryFilter,
                isParentCategory = this.isParentCategory(this.categoryInfo.category);

            if (categoryCacheKey === undefined) {
                categoryCacheKey = 'home_' + Mojo.Locale.current; //Forced cache key for undefined since "home" isn't real
            } else {
                categoryCacheKey += "_" + Mojo.Locale.current;
            }

            //If the prev parent is set then a subcat was selected.  We rebuilt based on the parent not the subcat.
            if (isParentCategory) {
                categoryFilter = this.categoryInfo.category;
            } else if (this.categoryInfo.prevParentCategory !== null) {
                categoryFilter = this.categoryInfo.prevParentCategory;
                categoryCacheKey = categoryFilter + "_" + Mojo.Locale.current; //there is no 3rd level.  subcats are stored by parent cat.
            }

            this._dbFetchCategories(categoryCacheKey, categoryFilter, isParentCategory);
	},

        //Determine of the selected category is a toplevel or sublevel category
        isParentCategory: function(selectedCategoryId) {
            var i,
                isParentCategory = false;

            for (i=0; i<this.categoryInfo.parentCategoryList.length; i++) {
                var id = this.categoryInfo.parentCategoryList[i].id;
                if (selectedCategoryId == id) {
                    isParentCategory = true;
                    break;
                }
            }

            return isParentCategory;
        },

        /**
         * Returns path to the category icon
         * @param categoryId
         * */
        getCategoryIconForSearchBar: function(categoryId) {
            var i,
                iconFilename = '';

            if (categoryId === null || categoryId === 'home') {
                iconFilename = 'images/category-icons/home/search-bar.png';
            } else {
                for (i=0; i<this.categoryInfo.parentCategoryList.length; i++) {
                    var id = this.categoryInfo.parentCategoryList[i].id;
                    if (categoryId == id) {
                        iconFilename = this.categoryInfo.parentCategoryList[i].iconLocation;
                        break;
                    }
                }

                if (iconFilename !== '') {
                    iconFilename = iconFilename.replace('category-selector.png', 'search-bar.png');
                }
            }

            return iconFilename;
        },

        /**
         * Mojo.Depot related methods
         */
        _dbSetup: function() {
            var md = new Mojo.Depot(
                                    {
                                        name: "categoryDB",
                                        version: 1,
                                        estimatedSize: 10000,
                                        replace: false
                                    },
                                    this._dbOpenSuccess.bind(this),
                                    this._dbOpenFailure.bind(this)
                                );
            return md;
        },

        _dbOpenSuccess: function() {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbOpenSuccess");
        },

        _dbOpenFailure: function() {
            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbOpenFailure");
        },

        _isCacheValid: function(categoryCacheKey, dateCached) {
            var millisecondsSinceEpoch = new Date().getTime(),
                timeSinceCached        = millisecondsSinceEpoch - dateCached;

            if (timeSinceCached > this._dbMaxCacheTimeAllowed) {
                this._dbExpireCachedCategories(categoryCacheKey); //Expire the cache
                return false;
            } else {
                Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._isCacheValid: Yes it is.  Milliseconds since cache %i", timeSinceCached);
                return true;
            }
        },

        _dbExpireCachedCategories: function(categoryCacheKey) {
            this._db.discard(categoryCacheKey, function() {
                Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._isCacheValid: Expired old cache for cacheKey: %s", categoryCacheKey);
            }, function() {
               Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._isCacheValid: Failed to expire old cache for cacheKey: %s", categoryCacheKey);
            });
        },

        _dbCacheCategories: function(categoryId, categories) {
            if (categoryId === undefined) {
                categoryId = 'home';
            }

            var cacheBlock = {
                    data: categories,
                    dateCached: new Date().getTime()
                };

            this._db.simpleAdd(categoryId,
                cacheBlock,
                function() {
                    Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbCacheCategories: Cached categories for id %s", categoryId);
                },
                function() {
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._dbCacheCategories: Unable to cache categories");
                }
            );
        },

        _dbFetchCategories: function(categoryCacheKey, categoryFilter, isParentCategory) {
            var self = this;

            //Attempt to pull categories from cache.  If missing, fetch and cache.
            this._db.simpleGet(categoryCacheKey,
                function(cachedCategoryObject) {
                    if (cachedCategoryObject === null || Object.toJSON(cachedCategoryObject) == "{}") {
                        Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Retrieved empty or null list from depot for categoryCacheKey %s", categoryCacheKey);

                        self._fetchCategoriesFromServer(categoryCacheKey, categoryFilter, isParentCategory);
                    } else {
                        Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: categories pulled from cache %j", cachedCategoryObject);

                        //We have categories in the cache, but must verify they are recent enough to use
                        var validCache = self._isCacheValid(categoryCacheKey, cachedCategoryObject.dateCached);

                        if (validCache === true) {
                            //Construct menu items from existing cache
                            self._setupCategoryMenuItems(categoryFilter, isParentCategory, cachedCategoryObject.data);
                        } else {
                            Mojo.Log.info("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Stale category cache found.  Refreshing...");

                            //Stale data.  Refetch.
                            self._fetchCategoriesFromServer(categoryCacheKey, categoryFilter, isParentCategory);
                        }
                    }
                },
                function() {
                    Mojo.Log.error("Weave.Utilities.AppCategoriesHelper._dbFetchCachedCategories: Unable to fetch categories from depot");
                    return false;
                }
            );
        }
});
