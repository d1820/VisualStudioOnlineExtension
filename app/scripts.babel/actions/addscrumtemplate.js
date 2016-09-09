var vsoExtAddScrumTemplate = function () {
    if ($ === window.jQuery) {
        var listHtml = "<ul><li></li></ul>";
        var scopelistHtml = "<ul><li></li><li>Integration and Unit Tests</li><li>Demo Video</li></ul>";
        var scopeHtml = "<br/><div>Scope</div><div>" + scopelistHtml + "</div>";
        var boundryHtml = "<div>Boundaries</div><div>" + listHtml + "</div>";
        var assumptionHtml = "<div>Assumptions</div><div>" + listHtml + "</div>";
        var target = $(".work-items-right-pane");
        if (target.length === 0) {
            target = $(".workitem-dialog");
        }
        target.last()
            .find(".workitemcontrol")
            .find(".richeditor-editarea iframe")
            .first()
            .contents()
            .find("body")
            .append(assumptionHtml + scopeHtml + boundryHtml);
    }
};
