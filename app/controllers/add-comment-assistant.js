/* Copyright 2009 Palm, Inc.  All rights reserved. */

var AddCommentAssistant = Class.create({
	//params should ahve following format
	//{appId:, packageId:, appDetails:, firstname:, lastname:}
    initialize: function(params)
	{
		Mojo.Log.info("AddCommentAssistant::initialize :%j", params);
      this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
			this._appid = params.appDetails.appid;
			this._packageid = params.appDetails.packageid;
			this._details = params.appDetails;
			this._myRating = params.myRating;
			this._stars = 0;
		if (params.firstName && params.lastName) {
			this._NamePassedIn = true;
			this._firstName = params.firstName;
			this._lastName = params.lastName;
		}
	},
	
    setup: function()
	{
    // Google Analytics
    this.appMetrics.trackNewScene('comment/'+this._appid);

		var self = this;
		this._spinner = new Spinner(this, 'spinner', false, 'large');
		
		// create new app details object that will be shared between
		// details & comments scenes, if one was not passed in
		if (!this._NamePassedIn) 
		{
			
			Mojo.Log.info("AddCommentAssistant._NamePassedIn :%s", this._packageid);
			this._spinner.start();
			Weave.Services.AccountServices.getAccountInfo(function(status, response)
			{
				
				if (status)
				{
					Mojo.Log.info("AddCommentsAssistant.setup getAccountInfo Got response %j", response);
					self._firstName = response.firstName;
					self._lastName = response.lastName;
					if(self._myRating !== undefined)
						self.updateDetails(false);
					else{
						Mojo.Log.info("AddCommentsAssistant myrating not defined ");
						Weave.Services.ApplicationServer.getMyComment(self._appid, self._packageid, function(status, review)
						{
							if (status)
							{
								self._myRating = review;
								self.updateDetails(false);
							}
							else{
								self._spinner.stop();
								Utilities.Errors.displayError(review);
							}
						});
					}
				}
				else{
					Mojo.Log.error("Error getAccountInfo Got response %j", response);
					self._spinner.stop();
					Utilities.Errors.displayError(response);
				}
			});
		}
		else if (self._myRating === undefined)
		{
			Weave.Services.ApplicationServer.getMyComment(self._appid, self._packageid,function(status, review)
			{
				if (status)
				{
					self._myRating = review;
					self.updateDetails(false);
				}
				else{
					self._spinner.stop();
					Utilities.Errors.displayError(review);
				}
			});
		}
		
		
		this._changeStars = this._changeStars.bindAsEventListener(this);
		this._addCommentPage = this.controller.get('addCommentPage');
		
		this._sendButton = {
								visible : false,
								items: [
									{},
									{},
									{
						                label: $L('Save'),
						                command: 'addreview',
										icon: 'send'
						            },
								],
							}
		// Set up a command menu
		this.controller.setupWidget(Mojo.Menu.commandMenu, 
		{
			menuClass: 'no-fade', 
		}, this._sendButton);
		
    },
	
	ready: function(){
		
		// we are ready to update widgets
		if (this._NamePassedIn && this._myRating !== undefined)
				this.updateDetails(true);
	},
	
	activate: function()
	{
		
	},
	
	deactivate: function()
	{
		this._starGroup.removeEventListener('mouseover', this._changeStars);
	},
	
	updateDetails: function(selfCalled){
		if(!selfCalled && this._spinner)
			this._spinner.stop();
		Mojo.Log.info("AddCommentAssistant.updateDetails");
		if (this._details != null) 
		{
			
			Mojo.Log.info("AddCommentAssistant.updateDetails details %j", this._details);
			//this._appDownload.updateFromServer(this._details)
			//this._myRating = this._appDetails.getMyRating();
			this._stars = 0;
			this._rebuildFromModel();
		}
		
	},
	
	_rebuildFromModel: function(model){
		
		// Render
		this.controller.update(this._addCommentPage, Mojo.View.render(
		{
			template: "add-comment/add-comment-all",
			object: model
		}));
		
		this.controller.get('title').innerText = this._details.title;
		this.controller.get('subtitle').innerText = this._details.creator || '';
		this.controller.get('icon').style.backgroundImage = 'url(' + this._details.appIcon + ')';
        this.controller.setupWidget(
            'add_comment_subject', 
            {
                hintText: $L('Enter title...'),
                modifierState: Mojo.Widget.steModeSentenceCase,
                focusMode: Mojo.Widget.focusInsertMode,
            }
        );
		this._commentSubject = this.controller.get('add_comment_subject');
        
        this.controller.setupWidget(
            'add_comment_body', 
            {
                hintText: $L('Enter review here...'),
                focus: true,
                multiline: true,
                modifierState: Mojo.Widget.steModeSentenceCase,
                focusMode: Mojo.Widget.focusInsertMode,
            },
			{
				value: this._myRating != null ? this._myRating.comment : ""
			}
        );
		this._commentBody = this.controller.get('add_comment_body');
		
		this._starGroup = this.controller.get('stars');
		var stars = [];
		for (var child = this._starGroup.firstChild; child; child = child.nextSibling)
		{
			if (child.tagName == 'IMG')
			{
				stars.push(child);
			}
		}
		this._stars = stars;
		this._setAverageStars();
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);

                //Restore previous selection as needed
                var commentAsSelection,
                    commentAsFullname     = this._firstName + ' ' + this._lastName,
                    commentAsFirstinitial = this._firstName + ' ' + this._lastName.substring(0, 1);

                if (this._myRating !== null && this._myRating !== undefined && this._myRating.creator !== undefined) {
                    //Override default selection as needed
                    if (this._myRating.creator === commentAsFullname) {
                        commentAsSelection = "fullname";
                    } else {
                        commentAsSelection = "firstinitial";
                    }
                } else {
                    commentAsSelection = "firstinitial"; //default for new review
                }

		this._commentorModel = 
		{
			choices:
			[
				{label: commentAsFullname, value: "fullname"},
				{label: commentAsFirstinitial, value: "firstinitial"}
			],
			commentAs: commentAsSelection
		};
		this.controller.setupWidget('commentasSelector', {label:"", modelProperty: "commentAs"}, this._commentorModel);
		
		this._starGroup.addEventListener('mouseover', this._changeStars);
		this.controller.instantiateChildWidgets(this.controller.get("comment-container"));
		this._sendButton.visible = true;
		this.controller.modelChanged(this._sendButton);
	},
	
	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.command && event.command == 'addreview')
 		{
			var score = this._stars.value < 0 ? 0 : this._stars.value;	
			if (score == 0) 
			{
				// ask user to set the score
				var self = this;
				this.controller.showAlertDialog(
				{
					title: $L("App Rating"),
				    message: $L("Rate the application by tapping the stars."), 
				    choices: [{ label: $L("OK"), value: true, type: 'dismiss' }]
			  	});
			}
			else 
			{
				this._addReview(event);
			}
 		}
	},
	
	_addReview: function(event)
	{	
		var comment = this._commentBody.mojo.getValue();
		var score = this._stars.value < 0 ? 0 : this._stars.value;
		var isAnonymous = (this._commentorModel.commentAs == "anonymous");
		var accountId;
		
		if (!isAnonymous)
		{
			for (var i = 0; i < this._commentorModel.choices.length; i++)
			{
				if (this._commentorModel.choices[i].value == this._commentorModel.commentAs)
				{
					accountId = this._commentorModel.choices[i].label;
					break;
				}
			}
		}
	
		
		var self = this;
		Mojo.Log.info("AddCommentAssistant._addReview sending: %s, %s,%s,%s ", comment, score, isAnonymous, this._details.appid);
		Weave.Services.ApplicationServer.addUserComment(this._details.appid, this._details.packageid, comment, score, Mojo.Locale.current, accountId, isAnonymous, false, undefined, 
		function(status, response)
		{
			if (status) 
			{
				
				self._nextScene();
			}
			else
			{
				self.controller.showAlertDialog(
				{
			    	onChoose: function(value){},
					title: $L("Error"),
				    message: $L("Could not submit your review at this time. Try again later."), 
				    choices:
					[
						{label:$L('OK'), value:'ok'}
				    ]
			  	});
			}
		});
    this.appMetrics.trackEvent("comment", "added", this._details.appid);
	},
	
	_setAverageStars: function()
	{
		var rating = this._myRating != null ? this._myRating.score : 0;
		var halfstars = Math.round(rating * 2);
		var stars = this._stars;
		
		for (var i = 0; i < 5; i++) 
		{
			stars[i].src = this._formatStar(halfstars, i);
		}
		stars.value = rating;
	},
	
	_formatStar: function(halfstars, idx)
	{
		halfstars -= 2 * idx;
		if (halfstars > 0)
		{
			if (halfstars > 1)
			{
				return 'images/star-xl-yellow-full.png';
			}
			else
			{
				return 'images/star-xl-yellow-half.png';
			}
		}
		else
		{
			return 'images/star-blue-empty.png';
		}
	},
	
	_changeStars: function(event)
	{
		var target = event.target;
		var stars = this._stars;
		for (var i = 0; i < 5; i++) 
		{
			if (stars[i] == target) 
			{
				stars.value = i + 1;
				for (var j = 0; j < 5; j++) 
				{
					if (j <= i) 
					{
						stars[j].src = 'images/star-blue-full.png';
					}
					else 
					{
						stars[j].src = 'images/star-blue-empty.png';
					}
				}
				break;
			}
		}
	},
	_nextScene: function()
	{
		var detailSceneExists = false;
		var sceneStack = this.controller.stageController.getScenes();
		if (sceneStack.size() == 1) 
		{
			this.controller.stageController.swapScene({name: "main", disableSceneScroller: true});
      Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_from", "comments");
      Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_to", "main");
		}
		else{
			this.controller.stageController.popScene();
      Mojo.Controller.getAppController().assistant.appMetrics.trackEvent("exit_from", "comments");
		}
	}
});
