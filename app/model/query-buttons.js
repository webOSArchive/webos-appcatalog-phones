var QueryButtons =
{
        _homeSearchBarLabels: [
            $L("Featured Apps"),
            $L("Top Paid Apps"),
            $L("Top Free Apps"),
            $L("What's New")
        ],

	_homeQueryItems:  [
            {
                iconPath: 'images/menu-button-hot.png',
                command: 'Blowfish2Query1'
            },
            {
                iconPath: 'images/menu-button-paid-dollar.png', //updated later based on country
                command: 'Blowfish2Query2'
            },
            {
                iconPath: 'images/menu-button-free.png',
                command: 'Blowfish2Query3'
            },
            {
                iconPath: 'images/menu-button-new.png',
                command: 'Blowfish2Query4'
            }
        ],

        _otherQueryItems: [
            {
                iconPath: 'images/menu-button-all.png',
                command: 'Blowfish2Query5'
            },
            {
                iconPath: 'images/menu-button-paid-dollar.png', //updated later based on country
                command: 'Blowfish2Query6'
            },
            {
                iconPath: 'images/menu-button-free.png',
                command: 'Blowfish2Query7'
            },
            {
                iconPath: 'images/menu-button-new.png',
                command: 'Blowfish2Query8'
            }
        ],

	getQueryButtonsForCategory: function(category, country)
	{
            var queryItems;

            if (category !== undefined && (category > 0 || category === 'all')) {
                queryItems = this._otherQueryItems;
            } else {
                queryItems = this._homeQueryItems;
            }

            //The paid icon is determined based on the activation country (US is default)
            if (country !== undefined) {
                queryItems[1].iconPath = this.getCurrencyIconForActivationCountry(country);
            }

            return queryItems;
	},

        updateQidForCategory: function(category, currentQid)
        {
            var i,
                buttons = this.getQueryButtonsForCategory(category);
            
            for(i=0; i<buttons.length; i++) {
                if (currentQid === buttons[i].command) {
                    return currentQid; //same button set so no swap required
                }
            }

            //If we made it here then this category has a different button set
            //We need to find the new active button for the currently selected command
            //menu position.
            var qidNum = parseInt(currentQid.replace("Blowfish2Query", ""), 10);
            if (qidNum < 5) {
                //Find opposite entry in the 5 to 8 range
                return "Blowfish2Query" + (qidNum + 4);
            } else {
                //Find opposite entry in the 1 to 4 range
                return "Blowfish2Query" + (qidNum - 4);
            }
        },

        getCurrencyIconForActivationCountry: function(activationCountry) {
            var currencyIconPath = '',
                country          = activationCountry.toLowerCase();

            switch (country) {
                case 'gb':
                    currencyIconPath = 'images/menu-button-paid-pound.png';
                    break;
                case 'fr':
                case 'de':
                case 'ie':
                case 'es':
                    currencyIconPath = 'images/menu-button-paid-euro.png';
                    break;
                case 'cn':
                case 'jp':
                    currencyIconPath = 'images/menu-button-paid-rmb.png';
                    break;
                default:
                    currencyIconPath = 'images/menu-button-paid-dollar.png';
                    break;
            }

            return currencyIconPath;
        },

        getSearchBarLabelForQid: function(currentQid) {
            var qidNum = parseInt(currentQid.replace("Blowfish2Query", ""), 10);

            return this._homeSearchBarLabels[qidNum - 1];
        }
};
