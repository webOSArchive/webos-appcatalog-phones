#!/bin/bash

# Customize for your env
PROJECT_PATH="`pwd`" #no trailing slash
PATH_TO_COMPRESSOR="/home/amgad/palm/client/submissions/yuicompressor-2.4.2/build/yuicompressor-2.4.2.jar"

# Delete the old scripts
echo 'Removing old js/css'
rm allscripts.js
rm allscriptscompressed.js
rm app/controllers/compressed/*.js
rm stylesheets/appcatalog.compressed.css

# The most common scripts are bundled into a single include
echo 'Combining common js scripts'

# Google Analytics stuff
cat ./app/lib/ga/ga.js >> allscripts.js
cat ./app/lib/google-analytics.js >> allscripts.js
cat ./app/lib/app-metrics.js >> allscripts.js

cat ./app/controllers/app-assistant.js >> allscripts.js
cat ./app/controllers/main-assistant.js >> allscripts.js
cat ./app/controllers/password-assistant.js >> allscripts.js
cat ./app/controllers/forgot-password-assistant.js >> allscripts.js
cat ./app/controllers/reset-password-assistant.js >> allscripts.js
cat ./app/controllers/reset-email-assistant.js >> allscripts.js
cat ./app/controllers/promocode-assistant.js >> allscripts.js

cat ./app/model/profile-model.js >> allscripts.js
cat ./app/model/preferences.js >> allscripts.js
cat ./app/model/termsofuse.js >> allscripts.js

cat ./app/utilities/spinner.js >> allscripts.js
cat ./app/utilities/errors.js >> allscripts.js
cat ./app/utilities/utcdate.js >> allscripts.js
cat ./app/utilities/versioncheck.js >> allscripts.js
cat ./app/utilities/lazyloadimage.js >> allscripts.js
cat ./app/utilities/common.js >> allscripts.js

cat ./weave/weave.js >> allscripts.js

cat ./weave/system/activator.js >> allscripts.js

cat ./weave/services/services.js >> allscripts.js
cat ./weave/services/accountservices.js >> allscripts.js
cat ./weave/services/applicationinstaller.js >> allscripts.js
cat ./weave/services/applicationmanager.js >> allscripts.js
cat ./weave/services/catalogserver.js >> allscripts.js
cat ./weave/services/applicationserver.js >> allscripts.js
cat ./weave/services/browser.js >> allscripts.js
cat ./weave/services/connectionmanager.js >> allscripts.js
cat ./weave/services/deviceprofile.js >> allscripts.js
cat ./weave/services/appinstallservice.js >> allscripts.js
cat ./weave/services/systemmanager.js >> allscripts.js
cat ./weave/services/systemproperties.js >> allscripts.js
cat ./weave/services/paymentserver.js >> allscripts.js

cat ./weave/utilities/regexp.js >> allscripts.js
cat ./weave/utilities/appmenu.js >> allscripts.js
cat ./weave/utilities/appcategorieshelper.js >> allscripts.js
cat ./weave/utilities/appversions.js >> allscripts.js

cat ./weave/download/downloadstates.js >> allscripts.js
cat ./weave/download/appdetails.js >> allscripts.js
cat ./weave/download/appdownload.js >> allscripts.js
cat ./weave/download/appdownloadmanager.js >> allscripts.js

# Less common scripts are compressed individually and included from the compressed location
echo 'Compressing individual controller js files'
JSFILELIST=`ls ${PROJECT_PATH}/app/controllers/*.js | xargs -n1 basename`
# Compress each in turn
for JSFILE in $JSFILELIST
    do
        java -jar ${PATH_TO_COMPRESSOR} -o ${PROJECT_PATH}/app/controllers/compressed/${JSFILE} ${PROJECT_PATH}/app/controllers/${JSFILE}
    done

echo 'Compressing individual model js files'
JSFILELIST=`ls ${PROJECT_PATH}/app/model/*.js | xargs -n1 basename`
# Compress each in turn
for JSFILE in $JSFILELIST
    do
        java -jar ${PATH_TO_COMPRESSOR} -o ${PROJECT_PATH}/app/model/compressed/${JSFILE} ${PROJECT_PATH}/app/model/${JSFILE}
    done

# Now compress allscripts.js & appcatalog.css files
echo 'Compressing large common js file'
java -jar ${PATH_TO_COMPRESSOR} -o ${PROJECT_PATH}/allscriptscompressed.js ${PROJECT_PATH}/allscripts.js
echo 'Compressing css'
java -jar ${PATH_TO_COMPRESSOR} -o ${PROJECT_PATH}/stylesheets/appcatalog.compressed.css ${PROJECT_PATH}/stylesheets/appcatalog.css
