function jiraGetProjects(jiraId, base64creds) {

    var systemdataFile = DriveApp.getFilesByName('systemdata').next();

    var systemdata = SpreadsheetApp.open(systemdataFile).getSheetByName("jiras");

    var values = systemdata.getDataRange().getValues();

    var jiraIsInList = false;

    for (var i = 1; i < values.length; i++) {

        if(values[i][0] == jiraId) {

            var jiraURL = values[i][2];
            Logger.log("Jira URL: " + jiraURL);

            var jiraName = values[i][1];
            Logger.log("Jira Name: " + jiraName);

            jiraIsInList = true;
            break;
        }
    }

    if(!jiraIsInList) {
        Logger.log("No such Jira ID in list: " + jiraId);
        return 1;
    }

    var URL = jiraURL + "/rest/api/latest/project";

    Logger.log("Connecting to " + jiraName);

    var options = {
        "method": "GET",
        "content-type": "application/json",
        "headers": {
            "content-type": "application/json",
            "Accept": "application/json",
            "Authorization": "Basic " + base64creds
        },
        "muteHttpExceptions": true
    };

    var projects = UrlFetchApp.fetch(URL, options);

    if (projects) {
        switch(projects.getResponseCode()){
            case 200:
                Logger.log("Code: " + projects.getResponseCode() + ", Projects list is gotten successfully.");
                var data = JSON.parse(projects.getContentText());
                Logger.log("Projects in list: " + data.length);

                systemdata = SpreadsheetApp.open(systemdataFile).getSheetByName("projects");
                values = systemdata.getDataRange().getValues();

                for(i = 0; i < data.length; i++) {
                    /*for(var j = 0; j < i; j++) {
                        if((values[j][0] != data[i].id) &&
                            (values[j][1] != jiraId) &&
                            (values[j][2] != data[i].name) &&
                            (values[j][3] != data[i].key)) {



                            values = systemdata.getDataRange().getValues();
                        }
                    }*/

                    systemdata.appendRow( [data[i].id, jiraId, data[i].key, data[i].name] );
                }

                return 0;

                break;
            default:

                Logger.log("Code: " + projects.getResponseCode() + ", Projects were not gotten.");
                return 1;
                break;
        }
    }
    else {
        Logger.log("Getting Projects, Code: !HttpResponse, Data = " + data);
        return 1;
    }

    return 0;
}
