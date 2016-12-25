function doGet(request) {

    return HtmlService.createTemplateFromFile('index.html').evaluate(); //.setSandboxMode(HtmlService.SandboxMode.IFRAME);

}

function includeFromFile(filename) {

    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

/*TEST TEST TEST*/