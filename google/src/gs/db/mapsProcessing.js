function processMap () {

    /*var commonSS = SpreadsheetApp.open( DriveApp.getFilesByName('common').next() );
    /*var peopleFile = DriveApp.getFilesByName('people').next();*/
    /*var companySS = SpreadsheetApp.open( DriveApp.getFilesByName('company').next() );

    var peopleSS = SpreadsheetApp.open(DriveApp.getFilesByName('people').next());

    var peopleSSId = peopleSS.getId(); /*peopleSS.getSheetByName('map').getSheetId();*/

   // peopleSS.getSheetByName("map").getDataRange();

   /* var commonFile = DriveApp.getFilesByName('common').next();

    Logger.log('Common File: ' + commonFile);

    var commonDBVolSS = SpreadsheetApp.open(commonFile);

    Logger.log('commonDBVolSS: ' + commonDBVolSS);

    var commonDBVolId = commonDBVolSS.getId();

    Logger.log('commonDBVolId: ' + commonDBVolId);

    var commonDBVol = open( commonDBVolId );

    Logger.log('commonDBVol: ' + commonDBVol);*/

    /*var rows = db.getRows('ss',[],{state:'active'});*/

    /*Logger.log(db.deleteItem('ss','7'));*/

    /*buildMap(commonDBVol);*/



    /*exploreRootVolume('common');*/

    var STab = '';
    var DTab = '';

    var volume = 'people';
    var table = 'persons';

    var field0 = 'common_types_id_value';

    var field1 = 'common_types_id';

    var field2 = 'common_types';


    var currVol = 'people';

    var currTab = 'emails';

    var field = 'username';

    var rfield = 'people_persons_id_lastname';

    var cond = {id:'12'};

    /*var userProps = PropertiesService.getUserProperties();
    userProps.deleteAllProperties();*/

    /*selectValue(currVol, currTab, cond);*/

    dbSelect(volume, currTab, [], cond);


}

