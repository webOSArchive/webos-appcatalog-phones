var ResetEmailAssistant = Class.create({
	
	initialize: function(sceneAssistant) {
		this.sceneAssistant = sceneAssistant;
		this.controller = sceneAssistant.controller;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
	setup : function(widget) {
    this.appMetrics.trackNewScene("reset_email");
		this.widget = widget;
		this.controller.get("emailAddress").update(myProfile.email);
		this.controller.listen("doneResetEmail", Mojo.Event.tap, this.doneResetEmail.bindAsEventListener(this));
	},
		
	doneResetEmail: function(event) {
		this.widget.mojo.close();
	}
	
});
