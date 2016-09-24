const vsoextShowMyVsoTasks = function ($) {
  function execute() {
    if ($) {
      $("#taskboard-table-body tbody tr.taskboard-row-summary").each(function (e, t) {
        $(t).hide();
      });
      $(".tbTile").each(function () {
        const e = this.id.substring(5, 999);
        const t = $(this).find(".witTitle").first();
        t.attr("_wi") === undefined && (t.attr("_wi", e), t.html("<strong>" + e + "</strong>-" + t.text()));
      });
      $("td.taskboard-parent").each(function () {
        const e = this.id.substring(17, 999);
        const t = $(this).find(".witTitle").first();
        t.attr("_wi") === undefined && (t.attr("_wi", e), t.html("<strong>" + e + "</strong>-" + t.text()));
      });
    }
  }
  return {
    execute: execute
  };
};

