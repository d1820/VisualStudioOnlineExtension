﻿const vsoExtAddScrumTemplate = function ($) {
  function execute() {
    if ($) {
      const listHtml = "<ul><li></li></ul>";
      const scopelistHtml = "<ul><li></li><li>Integration and Unit Tests</li><li>Demo Video</li></ul>";
      const scopeHtml = "<br/><div>Scope</div><div>" + scopelistHtml + "</div>";
      const boundryHtml = "<div>Boundaries</div><div>" + listHtml + "</div>";
      const assumptionHtml = "<div>Assumptions</div><div>" + listHtml + "</div>";
      let target = $(".work-items-right-pane");
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
  }
  return {
    execute: execute
  };
};
