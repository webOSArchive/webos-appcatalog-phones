/* Copyright 2009 Palm, Inc.  All rights reserved. */

if (window == window.top) 
{
	var Weave = Weave || {};
	
	(function()
	{
		function load(config)
		{
			for (var prefix in config) 
			{
				if (prefix) 
				{
					Weave[prefix.charAt(0).toUpperCase() + prefix.substring(1)] = {};
				}
			}
		}
		
		load(
		{
			system:		['activator'],
			services:	['services', 'accountservices', 'applicationinstaller', 'applicationmanager', 'catalogserver', 'applicationserver', 'browser', 'connectionmanager', 
						 'deviceprofile', 'appinstallservice', 'systemmanager', 'systemproperties', 'paymentserver'],
			utilities:	['regexp', 'appmenu', 'appversions', 'appcategorieshelper'],
			download:	['downloadstates', 'appdetails', 'appdownload', 'appdownloadmanager']
		});
		
	})();
}