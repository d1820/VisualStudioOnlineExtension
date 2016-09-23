const vsoExtExportData = function ($) {
  function execute() {
    if ($) {
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
              let tagStr = "";
              let tags = $(cells[i]).find(".tags-items-container li");
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
            //console.log(lastRowRead);
            rows.push(vsoRow);
          } else {
            return;
          }
          last = $("#" + lastRowRead);
          console.log("last:" + last);
          if (last.attr("id") == lastRow.attr("id")) {
            const lastSpot = lastRow.position().top;
            scrollTo += lastSpot - 20;
            canvas.scrollTop(scrollTo);

            if (scrollTo >= maxHeight) {
              clearInterval(inv);
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
                  itemText.push("\"" + e[key] + "\"")
                }
                content += itemText.join() + "\r\n"
              });
              const csvData = "data:application/csv;charset=utf-8," + encodeURIComponent(content);
              const link = document.createElement("a");
              link.setAttribute("href", csvData);
              const name = document.title ? document.title : "my_data";
              link.setAttribute("download", name + ".csv");
              link.click();
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

