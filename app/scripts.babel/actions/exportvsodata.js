const vsoExtExportData = function ($, messageService) {
  function execute() {
    if ($) {
      messageService.info("Generating export...");
      let header = "";
      const rows = [];
      const parent = $(".productbacklog-grid-results").length > 0 ? $(".productbacklog-grid-results") : $(".query-result-grid");
      let canvas = parent.find(".grid-canvas.ui-draggable");
      canvas = canvas.length === 0 ? parent.find(".grid-canvas") : canvas;
      const maxHeight = canvas[0].scrollHeight;
      let scrollTo = 0;
      canvas.scrollTop(scrollTo);
      let lastRowRead;
      let last = 0;
      const headers = parent.find(".grid-header-column");
      const headerArr = [];
      $.each(headers, function (i, e) {
        const str = $(e).text().replace(/\s+/g, "");
        headerArr.push("\"" + str + "\"");
      });
      header = headerArr.join() + "\r\n";

      const inv = setInterval(function () {
        const items = canvas.find(".grid-row");
        const lastRow = $(items[items.length - 1]);
        $.each(items, function (index, row) {
          const cells = $(row).find(".grid-cell");
          const vsoRow = {};
          let rowDataConcat = "";
          $.each(headerArr, function (i, e) {
            if (e == "\"Tags\"") {
              //console.log("tags column");
              let tagStr = "";
              const tags = $(cells[i]).find(".tags-items-container li");
              $.each(tags, function (idx, li) { tagStr += $(li).text().trim() + "|"; });
              rowDataConcat += tagStr;
              vsoRow[e] = tagStr;
            } else {
              vsoRow[e] = $(cells[i]).text();
              rowDataConcat += $(cells[i]).text().trim();
            }
          });
          if (rowDataConcat.length > 0) {
            lastRowRead = $(row).attr("id");
            rows.push(vsoRow);
          } else {
            return;
          }
          last = $("#" + lastRowRead);
          if (last.attr("id") === lastRow.attr("id")) {
            const lastSpot = lastRow.position().top;
            scrollTo += lastSpot - 20;
            canvas.scrollTop(scrollTo);
            if (scrollTo >= maxHeight) {
              clearInterval(inv);
              //console.log("interval cleared");
              const unq = [];
              const unqRows = [];
              $.each(rows, function (i, e) {
                const jn = JSON.stringify(e);
                if ($.inArray(jn, unq) == -1) {
                  unq.push(jn);
                  unqRows.push(e);
                }
              });
              let content = header;
              $.each(unqRows, function (i, e) {
                const itemText = [];
                for (const key in e) {
                  itemText.push("\"" + e[key] + "\"");
                }
                content += itemText.join() + "\r\n";
              });
              const csvData = "data:application/csv;charset=utf-8," + encodeURIComponent(content);
              const link = document.createElement("a");
              link.setAttribute("href", csvData);
              const name = document.title ? document.title : "my_data";
              link.setAttribute("download", name + ".csv");
              link.click();
              messageService.success("Export Complete");
            }
          }
        });
      }, 500);
    }
  }
  return {
    execute: execute
  };
};

