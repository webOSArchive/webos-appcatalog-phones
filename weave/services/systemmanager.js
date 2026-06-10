/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.SystemManager =
{
	_target: 'palm://com.palm.systemmanager',
	_unlockcount: 0,
	
	_startup: function()
	{
		if (PalmSystem.version.match("desktop")) 
		{
			// Simulator is always unlocked
		}
		else 
		{
			var self = this;
			var first = true;
			this._getstatusreq = Weave.Services.request(this._target, 
			{
				method: 'getLockStatus',
				parameters: 
				{
					subscribe: true
				}
			},
			function(response)
			{
				if (!first) 
				{
					self._unlockcount++;
				}
				first = false;
			});
		}
	},
	
	hasScreenLocked: function(state, callback)
	{
		if (!this._getstatusreq)
		{
			this._startup(undefined, false);
		}
		if (state._count == undefined || state._count == this._unlockcount)
		{
			state.locked = false;
		}
		else
		{
			state.locked = true;
		}
		state._count = this._unlockcount;
		callback(true, state);
	}
	
};