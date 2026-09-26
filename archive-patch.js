// archive-patch.js
// Bridges com.palm.app.findapps (Mojo) to the webOS Archive backend.
// Loaded as a global script from sources.json, after allscriptscompressed.js.

(function () {
    "use strict";

    Mojo.Log.info("ARCHIVE-PATCH loading");

    var API_BASE = "https://appcatalog.webosarchive.org/WebService/";

    // Updated by getConfig.php call at the bottom.  All URL construction is lazy.
    var _imageBase   = "http://appcatalog.webosarchive.org/AppImages/";
    var _packageBase = "appstorage.webosarchive.org/packages";

    // Keyed by String(numericId); populated by transformApp (list view).
    var _cache = {};

    // -----------------------------------------------------------------------
    // First-run: accept Terms of Use so the app skips the TOS scene.
    // -----------------------------------------------------------------------
    try { TermsOfUse.setAccepted(); } catch (e) {
        Mojo.Log.error("ARCHIVE-PATCH TermsOfUse.setAccepted failed: " + e);
    }

    // -----------------------------------------------------------------------
    // Clear stale HP category cache from Mojo.Depot.
    // -----------------------------------------------------------------------
    try {
        var _catDB = new Mojo.Depot(
            {name: "categoryDB", version: 1, estimatedSize: 10000, replace: false},
            function () {
                var locales = [Mojo.Locale.current, "en_US", "en_us"];
                locales.forEach(function (loc) {
                    _catDB.discard("home_" + loc, function () {}, function () {});
                    _catDB.discard(loc,            function () {}, function () {});
                });
                Mojo.Log.info("ARCHIVE-PATCH categoryDB cache cleared");
            },
            function () {}
        );
    } catch (e) {}

    // -----------------------------------------------------------------------
    // Fix: ConnectionManager.getDataService crashes on TouchPad (no cellular)
    // because DeviceProfile.getCarrierIdentification returns undefined carrier.
    // -----------------------------------------------------------------------
    try {
        if (Weave.Services.ConnectionManager && Weave.Services.ConnectionManager.getDataService) {
            Weave.Services.ConnectionManager.getDataService = function () {};
        }
    } catch (e) {}

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------
    function makeKey() {
        return "mfap-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    function makeIconUrl(relPath) {
        if (!relPath) { return ""; }
        if (relPath.indexOf("://") !== -1) { return relPath; }
        return _imageBase + relPath.toLowerCase();
    }

    // Map the qid command button to an archive sort mode.
    function qidToSort(qid) {
        if (qid === "Blowfish2Query4" || qid === "Blowfish2Query8") { return "recent"; }
        if (qid === "Blowfish2Query3" || qid === "Blowfish2Query7") { return "alpha"; }
        return "recommended";
    }

    // Transform an archive app record into the appSummary shape.
    function transformApp(app) {
        var iconUri = makeIconUrl(app.appIcon);
        var summary = {
            id:                  app.id,
            publicApplicationId: String(app.id),
            title:               app.title   || "",
            author:              app.author  || "",
            appIcon:             iconUri,
            averageRating:       app.starRating  || 0,
            ratingCount:         app.reviewCount || 0,
            price:               0,
            appVersion:          "",
            touchpadExclusive:   !!app.touchpad_exclusive
        };
        _cache[String(app.id)] = summary;
        return summary;
    }

    // Helper: GET url via Ajax.Request (Prototype.js); same HTTP stack as
    // the rest of the app.  evalJSON:'force' auto-parses JSON.
    // On status=0 (SSL session not yet warm after fresh install) we retry
    // once after 1.5 s before surfacing the offline error.
    function archiveGet(url, onSuccess, onFailure, _retried) {
        new Ajax.Request(url, {
            method: "GET",
            evalJSON: "force",
            onSuccess: function (transport) {
                var raw = transport.responseJSON;
                if (!raw) {
                    try { raw = JSON.parse(transport.responseText); } catch (e) {}
                }
                if (raw) {
                    onSuccess(raw);
                } else {
                    Mojo.Log.error("ARCHIVE-PATCH bad response from " + url + ": " +
                                   (transport.responseText || "").substring(0, 200));
                    onFailure("badformat");
                }
            },
            onFailure: function (transport) {
                Mojo.Log.error("ARCHIVE-PATCH HTTP " + transport.status + " from " + url);
                onFailure("failure");
            },
            on0: function () {
                if (!_retried) {
                    setTimeout(function () { archiveGet(url, onSuccess, onFailure, true); }, 1500);
                } else {
                    Mojo.Log.error("ARCHIVE-PATCH network error (gave up): " + url);
                    onFailure("offline");
                }
            }
        });
    }

    // -----------------------------------------------------------------------
    // Stub AccountServices — dead HP servers.
    // -----------------------------------------------------------------------
    Weave.Services.AccountServices.getServerUrl = function (callback) {
        setTimeout(function () { callback(true, API_BASE); }, 0);
    };

    Weave.Services.AccountServices.getAccountToken = function (callback) {
        setTimeout(function () {
            callback(true, "archive-token", "archive@webosarchive.org", "ACTIVE");
        }, 0);
    };

    Weave.Services.AccountServices.getGoogleAnalyticsWebPropertyID = function (callback) {
        setTimeout(function () { callback(false); }, 0);
    };

    // -----------------------------------------------------------------------
    // ApplicationServer overrides (instance-level, shadow prototype methods)
    // -----------------------------------------------------------------------
    var AS = Weave.Services.ApplicationServer;

    AS.$whenReadyServerUrl = function (cb) {
        this._serverUrl = API_BASE;
        cb();
    };

    AS.$whenReadyServerUrlCarrier = function (cb) {
        this._serverUrl = API_BASE;
        this._carrier   = "archive";
        cb();
    };

    AS._whenReadySecurityToken = function (cb) {
        this._token    = "archive-token";
        this._email    = "archive@webosarchive.org";
        this._deviceid = "archive-phone";
        this._carrier  = "archive";
        cb();
    };

    // --- getCategories -------------------------------------------------------
    var CATEGORIES = [
        {id: "Books",               name: "Books",               iconLocation: "category-icons/books/"},
        {id: "Business",            name: "Business",            iconLocation: "category-icons/business/"},
        {id: "Curator's Choice",    name: "Curator's Choice",    iconLocation: "category-icons/home/"},
        {id: "Education",           name: "Education",           iconLocation: "category-icons/education/"},
        {id: "Entertainment",       name: "Entertainment",       iconLocation: "category-icons/entertainment/"},
        {id: "Finance",             name: "Finance",             iconLocation: "category-icons/finance/"},
        {id: "Food",                name: "Food",                iconLocation: "category-icons/food/"},
        {id: "Games",               name: "Games",               iconLocation: "category-icons/games/"},
        {id: "Health & Fitness",    name: "Health & Fitness",    iconLocation: "category-icons/health-and-fitness/"},
        {id: "Lifestyle",           name: "Lifestyle",           iconLocation: "category-icons/lifestyle/"},
        {id: "Music",               name: "Music",               iconLocation: "category-icons/music/"},
        {id: "Navigation",          name: "Navigation",          iconLocation: "category-icons/navigation/"},
        {id: "News",                name: "News",                iconLocation: "category-icons/news/"},
        {id: "Photography",         name: "Photography",         iconLocation: "category-icons/photography/"},
        {id: "Productivity",        name: "Productivity",        iconLocation: "category-icons/productivity/"},
        {id: "Reference",           name: "Reference",           iconLocation: "category-icons/reference/"},
        {id: "Revisionist History", name: "Revisionist History", iconLocation: "category-icons/home/"},
        {id: "Social Networking",   name: "Social Networking",   iconLocation: "category-icons/social-networking/"},
        {id: "Sports",              name: "Sports",              iconLocation: "category-icons/sports/"},
        {id: "Travel",              name: "Travel",              iconLocation: "category-icons/travel/"},
        {id: "Weather",             name: "Weather",             iconLocation: "category-icons/weather/"}
    ];

    AS.getCategories = function (category, callback /*, localeOverride */) {
        var locale = arguments[2] || Mojo.Locale.current;
        setTimeout(function () { callback(true, CATEGORIES, locale); }, 0);
    };

    // --- searchForApplications -----------------------------------------------
    AS.searchForApplications = function (query, queryFragment, qid, categoryid, start, count, sort, locale, connectors, callback) {
        var url;
        var safeCount = count || 20;
        var safeStart = start || 0;

        if (query) {
            url = API_BASE + "getSearchResults.php?app=" + encodeURIComponent(query);
        } else {
            var page      = (safeCount > 0) ? Math.floor(safeStart / safeCount) : 0;
            var category  = categoryid || "All";
            var sortOrder = qidToSort(qid);

            url = API_BASE + "getMuseumMaster.php?" +
                  "device=All" +
                  "&category="     + encodeURIComponent(category) +
                  "&page="         + page +
                  "&count="        + safeCount +
                  "&key="          + makeKey() +
                  "&hide_missing=true" +
                  "&sort="         + sortOrder;
        }

        archiveGet(url,
            function (raw) {
                var apps, total;
                if (raw && raw.data && typeof raw.data.filter === "function") {
                    var valid = raw.data.filter(function (a) { return a && a.id; });
                    apps  = valid.map(transformApp);
                    total = (raw.extraData && raw.extraData.listCount) || apps.length;
                } else if (raw && typeof raw.filter === "function") {
                    // getSearchResults returns a plain array
                    apps  = raw.filter(function (a) { return a && a.id; }).map(transformApp);
                    total = apps.length;
                } else {
                    Mojo.Log.error("ARCHIVE-PATCH searchForApplications unexpected response shape");
                    callback(false, "badformat");
                    return;
                }
                Mojo.Log.info("ARCHIVE-PATCH search: " + apps.length + " apps (total " + total + ")");
                callback(true, apps, total, "US", null);
            },
            function (errorCode) {
                Mojo.Log.error("ARCHIVE-PATCH searchForApplications failed: " + errorCode);
                callback(false, errorCode);
            }
        );
    };

    // --- getApplicationDetails -----------------------------------------------
    AS.getApplicationDetails = function (appId, packageId, locale, callback) {
        var _pkg      = String(packageId || "");
        var _id       = String(appId     || "");
        var numericId = /^\d+$/.test(_pkg) ? _pkg
                      : /^\d+$/.test(_id)  ? _id
                      : _pkg || _id;

        var url = API_BASE + "getMuseumDetails.php?id=" + encodeURIComponent(numericId);

        archiveGet(url,
            function (raw) {
                var cached  = _cache[numericId] || {};
                var iconUri = cached.appIcon || makeIconUrl(raw.appIcon || "");

                var appLocation = raw.filename
                    ? "http://" + _packageBase + "/" + raw.filename
                    : "";

                var rawAttrs = raw.attributes || {};
                if (!rawAttrs.provides) {
                    rawAttrs.provides = {
                        noApp:          false,
                        services:       [],
                        dockMode:       false,
                        universalSearch: null,
                        connectors:     []
                    };
                }

                // Map raw.images (keyed "1"-"5") to appScaledImage1-5 fields.
                // _rebuildDetailsFromModel iterates these and sets visibility.
                var imgs = raw.images || {};
                var appDetail = {
                    id:                  numericId,
                    publicApplicationId: raw.publicApplicationId || numericId,
                    title:               cached.title  || raw.title       || "",
                    creator:             cached.author || "",
                    appIcon:             iconUri,
                    version:             raw.version              || "",
                    description:         raw.description          || "",
                    appSize:             raw.appSize              || 1,
                    installSize:         raw.installSize          || 1,
                    isEncrypted:         !!raw.isEncrypted,
                    islocationbased:     !!raw.islocationbased,
                    price:               0,
                    priceType:           "free",
                    currency:            raw.currency             || "USD",
                    sku:                 null,
                    paymentCategory:     null,
                    free:                true,
                    averageRating:       raw.starRating           || 0,
                    // cntRating is the HP field name used as g.pluralRating in the template
                    cntRating:           0,
                    supportURL:          raw.supportURL || raw.homeURL || "",
                    homeURL:             raw.homeURL              || "",
                    licenseURL:          raw.licenseURL           || "",
                    appLocation:         appLocation,
                    attributes:          rawAttrs,
                    touchpadExclusive:   !!raw.touchpad_exclusive,
                    // lastModifiedTime is required: UTCDate.parse crashes on undefined
                    lastModifiedTime:    raw.lastModifiedTime || "2000-01-01 00:00:00",
                    releaseStatus:       "final",
                    programType:        "",
                    appScaledImage1:     (imgs["1"] && imgs["1"].screenshot) ? makeIconUrl(imgs["1"].screenshot) : null,
                    appScaledImage2:     (imgs["2"] && imgs["2"].screenshot) ? makeIconUrl(imgs["2"].screenshot) : null,
                    appScaledImage3:     (imgs["3"] && imgs["3"].screenshot) ? makeIconUrl(imgs["3"].screenshot) : null,
                    appScaledImage4:     (imgs["4"] && imgs["4"].screenshot) ? makeIconUrl(imgs["4"].screenshot) : null,
                    appScaledImage5:     (imgs["5"] && imgs["5"].screenshot) ? makeIconUrl(imgs["5"].screenshot) : null
                };

                Mojo.Log.info("ARCHIVE-PATCH detail ok id=" + numericId);
                callback(true, appDetail, null, "US");
            },
            function (errorCode) {
                Mojo.Log.error("ARCHIVE-PATCH getApplicationDetails failed: " + errorCode);
                callback(false, errorCode);
            }
        );
    };

    // --- getUserComments -----------------------------------------------------
    AS.getUserComments = function (appid, offset, count, callback) {
        var url = API_BASE + "getMuseumReviews.php" +
                  "?id="     + encodeURIComponent(String(appid || "")) +
                  "&sign=positive" +
                  "&offset=" + (offset || 0) +
                  "&count="  + (count  || 10);

        archiveGet(url,
            function (raw) {
                var reviews = (raw && raw.reviews) || [];
                callback(true, reviews, reviews.length);
            },
            function () { callback(true, [], 0); }
        );
    };

    // --- getFeaturedApplications ---------------------------------------------
    AS.getFeaturedApplications = function (callback) {
        setTimeout(function () {
            callback(true, [], [], "", "US");
        }, 0);
    };

    // --- getAppListForUpdates ------------------------------------------------
    AS.getAppListForUpdates = function (packageNames, callback) {
        setTimeout(function () { callback(true, []); }, 0);
    };

    // --- getAppCatUserFlags / getTags ----------------------------------------
    AS.getAppCatUserFlags = function (callback) {
        setTimeout(function () {
            callback(true, {appFilterOn: false, paidAppAllowed: true}, {});
        }, 0);
    };

    AS.getTags = function (limit, order, callback) {
        setTimeout(function () { callback(true, []); }, 0);
    };

    // --- Write methods are no-ops (read-only archive) ------------------------
    AS.addUserComment = function (appid, packageid, comment, score, locale, name, anonymous, inappropriate, problemType, callback) {
        setTimeout(function () { callback(true); }, 0);
    };

    AS.getMyComment = function (appid, packageid, callback) {
        setTimeout(function () { callback(true, null); }, 0);
    };

    // -----------------------------------------------------------------------
    // Remove "paid" toolbar button.
    // query-buttons.js is lazy-loaded with the "main" scene, so we can't touch
    // QueryButtons at parse time.  Hook MainAssistant.prototype.setup (which IS
    // in allscriptscompressed.js) and patch QueryButtons there, before the
    // original setup builds the list widget.
    // -----------------------------------------------------------------------
    var _origMainSetup = MainAssistant.prototype.setup;
    MainAssistant.prototype.setup = function () {
        if (typeof QueryButtons !== "undefined" && !QueryButtons._archivePatched) {
            QueryButtons._homeQueryItems = [
                {iconPath: "images/menu-button-hot.png",  command: "Blowfish2Query1"},
                {iconPath: "images/menu-button-free.png", command: "Blowfish2Query3"},
                {iconPath: "images/menu-button-new.png",  command: "Blowfish2Query4"}
            ];
            QueryButtons._otherQueryItems = [
                {iconPath: "images/menu-button-all.png",  command: "Blowfish2Query5"},
                {iconPath: "images/menu-button-free.png", command: "Blowfish2Query7"},
                {iconPath: "images/menu-button-new.png",  command: "Blowfish2Query8"}
            ];
            // No paid button → no currency icon.  Any _updateQueryButton(1,
            // getCurrencyIconForActivationCountry(...)) call (both MainAssistant
            // and SearchAssistant do this) must not overwrite the free/alpha icon.
            QueryButtons.getCurrencyIconForActivationCountry = function () {
                return "images/menu-button-free.png";
            };
            // No currency-icon mutation: paid button (old index 1) is gone.
            QueryButtons.getQueryButtonsForCategory = function (a) {
                return (a !== undefined && (a > 0 || a === "all"))
                    ? this._otherQueryItems : this._homeQueryItems;
            };
            QueryButtons._homeSearchBarLabels[2] = "Alphabetic";
            QueryButtons._archivePatched = true;
            Mojo.Log.info("ARCHIVE-PATCH QueryButtons patched");
        }
        return _origMainSetup.call(this);
    };

    // -----------------------------------------------------------------------
    // "Download for free" → "Install"
    // Override both states that set this title.  Calling the original first
    // lets it handle all other model properties, then we overwrite the title.
    // -----------------------------------------------------------------------
    var _origDownloadStateInit = Catalog.appStates["download"].init;
    Catalog.appStates["download"].init = function (app, args) {
        _origDownloadStateInit.call(this, app, args);
        app._progressPillModel.title = $L("Install");
    };

    var _origPurchasedStateInit = Catalog.appStates["purchased"].init;
    Catalog.appStates["purchased"].init = function (app, args) {
        _origPurchasedStateInit.call(this, app, args);
        app._progressPillModel.title = $L("Install");
    };

    // -----------------------------------------------------------------------
    // Reset "Downloading…" → "Install" when the installer closes.
    //
    // webOS 2.x does not fire any JavaScript callback when a card returns to
    // the foreground (no stageActivate event, no handleLaunch, no stageActivated).
    // Instead we poll applicationManager/running via chained setTimeout.  While
    // the installer is foreground the JS engine is frozen, so only ONE pending
    // timeout fires on resume — at that point the installer is already gone.
    // -----------------------------------------------------------------------
    window._archivePrewareApp = null;

    function _archiveResetInstallButton() {
        var app = window._archivePrewareApp;
        if (!app) { return; }
        Mojo.Log.info("ARCHIVE-PATCH reset: state=" + app.stateToString());
        if (app.stateToString() === "fake progress") {
            window._archivePrewareApp = null;
            app.setState("download");
        }
    }

    // handlerId: the app the package was handed to (Preware, Preware 2, ...).
    function _watchForHandlerClose(app, handlerId) {
        window._archivePrewareApp = app;
        var handlerSeen = false;
        var ticks = 0;

        // Use setTimeout chaining rather than setInterval or a subscription.
        // While the installer is foreground, App Catalog's JS engine is frozen —
        // no subscription callbacks or interval ticks fire.  But the ONE pending
        // setTimeout fires the moment JS unfreezes (card restored), at which
        // point the installer is already gone from the running list.
        function poll() {
            if (!window._archivePrewareApp) { return; }
            ticks++;
            if (ticks > 120) {
                Mojo.Log.error("ARCHIVE-PATCH installer watch timeout");
                window._archivePrewareApp = null;
                return;
            }
            new Mojo.Service.Request("palm://com.palm.applicationManager", {
                method: "running",
                parameters: {},
                onSuccess: function (response) {
                    var running = response.running || [];
                    var found = false;
                    for (var i = 0; i < running.length; i++) {
                        if (running[i].id === handlerId) {
                            found = true;
                            break;
                        }
                    }
                    if (found) {
                        handlerSeen = true;
                        setTimeout(poll, 1000);
                    } else if (handlerSeen) {
                        Mojo.Log.info("ARCHIVE-PATCH " + handlerId + " closed — resetting button");
                        _archiveResetInstallButton();
                    } else {
                        // Not seen yet — keep polling
                        setTimeout(poll, 1000);
                    }
                },
                onFailure: function () {
                    setTimeout(poll, 2000);
                }
            });
        }

        setTimeout(poll, 500);
    }

    // -----------------------------------------------------------------------
    // The .ipk handler: hand the package to whichever app is registered for
    // application/vnd.webos.ipk (Preware, Preware 2, ...), the active one first,
    // then the alternates, then the original Preware by id, until one opens.
    // An app can't open an .ipk by target ("Unauthorized call to open an ipk"),
    // so each is launched by id with {type: "install", file, target}.  A handler
    // removed since it registered fails to launch, and the next is tried.
    // From a Preware 2 developer's patch for the tablet catalog, with its LuneOS
    // route: LunaAppManager passes launches on to SAM and then answers
    // '"<id>" was not found' even for an app it launched, so ask SAM itself.
    // -----------------------------------------------------------------------
    var IPK_MIME = "application/vnd.webos.ipk";
    var FALLBACK_IPK_HANDLER = "org.webosinternals.preware";
    var IS_LEGACY_WEBOS = /hpwOS\/|webOS\/[1-3]\./.test(navigator.userAgent);

    function _ipkHandlerCandidates(callback) {
        var ids = [];
        function add(id) { if (id && ids.indexOf(id) < 0) { ids.push(id); } }
        new Mojo.Service.Request("palm://com.palm.applicationManager", {
            method: "listAllHandlersForMime",
            parameters: {mime: IPK_MIME},
            onSuccess: function (r) {
                var h = r && r.resourceHandlers, i;
                if (h) {
                    add(h.activeHandler && h.activeHandler.appId);
                    for (i = 0; h.alternates && i < h.alternates.length; i++) { add(h.alternates[i].appId); }
                }
                add(FALLBACK_IPK_HANDLER);
                callback(ids);
            },
            onFailure: function () { add(FALLBACK_IPK_HANDLER); callback(ids); }
        });
    }

    function _launchHandler(id, params, onOk, onFail) {
        if (IS_LEGACY_WEBOS) {
            new Mojo.Service.Request("palm://com.palm.applicationManager", {
                method: "open", parameters: {id: id, params: params}, onSuccess: onOk, onFailure: onFail
            });
        } else {
            new Mojo.Service.Request("luna://com.webos.service.applicationmanager", {
                method: "launch", parameters: {id: id, params: params}, onSuccess: onOk, onFailure: onFail
            });
        }
    }

    function _openIpkWithHandler(ipkUrl, onSuccess, onFailure) {
        _ipkHandlerCandidates(function (ids) {
            var n = 0;
            function next(last) {
                if (n >= ids.length) { onFailure(last); return; }
                var id = ids[n++];
                _launchHandler(id, {type: "install", file: ipkUrl, target: ipkUrl}, function () {
                    Mojo.Log.info("ARCHIVE-PATCH package handed to " + id);
                    onSuccess(id);
                }, function (r) {
                    Mojo.Log.info("ARCHIVE-PATCH handler " + id + " not available: " + Object.toJSON(r));
                    next(r);
                });
            }
            next({returnValue: false, errorText: "No application for .ipk files"});
        });
    }

    // -----------------------------------------------------------------------
    // AppInstallService.install — hand the package to the .ipk handler instead
    // of HP's service, whose signing servers are gone.
    // -----------------------------------------------------------------------
    Weave.Services.AppInstallService.install = function (app, callback) {
        var ipkUrl = app.packageUrl;
        Mojo.Log.info("ARCHIVE-PATCH install id=" + app.publicApplicationId);

        if (!ipkUrl) {
            callback(false, {errorText: "nopackageurl"});
            return;
        }

        _openIpkWithHandler(ipkUrl, function (handlerId) {
            callback(true);
            _watchForHandlerClose(app, handlerId);
        }, function (response) {
            Mojo.Log.error("ARCHIVE-PATCH no .ipk handler could be opened: " + Object.toJSON(response));
            callback(false, response);
        });
    };

    // -----------------------------------------------------------------------
    // TouchPad Exclusive badge in main-scene app list.
    // -----------------------------------------------------------------------
    var _origRendered = MainAssistant.prototype._renderedAppSummary;
    MainAssistant.prototype._renderedAppSummary = function (widget, model, node) {
        _origRendered.call(this, widget, model, node);
        if (model.touchpadExclusive) {
            var details = node.querySelector(".search-result-details");
            if (details && !details.querySelector(".archive-tp-badge")) {
                var badge = document.createElement("div");
                badge.className = "archive-tp-badge";
                badge.setAttribute("style",
                    "font-size:10px;font-weight:bold;color:#fff;" +
                    "background:#5a3080;padding:1px 5px;" +
                    "border-radius:2px;display:inline-block;margin-top:3px;");
                badge.textContent = "TouchPad Exclusive";
                details.appendChild(badge);
            }
        }
    };

    // -----------------------------------------------------------------------
    // Fetch live config for image / package hosts.
    // -----------------------------------------------------------------------
    archiveGet(API_BASE + "getConfig.php",
        function (cfg) {
            if (cfg.image_host)   { _imageBase   = "http://" + cfg.image_host + "/"; }
            if (cfg.package_host) { _packageBase = cfg.package_host; }
            Mojo.Log.info("ARCHIVE-PATCH config ok imageBase=" + _imageBase + " packageBase=" + _packageBase);
        },
        function () {}
    );

    Mojo.Log.info("ARCHIVE-PATCH loaded ok");

}());
