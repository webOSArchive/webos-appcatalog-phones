/* Copyright 2009 Palm, Inc.  All rights reserved. */

var CommentsAssistant = Class.create({

	initialize : function(appDetails, myRating) 
	{
		
		this._appDetails = appDetails;
		//this._myRating = myRating;
		this._appDownload = Catalog.AppDownloadMngr.getAppDownload(appDetails._packageid, this);
		this._defaultNrUserComments = 25;
		
	},

	setup: function() 
	{
		Mojo.Log.info("CommentsAssistant.setup");
		this._appDetails.attach(this);
		
		this._commentsHead = this.controller.get('commentsHead');
		this._commentsList = this.controller.get('commentsList');
		
		this.controller.setupWidget('commentsList',
			{
				itemTemplate: 'comments/comments-item', 
				itemsCallback: this._commentItemsCallback.bind(this),
				formatters: {
					dummy: this._formatComment.bind(this)
				}
			},
			{}
		);
		
		// Only add the update button if we can review
		this._newUpdateModel =
		{
			items:
			[
				{
					label: this._myRating != null ? $L('Update') : $L('Review'),
					command: 'new',
					disabled: true
				},
				{},
				{
					label: $L('Share'),
					submenu: 'share-menu'
				}
			]
		}
			
		
		this.controller.setupWidget(Mojo.Menu.commandMenu, {menuClass: 'no-fade'}, this._newUpdateModel);
		
		this._shareMenuModel = {label: $L('Share'), 
								items: [{label: $L('Email'), command:'email'}, 
								        {label: $L('Text Message'), command:'text' }]
							   };
										
		this.controller.setupWidget('share-menu', undefined, this._shareMenuModel);
		
		// Menus
		Weave.Utilities.AppMenu.useDefault(this);
		
		this._spinner = new Spinner(this, 'spinner', true, 'large');
		
		var self = this;
		Weave.Services.AccountServices.getAccountInfo(function(status, response)
		{
			if (status)
			{
				Mojo.Log.info("CommentsAssistant.setup getAccountInfoGot response %j", response);
				self._firstName = response.firstName;
				self._lastName = response.lastName;
				self._newUpdateModel.items[0].disabled = !self._allowReview();
				self.controller.modelChanged(self._newUpdateModel);
			}
			else
			{
				// Error
			}
		});
		
		this._renderAppRating();
	},
	
	cleanup: function() 
	{
		this._appDetails.detach(this);		
		Catalog.AppDownloadMngr.releaseAppDownload(this._appDetails._packageid, this);
	},

	activate: function() 
	{
		var self = this;
		Mojo.Log.info("CommentsAssistant.activate");
		Weave.Services.ApplicationServer.getMyComment(self._appDetails._appid, self._appDetails._packageid,function(status, review)
		{
			if (status)
			{
				Mojo.Log.info("CommentsAssistant.got myrating %j", review);
				self._myRating = review;
				self.updateMyRating();
			}
			else{
				Mojo.Log.error("CommentsAssistant.got myrating %j", review);
				Utilities.Errors.displayError(review);
			}
		});
	},

	deactivate: function() 
	{
		Mojo.Log.info("CommentsAssistant.deactivate");
	},
	
	handleCommand: function(event)
	{
		if (event.type == Mojo.Event.command && event.command == 'new')
		{
			this._newComment();
		}
 		Utilities.Common.handleCommand(event, this._appDetails);
 	},
	
	_commentItemsCallback: function(widget, offset, count)
	{
		var self = this;
		var details = this._appDetails.getDetails();
		Weave.Services.ApplicationServer.getUserComments(details.id, offset, this._defaultNrUserComments, function(status, comments, total)
		{
			Mojo.Log.info("callback %d %j", status, comments);
			self._spinner.stop();
			if (status)
			{
				widget.mojo.noticeUpdatedItems(offset, comments);
				if (widget.mojo.getLength() != total)
				{
					widget.mojo.setLength(total);
				}
				self.controller.get('haveNoReviews').style.display = (total == 0 ? 'block' : 'none');
			}
			else
			{
				// Error
				Utilities.Errors.displayError(comments);
			}
		});
	},
	
	_formatComment: function(dummy, model)
	{
		model.formattedDate = model.creationtime ? Mojo.Format.formatDate(Utilities.UTCDate.parse(model.creationtime), { date: 'short' }) : '';
		model.formattedCreator = (model.isAnonymous ? $L('Anonymous') : model.creator);
	},
	
	// Observer method for application details changes
	updateDetails: function()
	{
		Mojo.Log.info("CommentsAssistant.updateDetails");
		this._renderAppRating();
		
		// refresh comments from the server
		var len = this._commentsList.mojo.getLength();
		this._commentsList.mojo.setLengthAndInvalidate(len == 0 ? 1 : len);
		
		this._spinner.start();
	},
	
	// Observer method for download state changes
	// if application got installed allow user to submit a review
	updateDownloadState: function() 
	{
		Mojo.Log.info("CommentsAssistant.updateDownloadState");
		this._renderReviewButton();
	},
	
	// Observer method for my rating changes
	updateMyRating: function() 
	{
		Mojo.Log.info("CommentsAssistant.updateMyRating");
		this._renderMyRating();
		this._renderReviewButton();
	},
	
	_renderAppRating: function()
	{
		var model = this._appDetails.getDetails();
		var halfstars = Math.round(model.averageRating * 2);
		model.formattedStar1 = this._formatStar(halfstars, 0);
		model.formattedStar2 = this._formatStar(halfstars, 1);
		model.formattedStar3 = this._formatStar(halfstars, 2);
		model.formattedStar4 = this._formatStar(halfstars, 3);
		model.formattedStar5 = this._formatStar(halfstars, 4);
		
		// Fixup rating plural
		model.pluralRating = Mojo.Format.formatChoice(model.cntRating, $L("1##{cntRating} rating|##{cntRating} ratings"), model);
		this.controller.update(this._commentsHead, Mojo.View.render({ template: "comments/comments-all", object: model }));
	},
	
	_renderReviewButton: function()
	{
		this._newUpdateModel.items[0].label = this._myRating != null ? $L('Update') : $L('Review'),
		this._newUpdateModel.items[0].disabled = !this._allowReview();
		this.controller.modelChanged(this._newUpdateModel);	
	},
	
	_renderMyRating: function()
	{
		// TODO move my review into template
		var myReview = this._myRating;
		if (myReview)
		{
			this._formatComment(null, myReview);
			this.controller.get('myreview_date').innerHTML = myReview.formattedDate;
			this.controller.get('myreview_creator').innerHTML = myReview.formattedCreator;
			this.controller.get('myreview_comment').innerHTML = myReview.comment;
			this.controller.get('myreview_rating').src = "images/stars-" + myReview.score + ".png";
			this.controller.get('myReview').style.display = "block";
		}
		else 
		{
			this.controller.get('myReview').style.display = "none";
		}
	},
	
	_formatStar: function(halfstars, idx)
	{
		halfstars -= 2 * idx;
		if (halfstars > 0)
		{
			if (halfstars > 1)
			{
				return 'full';
			}
			else
			{
				return 'half';
			}
		}
		else
		{
			return 'empty';
		}
	},
	
	_newComment: function()
	{
		Mojo.Log.info("CommentsAssistant._newComment");
		var params = {};
		params.appDetails = {};
		params.appDetails.title = this._appDetails.getDetails().title;
		params.appDetails.creator = this._appDetails.getDetails().creator;
		params.appDetails.appIcon = this._appDetails.getDetails().appIcon;
		params.appDetails.appid = this._appDetails._appid;
		params.appDetails.packageid = this._appDetails._packageid;
		params.firstName = this._firstName;
		params.lastName = this._lastName;
		params.myRating = this._myRating;
		this.controller.stageController.pushScene('add-comment', params);
	},
	
	_allowReview: function()
	{
		Mojo.Log.info("CommentAssistant._allowReview myRating: %j, installed %s", this._myRating, this._appDownload.isInstalled());
		if ((this._myRating != null || this._appDownload.isInstalled()) &&
			(this._firstName || this._lastName))
		{
			Mojo.Log.info("CommentAssistant._allowReview returning true"); 
			return true;		
		}
		Mojo.Log.info("CommentAssistant._allowReview returning false"); 
		return false;	
	}
	
})
