function doGet(request) {

    /*var creds = Utilities.base64Encode("alp" + ':' + "voffka.com");
    var creds2 = Utilities.base64Encode("alexey_panamaryov" + ':' + "Voffka85.com");*/

    /*jiraGetProjects('1' , creds2);*/

    return HtmlService.createTemplateFromFile('index.html').evaluate();

}


