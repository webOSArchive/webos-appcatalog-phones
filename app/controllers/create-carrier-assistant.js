/* Copyright 2009 Palm, Inc.  All rights reserved. */

var CreateCarrierAssistant = Class.create({
    initialize: function(params){
        this.params = params || {};
        this._appid = params.appid;
        this._obinfo = this.params.obInfos || {};
        this.isEditMode = this.params.edit;
        this._invoiceEmail = params.email;

        myProfile.validPayment = undefined;
    },
    
    setup: function(){
    	Mojo.Log.info("### Carrier setup()");

        this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");
        
        this._spinner = new Spinner(this, 'spinner', false, 'large');
        this._enableDisableSave = this._enableDisableSave.bindAsEventListener(this);
        this._validateAndSubmit = this._validateAndSubmit.bindAsEventListener(this);
		
		this.changeInvoiceEmailHandler = this.handleChangeInvoiceEmail.bind(this);
        
        this.spinOn();

    	this._setupBillCountry();
        
        if (this.isEditMode) {
            this.controller.get("accountTitle").update($L("Edit Carrier Payment"));
		} else {
			this.controller.listen("invoiceEmail", Mojo.Event.propertyChange, this.changeInvoiceEmailHandler);
            this.controller.get("accountTitle").update($L("Setup Carrier Payment"));
		} 
        
        this.resetForm = this._resetForm.bind(this);
    },
    
    cleanup: function(){
        this._addedPrefs !== true && this.controller.document.body.removeClassName("prefs");
        this.controller.stopListening("billCountryListSelector", Mojo.Event.propertyChange, this.resetForm);
		this.controller.stopListening("invoiceEmail", Mojo.Event.propertyChange, this.changeInvoiceEmailHandler);
    },
    
    activate: function(){
        this.controller.document.addEventListener(Mojo.Event.keyup, this._enableDisableSave, true);
    },
    
    deactivate: function(){
        this.controller.document.removeEventListener(Mojo.Event.keyup, this._enableDisableSave, true);
    },
    
    handleCommand: function(event){
        if (event.type == Mojo.Event.back) {
            event.preventDefault();
            event.stopPropagation();
            this.controller.stageController.popScene();
        }
    },
    
    spinOn: function(){
        this._spinner.start();
    },
    
    spinOff: function(){
        this._spinner.stop();
    },
    
    cancelButton: function(){
        this.controller.stageController.popScene();
    },
    
    _getInfo: function(){
				/*
        var address = {};
        var card = {};
		
        var name = this.nameModel.value;
        var namearray = name.split(" ");
        
		
        address.lastName = "";
        
        if (namearray.length > 1) {
            address.firstName = namearray[0];
            for (var i = 1; i < namearray.length; i++) {
                address.lastName += namearray[i];
                if (i < namearray.length - 1) {
                    address.lastName += " ";
                }
            }
        }
        else {
            if (namearray.length == 1) {
                address.firstName = namearray[0];
                address.lastName = '';
            }
            else {
                address.firstName = '';
                address.lastName = '';
            }
        }
        
        address.address1 = this.address1Model.value;
        address.address2 = this.address2Model.value;
		if(this._address3Div)
		 address.address3 = this.address3Model.value;
        address.city = this.cityModel.value;
		if(this._stateDiv)
        	address.state = this.stateModel.value;
		if(this._zipDiv)
        	address.zip = this.zipModel.value;
        address.phone = this.phoneModel.original.replace(/[. ()-+]/g, '');
        
        address.company = '';
        address.county = '';
        address.country = this.billCountryModel.value;
        
        card.number = this.creditcardModel.value.replace(/ /g, '');
        // this._ccinfo.expDate = this.cardExpiresModel.time.getMonth() + "/" + this.cardExpiresModel.time.getDay();
        // cybersource api is currently using mmyyyy format while accepting expiration date
        card.expDate = Mojo.Format.formatDate(this.cardExpiresModel.time, {
            format: "MMyyyy"
        });
        card.cvv = this.secretNumModel.value;
        card.email = '';
        
        return {
            address: address,
            card: card
        };
        */
    },
    
	handleChangeInvoiceEmail: function(event){
		this.controller.get("embargoedAddError").hide();
		this.controller.get("emailNotValidError").hide();
		Mojo.Log.info("## handleChangeInvoiceEmail Email:%sAddress", event.value);
			
		Event.stop(event);
		var self = this;
		var ext = event.value.substring(event.value.indexOf(".") + 1);
		if (event.value.search(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) == -1)
		{
			Mojo.Log.info("## Email invalid");

			self.controller.get("emailNotValidError").show();
			self.controller.get("invoiceEmail").focus();
			self.invalidEmail = true;
			self._enableDisableSave();
		}
		else{
			Mojo.Log.info("## Sending embargo check");
			self._doEmbargoCheck(event.value, function(status) {
				Mojo.Log.info("## Embargo returned");
				
				if (status){
					Mojo.Log.info("## Embargoed.");
					self.controller.get("embargoedAddError").show();
					self.controller.get("invoiceEmail").focus();
					self.invalidEmail = true;
				} else {
					Mojo.Log.info("## Email not invalid");
					self.invalidEmail = false;
				}

				self._enableDisableSave();
			});
		}
	},   
	
	_doEmbargoCheck:function(email, callback)
	{
		Mojo.Log.info("Carrier-assistant, doEmbargoCheck, new address %s", email);
		
		var ext = email.substring(email.lastIndexOf(".") + 1);
		
		if (AppAssistant.embargoedList) {
			if( AppAssistant.embargoedList.indexOf(ext) != -1)
				callback(true);
			else
				callback(false);
		}
		else {
			
			var self = this;
			Weave.Services.PaymentServer.getEmbargoedEmailExtensions(function(status, response){
				Mojo.Log.info("getEmbargoedCountryList %j", response);
				if (status) {
					AppAssistant.embargoedList = response.OutGetEmbargoedEmailExtensions.embargoedEmailExtensions;
					if( AppAssistant.embargoedList.indexOf(ext) != -1)
						callback(true);
					else
						callback(false);
				}
				else {
					var err = (response && response.errorCode) ? response.errorCode : response;
					Utilities.Errors.displayError(err, {
						errCode: err
					}, "PMT_catchAll");
				}
			});
		
		}
	},
    
    saveCarrier: function(){        
        var self = this;

        var state = this._stateDiv ? this.stateModel.value : '';
        var country = this.billCountryModel.value;
        var email = '';
        
        if (this.isEditMode) {
            Mojo.Log.info("### Saving OB Edit Mode");
            var addressParam = {};
            var creditCardParam = {};
            var updateAddress = false;

            if (state !== undefined && this._obinfo.address.state !== undefined && state.toUpperCase() != this._obinfo.address.state.toUpperCase()) {
                addressParam.state = state;
            }
			
            for (var k in addressParam) {
                updateAddress = true;
                break;
            }
            
            creditCardParam.paymentInfoId = this._obinfo.paymentInfoId;
            
            if (updateAddress) {
                this.saveButtonModel.disabled = true;
                this.controller.modelChanged(this.saveButtonModel);

                addressParam.country = country;
            
                Mojo.Log.info("### Going to updateOBAccount")
                
                Weave.Services.PaymentServer.updateOBAccount(addressParam, this._obinfo.paymentInfoId, function(status, response){
                	if (status) {
		            	Mojo.Log.info("### Returned from updateOBAccount")
		                self.saveButtonModel.disabled = false;
		                self.controller.modelChanged(self.saveButtonModel);
		                self._saveButton.mojo.deactivate();
					
						//passing whole address param
						//in case error need to reinitialize
						addressParam = {
					        state: state,
					        country: country
			        	}
					
		                self._handleAddUpdateResponse("update", status, response, addressParam);
					} else {
						Mojo.Log.error("## updateOBAccount failed with %j", response);
						var err = (response && response.errorCode) ? response.errorCode : response;
						Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
					}
                });
            }
            else {
                self.controller.stageController.popScene();
            }
        }
        else {
            var addressParam = {
                state: state,
                country: country
            };
            
            this.saveButtonModel.disabled = true;
            this.controller.modelChanged(this.saveButtonModel);
            
            Mojo.Log.info("### Calling addOBAccount");

            Weave.Services.PaymentServer.addOBAccount(addressParam, function(status, response){
                self.saveButtonModel.disabled = false;
                self.controller.modelChanged(self.saveButtonModel);
                self._saveButton.mojo.deactivate();
                self._handleAddUpdateResponse("add", status, response, addressParam);
            });

			if (this.invoiceEmailModel.value != this._invoiceEmail) {
            	Mojo.Log.info("### Calling email update to %s", this.invoiceEmailModel.value);
				Weave.Services.PaymentServer.setInvoiceEmail(this.invoiceEmailModel.value, function(status, response) {
					if (status) {
						Mojo.Log.info("### Email update returned %s, %j", status, response);
					} else {
						Mojo.Log.error("## setInvoiceEmail failed with %j", response);
						var err = (response && response.errorCode) ? response.errorCode : response;
						Utilities.Errors.displayError(err, {errCode: err}, "PMT_catchAll");
					}
				});
			} else {
            	Mojo.Log.info("### Email has not changed.");
			}
        }

		/*
		// Return to previous screen

		this.controller.stageController.popScene();
    
    	Mojo.Log.info("## onComplete is %s", this.params.onComplete);
    
    	this.params.onComplete && this.params.onComplete({
			accountValid: true,
			accountState: this.stateModel.value,
			accountCountry: this.billCountryModel.value
		});
		*/
    },
    
    removeAccount: function(){
        var self = this;
        this.controller.showAlertDialog({
            onChoose: function(value){
                if ("remove" == value) {
                    self.spinOn();
                    Weave.Services.PaymentServer.removeAccount(this._obinfo.paymentInfoId, false, function(status, response){
                        self.spinOff();
                        if (status) {
                            self.controller.stageController.popScene();
                        }
                        else {
                            var err = (response && response.errorCode) ? response.errorCode : response;
                            Utilities.Errors.displayError(err, {
                                errCode: err
                            }, "PMT_catchAll");
                            
                        }
                    });
                }
            },
            title: $L("Remove Carrier Account"),
            message: $L("Are you sure you want to remove this carrier account?"),
            choices: [{
                label: $L('Remove Carrier Account'),
                value: "remove",
                type: "negative"
            }, {
                label: $L("Keep Carrier Account"),
                value: "cancel"
            }]
        });
    },
    
    _enableDisableSave: function(){
   		Mojo.Log.info("### enableDisableSave %j", this.stateModel);

   		// Check validity of form input
    
        if (!this.billCountryModel.value || !this.stateModel.value || this.invalidEmail) {
            this.saveButtonModel.disabled = true;
        }
        else {
            this.saveButtonModel.disabled = false;
        }
        this.controller.modelChanged(this.saveButtonModel);
    },
    
    _statesUS: [{
        label: $L("State..."),
        value: ""
    },    // State names should not be localized
    {
        label: $L("Alabama"),
        value: "AL"
    }, {
        label: $L("Alaska"),
        value: "AK"
    }, {
        label: $L("American Samoa"),
        value: "AS"
    }, {
        label: $L("Arizona"),
        value: "AZ"
    }, {
        label: $L("Arkansas"),
        value: "AR"
    }, {
        label: $L("AF Americas"),
        value: "AA"
    }, {
        label: $L("AF Europe"),
        value: "AE"
    }, {
        label: $L("AF Pacific"),
        value: "AP"
    }, {
        label: $L("California"),
        value: "CA"
    }, {
        label: $L("Colorado"),
        value: "CO"
    }, {
        label: $L("Connecticut"),
        value: "CT"
    }, {
        label: $L("Delaware"),
        value: "DE"
    }, {
        label: $L("District of Columbia"),
        value: "DC"
    }, {
        label: $L("Federated Micronesia"),
        value: "FM"
    }, {
        label: $L("Florida"),
        value: "FL"
    }, {
        label: $L("Georgia"),
        value: "GA"
    }, {
        label: $L("Guam"),
        value: "GU"
    }, {
        label: $L("Hawaii"),
        value: "HI"
    }, {
        label: $L("Idaho"),
        value: "ID"
    }, {
        label: $L("Illinois"),
        value: "IL"
    }, {
        label: $L("Indiana"),
        value: "IN"
    }, {
        label: $L("Iowa"),
        value: "IA"
    }, {
        label: $L("Kansas"),
        value: "KS"
    }, {
        label: $L("Kentucky"),
        value: "KY"
    }, {
        label: $L("Louisiana"),
        value: "LA"
    }, {
        label: $L("Maine"),
        value: "ME"
    }, {
        label: $L("Marshall Islands"),
        value: "MH"
    }, {
        label: $L("Maryland"),
        value: "MD"
    }, {
        label: $L("Massachusetts"),
        value: "MA"
    }, {
        label: $L("Michigan"),
        value: "MI"
    }, {
        label: $L("Minnesota"),
        value: "MN"
    }, {
        label: $L("Mississippi"),
        value: "MS"
    }, {
        label: $L("Missouri"),
        value: "MO"
    }, {
        label: $L("Montana"),
        value: "MT"
    }, {
        label: $L("Nebraska"),
        value: "NE"
    }, {
        label: $L("Nevada"),
        value: "NV"
    }, {
        label: $L("New Hampshire"),
        value: "NH"
    }, {
        label: $L("New Jersey"),
        value: "NJ"
    }, {
        label: $L("New Mexico"),
        value: "NM"
    }, {
        label: $L("New York"),
        value: "NY"
    }, {
        label: $L("North Carolina"),
        value: "NC"
    }, {
        label: $L("North Dakota"),
        value: "ND"
    }, {
        label: $L("N. Mariana Islands"),
        value: "MP"
    }, {
        label: $L("Ohio"),
        value: "OH"
    }, {
        label: $L("Oklahoma"),
        value: "OK"
    }, {
        label: $L("Oregon"),
        value: "OR"
    }, {
        label: $L("Palau"),
        value: "PW"
    }, {
        label: $L("Pennsylvania"),
        value: "PA"
    }, {
        label: $L("Puerto Rico"),
        value: "PR"
    }, {
        label: $L("Rhode Island"),
        value: "RI"
    }, {
        label: $L("South Carolina"),
        value: "SC"
    }, {
        label: $L("South Dakota"),
        value: "SD"
    }, {
        label: $L("Tennessee"),
        value: "TN"
    }, {
        label: $L("Texas"),
        value: "TX"
    }, {
        label: $L("Utah"),
        value: "UT"
    }, {
        label: $L("Vermont"),
        value: "VT"
    }, {
        label: $L("Virgin Islands"),
        value: "VI"
    }, {
        label: $L("Virginia"),
        value: "VA"
    }, {
        label: $L("Washington"),
        value: "WA"
    }, {
        label: $L("West Virginia"),
        value: "WV"
    }, {
        label: $L("Wisconsin"),
        value: "WI"
    }, {
        label: $L("Wyoming"),
        value: "WY"
    }, ],
    
    _statesCA: [{
        label: $L("Province/Territory..."),
        value: ""
    },    // State names should not be localized
    {
        label: $L("Alberta"),
        value: "AB"
    }, {
        label: $L("British Columbia"),
        value: "BC"
    }, {
        label: $L("Manitoba"),
        value: "MB"
    }, {
        label: $L("New Brunswick"),
        value: "NB"
    }, {
        label: $L("Newfoundland and Labrador"),
        value: "NL"
    }, {
        label: $L("Northwest Territories"),
        value: "NT"
    }, {
        label: $L("Nova Scotia"),
        value: "NS"
    }, {
        label: $L("Nunavut"),
        value: "NU"
    }, {
        label: $L("Ontario"),
        value: "ON"
    }, {
        label: $L("Prince Edward Island"),
        value: "PE"
    }, {
        label: $L("Quebec"),
        value: "QC"
    }, {
        label: $L("Saskatchewan"),
        value: "SK"
    }, {
        label: $L("Yukon"),
        value: "YT"
    }],
    
    _setupState: function(clearField){
    
        Mojo.Log.info("### SetupState for _obinfo %j", this._obinfo);
        
        //if country is US or Canada, set state picker
        if (this.billCountryModel.value == "US" || this.billCountryModel.value == "CA") {
        	Mojo.Log.info("## State should be shown.");
            var stateHtml = Mojo.View.render({
                object: {},
                template: 'create-account/state-picker'
            });
            this.controller.get("stateContainer").insert(stateHtml);
            this._stateDiv = this.controller.get("stateDiv");
            this.stateModel = {
                value: this.isEditMode && !clearField ? this._obinfo.address.state : ""
            };
            
            Mojo.Log.info("## stateModel %j - editMode %s - clearField", this.stateModel, this.isEditMode, clearField);
            
            this.stateChoices = {
                choices: this.billCountryModel.value == "US" ? this._statesUS : this._statesCA
            };

            
            this.controller.setupWidget("stateField", this.stateChoices, this.stateModel);
        }
        else {
        	Mojo.Log.info("## State should not be shown.");
            this._stateDiv = undefined;
        }

        this.controller.instantiateChildWidgets(this.controller.get("stateContainer"));

        this.controller.listen("stateField", Mojo.Event.propertyChange, this._enableDisableSave);
    },
    
    _setupBillCountry: function() {
    	Mojo.Log.info("### setupBillCountry");
    	
    	var self = this;
    
        Weave.Services.PaymentServer.getOBCountries(function(status, response) {
        //self.controller.setupWidget("stateField", self.stateChoices, self.stateModel);
        	self.spinOff();
        	if (status) {
				Mojo.Log.info("## OB Countries received OK %j", response);

				var createAccHtml = Mojo.View.render({
				    object: {},
				    template: 'create-carrier/create-carrier-form'
				});
				self.controller.get("formContainer").insert(createAccHtml);

				var binCountries = response.OutGetOBCountries.obCountries;
        		/*
				Example:
        		[{"name": "CANADA", "code": "CA"}, {"name": "MEXICO", "code": "MX"}, {"name": "UNITED STATES", "code": "US", "activation": "true"}]
        		*/
        		var choices = [];
				var activationCountry;
				for (var i = 0; i < binCountries.length; i++) {
				    var formattedName = Utilities.Common.capWords(binCountries[i].name);
				    choices.push({
				        label: $L(formattedName),
				        value: binCountries[i].code
				    });
				    if (binCountries[i].activation) 
				        activationCountry = binCountries[i].code;
				}
				
				if (activationCountry == "US") {
					// Don't ask for country, assume they are in the US still
					self.controller.get("countryRow").hide();
					self.controller.get("stateRow").addClassName("last");
					self.controller.get("stateCountryTitle").update($L("State"));

					self.billCountryModel = {
						value: "US" //self.binCountry
					};
				} else {
					//if not in edit mode, billing country is defaulted to activation country
					self.binCountry = self.isEditMode ? self._obinfo.address.country : activationCountry;
					self.selectedCountry = self.binCountry;
					self.billCountryModel = {
						value: self.binCountry
					};
				
					self.billCountryTypes = {
						choices: choices
					};

					Mojo.Log.info("## self.billCountryTypes %j", self.billCountryTypes);

					self.controller.setupWidget("billCountryListSelector", self.billCountryTypes, self.billCountryModel);

					Mojo.Log.info("## setupWidget succeeded.");
				}
				
		        self._setupForm(); // Set up the rest of the form

				self.controller.listen("billCountryListSelector", Mojo.Event.propertyChange, self.resetForm);

        	} else {
				var err = (response && response.errorCode) ? response.errorCode : response;
                Utilities.Errors.displayError(err, {
                    errCode: err
                }, "PMT_catchAll");
			}
        });
		
    
    /*
		    var createAccHtml = Mojo.View.render({
		        object: {},
		        template: 'create-carrier/create-carrier-form'
		    });
		    self.controller.get("formContainer").insert(createAccHtml);
		    var binCountries = response.OutGetBillToCountries.billToCountries;
		    Mojo.Log.info("BIN1 %j", binCountries);
		    for (var i = 0; i < binCountries.length; i++) {
		        var formatedName = Utilities.Common.capWords(binCountries[i].name);
		        choices.push({
		            label: $L(formatedName),
		            value: binCountries[i].code
		        });
		        if (binCountries[i].activation) 
		            activationCountry = binCountries[i].code;
		    }
		    //if not in edit mode, billing counrty is defaulted to activation country
		    self.binCountry = self.isEditMode ? self._ccinfo.billTo.country : activationCountry;
			self.selectedCountry = self.binCountry;
			Mojo.Log.info("SelectedCountry %s", self.selectedCountry);
		    self.billCountryModel = {
		        value: self.binCountry
		    };
		    
		    self.billCountryTypes = {
		        choices: choices
		    };
		    
		    self.controller.setupWidget("billCountryListSelector", self.billCountryTypes, self.billCountryModel);
		    
		    self._setupForm();
		    self.controller.listen("billCountryListSelector", Mojo.Event.propertyChange, self.resetForm);
        
        */
    },
    
    _validateAndSubmit: function(event){
    
    /*
        this._enableDisableSave();
        if (this.saveButtonModel.disabled == false && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) {
            this.saveButtonModel.disabled = true;
            this.controller.modelChanged(this.saveButtonModel);
            this._saveButton.mojo.activate();
            this.saveCarrier();
        }
        */
    },
	
    //If billing country is changed, reset the form. Clear the fields if new choice 
    //for billing country is different than saved billing country if in edit mode.
    //Also, display the form accordingly
    _resetForm: function(event){
		Mojo.Log.info("Resetting selected country %s", this.selectedCountry);
        var clearField = (this.billCountryModel.value != this.lastCountry);

		this.lastCountry = this.billCountryModel.value; // For next time

        if (this._stateDiv) {
            this._stateDiv.remove();
        }

        this._setupState(clearField);
        
        this._enableDisableSave();
    },
    
    _setupForm: function(){
    
    	Mojo.Log.info("### setupForm");
    
    	this._setupState();
        
        // The email field should be hidden if it has been confirmed.
        if (this.isEditMode) {
			this.controller.get('receiptsGroup').hide();        
        } else {
     		this.invoiceEmailAttr = {
        	hintText: $L('Email...'),
				multiline: false,
				focus: false,
				limitResize: false,
				enterSubmits: false,
				textCase: Mojo.Widget.steModeLowerCase,
				changeOnKeyPress: false
			};
			
			this.invoiceEmailModel = {
			 	value : this._invoiceEmail
			};

			this.controller.setupWidget('invoiceEmail', this.invoiceEmailAttr, this.invoiceEmailModel);
        }
        
        
        /* Buttons */

        this.saveButtonModel = {
            buttonLabel: $L("Continue"),
            buttonClass: "primary",
            disabled: true
        };
        
        this.controller.setupWidget('saveButton', {
            type: Mojo.Widget.activityButton
        }, this.saveButtonModel);
        
        this.controller.listen("saveButton", Mojo.Event.tap, this.saveCarrier.bind(this));
        this._saveButton = this.controller.get("saveButton");
        
        this.controller.setupWidget('cancelButton', {
            disabled: false,
            type: "default"
        }, {
            buttonLabel: $L("Cancel"),
            buttonClass: "dismiss",
            disabled: false
        });
        this.controller.listen("cancelButton", Mojo.Event.tap, this.cancelButton.bind(this));
        
        if (this.isEditMode) {
            this.controller.setupWidget('removeButton', {
                disabled: false,
                type: "default"
            }, {
                buttonLabel: $L("Remove Account"),
                buttonClass: "negative",
                disabled: false
            });
            this.controller.listen("removeButton", Mojo.Event.tap, this.removeAccount.bind(this));
        }

        this.controller.instantiateChildWidgets(this.controller.get("formContainer"));
    },

    _handleAddUpdateResponse: function(requestType, status, response, addressParam){
		Mojo.Log.info("### entered handleAddUpdateResponse with status %s and response %j", status, (response ? response : {}));
		var self = this;
        if (status) {	
        	var resObject = undefined;

			if(requestType == "add")
				resObject = response.OutAddOBPaymentInfo;
			else if(requestType = "update") 
				resObject = response.OutUpdateOBPaymentInfo;

			var paymentInfoId = resObject.paymentInfoId;
			
			// Potential error condition?
            if (!paymentInfoId) {
				Mojo.Log.error("### Error in saving/updating OB account.");
            }
			//Success
            else 
            {
				Mojo.Log.info("success in saving/Updating account");
                self.controller.stageController.popScene();
                self.params.onComplete && self.params.onComplete({
					accountValid: true
            	});
            }
        }
        else {
			var defaultError = "PMT_catchAll";
            var err = (response && response.errorCode) ? response.errorCode : response;
			
            Utilities.Errors.displayError(err, {
                errCode: err
            }, defaultError, null, null, function(value){
                if (value == 'help') {
					self.controller.stageController.popScene();
                    Weave.Services.ConnectionManager.getStatus(function(online){
                        Weave.Services.ApplicationManager.openApplication('com.palm.app.help', {
                            target: online ? 'http://help.palm.com/app_catalog/appcatalog_download_error.html' : 'no-network'
                        });
                    });
                }
				else if(value == 'quit'){
					self.controller.stageController.popScene();
				}
            });
        }
    }
});
