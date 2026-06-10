/* Copyright 2009 Palm, Inc.  All rights reserved. */


var PictureAssistant = Class.create({
	
	initialize : function(images, start) 
	{
		Mojo.Log.info("PictureAssistant.initialize", start, images[0]);
		
		this._images = [];
		var len = images.length;
		for (var i = 0; i < len; i++)
		{
			// Start the images loading as soon as we can
			var img = document.createElement('img');
			img.onload = (function() { this._loaded = true; }).bind(img);
			img.src = images[i];
			this._images.push(img);
		}
		
		this._pos = start;
	},

	setup: function() 
	{
/*
		Mojo.Log.info("PictureAssistant.setup");
		
		var container = this.controller.get('imageContainer');
		var images = this._images;
		var width = images.length * 320;
		var len = images.length;
		for (var i = 0; i < len; i++)
		{
			container.appendChild(images[i]);
		}

		this.controller.setupWidget(
			'imageScroller', 
			{},
			{
				mode: 'horizontal-snap',
				snapElements: {
					x: images,
					y: []
				},
				snapIndex: this._start
			}
		);
		
		container.style.width = width + 'px';
*/
		var scalingFactor = this.controller.window.zoomFactor || 1, scaledHeight, scaledWidth;
		this._imageLoaded = this._imageLoaded.bindAsEventListener(this);
		
		this._viewer = this.controller.get('imageContainer');
		scaledHeight = Math.floor(Mojo.Environment.DeviceInfo.screenHeight / scalingFactor);
		scaledWidth = Mojo.Environment.DeviceInfo.screenWidth / scalingFactor;
		this._viewer.style.height = scaledHeight + "px";
        this._viewer.style.width = scaledWidth + "px";
        
        console.log("APP CATALOG SCALING");
        console.log(scalingFactor);
        console.log(Mojo.Environment.DeviceInfo.screenHeight);
        console.log(Mojo.Environment.DeviceInfo.screenWidth);
						
		var self = this;
		this.controller.setupWidget(
			'imageContainer',
			{limitZoom: true},
			{
				backgroundImage: 'images/black.png',
				onLeftFunction: function() { self._needImage(-1); },
				onRightFunction: function() { self._needImage(1); },
				
			}
		);

		this._spinner = new Spinner(this, 'spinner', false, 'large');
	},

	cleanup: function() 
	{
		Mojo.Log.info("PictureAssistant.cleanup");
	},

	activate: function() 
	{
		Mojo.Log.info("PictureAssistant.activate");
		
		if (this.controller.window.PalmSystem)
		{
			this.controller.window.PalmSystem.enableFullScreenMode(true);
		}
		
		this._viewer.addEventListener(Mojo.Event.imageViewChanged, this._imageLoaded);
		
		this._needImage(0);
	},

	deactivate: function() 
	{
		Mojo.Log.info("PictureAssistant.deactivate");
		
		this._viewer.removeEventListener(Mojo.Event.imageViewChanged, this._imageLoaded);
		
		if (this.controller.window.PalmSystem)
		{
			this.controller.window.PalmSystem.enableFullScreenMode(false);
		}
	},
	
	_needImage: function(dir)
	{
		Mojo.Log.info("_needImage", this._pos, dir);
		
		if (this._getUrl(this._pos + dir)) 
		{
			this._pos += dir;
			
			if (!this._images[this._pos]._loaded) 
			{
				this._spinner.start();
			}
			
			switch (this._pos)
			{
				case 0:
					this._viewer.mojo.centerUrlProvided(this._getUrl(0));
					this._viewer.mojo.rightUrlProvided(this._getUrl(1));
					break;
					
				case 1:
					this._viewer.mojo.leftUrlProvided(this._getUrl(0));
					this._viewer.mojo.centerUrlProvided(this._getUrl(1));
					this._viewer.mojo.rightUrlProvided(this._getUrl(2));
					break;
					
				case 2:
					this._viewer.mojo.leftUrlProvided(this._getUrl(1));
					this._viewer.mojo.centerUrlProvided(this._getUrl(2));
                                        this._viewer.mojo.rightUrlProvided(this._getUrl(3));
					break;

                                case 3:
					this._viewer.mojo.leftUrlProvided(this._getUrl(2));
					this._viewer.mojo.centerUrlProvided(this._getUrl(3));
                                        this._viewer.mojo.rightUrlProvided(this._getUrl(4));
					break;

                                case 4:
					this._viewer.mojo.leftUrlProvided(this._getUrl(3));
					this._viewer.mojo.centerUrlProvided(this._getUrl(4));
					break;
			}
		}
	},
	
	_getUrl: function(idx)
	{
		return this._images[idx] ? this._images[idx].src : undefined;
	},
	
	_imageLoaded: function(event)
	{
		this._spinner.stop();
	}

});
