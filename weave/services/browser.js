/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationManager.Browser =
{
	openPage: function(url)
	{
		Weave.Services.ApplicationManager.openApplication('com.palm.app.browser', { target: url });
	}
	
};