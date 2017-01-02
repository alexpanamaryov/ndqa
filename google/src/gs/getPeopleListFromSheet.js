function getPeopleListFromSheet(is_active) {

    var peopleFile = DriveApp.getFilesByName('people').next();

    var peopleSheet = SpreadsheetApp.open(peopleFile).getSheetByName("people").getDataRange().getValues();
    var companiesSheet = SpreadsheetApp.open(peopleFile).getSheetByName("companies").getDataRange().getValues();
    var locationsSheet = SpreadsheetApp.open(peopleFile).getSheetByName("locations").getDataRange().getValues();
    var positionsSheet = SpreadsheetApp.open(peopleFile).getSheetByName("positions").getDataRange().getValues();

    var id = '';
    var isActive = '';
    var name = '';
    var company = '';
    var location = '';
    var position = '';
    var email = '';
    var avatar = '';

    var activePeople = '{ "activePeople" : [';
    var inactivePeople = '{ "inactivePeople" : [';

    var peopleJSON = '';

    function checkSheetStruct(sheet, col_name) {

        Logger.log('Checking column: ' + col_name);

        var col_index = 0;
        var col_found = false;

        for(col_index; col_index < sheet[0].length; col_index++) {
            if(sheet[0][col_index] == col_name) {
                Logger.log('"' + col_name + '" column found. Index: ' + col_index);
                col_found = true;
                break;
            }
        }

        if(!col_found) {
            Logger.log('Error! There is no "' + col_name + '" column');
            return -1;
        }

        return col_index;
    }

    function getPerson (row) {

        var id_col_index = 0;
        var name_col_index = 0;

        var itemFound = false;

        var p = 0;

        for(var col = 0; col < peopleSheet[0].length; col++) {

            switch(peopleSheet[0][col]) {
                case 'id':

                    id = peopleSheet[row][col];
                    Logger.log("Id: " + id);
                    break;

                case 'is_active':

                    isActive = peopleSheet[row][col];
                    Logger.log("isActive: " + isActive);
                    break;

                case 'name':

                    name = peopleSheet[row][col];
                    Logger.log("Name: " + name);
                    break;

                case 'email':

                    email = peopleSheet[row][col];
                    Logger.log("E-Mail: " + email);
                    break;

                case 'companies':

                    Logger.log("Searching Company Name by Id in 'people' file -> 'companies' sheet.");
                    Logger.log("Checking 'people' file -> 'companies' sheet structure...");

                    id_col_index = checkSheetStruct(companiesSheet,'id');
                    name_col_index = checkSheetStruct(companiesSheet,'name');

                    if((id_col_index == -1) || (name_col_index == -1)) {
                        Logger.log("Error! 'people' file -> 'companies' sheet structure is wrong.");
                        return -1;
                    }

                    Logger.log("'people' file -> 'companies' sheet structure is correct. Searching given Id: " + peopleSheet[row][col]);

                    Logger.log("Companies available: " + companiesSheet.length);

                    for(p = 1; p < companiesSheet.length; p++) {

                        Logger.log("Company Id in 'companies' sheet: " + companiesSheet[p][id_col_index]);

                        if(companiesSheet[p][id_col_index] == peopleSheet[row][col]) {
                            company = companiesSheet[p][name_col_index];
                            itemFound = true;
                            break;
                        }
                    }

                    if(!itemFound) {
                        Logger.log("Error! There is no such Company Id: " + peopleSheet[row][col]);
                        return -1;
                    }

                    Logger.log("Company: " + company);
                    break;

                case 'locations':

                    Logger.log("Searching Location by Id in 'people' file -> 'locations' sheet.");
                    Logger.log("Checking 'people' file -> 'locations' sheet structure...");

                    id_col_index = checkSheetStruct(locationsSheet,'id');
                    name_col_index = checkSheetStruct(locationsSheet,'name');

                    if((id_col_index == -1) || (name_col_index == -1)) {
                        Logger.log("Error! 'people' file -> 'locations' sheet structure is wrong.");
                        return -1;
                    }

                    Logger.log("'people' file -> 'locations' sheet structure is correct. Searching given Id: " + peopleSheet[row][col]);

                    Logger.log("Locations available: " + locationsSheet.length);

                    for(p = 1; p < locationsSheet.length; p++) {

                        Logger.log("Location Id in 'locations' sheet: " + locationsSheet[p][id_col_index]);

                        if(locationsSheet[p][id_col_index] == peopleSheet[row][col]) {
                            location = locationsSheet[p][name_col_index];
                            itemFound = true;
                            break;
                        }
                    }

                    if(!itemFound) {
                        Logger.log("Error! There is no such Location Id: " + peopleSheet[row][col]);
                        return -1;
                    }

                    Logger.log("Location: " + location);
                    break;

                case 'positions':

                    Logger.log("Searching Position by Id in 'people' file -> 'positions' sheet.");
                    Logger.log("Checking 'people' file -> 'positions' sheet structure...");

                    id_col_index = checkSheetStruct(positionsSheet,'id');
                    name_col_index = checkSheetStruct(positionsSheet,'name');

                    if((id_col_index == -1) || (name_col_index == -1)) {
                        Logger.log("Error! 'people' file -> 'positions' sheet structure is wrong.");
                        return -1;
                    }

                    Logger.log("'people' file -> 'positions' sheet structure is correct. Searching given Id: " + peopleSheet[row][col]);

                    Logger.log("Positions available: " + positionsSheet.length);

                    for(p = 1; p < positionsSheet.length; p++) {

                        Logger.log("Position Id in 'positions' sheet: " + positionsSheet[p][id_col_index]);

                        if(positionsSheet[p][id_col_index] == peopleSheet[row][col]) {
                            position = positionsSheet[p][name_col_index];
                            itemFound = true;
                            break;
                        }
                    }

                    if(!itemFound) {
                        Logger.log("Error! There is no such Position Id: " + peopleSheet[row][col]);
                        return -1;
                    }

                    Logger.log("Position: " + position);
                    break;

                case 'avatar':

                    avatar = peopleSheet[row][col];
                    Logger.log("Avatar: " + avatar);
                    break;

                default:
                    /*Logger.log("Error! No such column in 'people' file -> 'people' sheet.");
                     return 1;*/
                    break;
            }
        }

        var person = '{' +
            ' "id":"'+ id + '",' +
            '"isActive":"' + isActive + '",' +
            '"name":"' + name + '",' +
            '"company":"' + company + '",' +
            '"location":"' + location + '",' +
            '"position":"' + position + '",' +
            '"email":"' + email + '",' +
            '"avatar":"' + avatar + '"' +
            '}';

        /*Logger.log("Person: " + person);*/

        return person;

    }

    var activePeopleCount = 0;
    var inactivePeopleCount = 0;

    for(var i = 1; i < peopleSheet.length; i++) {

        for(var j = 0; j < peopleSheet[0].length; j++) {

            if((peopleSheet[0][j] == 'is_active')
                && (peopleSheet[i][j] == 'active')
                && (peopleSheet[i][j] == is_active)) {

                if(activePeopleCount > 0) {
                    activePeople += ',';
                }

                var activePerson = getPerson(i);

                Logger.log("Active Person: " + activePerson);

                activePeople += activePerson;

                activePeopleCount++;

                break;

            } else if((peopleSheet[0][j] == 'is_active')
                && (peopleSheet[i][j] == 'inactive')
                && (peopleSheet[i][j] == is_active)) {

                if(inactivePeopleCount > 0) {
                    inactivePeople += ',';
                }

                var inactivePerson = getPerson(i);

                Logger.log("Inactive Person: " + inactivePerson);

                inactivePeople += inactivePerson;

                inactivePeopleCount++;

                break;
            }
        }
    }

    activePeople += ']}';

    Logger.log("Active People number: " + activePeopleCount);
    Logger.log(activePeople);

    inactivePeople += ']}';

    Logger.log("Inactive People number: " + inactivePeopleCount);
    Logger.log(inactivePeople);

    if(isActive == 'active') {

        peopleJSON = JSON.parse(activePeople);

        /*Logger.log("Active persons number: " + peopleJSON.length);*/

        return peopleJSON;

    } else if(isActive == 'inactive') {

        peopleJSON = JSON.parse(inactivePeople);

        /*Logger.log("Inactive persons number: " + peopleJSON.length);*/

        return peopleJSON;

    } else {
        Logger.log("Error! Unknown activity type.");

        return -1;
    }

}