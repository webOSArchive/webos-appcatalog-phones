var TermsAssistant = Class.create(
{
	initialize: function(callback)
	{
    	this.expanded = false;
		this.onTermsAccepted = callback;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup: function()
	{
    this.appMetrics.trackNewScene("terms");
		this.controller.listen("acceptTerms", Mojo.Event.tap, this.showMain.bindAsEventListener(this));
		this.controller.listen("declineTerms", Mojo.Event.tap, this.declineTerms.bindAsEventListener(this));
		
		this.controller.setupWidget('terms-box', {});  
		
		this.termsExpand = this.controller.get('terms-expand-div');
		this.termsCollapse = this.controller.get('terms-collapse-div');
		this.termsBox = this.controller.get('terms-box');
			
		this.expandTermsFunction = this.expandTermsFunction.bind(this);
		this.termsBox.addEventListener(Mojo.Event.tap, this.expandTermsFunction);
		this.termsBox.addEventListener(Mojo.Event.flick, this.expandTermsFunction);		

		// set touchable rows class
		this.controller.get('firstuse-main').down('.glass-card').addClassName('rows-'+ Mojo.Environment.DeviceInfo.touchableRows);
	},
	
	showPrivacyPolicy: function (event) 
	{
		this.controller.showDialog(
		{
			template: 'terms/privacy-dialog',
			assistant: new DialogAssistant(this)		
		});	  
	},	
	
	expandTermsFunction: function (event) 
	{
	    if ((event.target.nodeName === "A" && this.expanded) || (event.target.id == "palm-privacy-policy")) {
	      return;
	    }
	    
	    if (this.expanded) 
		{
	      	this.shrinkTerms();
	      	this.termsBox.addEventListener(Mojo.Event.flick, this.expandTermsFunction);
	    } 
		else 
		{
			this.termsBox.removeEventListener(Mojo.Event.flick, this.expandTermsFunction);      
	      	this.expandTerms();
	    }
	},
	
	expandTerms: function (event) 
	{
    	this.expanded = true;
		this.termsExpand.hide();
    	this.termsCollapse.show();
    	this.termsBox.addClassName('expanded');
	},
	
	shrinkTerms: function (event) 
	{
    	this.expanded = false;
		this.termsExpand.show();
    	this.termsCollapse.hide();
    	this.termsBox.removeClassName('expanded');
    	this.controller.sceneScroller.mojo.scrollTo(undefined, 0, false);
	},	
	
	showMain: function(event)
	{
		// Terms were accepted.  Save the cookie
    this.appMetrics.trackEvent("terms", "accepted");
		TermsOfUse.setAccepted();
		this.onTermsAccepted(true);
	},
	
	declineTerms: function(event)
	{
    this.appMetrics.trackEvent("terms", "declined");
		var message = $L("In order to download items in the Application Catalog, you must accept the Terms. If you decline, you cannot download items using the Application Catalog.");
		var self = this;
		var dialog = this.controller.showAlertDialog(
		{
			onChoose: function(value)
			{
				if(value == "accept") 
				{
					self.showMain();
				} 
				else
				{
					// close the app
					self.onTermsAccepted(false);
				}
			},
			title: $L("Really decline?"),
			message: message,
			choices: [
				{label:$L('Accept terms'), value:"accept"},  
        		{label:$L("Decline terms"), value:"decline"}
			]
		});
	}
	
});

var DialogAssistant = Class.create(
{
	initialize: function(sceneAssistant) 
	{
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;	
	},
	
	setup : function(widget) 
	{
		this.widget = widget;
		this.dismissButton = this.controller.get("dismissButton");
        this.dismissButton.addEventListener(Mojo.Event.tap, this.closeDialog.bind(this));
	},	
	
	closeDialog: function(event) 
	{
		this.widget.mojo.close();
	}
});
