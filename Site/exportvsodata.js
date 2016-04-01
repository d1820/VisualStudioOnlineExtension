var vsoExtExportData = function () {
    if (window.jQuery) {
        var header = "";
        var rows = [];
        var parent = $(".productbacklog-grid-results").length > 0 ? $(".productbacklog-grid-results") : $(".query-result-grid");
        var canvas = parent.find(".grid-canvas.ui-draggable");
        canvas = canvas.length === 0 ? parent.find(".grid-canvas") : canvas;
        var maxHeight = canvas[0].scrollHeight;
        var scrollTo = 0;
        canvas.scrollTop(scrollTo);
        var lastRowRead;
        var last = 0;
        var headers = parent.find(".grid-header-column");
        var headerArr = [];
        $.each(headers, function(i, e) {
            str = $(e).text().replace(/\s+/g, "");
            headerArr.push("\"" + str + "\"");
        });
        header = headerArr.join() + "\r\n";
        var inv = setInterval(function() {
            var items = canvas.find(".grid-row");
            var lastRow = $(items[items.length - 1]);
            $.each(items, function(index, row) {
                var cells = $(row).find(".grid-cell");
                var vsoRow = {};
                var rowDataConcat = "";
                $.each(headerArr, function(i, e) {
                    if (e == "\"Tags\"") {
                        var tagStr = "";
                        var tags = $(cells[i]).find(".tags-items-container li");
                        $.each(tags, function(idx, li) { tagStr += $(li).text().trim() + "|"; });
                        rowDataConcat += tagStr;
                        vsoRow[e] = tagStr;
                    } else {
                        vsoRow[e] = $(cells[i]).text();
                        rowDataConcat += $(cells[i]).text().trim();
                    }
                });
                if (rowDataConcat.length > 0) {
                    lastRowRead = $(row).attr("id");
                    console.log(lastRowRead);
                    rows.push(vsoRow);
                } else {
                    return;
                }
                last = $("#" + lastRowRead);
                console.log("last:" + last);
                if (last.attr("id") == lastRow.attr("id")) {
                    var lastSpot = lastRow.position().top;
                    scrollTo += lastSpot - 20;
                    canvas.scrollTop(scrollTo);

                    if (scrollTo >= maxHeight) {
                        clearInterval(inv);
                        var unq = [];
                        var unqRows = [];
                        $.each(rows, function(i, e) {
                            var jn = JSON.stringify(e);
                            if ($.inArray(jn, unq) == -1) {
                                unq.push(jn);
                                unqRows.push(e);
                            }
                        });
                        var content = header;
                        $.each(unqRows, function(i, e) {
                            var itemText = [];
                            for (var key in e) {
                                itemText.push("\"" + e[key] + "\"")
                            }
                            content += itemText.join() + "\r\n"
                        });
                        var csvData = "data:application/csv;charset=utf-8," + encodeURIComponent(content);
                        var link = document.createElement("a");
                        link.setAttribute("href", csvData);
                        var name = document.title ? document.title : "my_data";
                        link.setAttribute("download", name + ".csv");
                        link.click();
                    }
                }
            });
        }, 500);
    }
};

