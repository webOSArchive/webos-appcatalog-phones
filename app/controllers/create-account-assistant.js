/* Copyright 2009 Palm, Inc.  All rights reserved. */

var CreateAccountAssistant = Class.create({
    initialize: function(params){
        this.appMetrics = Mojo.Controller.getAppController().assistant.appMetrics;
        this._address = {};
        this.params = params ||
        {};
        this._appid = params.appid;
        this._ccinfo = this.params.ccInfos ||
        {};
        this.isEditMode = this.params.edit;
        // Clear the cache - we might be changing this
        myProfile.validPayment = undefined;
    },
    
    setup: function(){
        this.appMetrics.trackNewScene('account/create?app_id='+this._appid);
        this._addedPrefs = this.controller.document.body.hasClassName("prefs") || this.controller.document.body.addClassName("prefs");
        
        this._spinner = new Spinner(this, 'spinner', false, 'large');
        
        if (this.isEditMode) 
            this.controller.get("accountTitle").update($L("Edit Credit Card"));
        else 
            this.controller.get("accountTitle").update($L("Add Credit Card"));
        
        this.resetForm = this._resetForm.bind(this);
        //sets up billing country and depending upon that displays rest of the form
        this._setupBillCountry();
        
        this._enableDisableSave = this._enableDisableSave.bindAsEventListener(this);
        this._validateAndSubmit = this._validateAndSubmit.bindAsEventListener(this);
        
        
    },
    
    cleanup: function(){
        this._addedPrefs !== true && this.controller.document.body.removeClassName("prefs");
        this.controller.stopListening("billCountryListSelector", Mojo.Event.propertyChange, this.resetForm);
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
    
    _getCreditCardTypes: function(widget){
        var self = this;
        self.cardTypes = [];
        this.spinOn();
		Mojo.Log.info("SelectedCountry _getCreditCardTypes%s", this.selectedCountry);
        Weave.Services.PaymentServer.getCCTypes(self.selectedCountry, function(status, response){
            Mojo.Log.info("_getCreditCardTypes %j", response);
            self.spinOff();
            if (status) {
                var ccTypes = response.OutGetCCTypes.ccTypes;
                Mojo.Log.info("CC %j", ccTypes);
                Mojo.Log.info("IN %j", self._ccinfo);
                for (var i = 0; i < ccTypes.length; i++) {
                    Mojo.Log.info("%d", i);
                    self.cardTypes.push({
                        label: ccTypes[i].description,
                        code: ccTypes[i].code,
                        icon: ccTypes[i].code.toLowerCase(),
                        disabled: false,
                        value: ccTypes[i].code == (self._ccinfo.creditCard ? self._ccinfo.creditCard.type : ccTypes[0].code)
                    });
                }
                Mojo.Log.info("r=%j", self.cardTypes);
                widget.mojo.noticeUpdatedItems(0, self.cardTypes);
                widget.mojo.setLength(self.cardTypes.length);
            }
            else {
                Mojo.Log.error("No credit card types");
                var err = response.errorCode ? response.errorCode : response;
                Utilities.Errors.displayError(err, {
                    errCode: err
                }, "PMT_catchAll");
            }
        });
    },
    
    handleCardTypeTap: function(event){
        for (var i = 0; i < this.cardTypes.length; i++) {
            this.cardTypes[i].value = event.index == i;
        }
        this._cardTypeList.mojo.noticeUpdatedItems(0, this.cardTypes);
    },
    
    getActiveCreditCard: function(){
        for (var i = 0; i < this.cardTypes.length; i++) {
            if (this.cardTypes[i].value) 
                return this.cardTypes[i].code;
        }
    },
    
    cancelButton: function(){
        this.controller.stageController.popScene();
    },
    
    _getInfo: function(){
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
        
        card.type = this.getActiveCreditCard();
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
    },
    
    saveAccount: function(){
        Mojo.Log.info("Add OR Update ACCOUNT");
        
        var self = this;
        var name = this.nameModel.value;
        var namearray = name.split(" ");
        
        var firstName;
        var lastName = "";
        
        if (namearray.length > 1) {
            firstName = namearray[0];
            for (var i = 1; i < namearray.length; i++) {
                lastName += namearray[i];
                if (i < namearray.length - 1) {
                    lastName += " ";
                }
            }
        }
        else {
            if (namearray.length == 1) {
                firstName = namearray[0];
                lastName = '';
            }
            else {
                firstName = '';
                lastName = '';
            }
        }
        
        var address1 = this.address1Model.value;
        var address2 = this.address2Model.value;
		var address3 = this._address3Div ? this.address3Model.value : '';
        var city = this.cityModel.value;
        var state = this._stateDiv ?this.stateModel.value : '';
        var zip = this._zipDiv ? this.zipModel.value : '';
        /*for (var i = 0; i < zip.length; i++) {
            var charcode = zip.charCodeAt(i);
            if (charcode > 31 && (charcode < 48 || charcode > 57)) {
                this.zipModel.value = "";
                zip = "";
            }
        }*/
        
        var phone = this.phoneModel.original.replace(/[. ()-+]/g, '');
        
        var company = '';
        var county = '';
        var country = this.billCountryModel.value;
        
        var type = this.getActiveCreditCard();
        var number = this.creditcardModel.value.replace(/ /g, '');
        // this._ccinfo.expDate = this.cardExpiresModel.time.getMonth() + "/" + this.cardExpiresModel.time.getDay();
        // cybersource api is currently using mmyyyy format while accepting expiration date
        var expDate = Mojo.Format.formatDate(this.cardExpiresModel.time, {
            format: "MMyyyy"
        });
        var cvv = this.secretNumModel.value;
        var email = '';
        
        if (this.isEditMode) {
            var addressParam = {};
            var creditCardParam = {};
            var updateAddress = false;
            var updateCard = false;
            //figure out what changed and generate the appropriate params to send to the server
            if (firstName !== undefined && firstName.toUpperCase() != this._ccinfo.billTo.firstName.toUpperCase()) {
                addressParam.firstName = firstName;
            }
            if (lastName !== undefined&& lastName.toUpperCase() != this._ccinfo.billTo.lastName.toUpperCase()) {
                addressParam.lastName = lastName;
            }
            if (address1 !== undefined&& address1.toUpperCase() != this._ccinfo.billTo.address1.toUpperCase()) {
                addressParam.address1 = address1;
            }
            if (address2 !== undefined&& this._ccinfo.billTo.address2 !== undefined && address2.toUpperCase() != this._ccinfo.billTo.address2.toUpperCase()) {
                addressParam.address2 = address2;
            }
			
			if (address3 !== undefined && this._ccinfo.billTo.address3 !== undefined && address3.toUpperCase() != this._ccinfo.billTo.address3.toUpperCase()) {
				Mojo.Log.info("*****Address3: ", address3);
                addressParam.address3 = address3;
            }
            if (city !== undefined&& this._ccinfo.billTo.city !== undefined && city.toUpperCase() != this._ccinfo.billTo.city.toUpperCase()) {
                addressParam.city = city;
            }
            if (state !== undefined && this._ccinfo.billTo.state!== undefined && state.toUpperCase() != this._ccinfo.billTo.state.toUpperCase()) {
                addressParam.state = state;
            }
			
			if (country !== undefined && country.toUpperCase() != this._ccinfo.billTo.country.toUpperCase()) {
                addressParam.country = country;
            }
            if (zip !== undefined && this._ccinfo.billTo.zip !== undefined && zip.toUpperCase() != this._ccinfo.billTo.zip.toUpperCase()) {
                addressParam.zip = zip;
            }
            if (phone !== undefined && phone.toUpperCase() != this._ccinfo.billTo.phone.toUpperCase()) {
                addressParam.phone = phone;
            }
            for (var k in addressParam) {
                updateAddress = true;
                break;
            }
            
            if (type != this._ccinfo.creditCard.type) {
                creditCardParam.type = type;
            }
            if (number != this._ccinfo.creditCard.number) {
                creditCardParam.number = number;
                // Always need the type if we change the number
                creditCardParam.type = type;
            }
            if (expDate != Mojo.Format.formatDate(this.originalCardDate, {
                format: "MMyyyy"
            })) {
                creditCardParam.expDate = expDate;
            }
            if (cvv != this._ccinfo.creditCard.cvv) {
                creditCardParam.cvv = cvv;
            }
            for (var k in creditCardParam) {
                //creditCardParam.email = email;
                updateCard = true;
                break;
            }
            
            //always include the paymentInfoId param
            creditCardParam.paymentInfoId = this._ccinfo.paymentInfoId;
            
            if (updateAddress || updateCard) {
                // Validate the card info as much as we can, and report errorinal commerces locally when we can
                var error = this._localCardCheck(updateAddress ? addressParam : null, updateCard ? creditCardParam : null, "edit");
                if (error) {
                    Utilities.Errors.displayError(error.error, null, null, error.title, error.message);
                    this._saveButton.mojo.deactivate();
                    return;
                }
                
                this.saveButtonModel.disabled = true;
                this.controller.modelChanged(this.saveButtonModel);
                Weave.Services.PaymentServer.updateAccount(addressParam, creditCardParam, function(status, response){
                    self.saveButtonModel.disabled = false;
                    self.controller.modelChanged(self.saveButtonModel);
                    self._saveButton.mojo.deactivate();
					
					//passing whole address param and credit card param
					//in case error need to reinitialize the ccinfo
					addressParam = {
	                firstName: firstName,
	                lastName: lastName,
	                address1: address1,
	                address2: address2,
					address3: address3,
	                city: city,
	                state: state,
	                zip: zip,
	                phone: phone,
	                company: company,
	                county: county,
	                country: country
	            	}
					
					creditCardParam = {
	                type: type,
	                number: number,
	                expDate: expDate,
	                cvv: cvv
	            }
                    self._handleAddUpdateResponse("update", status, response, addressParam, creditCardParam);
                });
            }
            else {
                self.controller.stageController.popScene();
            }
        }
        else {
            var addressParam = {
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: address2,
				address3: address3,
                city: city,
                state: state,
                zip: zip,
                phone: phone,
                company: company,
                county: county,
                country: country
            }
            
            var creditCardParam = {
                type: type,
                number: number,
                expDate: expDate,
                cvv: cvv
            }
            
            // Validate the card info as much as we can, and report errors locally when we can
            var error = this._localCardCheck(addressParam, creditCardParam, "new");
            if (error) {
                Utilities.Errors.displayError(error.error, {
                    errCode: error.error
                }, null, error.title, error.message);
                this._saveButton.mojo.deactivate();
                return;
            }
            
            this.saveButtonModel.disabled = true;
            this.controller.modelChanged(this.saveButtonModel);
            Weave.Services.PaymentServer.addAccount(addressParam, creditCardParam, function(status, response){
                self.saveButtonModel.disabled = false;
                self.controller.modelChanged(self.saveButtonModel);
                self._saveButton.mojo.deactivate();
                self._handleAddUpdateResponse("add", status, response, addressParam, creditCardParam);
            });
        }
    },
    
    removeAccount: function(){
        var self = this;
        this.controller.showAlertDialog({
            onChoose: function(value){
                if ("remove" == value) {
                    self.spinOn();
                    Weave.Services.PaymentServer.removeAccount(this._ccinfo.paymentInfoId, true, function(status, response){
                        self.spinOff();
                        if (status) {
                            self.controller.stageController.popScene();
                        }
                        else {
                            var err = response.errorCode ? response.errorCode : response;
                            Utilities.Errors.displayError(err, {
                                errCode: err
                            }, "PMT_removeCC_default");
                        }
                    });
                }
            },
            title: $L("Remove Credit Card"),
            message: $L("Are you sure you want to remove this credit card?"),
            choices: [{
                label: $L('Remove Credit Card'),
                value: "remove",
                type: "negative"
            }, {
                label: $L("Keep Credit Card"),
                value: "cancel"
            }]
        });
    },
    
    _localCardCheck: function(addr, card, mode){
        // Make sure all the required lines of the address are there
        Mojo.Log.info("addr %j card %j", addr, card);
        function okay(v){
            return (mode == "edit") || (v && v != "");
        }
        var error;
        var title;
        var message;
        if (addr) {
            if (!(okay(addr.firstName) || okay(addr.lastName) || okay(addr.address1))) {
                error = "PMT02010";
            }
            else 
                if (!okay(addr.phone)) {
                    error = "LOCL0005";
                }
                else {
                    var fields = [];
                    if (!(okay(addr.firstName) && okay(addr.lastName))) {
                        fields.push($L("Name"));
                    }
                    if (!okay(addr.address1)) {
                        fields.push($L("Billing Address 1"));
                    }
                    if (addr.country != "GB" && !okay(addr.city)) {
                        fields.push($L("City"));
                    }
                    if ((addr.country == "US" ||addr.country == "CA") && !okay(addr.state)) {
                        fields.push($L("State"));
                    }
                    if ((addr.country == "US" ||addr.country == "CA") && !okay(addr.zip)) {
                        fields.push($L("Zip"));
                    }
                    if (fields.length > 0) {
                        error = "UNKNOWN";
                        title = $L("Data Entry");
                        message = $L("You must enter data in the correct format in these fields: ") + fields.join(", ");
                    }
                }
        }
        if (card && !error) {
            if (!okay(card.number)) {
                error = "PMT02011";
            }
            else 
                if (mode != "check" &&  (!card.cvv || card.cvv == "")) {
                    error = "LOCL0006";
                }
                else 
                    if ((mode == "new" || card.number) && mode != "check" && !/^\d*$/.test(card.number)) {
                        error = "LOCL0003";
                    }
                    else 
                        if ((mode == "new" || card.cvv) && !/^\d*$/.test(card.cvv)) {
                            error = "LOCL0003";
                        }
                        else 
                            if (!okay(card.type)) {
                                error = "LOCL0004";
                            }
        }
        if (addr && addr.zip && !error) {
            Mojo.Log.info("billCountryListSelector value : %s", addr.country);
            if (addr.country == "US" && !/^\d{5}$|^\d{5}-\d{4}$/.test(addr.zip)) {
                error = "LOC02018";
            }
            else 
                if (addr.country == "CA" && !/^[a-zA-Z]{1}\d{1}[a-zA-Z]{1}[ ]{0,1}\d{1}[a-zA-Z]{1}\d{1}$/.test(addr.zip)) {
                    error = "LOC02019";
                }
            
        }
		
		if (addr && addr.firstName && !error) {
            
			if (addr.firstName.length > 60) {
				Mojo.Log.info("First name more than 60 chars: %s", addr.firstName);
				error = "LOC02020";
			}
        }
		
		if (addr && addr.lastName && !error) {
            
			if (addr.lastName.length > 60) {
				Mojo.Log.info("Lat name more than 60 chars: %s", addr.firstName);
				error = "LOC02021";
			}
        }
		
        if (error) {
            return {
                error: error,
                title: title,
                message: message
            };
        }
        else {
            return undefined;
        }
    },
    
    _enableDisableSave: function(){
        var info = this._getInfo();
        if (this._localCardCheck(info.address, info.card, this.isEditMode ? "check" : "new")) {
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
        Mojo.Log.info("SetupState for country%s", this.selectedCountry);
        
        //if country is US or Canada, set state picker
        if (this.selectedCountry == "US" || this.selectedCountry == "CA") {
            var stateHtml = Mojo.View.render({
                object: {},
                template: 'create-account/state-picker'
            });
            this.controller.get("stateContainer").insert(stateHtml);
            this._stateDiv = this.controller.get("stateDiv");
            this.stateModel = {
                value: this.isEditMode && !clearField ? this._ccinfo.billTo.state : ""
            };
			var stateChoices = (this.selectedCountry === "US") ? this._statesUS : this._statesCA;
			stateChoices.sort(function(a,b){return a.label.localeCompare(b.label)});
            this.controller.setupWidget("stateField", {
                choices: stateChoices
            }, this.stateModel);
            
        }
        else 
            this._stateDiv = undefined;
        this.controller.instantiateChildWidgets(this.controller.get("stateContainer"));
    },
    
    _setupBillCountry: function(){
        var self = this;
        var activationCountry = "";
        var choices = [];
        this.spinOn();
        Weave.Services.PaymentServer.getBillToCountries(function(status, response){
            self.spinOff();
            if (status) {
                var createAccHtml = Mojo.View.render({
                    object: {},
                    template: 'create-account/create-account-form'
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
				choices.sort(function sortCompare(a,b){return a.label.localeCompare(b.label);});
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
                
            }
			else{
				var err = response.errorCode ? response.errorCode : response;
                Utilities.Errors.displayError(err, {
                    errCode: err
                }, "PMT_catchAll");
			}
        });
    },
    
    _validateAndSubmit: function(event){
        this._enableDisableSave();
        if (this.saveButtonModel.disabled == false && Mojo.Char.isEnterKey(event.originalEvent.keyCode)) {
            this.saveButtonModel.disabled = true;
            this.controller.modelChanged(this.saveButtonModel);
            this._saveButton.mojo.activate();
            this.saveAccount();
        }
    },
	
	_setAddress1: function(clearField){

            var address1Html = Mojo.View.render({
                object: {},
                template: 'create-account/address1-field'
            });

            this.controller.get("address1Container").insert(address1Html);
		this._address1Div = this.controller.get("address1Div");
		if (this.selectedCountry == "US" || this.selectedCountry == "CA"){
			this.address1Attr = {
                            hintText: $L('Billing Address 1...'),
                            multiline: false,
                            label: $L('To:'),
                            focus: false,
                            limitResize: false,
                            enterSubmits: false,
                            changeOnKeyPress: true,
                            modifierState: Mojo.Widget.numLock,
                            textCase: Mojo.Widget.steModeTitleCase,
                            holdToEnable: true,
                            maxLength: 60,
                            autoReplace: false
                        };
		}else{
                        this.address1Attr = {
                            hintText: $L('Billing Address 1...'),
                            multiline: false,
                            label: $L('To:'),
                            focus: false,
                            limitResize: false,
                            enterSubmits: false,
                            changeOnKeyPress: true,
                            textCase: Mojo.Widget.steModeTitleCase,
                            holdToEnable: true,
                            maxLength: 60,
                            autoReplace: false
                        };
		}
		
		this.address1Model = {
			value: this.isEditMode && !clearField ? (this._ccinfo.billTo.address1 ? this._ccinfo.billTo.address1 : "") : "",
			disabled: false
		};
		this.controller.setupWidget('address1Field', this.address1Attr, this.address1Model);
		this.controller.instantiateChildWidgets(this.controller.get("address1Container"));
		
    },
	
	_setAddress3: function(clearField){
        
        if (this.selectedCountry == "GB") {
			var address3Html = Mojo.View.render({
	            object: {},
	            template: 'create-account/address3-field'
	        });
	        this.controller.get("address3Container").insert(address3Html);
			this._address3Div = this.controller.get("address3Div");
			this.address3Attr = {
				hintText: $L('Billing Address 3...'),
				multiline: false,
				label: $L('To:'),
				focus: false,
				limitResize: false,
				enterSubmits: false,
				changeOnKeyPress: true,
				textCase: Mojo.Widget.steModeTitleCase,
				holdToEnable: true,
				maxLength: 60,
                autoReplace: false
			};
			
			this.address3Model = {
				value: this.isEditMode && !clearField ? (this._ccinfo.billTo.address3 ? this._ccinfo.billTo.address3 : "") : "",
				disabled: false
			};
			this.controller.setupWidget('address3Field', this.address3Attr, this.address3Model);
			this.controller.instantiateChildWidgets(this.controller.get("address3Container"));
		}
		else
			this._address3Div = undefined;
    },
    
    _setCity: function(clearField){
        var cityHtml = Mojo.View.render({
            object: {},
            template: 'create-account/city-field'
        });
        this.controller.get("cityContainer").insert(cityHtml);
        if (this.selectedCountry == "GB") {
            this.cityAttr = {
                hintText: $L('Posttown...'),
                multiline: false,
                label: $L('To:'),
                focus: false,
                limitResize: false,
                enterSubmits: false,
                changeOnKeyPress: true,
                textCase: Mojo.Widget.steModeTitleCase,
                holdToEnable: true,
		        maxLength: 50,
                autoReplace: false
            };
        }
        else 
            if (this.selectedCountry == "US") {
                this.cityAttr = {
                    hintText: $L('City...'),
                    multiline: false,
                    label: $L('To:'),
                    focus: false,
                    limitResize: false,
                    enterSubmits: false,
                    changeOnKeyPress: true,
                    textCase: Mojo.Widget.steModeTitleCase,
                    holdToEnable: true,
                    maxLength: 50,
                    autoReplace: false
                };
            }
            else {
                this.cityAttr = {
                    hintText: $L('City/Town...'),
                    multiline: false,
                    label: $L('To:'),
                    focus: false,
                    limitResize: false,
                    enterSubmits: false,
                    changeOnKeyPress: true,
                    textCase: Mojo.Widget.steModeTitleCase,
                    holdToEnable: true,
                    maxLength: 50,
                    autoReplace: false
                };
            }
        this.cityModel = {
            value: this.isEditMode && !clearField ? (this._ccinfo.billTo.city ? this._ccinfo.billTo.city: "") : "",
            disabled: false
        };
        this.controller.setupWidget('cityField', this.cityAttr, this.cityModel);
        this.controller.instantiateChildWidgets(this.controller.get("cityContainer"));
    },
    
    _setZip: function(clearField){
		if (this.selectedCountry != "IE") 
		{
			var zipHtml = Mojo.View.render({
				object: {},
				template: 'create-account/zip-field'
			});
			var modState = (["US", "MX", "FR", "ES", "NL"].indexOf(this.selectedCountry) != -1) ? Mojo.Widget.numLock : Mojo.Widget.capsLock;
			
			this.controller.get("zipContainer").insert(zipHtml);
			this._zipDiv = this.controller.get("zipDiv");
			if (this.selectedCountry == "GB") {
				this.zipAttr = {
					hintText: $L('Postcode...'),
					multiline: false,
					label: $L('To:'),
					focus: false,
					limitResize: false,
					enterSubmits: false,
					changeOnKeyPress: true,
					modifierState: modState,
					holdToEnable: true,
					maxLength: 10
				};
			}
			else if (this.selectedCountry == "US") 
			{
				this.zipAttr = {
					hintText: $L('Zip...'),
					multiline: false,
					label: $L('To:'),
					focus: false,
					limitResize: false,
					enterSubmits: false,
					changeOnKeyPress: true,
					modifierState: modState,
					holdToEnable: true,
					maxLength: 10
				};
			}
			else 
			{
				this.zipAttr = {
					hintText: $L('Postal Code...'),
					multiline: false,
					label: $L('To:'),
					focus: false,
					limitResize: false,
					enterSubmits: false,
					changeOnKeyPress: true,
					modifierState: modState,
					holdToEnable: true,
					maxLength: 10
				};
			}
			this.zipModel = {
				value: this.isEditMode && !clearField ? this._ccinfo.billTo.zip : "",
				disabled: false
			};
			this.controller.setupWidget('zipField', this.zipAttr, this.zipModel);
			this.controller.instantiateChildWidgets(this.controller.get("zipContainer"));
		}
		else
			this._zipDiv = undefined;
    },
    
    //If billing country is changed, reset the form. Clear the fields if new choice 
    //for billing country is different than saved billing country if in edit mode.
    //Also, display the form accordingly
    _resetForm: function(event){
		this.selectedCountry = event.value;
		Mojo.Log.info("Resetting selected country %s", this.selectedCountry);
        var clearField = !(this.binCountry == this.selectedCountry);
		this._getCreditCardTypes(this.controller.get("cardTypeList"));
        if (this._stateDiv) {
            this._stateDiv.remove();
        }
		
		if (this._address3Div) {
            this._address3Div.remove();
        }
		this.controller.get("address1Div").remove();
        this.controller.get("cityDiv").remove();
		
		if (this._zipDiv) 
        	this._zipDiv.remove();
        
        this.creditcardModel.value = this.isEditMode && !clearField ? this._ccinfo.creditCard.number : "";
        this.controller.modelChanged(this.creditcardModel, this);
        
        this.cardExpiresModel.time = new Date();
        this.controller.modelChanged(this.cardExpiresModel, this);
        
        this.secretNumModel.value = this.isEditMode && !clearField ? this._ccinfo.creditCard.cvv : "";
        this.controller.modelChanged(this.secretNumModel, this);
        
        this.phoneModel.original = this.isEditMode && !clearField ? Mojo.Format.formatPhoneNumber(this._ccinfo.billTo.phone) : "";
        this.controller.modelChanged(this.phoneModel, this);
        
        this.address1Model.value = this.isEditMode && !clearField ? this._ccinfo.billTo.address1 : "";
        this.controller.modelChanged(this.address1Model, this);
        
        this.address2Model.value = this.isEditMode && !clearField ? this._ccinfo.billTo.address2 : "";
        this.controller.modelChanged(this.address2Model, this);
		
		this._setAddress1(clearField);
		
		this._setAddress3(clearField);
        
        this._setCity(clearField);
        
        this._setupState(clearField);
        
        this._setZip(clearField);
        
    },
    
    _setupForm: function(){
		
        //**ToDO get credit cards according to billing country
        this.controller.setupWidget('cardTypeList', {
            itemTemplate: 'create-account/credit-card-type',
            itemsCallback: this._getCreditCardTypes.bind(this)
        }, {});
		
        this.controller.listen("cardTypeList", Mojo.Event.listTap, this.handleCardTypeTap.bind(this));
        this._cardTypeList = this.controller.get("cardTypeList");
        this.attributes = {
            property: "value",
            trueValue: true,
            falseValue: false
        };
        
        this.creditcardAttr = {
            hintText: $L('Card Number...'),
            multiline: false,
            label: $L('To:'),
            focus: true,
            limitResize: false,
            enterSubmits: false,
            changeOnKeyPress: true,
            holdToEnable: true,
            modifierState: Mojo.Widget.numLock,
            focusMode: Mojo.Widget.focusSelectMode
        };
        this.creditcardModel = {
            value: this.isEditMode ? this._ccinfo.creditCard.number : "",
            disabled: false
        };
        this.controller.setupWidget('creditCardField', this.creditcardAttr, this.creditcardModel);
        
        var cardDate = new Date();
        if (this.isEditMode) {
            var expDate = this._ccinfo.creditCard.expDate;
            var expMonth = expDate.substring(0, 2);
            var expYear = expDate.substring(2);
            cardDate.setFullYear(parseInt(expYear, 10), parseInt(expMonth, 10) - 1, 1);
        }
        this.originalCardDate = new Date(cardDate);
        this.cardExpiresModel = {
            time: cardDate
        };
        var currentDate = new Date();
        this.controller.setupWidget("cardExpDate", {
            day: false,
            label: $L('Expires'),
            labelPlacement: Mojo.Widget.labelPlacementLeft,
            changeOnKeyPress: true,
            modelProperty: 'time', // one may override the default modelProperty so as to share a Date object with a time picker
            maxYear: (currentDate.getFullYear() + 18),
            minYear: currentDate.getFullYear()
        }, this.cardExpiresModel);
        
        this.secretNumAttr = {
            hintText: $L('Security Number...'),
            multiline: false,
            label: $L('To:'),
            focus: false,
            limitResize: false,
            enterSubmits: false,
            changeOnKeyPress: true,
            holdToEnable: true,
            modifierState: Mojo.Widget.numLock,
            focusMode: Mojo.Widget.focusSelectMode
        };
        this.secretNumModel = {
            value: this.isEditMode ? this._ccinfo.creditCard.cvv : "",
            disabled: false
        };
        this.controller.setupWidget('secretNumField', this.secretNumAttr, this.secretNumModel);
        
        this.phoneAttr = {
            hintText: $L('Telephone Number...'),
            modelProperty: 'original',
            multiline: false,
            label: $L('To:'),
            focus: false,
            limitResize: false,
            enterSubmits: false,
            changeOnKeyPress: true,
            requiresEnterKey: true,
            modifierState: Mojo.Widget.numLock,
            holdToEnable: true,
            maxLength: 16
        };
        this.phoneModel = {
            'original': this.isEditMode ? Mojo.Format.formatPhoneNumber(this._ccinfo.billTo.phone) : "",
            disabled: false
        };
        this.controller.setupWidget('phoneNumField', this.phoneAttr, this.phoneModel);
        
        this.nameAttr = {
            hintText: $L('Name...'),
            multiline: false,
            label: $L('To:'),
            focus: false,
            limitResize: false,
            enterSubmits: false,
            changeOnKeyPress: true,
            textCase: Mojo.Widget.steModeTitleCase,
            holdToEnable: true,
            maxLength: 121,
            autoReplace: false
        };
        this.nameModel = {
            value: this.isEditMode ? this._ccinfo.billTo.firstName + " " + this._ccinfo.billTo.lastName : "",
            disabled: false
        };
        this.controller.setupWidget('nameField', this.nameAttr, this.nameModel);

		this._setAddress1(false, this.binCountry);
		
        this.address2Attr = {
            hintText: $L('Billing Address 2...'),
            multiline: false,
            label: $L('To:'),
            focus: false,
            limitResize: false,
            enterSubmits: false,
            changeOnKeyPress: true,
            textCase: Mojo.Widget.steModeTitleCase,
            holdToEnable: true,
            maxLength: 60,
            autoReplace: false
        };
        this.address2Model = {
            value: this.isEditMode ? this._ccinfo.billTo.address2 : "",
            disabled: false
        };
        this.controller.setupWidget('address2Field', this.address2Attr, this.address2Model);
		
        this._setAddress3(false, this.binCountry);
		
        this._setCity(false, this.binCountry);
        
        this._setupState(false, this.binCountry);
        
        this._setZip(false, this.binCountry);
        
        this.saveButtonModel = {
            buttonLabel: $L("Submit"),
            buttonClass: "primary",
            disabled: true
        };
        
        this.controller.setupWidget('saveButton', {
            type: Mojo.Widget.activityButton
        }, this.saveButtonModel);
        
        this.controller.listen("saveButton", Mojo.Event.tap, this.saveAccount.bind(this));
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
        
        
        
        if (!this.isEditMode) {
            var self = this;
            Weave.Services.AccountServices.getAccountInfo(function(status, response){
                self.nameModel.value = response.firstName + " " + response.lastName;
                self.controller.modelChanged(self.nameModel);
            });
        }
        //this.controller.get("cityField").addEventListener(Mojo.Event.propertyChange, this._enableDisableSave);
        this.controller.get("phoneNumField").addEventListener(Mojo.Event.propertyChange, this._validateAndSubmit);
        this.controller.instantiateChildWidgets(this.controller.get("formContainer"));
    },
    
    _formatAddress: function(msg, address){
		var formattedAdd = msg + "<br/><br/>";
		if(address.address1)
		 formattedAdd +=  address.address1 + "<br/>";
		 if(address.address2)
		 formattedAdd +=  address.address2 + "<br/>";
		 if(address.city)
		 formattedAdd +=  address.city + ", ";
		 if(address.state)
		 formattedAdd +=  address.state + "<br/>";
		 if(address.zip)
		 formattedAdd +=  address.zip;
        return formattedAdd;
        
    },
    
    _handleAddUpdateResponse: function(requestType, status, response, addressParam, creditCardParam){
		Mojo.Log.info("handleAddUpdateResponse status %s response %j addressParam %j creditCardParam %j", status, response, addressParam, creditCardParam);
		var self = this;
        if (status) 
        {	var resObject = undefined;
			if(requestType == "add")
           		resObject = response.OutAddCCPaymentInfo;
			else if(requestType = "update") 
				resObject = response.OutUpdateCCPaymentInfo;
			var billTo = resObject.billTo;
			
			//if result have DAV suggestion or couldn't verify address
            if (billTo !== undefined) {
				//If address cannot be verified by cybersource
				 if (billTo === "") {
				 	var msg = $L("Your address could not be verified. Is it correct?");
				 	msg = self._formatAddress(msg, addressParam);
				 	self.controller.showAlertDialog({
				 		allowHTMLMessage: true,
				 		preventCancel: true,
				 		onChoose: function(value){
				 			switch (value) {
				 				case "change":
									//Since address was saved. So if user reaches this screen it should be editing
									self.controller.get("accountTitle").update($L("Edit Credit Card"));
									self.isEditMode = true;
									self._ccinfo = {billTo: addressParam, creditCard: creditCardParam, paymentInfoId:resObject.paymentInfoId};
									self.saveButtonModel.disabled = true;
									this.controller.modelChanged(this.saveButtonModel);
									break;
										
								case "ok":
									self.controller.stageController.popScene();
									self.params.onComplete &&
									self.params.onComplete({
										accountValid: true
									});
									break;
									
								default:
									break;
								}
							},
							title: $L("Address Verification"),
							message: $L(msg),
							choices: [{
								label: $L("No, it's wrong"),
								value: "change",
								type: "primary"
							}, {
								label: $L("Yes, it's correct"),
								value: "ok",
								type: "secondary"
							}, ]
						});
					}
					//DAV with suggestion
					else{
						var msg = $L("The billing address you entered was not found. Is this version correct?");
					 	msg = self._formatAddress(msg, billTo);
					 	self.controller.showAlertDialog({
				 		allowHTMLMessage: true,
				 		preventCancel: true,
				 		onChoose: function(value){
				 			switch (value) {
				 				case "change":
				 						Weave.Services.PaymentServer.updateAccount(billTo, {paymentInfoId:resObject.paymentInfoId}, function(status, response){
				 							if (status) 
											{
												self.controller.stageController.popScene();
												self.params.onComplete &&
												self.params.onComplete({
													accountValid: true
												});
											}
											else
											{
												var err = response.errorCode ? response.errorCode : response;
									            Utilities.Errors.displayError(err, { errCode: err}, "PMT_addCC_default")
											}
										});
										break;
										
									case "ok":
										self.controller.stageController.popScene();
										self.params.onComplete &&
										self.params.onComplete({
											accountValid: true
										});
										break;
										
									default:
										break;
								}
							},
							title: $L("Address Verification"),
							message: $L(msg),
							choices: [{
								label: $L("Yes, Use This Address"),
								value: "change",
								type: "primary"
							}, {
								label: $L('No, Use What I entered'),
								value: "ok",
								type: "secondary"
							}, ]
						});
					}
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
			var defaultError = requestType == "add" ? "PMT_addCC_default" : "PMT_modifyCC_default";
            var err = response.errorCode ? response.errorCode : response;
			
			//DPL error have help link
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
