/**
 * The Activator manage the dispatch of incoming launch commands.
 * 'Interfaces' (literals of functions) are attached to the Activator
 * together with the interface name and the target stage.  Then a command
 * is 'run', the format of the arguments is used to locate the relevant interface,
 * launch the stage if necessary, and dispatch the contains arguments to the
 * methods named in the parameters.  The command format is:
 *   { interfacename: { methodname: { ... arguments .... } }
 * If no parameters are present, then the 'main' interface is called.  If the
 * stage is created, it calls the 'start' method, if not it calls the 'restart'
 * method.
 
Copyright 2009 Palm, Inc.  All rights reserved.

*/
Weave.System.Activator = 
{	
	_inames: {},
	
	addInterface: function(name, iface)
	{
		this._inames[name] = iface;
	},
	
	run: function(params)
	{
		// there is only one param
		var self = this;
		var done = false;
		for (var k in params) 
		{
			// this runs only once
			iface = this._inames[k];
			if (iface)
			{
				iface.init(params[k]);
				done = true;
			}
		}
		if(!done){
			iface = this._inames["main"];
			if (iface)
			{
				iface.init("");
				done = true;
			}
		}
	},
	
	open: function(stageName, stageAssistantName, callback)
	{
		Mojo.Log.info("Activator.open stage ", stageName, stageAssistantName);
		if (stageName == null) 
		{
			callback && callback(null);
		}
		else 
		{
			var stage = Mojo.Controller.appController.getStageController(stageName);
			if (stage) 
			{
				callback && callback(stage.assistant);
				//bring stage to focus if existing stage
				stage.activate();
			}
			else 
			{
				var self = this;
				Mojo.Controller.appController.createStageWithCallback(
				{
					lightweight: true,
					name: stageName,
					assistantName: stageAssistantName
				}, 
				function(stage)
				{
					Mojo.Log.info("Activator.open stageAssistant: %s callback ", stage.assistant.stageName);	
					callback && callback(stage.assistant);
				});
			}
		}
	},
	
	close: function(name)
	{
		Mojo.Controller.appController.closeStage(name);
	},
	
	// returns active stage controller that is not dashboard
	getActiveStageController: function(tryDefault)
	{
		var stage = Mojo.Controller.appController.getActiveStageController();
		if (!stage && tryDefault)
		{
			stage = Mojo.Controller.appController.getStageController("default");
		}
		
		return stage;
	}
};
