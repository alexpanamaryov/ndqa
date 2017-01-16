function exploreRootVolume(rootVolName) {

    try {

        var openedVol = openVolume(rootVolName);

        if(!openedVol) {
            Logger.log('Error! Something went wrong on volume opening attempt.');
            logError_( e );
            return false;
        }

        var rootVolSS = openedVol.volSS;
        var rootVolSSId = openedVol.volSSId;
        var rootVol = openedVol.vol;

        Logger.log('Looking for Tables in ' + rootVolName + ' volume that was specified as Root... ');

        var rootVolTables = rootVolSS.getSheets();

        var route = {};
        var rootVolMapTableName = '';
        var tabindex = 0;

        if(rootVolTables)
        {

            Logger.log(rootVolTables.length + ' tables found in "' + rootVolName + '" volume.');

            var rootVolMapProcResults = processMapTable(rootVol,rootVolName,rootVolSSId,rootVolTables);

            var rootVolMapIndex = rootVolMapProcResults.volMapIndex;
            rootVolMapTableName = rootVolMapProcResults.tabName;
            var lastRouteId = rootVolMapProcResults.newId;

            Logger.log('========================== ROOT VOLUME');

            Logger.log('Updating info about other tables in "' + rootVolName + '" volume...');

            for(tabindex = 0; tabindex < rootVolTables.length; tabindex++) {

                if(tabindex != rootVolMapIndex) {

                    var tabName = rootVolTables[tabindex].getSheetName();

                    Logger.log('========================== NEXT TABLE');

                    Logger.log('Processing "' + tabName + '" table...');

                    var tabSId = rootVolTables[tabindex].getSheetId();

                    Logger.log('sid: ' + tabSId);

                    var tabFields = getFields(rootVol, tabName);

                    route.id = lastRouteId;
                    route.volName = rootVolName;
                    route.ssId = rootVolSSId;
                    route.tabName = tabName;
                    route.sid = tabSId;
                    route.mapTabName = rootVolMapTableName;

                    for(var field in tabFields[0]) {

                        route.field = field;

                        lastRouteId = addRoute(rootVol, route);

                    }

                    Logger.log('"' + tabName + '" table processing finished.\n\n');

                }

            }

            Logger.log('Info about other tables in "' + rootVolName + '" volume is updated.\n\n');

        } else {
            Logger.log('Error! Tables were not found in "' + rootVolName + '" volume.');
            logError_( e );
            return false;
        }

        /* =================== PROCESSING OTHER VOLUMES  =================== */

        Logger.log('========================== NEXT VOLUME');
        Logger.log('Processing other volumes...');

        // for(var volIndex = 0; volIndex < volumes.length; volIndex++){
        //
        //     var currentVolName = volumes[volIndex].volume;
        //
        //     if(currentVolName == rootVolName){
        //         continue;
        //     }
        //
        //
        //     Logger.log('Processing "' + currentVolName + '" Root Volume... ');
        //
        //     var volFile = DriveApp.getFilesByName(currentVolName).next();
        //     Logger.log('Volume File: ' + volFile);
        //
        //     var volSS = SpreadsheetApp.open(volFile);
        //     Logger.log('Volume Spreadsheet: ' + volSS.getName());
        //
        //     var volSSId = volSS.getId();
        //     Logger.log('Volume Spreadsheet Id: ' + volSSId);
        //
        //     var vol = open( volSSId );
        //     Logger.log('Volume: "' + currentVolName + '" ' + vol);
        //
        //     Logger.log('Looking for Tables in current volume... ');
        //
        //     var volTables = volSS.getSheets();
        //
        //     if(volTables) {
        //
        //         Logger.log(volTables.length + ' tables found in "' + currentVolName
        //             + '" volume.');
        //
        //         Logger.log('Searching "map" table...');
        //
        //
        //     }
        //
        // }


        return true;

    } catch( e ) {

        Logger.log('Error! Something went wrong on Root volume processing attempt.');
        logError_( e );
        return false;

    }

}

function addRoute(vol, route) {

    Logger.log('=========================== NEW ROUTE');

    Logger.log('Adding route for "' + route.field + '" field in "' + route.volName + '" -> "' + route.tabName + '" table.');

    var fName = '';

    if(route.field == 'id') {
        fName = '*';
    } else {
        fName = route.field;
    }

    var fPointer = route.volName + '_' + route.tabName + '_id_' + fName;

    Logger.log('Route Id: ' + route.id);
    Logger.log('Volume: ' + route.volName);
    Logger.log('ssid: ' + route.ssId);
    Logger.log('Table: ' + route.tabName);
    Logger.log('sid: ' + route.sid);
    Logger.log('Field: ' + route.field);
    Logger.log('fPointer: ' + fPointer);
    Logger.log('Map Table: : ' + route.mapTabName);

    vol.insertRow(
        route.mapTabName, {
            id: route.id,
            volume: route.volName,
            ssid: route.ssId,
            table: route.tabName,
            sid: route.sid,
            field: route.field,
            fpointer: fPointer,
            updated: Date.now(),
            state: 'active'
        }
    );

    route.id = route.id + 1;

    Logger.log(fPointer + ' route added successfully.');

    Logger.log('Next route Id = ' + route.id);

    Logger.log('=========================== ROUTE END');

    return route.id;
}

function processMapTable(vol, volName, ssId, volTabs) {

    Logger.log('Processing "map" table...');

    var ret = {};

    var route = {};

    for(var tabindex = 0; tabindex < volTabs.length; tabindex++) {

        var tabName = volTabs[tabindex].getSheetName();

        if(tabName == 'map') {

            ret.tabName = tabName;
            route.mapTabName = tabName;

            Logger.log('"map" table found in "' + volName + '" volume.');

            ret.volMapIndex = tabindex;
            /*ret.mapTableSId = volTabs[rootVolMapIndex].getSheetId();*/

            var sId = volTabs[tabindex].getSheetId();

            ret.sId = sId;

            Logger.log('Getting volumes list...');

            var volumes = vol.getRows(                    /* LIST OF VOLUMES */
                tabName,
                [],
                {state:'active'}
            );

            if(!volumes) {

                Logger.log('Error! There are no volumes in list.');
                logError_(e);
                return false;

            }

            Logger.log(volumes.length + ' volumes were found.');
            Logger.log('Updating "map" table info for "' + volName + '" volume...');

            var newId = volumes.length + 1;

            ret.newId = newId;

            route.id = newId;
            route.volName = volName;
            route.ssId = ssId;
            route.tabName = ret.tabName;
            route.sid = sId;


            for(var field in volumes[0]) {

                route.field = field;

                if(route.field == 'id') {

                    Logger.log('=================== EXISTING ROUTE UPDATE');
                    Logger.log('field = '+ field);

                    Logger.log('route.field = '+ route.field);

                    vol.updateRow(
                        route.mapTabName, {
                            ssid: route.ssId,
                            table: route.tabName,
                            sid: sId,
                            field: route.field,
                            fpointer: volName + '_' + route.tabName + '_id_*',
                            updated: Date.now()}, {

                            volume: route.volName,
                            state:'active'
                        }
                    );

                } else {

                    /*Logger.log('=================== EXISTING ROUTE UPDATE');*/

                    Logger.log('field = '+ field);

                    //route.field = field;

                    Logger.log('route.field = '+ route.field);

                    ret.newId = addRoute(vol, route);

                }

            }

            Logger.log('"map" table info for "' + volName + '" volume updated successfully.');

            return ret;
        }

        Logger.log('Error! "map" table is not found in "' + volName + '" volume.');
        logError_( e );
        return false;
    }

}

function getFields(volume, table) {

    return fields = volume.getRows(
        table,
        [],
        {state:'active'},
        1
    );

}

function openVolume(volName) {

    try {

        var ret = {};

        Logger.log('Processing "' + volName + '" volume... ');
        Logger.log('Checking whether this volume opening occurs first time...');

        var userProps = PropertiesService.getUserProperties();

        ret.volSSId = userProps.getProperty(volName);

        if(ret.volSSId == null) {

            Logger.log('"' + volName + '" volume opens first time. Using file name to open.');

            ret.volFile = DriveApp.getFilesByName(volName).next();
            Logger.log('Volume File: ' + ret.volFile);

            ret.volSS = SpreadsheetApp.open(ret.volFile);

            ret.volName = ret.volSS.getName();

            Logger.log('Volume Spreadsheet: ' + ret.volName);

            ret.volSSId = ret.volSS.getId();
            Logger.log('Volume Spreadsheet Id: ' + ret.volSSId);

            ret.vol = open( ret.volSSId );
            Logger.log('Volume "' + ret.volName + '" is opened. ' + ret.vol);

            Logger.log('Updating properties...');

            userProps.setProperty(volName, ret.volSSId);

            Logger.log('Updating map...');

            ret.vol.updateRow(
                'map',
                {ssid: ret.volSSId},
                {volume: volName}
            );

            return ret;

        } else {

            Logger.log('"' + volName + '" volume opens not first time. Using ID to open.');

            Logger.log('Volume Spreadsheet Id: ' + ret.volSSId);

            ret.volSS = SpreadsheetApp.openById(ret.volSSId);

            ret.volName = ret.volSS.getName();

            Logger.log('Volume Spreadsheet: ' + ret.volName);

            ret.vol = open( ret.volSSId );
            Logger.log('Volume "' + ret.volName + '" is opened. ' + ret.vol);

            return ret;
        }

    } catch( e ) {

        Logger.log('Something went wrong on open volume attempt.');
        logError_( e );
        return false;

    }

}

function collectFieldsInfo(volObj, table_) {

    Logger.log('\n ============ COLLECTING FIELDS INFO');

    var volume = volObj.vol;
    var table = table_;

    var field = '';
    var fieldNameParts = [];

    var _ret = function() {
        this.fkeys = [{}];
        this.valContainers = [{}];
        this.foreignValContainers = [{}];
    };

    var ret = new _ret();

    var _valContainer = function(fieldName_, volume_, table_, key_, field_) {
        this.fieldName = fieldName_;
        this.volume = volume_;
        this.table = table_;
        this.tkey = key_;
        this.field = field_;

    };

    var vcCount = 0;

    var _fk = function(fieldName_, volume_, table_, key_) {
        this.fieldName = fieldName_;
        this.volume = volume_;
        this.table = table_;
        this.tkey = key_;
    };

    var fkCout = 0;

    var _foreignValContainer = function(fieldName_, volume_, table_, key_, field_) {
        this.fieldName = fieldName_;
        this.volume = volume_;
        this.table = table_;
        this.tkey = key_;
        this.field = field_;
    };

    var fvcCount = 0;

    Logger.log('Getting fields names for "' + volObj.volName + '" -> "' + table + '"');

    var fields = volume.getRows(
        table,
        [],
        {state:'active'},
        1
    );

    if(fields){

        for (var fieldIdx in fields[0]) {

            field = fieldIdx;

            Logger.log('Processing "' + field + '" field...');

            fieldNameParts = field.split('_');

            Logger.log('Field name contains ' + fieldNameParts.length + ' parts.');


            if((fieldNameParts.length > 0) && (fieldNameParts.length < 3)) {

                Logger.log('Field "' + field
                    + '" looks like value container in current table.');

                var key = 'id';

                var valContainer = new _valContainer(
                    field,
                    volObj.volName,
                    table,
                    key,
                    field
                );

                Logger.log('VALUE CONTAINER IN CURRENT TABLE -----> ' + valContainer.fieldName);
                Logger.log('-----> Volume: ' + valContainer.volume);
                Logger.log('-----> Table: ' + valContainer.table);
                Logger.log('-----> Key: ' + valContainer.tkey);
                Logger.log('-----> Field: ' + valContainer.field);

                Logger.log('\n======= PUSHING \n'
                    + JSON.stringify(valContainer) + '\n');

                ret['valContainers'][vcCount] = valContainer;
                vcCount ++;

            } else if(fieldNameParts.length == 3) {

                Logger.log('Field "' + field + '" looks like foreign key.');

                var fk = new _fk(
                    field,
                    fieldNameParts[0],
                    fieldNameParts[1],
                    fieldNameParts[2]
                );

                Logger.log('FOREIGN KEY -----> ' + fk.fieldName);
                Logger.log('-----> Volume: ' + fk.volume);
                Logger.log('-----> Table: ' + fk.table);
                Logger.log('-----> Key: ' + fk.tkey);

                var isDupFk = false;

                for(var fkIdx = 0; fkIdx < ret['fkeys'].length; fkIdx++) {

                    if(
                        (ret['fkeys'][fkIdx].fieldName == fk.fieldName) &&
                        (ret['fkeys'][fkIdx].volume == fk.volume) &&
                        (ret['fkeys'][fkIdx].table == fk.table) &&
                        (ret['fkeys'][fkIdx].tkey == fk.tkey)) {

                        isDupFk = true;

                    }

                }

                if(!isDupFk) {

                    Logger.log('\n======= PUSHING \n'
                        + JSON.stringify(fk) + '\n');

                    ret['fkeys'][fkCout] = fk;
                    fkCout ++;

                } else {
                    Logger.log('Such FK is already processed. Skipping.');
                }


            } else if(fieldNameParts.length == 4) {

                Logger.log('Field "' + field
                    + '" looks like pointer to value container in "'
                    + fieldNameParts[0] + '" -> "' + fieldNameParts[1] + '" table.');

                var foreignValContainer = new _foreignValContainer(
                    field,
                    fieldNameParts[0],
                    fieldNameParts[1],
                    fieldNameParts[2],
                    fieldNameParts[3]
                );

                Logger.log('VALUE CONTAINER IN FOREIGN TABLE -----> ' + foreignValContainer.fieldName);
                Logger.log('-----> Volume: ' + foreignValContainer.volume);
                Logger.log('-----> Table: ' + foreignValContainer.table);
                Logger.log('-----> Key: ' + foreignValContainer.tkey);
                Logger.log('-----> Field: ' + foreignValContainer.field);

                var fvcIdx = 0;
                var isDupFvc = false;

                var isDupVol = false;
                var dupVolPos = 0;

                var isDupTab = false;
                var dupTabPos = 0;

                var isDupKey = false;
                var dupKeyPos = 0;

                var isDupField = false;
                var dupFieldPos = 0;

                for(fvcIdx; fvcIdx < ret['foreignValContainers'].length; fvcIdx++) {

                    if(ret['foreignValContainers'][fvcIdx].fieldName == foreignValContainer.fieldName) {
                        isDupFvc = true;
                        break;
                    } else if(ret['foreignValContainers'][fvcIdx].volume == foreignValContainer.volume) {
                        isDupVol = true;
                        dupVolPos = fvcIdx;
                    } else if(ret['foreignValContainers'][fvcIdx].table == foreignValContainer.table) {
                        isDupTab = true;
                        dupTabPos = fvcIdx;
                    } else if(ret['foreignValContainers'][fvcIdx].tkey == foreignValContainer.tkey) {
                        isDupKey = true;
                        dupKeyPos = fvcIdx;
                    } else if(ret['foreignValContainers'][fvcIdx].field == foreignValContainer.field) {
                        isDupField = true;
                        dupFieldPos = fvcIdx;
                    }

                }

                if(isDupFvc){
                    Logger.log('Such FVC is already processed. Skipping.');
                } else {

                    if((isDupTab && isDupKey) && (dupTabPos == dupKeyPos)) {
                        if(
                            !isDupField &&
                            (dupTabPos == dupKeyPos) &&
                            (dupTabPos == dupFieldPos)) {
                            ret['foreignValContainers'][dupFieldPos]
                                .field[ret['foreignValContainers'][dupFieldPos].field.length + 1]
                                = foreignValContainer.field;
                        } else {
                            Logger.log('Such FVC is already processed. Skipping.');
                        }

                    } else {

                        Logger.log('\n======= PUSHING \n'
                            + JSON.stringify(foreignValContainer) + '\n');

                        ret['foreignValContainers'][fvcCount] = foreignValContainer;
                        fvcCount ++;

                    }

                }



            } else {

                Logger.log('Wrong field name format. It should be: volume_table_key_[field].');

                return false;

            }

        }

        Logger.log(
            '\nValues in current table: ' + vcCount + '\n'
            + 'Foreign keys: ' + fkCout + '\n'
            + 'Pointers to values in other tables: ' + fvcCount + '\n'
        );

        return ret;

    } else {
        Logger.log('It is impossible to get fields names for "' + volObj.volName + '" -> "' + table + '"');
        return false;
    }

}


function dbSelect(volName, tabName, target_, cond_) {

    Logger.log('\n ============ SELECT QUERY');
    Logger.log('Selecting data from "' + volName + '" -> "' + tabName + '" table');

    var target = target_;
    var cond = cond_;

    if((!cond.state) || (typeof(cond) != 'object')) {
        cond.state = 'active';
        Logger.log('Selecting objects in active state: ' + JSON.stringify(cond));
    } else {
        Logger.log('where ' + JSON.stringify(cond));
    }

    var tgCount = 0;
    var targets = [];

    if( (typeof( target ) != 'object' || target.length == 0) && volName && tabName) {

        Logger.log('Target is not specified. Getting full record...');





        var volume = openVolume(volName);
        var fieldsInfo = collectFieldsInfo(volume, tabName);

        Logger.log(
            '\n======= TABLE FIELDS PROCESSING RESULT ======= \n'
            + JSON.stringify(fieldsInfo)
            + '\n======= END ======= \n'
        );

        tgCount = 0;

        for(var _vcIdx in fieldsInfo.valContainers) {

            targets[tgCount] = fieldsInfo.valContainers[_vcIdx].field;
            tgCount ++;

        }

        Logger.log('Number of targets: ' + tgCount);

        var valsFromCurrTable = volume.vol.getRows(
            tabName,
            targets,
            cond
        );

        Logger.log('\n >>>> Values from current table <<<< \n'
            + JSON.stringify(valsFromCurrTable[0]) + '\n'
        );




        for(var _fkIdx in fieldsInfo.fkeys) {

            /* fieldsInfo.fkeys[_fkIdx] */

        }

        var fTargets = [];

        var fVolsCount = 0;
        var fVolsIdx = 0;
        var foreignVlos = [];
        var volInList = false;

        for(var _fvcIdx in fieldsInfo.foreignValContainers) {

            if(foreignVlos.length != 0) {

                for(fVolsIdx = 0; fVolsCount < foreignVlos.length; fVolsIdx++)
                {
                    if(foreignVlos[fVolsIdx] == fieldsInfo.foreignValContainers[_fvcIdx].volume) {
                        volInList = true;
                    }

                    if(!volInList) {
                        foreignVlos[fVolsCount + 1] = fieldsInfo.foreignValContainers[_fvcIdx].volume;
                    }
                }

            } else {
                foreignVlos[fVolsCount] = fieldsInfo.foreignValContainers[_fvcIdx].volume;
            }


        }

        /*var selectResult = volume.vol.getRows(
            tabName,
            target,
            cond
        );

        Logger.log('\nSelected: ' + JSON.stringify(selectResult[0]));*/






    } else if(target[0].length == 0 && volName && tabName) {

        Logger.log('Getting: ' + target[0]);

        targets.push(target[0]);

    } else if(target[0].length > 0 && volName && tabName) {
        Logger.log('Getting ' + target[0].length + ' targets: ');

        for(tgCount = 0; tgCount < target[0].length; tgCount++) {
            Logger.log(target[tgCount]);

            targets.push(target[tgCount]);
        }
    } else {
        Logger.log('Incorrect query: '
            + volName + ' -> ' + tabName + ' -> ' + target
            + ' where ' + JSON.stringify(cond));
        return false;
    }

}





function selectValue(currentVol, currentTab, _cond) {

    var cond = _cond;

    cond.state = 'active';

    var openedVol = '';

    var gottenResult = '';

    var value = [];

    var startVol = openVolume(currentVol);

    Logger.log('startVol.vol -----> ' + startVol.volName);
    Logger.log('currentTab -----> ' + currentTab);

    var fields = getFields(startVol.vol, currentTab);

    var fk = {};

    for(var field in fields[0]) {

        var fieldName = field;

        if((fieldName != 'id') && (fieldName != 'state') && (fieldName != 'updated')) {

            Logger.log('Processing "' + fieldName + '" field...');

            var routeStepsCount = 1;

            var splitterPosition = fieldName.indexOf('_');

            while (splitterPosition != -1) {
                routeStepsCount++;

                splitterPosition = fieldName.indexOf('_', splitterPosition + 1);
            }

            if((routeStepsCount == 1) || (routeStepsCount < 3)) {
                Logger.log('Field name: ' + fieldName);
                Logger.log('Number of steps in route: ' + routeStepsCount);

                Logger.log('Trying to get "' + fieldName + '" field value from "' + currentVol
                    + '" -> "' + currentTab + '" table...');


                /* ===================  TEMPORARY ===================== */


                gottenResult = startVol.vol.getRows(
                    currentTab,
                    [fieldName],
                    cond
                );

                if(!gottenResult) {

                    Logger.log('There is no value for field "' + fieldName
                        + '" by specified conditions or state of record is "inactive."');

                    return false;
                }

                /*Logger.log(JSON.stringify(gottenResult));*/ /* TEMP */


                value.push(gottenResult[0][fieldName]);

                /*Logger.log('Value: ' + value);*/



                /*return value;*/
            } else {

                Logger.log('Getting FK...');



                Logger.log('Field name is route. Parsing...');

                Logger.log('Count of steps in route: ' + routeStepsCount);

                var splittedFieldName = fieldName.split('_');

                var result = {};

                if(splittedFieldName.length == 4) {
                    result.srcField = splittedFieldName[3];
                } else if (splittedFieldName.length == 3) {
                    result.srcField = splittedFieldName[2];
                } else {
                    Logger.log('Wrong field name format.');
                    return false;
                }

                result.srcVolume = splittedFieldName[0];
                result.srcTable = splittedFieldName[1];

                Logger.log('The route is: "' + result.srcVolume + '" -> "' + result.srcTable + '" -> "' + result.srcField + '"');

                if(result.srcField == 'id') {
                    Logger.log('Source field name in route = "' + result.srcField + '". Getting row...');


                    openedVol = openVolume(result.srcVolume);


                    gottenResult = openedVol.vol.getRows(
                        result.srcTable,
                        [],
                        cond
                    );

                    Logger.log(gottenResult[0]);

                    if(!gottenResult) {
                        Logger.log('There is no value for field "' + fieldName
                            + '" by specified conditions or state of record is "inactive."');

                        return false;
                    }

                    fk.id = gottenResult[0]['id'];

                    Logger.log('FK: ' + fk.id);
                    Logger.log('Opened Vol: ' + openedVol.volName);

                    var rowFieldName = '';

                    for(var rowField in gottenResult[0]) {

                        rowFieldName = rowField;

                        Logger.log('=========== >>>> ' + rowFieldName);

                        if((rowFieldName != 'id') && (rowFieldName != 'state') && (rowFieldName != 'updated')) {

                            Logger.log('Getting... ' + rowFieldName);

                            Logger.log('openedVol.volName -----> ' + startVol.volName);
                            Logger.log('result.srcTable -----> ' + result.srcTable);

                            var subVal = selectValue(openedVol.volName, result.srcTable, fk.id);

                            Logger.log('======== SUB VALUE: ' + subVal);

                        } else {
                            Logger.log('Bumping... ' + rowFieldName);
                        }
                    }

                    /*Logger.log(JSON.stringify(gottenResult));*/ /* TEMP */


                    value.push(subVal); /*[result.srcField];*/

                    Logger.log('======== VALUE: ' + value);

                    /*Logger.log('Value: ' + value);*/

                    /*return value;*/

                } else {
                    Logger.log('Getting value from "' + result.srcVolume + '" -> "' + result.srcTable + '" -> "' + result.srcField +  '" field...');

                    var srcVolume = openVolume(result.srcVolume);

                    fk = {}; /*--------- FOREIGN KEY -------------*/

                    var tmp = startVol.vol.getRows(
                                currentTab,
                                [fieldName],
                                cond
                            );

                    fk.id = tmp[0][fieldName];

                    Logger.log('Foreign key: ' + fk.id);

                    gottenResult = srcVolume.vol.getRows(
                        result.srcTable,
                        [result.srcField],
                        fk   /******************************************************/
                    );

                    if(!gottenResult) {
                        Logger.log('There is no value for field "' + fieldName
                            + '" by specified conditions or state of record is "inactive."');

                        return false;
                    }

                    /*Logger.log(JSON.stringify(gottenResult));*/ /* TEMP */

                    value.push( gottenResult[0][result.srcField]);

                    /*Logger.log('Value: ' + value);*/


                    /*return gottenResult[0];*/
                }

            }

        }

    }

    Logger.log('============= RESULT ============');
    Logger.log(value);

    return value;

}

