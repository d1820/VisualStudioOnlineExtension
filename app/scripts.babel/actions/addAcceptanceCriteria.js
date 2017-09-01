/* eslint no-undefined:off, no-unused-vars:off */
const vsoAcceptanceCriteriaTemplate = function($, checkboxCollection) {
  function execute() {
    if ($) {
      const listHtml = "<ul><li></li></ul>";
      const html = [];
      const target = $(".workitem-dialog");
      const $body = target.last()
        .find(".section-container .work-item-control")
        .find(".richeditor-editarea iframe")
        .contents()
        .find("body[aria-label='Acceptance Criteria']");

      const $ol = $body.find("ol").last();
      if ($ol.length > 0) {
        $.each(checkboxCollection, (idx, node) => {
          html.push("<li><div>" + $(node).data("title") + "</div>" + listHtml + "</li>");
        });
        $ol.find("li").last().append("<ul>" + html.join("") + "</ul>");
      } else {
        $.each(checkboxCollection, (idx, node) => {
          html.push("<div style='padding-left:15px;'><div>" + $(node).data("title") + "</div>" + listHtml + "</div>");
        });
        $body.append(html.join("")).focus();
      }
    }
  }

  return {
    execute: execute
  };
};



