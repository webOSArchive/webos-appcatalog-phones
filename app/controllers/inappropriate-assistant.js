/* Copyright 2009 Palm, Inc.  All rights reserved. */

var InappropriateAssistant = Class.create({
	
    initialize: function(params)
	{
		this._details = params.appDetails;
    this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
	},
	
    setup: function()
	{
    this.appMetrics.trackNewScene("inappropriate");
		var self = this;
		this._addReview = this._addReview.bindAsEventListener(this);

		this.controller.get('txt-fa-in-title').innerText = this._details.title;
		this.controller.get('txt-fa-in-subtitle').innerText = this._details.creator;
		this.controller.get('img-fa-in-appIcon').style.backgroundImage = 'url(' + this._details.appIcon + ')';
        
        this.controller.setupWidget(
            'txt-fa-in-comment', 
            {
                focus: true,
                enterSubmits: false,
                multiline: true,
                modifierState: Mojo.Widget.steModeSentenceCase,
                focusMode: Mojo.Widget.focusInsertMode,
                requiresEnterKey: false,
                changeOnKeyPress: false
            }
        );
		
		this._problemTypeModel = {problemType: '1'};
		this._problemTypes = [{label: $L('Bug'), value:'1'},
								  {label: $L('Offensive Content'), value:'2'},
								  {label: $L({key: 'download-verb', value: 'Download'}), value:'3'},
								  {label: $L('Installation'), value:'4'},
								  {label: $L('Payment'), value:'5'},
								  {label: $L('Legal Issue'), value:'6'},
								  {label: $L('Other'), value:'7'}];
								
		this.controller.setupWidget('problemTypeSelector', {label: "", choices: this._problemTypes, modelProperty:'problemType'}, this._problemTypeModel);
		
		
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);
		
		// Set up a command menu
		this.controller.setupWidget(Mojo.Menu.commandMenu, 
		{
			menuClass: 'no-fade'
		}, {
			items: [
				{},
				{},
				{
	                label: $L('Send'),
	                command: 'addreview',
					icon: 'send'
	            },
			]
		});
		 Weave.Services.AccountServices.getAccountInfo(function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("CommentsAssistant.setup getAccountInfoGot response %j", response);
				self._firstName = response.firstName;
				self._lastName = response.lastName;
			}
		});
    },
	
	activate: function()
	{
		//this.controller.get('addreview').addEventListener(Mojo.Event.tap, this._addReview);
	},
	
	deactivate: function()
	{
		//this.controller.get('addreview').removeEventListener(Mojo.Event.tap, this._addReview);
	},
	
	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.command && event.command == 'addreview')
		{
			this._addReview(event);
		}
	},
	
	_addReview: function(event)
	{
		var self = this;
		Weave.Services.ApplicationServer.addUserComment(this._details.appid, this._details.packageid, this.controller.get('txt-fa-in-comment').mojo.getValue(), 0, Mojo.Locale.current, this._firstName + " " +this._lastName, false, true, this._problemTypeModel.problemType, function(status, response)
		{
			if (status) 
			{
				self._nextScene();
			}
			else
			{
				// ignore errors here
				// Utilities.Errors.displayError(response);
				self.controller.showAlertDialog(
				{
			    	onChoose: function(value)
					{
						if (value == "ok")
							self._nextScene();
					},
					title: $L("Error"),
				    message: $L("Could not submit your report at this time. Try again later."), 
				    choices:
					[
						{label:$L('OK'), value:'ok'}
				    ]
			  	});
			}
		});
	},
	
	_nextScene: function()
	{
		var detailSceneExists = false;
		var sceneStack = this.controller.stageController.getScenes();
		if (sceneStack.size() == 1) 
		{
			this.controller.stageController.swapScene({name: "main", disableSceneScroller: true});
		}
		else{
			this.controller.stageController.popScene();
		}
	}
});
