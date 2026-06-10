function GoogleAnalytics(accountId) {
  var self = {};
  var hasNetConnection = false;
  var trackings = [];


  self.trackPageview = function(pageName) {
    Mojo.Log.info("GoogleAnalytics#trackPageView(%s) on %s", pageName, self.accountId);
    trackOrSaveForWhenThereIsAConnection(['_trackPageview', pageName]);
  };

  self.setAccountId = function(accountId) {
    Mojo.Log.info("GoogleAnalytics#setAccountId(%s)", accountId);
    self.accountId = accountId;
    trackOrSaveForWhenThereIsAConnection(['_setAccount', self.accountId]);
    trackOrSaveForWhenThereIsAConnection(['_trackPageview', '/']);
  }

  self.trackEvent = function() {
    Mojo.Log.info("GoogleAnalytics#trackEvent");
    var event = ['_trackEvent'];
    event.push.apply(event, arguments);
    trackOrSaveForWhenThereIsAConnection(event)

    ensureArugment(arguments[2], 'label', 'string');
    ensureArugment(arguments[3], 'value', 'number');
  };

  self.setInternetConnection = function(value) {
    Mojo.Log.info("GoogleAnalytics#setInternetConnection(%s)", value);
    hasNetConnection = value;

    if (hasNetConnection && trackings.length > 0) {
      trackings.forEach(function(tracking) {
                           Mojo.Log.info("GoogleAnalytics#setInternetConnection: FLUSHED ITEM [%s, %s]", tracking[0], tracking[1]);
                          _gaq.push(tracking);
                       });
    }
  };

  self.hasInternetConnection = function() {
    return hasNetConnection;
  };

  return self;

  function trackOrSaveForWhenThereIsAConnection(item) {
    if (hasNetConnection) {
      Mojo.Log.info("GoogleAnalytics#trackOrSaveForWhenThereIsAConnection: PUSHED ITEM [%s, %s]", item[0], item[1]);
      _gaq.push(item);
    } else {
      Mojo.Log.info("GoogleAnalytics#trackOrSaveForWhenThereIsAConnection: INTERNET BROKEN");
      trackings.push(item);
    }
  }

  function ensureArugment(arg, name, type) {
    if (arg != undefined && typeof arg != type) {
      console.error('GoogleAnalytics#trackEvent: '+ name + ' must be a ' + type + ' - event will not be tracked')
    }
  }

}
