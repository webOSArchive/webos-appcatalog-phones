/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Utilities.AppVersions =
{
	isNewAppVersionAvailable: function(installedVersion, latestVersion)
        {
            Mojo.Log.info("Weave.Utilities.AppVersions::isNewAppVersionAvailable - %s : %s", installedVersion, latestVersion);

            //Save the parse overhead by first just comparing the strings for exact match
            if (installedVersion !== latestVersion) {
                var i,
                    testVal,
                    parsedInstalledVersion = this.parseAppVersionNumber(installedVersion),
                    parsedLatestVersion    = this.parseAppVersionNumber(latestVersion),
                    plvLength;

                if (parsedInstalledVersion === false || parsedLatestVersion === false) {
                    Mojo.Log.error("Unable to parse one of these versions numbers: %s, %s", parsedInstalledVersion, parsedLatestVersion);
                    return false; //something is wrong with the version number format, bail out and assume no update.
                }

                plvLength = parsedLatestVersion.length;
                for(i=0; i<plvLength; i++) {
                    testVal =  (parsedInstalledVersion[i] === undefined) ? 0 : parsedInstalledVersion[i];
                    if (testVal > parsedLatestVersion[i]) {
                        //A newer version is installed locally
                        return false;
                    } else if (testVal < parsedLatestVersion[i]) {
                        //A newer verion is available
                        return true;
                    } else {
                        //This part of the version matches, keep checking...
                    }
                }

                //If here then no new version available
                return false;
            } else {
                return false;
            }
        },

        /**
         * Assumes the following rules are enforced upstream:
         * 1) No non-numeric characters outside of "." are in use
         * 2) "." is the version delimiter
         **/
        parseAppVersionNumber: function(version){
            Mojo.Log.info("Weave.Utilities.AppVersions::parseAppVersionNumber %s", version);

            var i,
                versionParts = [],
                versionSplit,
                vsLength,
                acceptablePattern = /^\d[.|\d]*$/;

            if (version === undefined || typeof(version) !== 'string' || acceptablePattern.test(version) === false) {
                return false;
            } else {
                versionSplit = version.split('.');
            }

            vsLength = versionSplit.length;
            for (i=0; i<vsLength; i++) {
                versionParts[versionParts.length] = parseInt(versionSplit[i], 10);
            }

            return versionParts;
        },

        checkForUpdates: function(installedAppList, callback)
        {
            Mojo.Log.info("Weave.Utilities.AppVersions::checkForUpdates");

            try {
                Weave.Services.AppCatalogServer.getUserSession(function(status) {
                    if (!status) {
                        Mojo.Log.error("Weave.Utilities.AppVersions::checkForUpdates - Error trying to get user session");
                    } else {
                        var appsToCheck = [],
                            appVersionLookupList = [];

                        //Build an array of apps to have the server check and an optimized lookup table
                        for (var i=0; i<installedAppList.length; i++) {
                            appsToCheck[appsToCheck.length] = installedAppList[i].publicApplicationId;
                            appVersionLookupList[installedAppList[i].publicApplicationId] = installedAppList[i].installedVersion;
                        }

                        Mojo.Log.info("getApplicationsLatestVersion: Checking for updates on %d install apps", appsToCheck.length);
                        Weave.Services.AppCatalogServer.getApplicationsLatestVersion(appsToCheck, function(status, appResult) {
                            var listOfAvailableUpdates = [];

                            if (status) {
                                Mojo.Log.info("DEVELOPER ENV:Got getApplicationsLatestVersion: apps: [%j]", appResult);

                                //Determine the number of available updates
                                if (appResult) {
                                    for (var a=0; a<appResult.length; a++) {
                                        var installedVersion = appVersionLookupList[appResult[a].publicApplicationId],
                                            serverVersion    = appResult[a].appVersion,
                                            updateAvailable  = Weave.Utilities.AppVersions.isNewAppVersionAvailable(installedVersion, serverVersion);

                                        if (updateAvailable === true) {
                                            Mojo.Log.info("@@@@@App update is available: %s. Update from %s to %s.", appResult[a].publicApplicationId, installedVersion, serverVersion);
                                            listOfAvailableUpdates[listOfAvailableUpdates.length] = appResult[a];
                                        }
                                    }
                                }


                                return callback(listOfAvailableUpdates);
                            } else {
                                Mojo.Log.error("DEVELOPER ENV:Fail to getApplicationsLatestVersion");
                            }
                        });
                    }
                });
            } catch (exception) {
                Mojo.Log.error("Weave.Utilities.AppVersions::checkForUpdates - Exception calling getUserSession: " + exception);
            }
        }
};
