function includeFromFile(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

