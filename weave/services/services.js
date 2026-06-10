/**
 * Services provides a basic garbage-collector safe wrapper round the standard service 
 * requests.
 
Copyright 2009 Palm, Inc.  All rights reserved.

*/
Object.extend(Weave.Services,
{	
	_pending: {},
	_next: 1,
	
	request: function(target, args, success, failure)
	{
		var id = this._next++;
		var pending = this._pending;
		args.onSuccess = function(response)
		{
			delete pending[id];
			success && success(response);
		};
		args.onFailure = function(response)
		{
			delete pending[id];
			failure && failure(response);
		};
		pending[id] = new Mojo.Service.Request(target, args);
		return pending[id];
	},
	
	subscriptionRequest: function(target, args, success, failure)
	{
		var id = this._next++;
		var pending = this._pending;
		args.onSuccess = function(response)
		{
			success && success(response);
		};
		args.onFailure = function(response)
		{
			failure && failure(response);
		};
		args.parameters = Object.extend(args.parameters || {}, {subscribe: true});
		
		pending[id] = new Mojo.Service.Request(target, args);
		return pending[id];
	},
	
	
	// called on application cleanup to delete any
	// pending requests
	cleanup: function()
	{
		
	}
	
});
