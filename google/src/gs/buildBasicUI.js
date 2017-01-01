function buildBasicUI() {
    return HtmlService.createTemplateFromFile('index.html').evaluate().setTitle("Norse Digital");
}
