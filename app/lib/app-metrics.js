function AppMetrics(accountId, depot) {
  var self = {};
  var googleAnalytics = new GoogleAnalytics(accountId);

  self.setInternetConnection = function(status) {
    googleAnalytics.setInternetConnection(status);
  };

  self.setAccountId = function(accountId) {
    googleAnalytics.setAccountId(accountId);
  };

  self.trackEvent = function() {
    googleAnalytics.trackEvent.apply(googleAnalytics, arguments);
  };

  self.trackLaunch = function(appVersion) {
    googleAnalytics.trackEvent('Launch', 'Version', appVersion);
  };

  self.trackNewScene = function(sceneName) {
    googleAnalytics.trackPageview(sceneName);
  };

  self.trackRegistration = function(appVersion) {
    if (!depot) {
      return;
    }
    
    depot.get(AppMetrics.registrationKey, trackIfNotRegistered, track);

    function trackIfNotRegistered(registeredVersion) {
      if (registeredVersion != appVersion) {
        track();
      }
    }

    function track() {
      self.trackEvent('Registration', appVersion);
      depot.add(AppMetrics.registrationKey, appVersion, doNothing, doNothing);
    }

  };

  return self;

  function doNothing() {}
}

AppMetrics.registrationKey = 'AppMetrics__Registration';
