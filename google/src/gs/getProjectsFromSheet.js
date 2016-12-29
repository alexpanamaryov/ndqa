function getProjectsFromSheet(){

    var systemdataFile = DriveApp.getFilesByName('systemdata').next();

    projects = SpreadsheetApp.open(systemdataFile).getSheetByName("projects").getDataRange().getValues();

    Logger.log("Projects in sheet: " + projects.length);

    var projectsJSON = '{ "projects" : [';

    var nextProject = '';

    for(var i = 1; i < projects.length; i++) {
        nextProject = '{' + '"id":' + projects[i][0] + ','  +
        '"jira_id":' + projects[i][1] + ','  +
        '"key":"' + projects[i][2] + '",'  +
        '"name":"' + projects[i][3] + '"}';

        if(i != projects.length - 1) {
            nextProject = nextProject + ',';
        }

        Logger.log(nextProject);

        projectsJSON = projectsJSON + nextProject;
    }

    projectsJSON = projectsJSON + ']};';

    return JSON.parse(projectsJSON);

}
