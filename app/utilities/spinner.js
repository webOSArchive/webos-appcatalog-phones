/* Copyright 2009 Palm, Inc.  All rights reserved. */

var Spinner = Class.create({
	
	initialize: function(sceneAssistant, id, start, size, scrim)
	{
		this._controller = sceneAssistant.controller;
		this._model =
		{
			spinning: false
		};
		this._controller.setupWidget(id,
			{
				spinnerSize: size ? size : 'small'
			},
			this._model
		);
		this._scrim = this._controller.get(scrim ? scrim : id + "Cont");
		this._state = 'stopped';
		if (start)
		{
			this.start();
		}
	},
	
	start: function()
	{
		if (this._scrim)
		{
			this._scrim.show();
		}
		this._fire('start');
	},
	
	stop: function()
	{
		this._fire('stop');
	},
	
	_fire: function(event)
	{
		Mojo.Log.info('Spinner event', event, 'state', this._state);
		var self = this;
		switch (this._state)
		{
			case 'stopped':
				switch (event)
				{
					case 'start':
						this._state = 'starting';
						this._timer = setTimeout(function() { self._fire('starting2sec'); }, 2000);
						break;
						
					case 'stop':
					case 'starting1sec':
					case 'running1sec':
						break;
				}
				break;
				
			case 'starting':
				switch (event)
				{
					case 'starting2sec':
						this._state = 'runningquick';
						this._model.spinning = true;
						this._controller.modelChanged(self._model);
						this._timer = setTimeout(function() { self._fire('running1sec'); }, 1000);
						break;
						
					case 'stop':
						clearTimeout(this._timer);
						this._state = 'stopped';
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
					case 'running1sec':
						break;
				}
				break;
				
			case 'runningquick':
				switch (event)
				{
					case 'running1sec':
						this._state = 'running';
						break;
						
					case 'stop':
						this._state = 'stopping';
						break;
						
					case 'start':
					case 'starting2sec':
						break;
				}
				break;
				
			case 'running':
				switch (event)
				{
					case 'stop':
						this._state = 'stopped';
						this._model.spinning = false;
						this._controller.modelChanged(this._model);
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
					case 'starting2sec':
					case 'running1sec':
						break;
				}
				break;
				
			case 'stopping':
				switch (event)
				{
					case 'running1sec':
						this._state = 'stopped';
						this._model.spinning = false;
						this._controller.modelChanged(this._model);
						if (this._scrim)
						{
							this._scrim.hide();
						}
						break;
						
					case 'start':
						this._state = 'running';
						break;
						
					case 'stop':
					case 'starting2sec':
						break;
				}
				break;
		}
	}
	
});
