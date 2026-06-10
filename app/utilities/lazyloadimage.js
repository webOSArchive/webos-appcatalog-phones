/* Copyright 2009 Palm, Inc.  All rights reserved. */

var LazyLoadImage = Class.create(
{
	initialize: function(url, target)
	{
		var img = document.createElement('img');
		img.onload = function()
		{
			this.onload = undefined; // Remove the listener (in case of GC broken-ness)
			target.style.backgroundImage = 'url(' + this.src + ')';
		};
		img.src = url;
	}
});
