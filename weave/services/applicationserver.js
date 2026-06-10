/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationServer = new (Class.create(Weave.Services.CatalogServer,
{
	$whenReadyServerUrl: function(callback)
	{
		if (this._serverUrl)
		{
			callback();
		}
		else
		{
			// We need the server url and the carrier info
			var self = this;
			Weave.Services.AccountServices.getServerUrl(function(status, url)
			{
				self._serverUrl = status ? url : 'error:///';
				callback();
			});
		}
	},

	getFeaturedApplications: function(callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			self.$whenReadyServerUrlCarrier(function()
			{
				var features =
				{
					InGetFeaturedAppsV2:
					{
						accountTokenInfo: token,
						carrier: self._carrier
					}
				};
				self._callServer('featuredApps_ext2', features, function(status, response)
				{
					if (status)
					{
						if (response.FeaturedApps)
						{
							callback(true, response.FeaturedApps.palmFeaturedAppList.appSummary, response.FeaturedApps.carrierFeaturedAppList.appSummary, response.FeaturedApps.releaseStatus, response.FeaturedApps.country);
						}
						else
						{
							callback(false, 'badformat'); // do not localize
						}
					}
					else
					{
						callback.apply(null, arguments);
					}
				});
			});
		});
	},

	getAppCatUserFlags: function(callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			self.$whenReadyServerUrl(function()
			{
				var inGetAppCatUserFlags =
				{
					InGetAppCatUserFlags:
					{
						accountTokenInfo: token
					}
				};
				self._callServer('getAppCatUserFlags', inGetAppCatUserFlags, function(status, response)
				{
					if (status)
					{
						if (response.OutGetAppCatUserFlags)
						{
							callback(true, response.OutGetAppCatUserFlags, token);
						}
						else
						{
							callback(false, 'badformat', token); // do not localize
						}
					}
					else
					{
						callback(false, response, token);
					}
				});
			});
		});
	},

	getCategories: function(category, callback, localeOverride)
	{
		var self = this,
                    locale = (localeOverride === undefined) ? Mojo.Locale.current : localeOverride;

                this.$whenReadyServerUrlCarrier(function()
		{
			var params =
			{
				InGetCategoryList:
				{
					locale: locale,
                                        categoryId: category || ""
				}
			};
			self._callServer('categoryList', params, function(status, response, extra)
			{
				Mojo.Log.info("getCategories", status, response);
				if (status)
				{
					if (response.OutGetCategoryList == '' || response.OutGetCategoryList.categoryList == '')
					{
						callback(true, [], 0);
					}
					else if (response.OutGetCategoryList && response.OutGetCategoryList.categoryList && response.OutGetCategoryList.categoryList.categoryItems)
					{
						var items = response.OutGetCategoryList.categoryList.categoryItems;

                                                //We return the locale param so that we know to override the first "default" element
                                                //in the applicationcategorieshelper if we recovered from the invalidlocale error.
						callback(true, !items ? [] : Object.isArray(items) ? items : [ items ], locale);
					}
					else
					{
						callback(false, 'badformat'); // do not localize
					}
				}
				else
				{
					if (response == 'jsonexception' && extra.errorCodes == 'DISC0123')
					{
						//We default to the english category list when invalidlocale is returned
                                                //from the server.  There is an outstanding category cleanup effort remaining
                                                //on the server.
                                                self.getCategories(category, callback, 'en_US');
					}
					else
					{
						callback(false, response);
					}
				}
			});
		});
	},

	getApplicationDetails: function(appId, packageId, locale, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var details =
			{
				InGetAppDetailV2:
				{
					accountTokenInfo: token,
					"packageId": packageId,
					"locale": locale
				}
			};
			
			if (appId)
			  details.InGetAppDetailV2.appId = appId;
			self._callServer('appDetail_ext2', details, function(status, response, extra)
			{
				if (status)
				{
					if (response && response.OutGetAppDetailV2)
					{
						callback(true, response.OutGetAppDetailV2.appDetail, response.OutGetAppDetailV2.userRating, response.OutGetAppDetailV2.country);
					}
					else
					{
						callback(false, 'badformat'); // do not localize
					}
				}
				else
				{
					if (response == 'jsonexception' && extra.errorCodes == 'DISC0120')
					{
						callback(false, 'appunavailable', extra.message); // do not localize
					}
					else if (response == 'jsonexception' && self._isAppIncompatibleError(extra.errorCodes))
					{
						// app is not compatible with the device
						callback(false, extra.errorCodes);
					}
					else if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
					{
						callback(false, 'invalidtoken', extra.message); // do not localize
					}
					else
					{
						callback.apply(null, arguments);
					}
				}
			});
		});
	},

	getTags: function(limit, order, callback)
	{
		var get =
		{
			InGetTags:
			{
				criterion: (order == 'popularity' ? 'APP_COUNT' : 'TAG_NAME'),
				limit: limit
			}
		}
		this._callServer('getTags', get, function(status, response)
		{
			if (status)
			{
				if (response.OutGetTagList)
				{
					callback(true, response.OutGetTagList.tagList.tagItems);
				}
				else
				{
					callback(false, 'badformat'); // do not localize
				}
			}
			else
			{
				callback.apply(null, arguments);
			}
		});
	},

	searchForApplications: function(query, queryFragment, qid, categoryid, start, count, sort, locale, connectors, callback)
	{
		Mojo.Log.info("*********************************Entered seach for applications***********************");
		var self = this;
		this.getSecurityToken(function(token)
			{
				var q  = [];
				if (query)
				{
					var words = query.toLowerCase().split(' ');
					for (var i = 0; i < words.length; i++)
					{
						q.push(words[i] + '*');
					}
				}
				q = q.join(' && ');

				Mojo.Log.info("********* token *****" + token);
				var search =
				{
					InGetAppListV2:
					{
						tagName: '',
						queryStr: q,
                                                qid: qid,
						categoryid: categoryid,
                                                provides: connectors,
						startPosition: start,
						count: count,
						sort: sort,
						locale: locale,
						accountTokenInfo: token
					}
				};

                                //Query fragments get added as additional payload properties
                                if (queryFragment) {
                                    var fragParts,
                                        frags = queryFragment.split("&");

                                    for (var i=0; i<frags.length; i++) {
                                        fragParts = frags[i].split("=");

                                        if (fragParts.length === 2) {
                                            search.InGetAppListV2[fragParts[0]] = fragParts[1];
                                        }
                                    }
                                }

                                Mojo.Log.info("InGetAppListV2 payload: %j", search.InGetAppListV2);
				Mojo.Log.info('****************************** app List called with token***' + token);
				self._callServer('appList_ext2', search, function(status, response)
				{
					if (status)
					{
						if (response.OutGetAppList)
						{
							var apps = response.OutGetAppList.appList.appSummary;
							callback(true, !apps ? [] : apps.constructor != Array ? [ apps ] : apps, response.OutGetAppList.appList.totalCount, response.OutGetAppList.country, response.OutGetAppList.tiles);
						}
						else
						{
							callback(false, 'badformat'); // do not localize
						}
					}
					else
					{
						callback.apply(null, arguments);
					}
				});
			});
	},

	getUserComments: function(appid, offset, count, callback)
	{
		var get =
		{
			InGetUserRatings:
			{
				appId: appid,
				startPosition: offset,
				count: count
			}
		};
		this._callServer('getUserRatings', get, function(status, response)
		{
			if (status)
			{
				if (response.UserRatingList)
				{
					var ratings = response.UserRatingList.ratings;
					ratings = (!ratings ? [] : ratings.constructor != Array ? [ ratings ] : ratings);
					callback(true, ratings, ratings.length);
				}
				else if (response.UserRatingList == '')
				{
					callback(true, [], 0);
				}
				else
				{
					callback(false, 'badformat'); // do not localize
				}
			}
			else
			{
				callback.apply(null, arguments);
			}
		});
	},

	addUserComment: function(appid, packageid, comment, score, locale, name, anonymous, inappropriate, problemType, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var rating =
			{
				InAddUserRating:
				{
					userRatingItem:
					{
						score: Math.round(score), // Server requires score to be an interger
						comment: comment,
						accountId: name || "",
						locale: locale,
						isAnonymous: anonymous,
						isInappropriate: inappropriate,
						appId: appid,
						publicApplicationId: packageid,
						complaintType: problemType
					},
					accountTokenInfo: token
				}
			};

			Mojo.Log.info("asdd User comment %j", rating);
			self._callServer('addUserRating', rating, function(status, response, extra)
			{
				callback.apply(null, arguments);
			});
		});
	},

	getMyComment: function(appid, packageid, callback)
	{
		var self = this;
		this.getSecurityToken(function(token)
		{
			var comment =
			{
				InGetMyRating:
				{
					accountTokenInfo: token,
					appEntryId: appid,
					publicApplicationId: packageid
				}
			};
			Mojo.Log.info("getMyComment %j", comment);
			self._callServer('getMyRating', comment, function(status, response, extra)
			{
				if (status)
				{
					if (response && response.UserRating)
					{
						callback(true, response.UserRating);
					}
					else
					{
						callback(true, null);
					}
				}
				else
				{
					if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
					{
						callback(false, 'invalidtoken', extra.message); // do not localize
					}
					else
					{
						callback.apply(null, arguments);
					}
				}
			});
		});
	},

	getAppListForUpdates: function(packageNames, callback)
	{
            var self = this;
            this.getSecurityToken(function(token)
            {
                    Mojo.Log.info("Weave.Services.ApplicationServer.getAppListForUpdates sending %s", packageNames);
                    var updates =
                    {
                            InGetUpdatableApps:
                            {
                                    accountTokenInfo: token,
                                    packageIds: packageNames
                            }
                    };
                    self._callServer('getListOfUpdatableApps', updates, function(status, response, extra)
                    {
                            if (status)
                            {
                                    Mojo.Log.info("%j", response);
                                    if (response && response.OutUpdateInfoList == "")
                                    {
                                            callback(true, []);
                                    }
                                    else if(response && response.OutUpdateInfoList)
                                    {
                                            var updates = response.OutUpdateInfoList.appSummaryForUpdates;
                                            callback(true, !updates ? [] : Object.isArray(updates) ? updates : [ updates ]);
                                    }
                                    else
                                    {
                                            callback(false, 'badformat');
                                    }
                            }
                            else
                            {
                                    if (response == 'jsonexception' && self._isInvalidTokenError(extra.errorCodes))
                                    {
                                            callback(false, 'invalidtoken', extra.message); // do not localize
                                    }
                                    else
                                    {
                                            callback.apply(null, arguments);
                                    }
                            }
                    });
            });
	},

	_isInvalidTokenError: function(err)
	{
		if (err == 'DISC0049' || err == 'DISC0050' || err == 'DISC0051')
		{
			Mojo.Log.error("ApplicationServer._isInvalidTokenError TRUE, error:%s", err);
			return true;
		}
		return false;
	},

	_isAppIncompatibleError: function(err)
	{
		if (err == 'DISC0025' || err == 'DISC0124' || err == 'DISC0125'
			|| err == 'DISC0201' || err == 'DISC0202' || err == 'DISC0203')
		{
			Mojo.Log.error("ApplicationServer.isAppIncompatibleError TRUE, error:%s", err);
			return true;
		}
		return false;
	}
}));
