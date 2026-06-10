/* Copyright 2009 Palm, Inc.  All rights reserved. */

Weave.Services.ApplicationInstaller = 
{
	_target: 'palm://com.palm.appinstaller',
	
	validateInstall: function(appid, size, uncomprSize, callback)
	{
		uncomprSize = (uncomprSize && uncomprSize != 0) ? Math.ceil(uncomprSize/1024): undefined;
		size = Math.ceil(size/1024);
		Mojo.Log.info("Weave.Services.ApplicationInstaller.validateInstall appid %s, size %s, uncomprSize %d", appid,size,uncomprSize );
		var self = this;
		this._pendingreq = Weave.Services.request(self._target, 
		{
			method: 'queryInstallCapacity',
			parameters: 
			{
				appId: appid,
				size: size,
				uncompressedSize: uncomprSize
			}
		},
		function(response)
		{
			if (response.result == 0 || response.result == 4  || PalmSystem.version.match("desktop")) 
			{
				callback(true);
			}
			else
			{
				Mojo.Log.error("Weave.Services.ApplicationInstaller.validateInstall failed %j", response);
				callback(false, response);
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.ApplicationInstaller.validateInstall failed %j", response);
			callback(false);
		});
	}
	
	/*installNoVerify: function(app, callback)
	{
		var state;
		Mojo.Log.info("Weave.Services.AppInstaller.installNoVerify payload %s, %s", app.id, app.ipkgUrl);
		var request = Weave.Services.subscriptionRequest(this._target, 
		{
			method: 'installNoVerify',
			parameters: {"target": app.ipkgUrl}
		},
		function(response)
		{
			Mojo.Log.info("Weave.Services.AppInstallService.install response %s,  %j", app.id, response);
			if(response.status){
				if (response.status === "STARTING") {
					state = "installing"
				}
				else 
					if (response.status === "SUCCESS") {
						state = "installed"
						request.cancel();
					}
					else if (response.status.indexOf("FAILED") >= 0) {
						state = "install failed"
						request.cancel();
					}
				
				callback(true, {"state": state});
			}
		},
		function(response)
		{
			Mojo.Log.error("Weave.Services.AppInstallService.install failed %s, %j", app.id, response);
			request.cancel();
			callback(false, response);
			
		});
			
	}*/
	
};
