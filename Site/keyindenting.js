
var vsoKeyIndentingTemplate = function () {
    if ($ === window.jQuery) {

        var target = $(".work-items-right-pane");
        if (target.length === 0) {
            target = $(".workitem-dialog");
        }


        var items = target.last()
                .find(".workitemcontrol");

        var contentItems = [];
        items.each(function (index) {

            var $body = $(this).find(".richeditor-editarea iframe").contents().find("body");
            if ($body.length > 0) {
                var $toolbar = $(this).find(".richeditor-toolbar");
                $body.data("idx", index);
                contentItems.push({
                    indent: function () {
                        $toolbar.find(".richeditor-toolbar-indent").click();
                    },
                    outdent: function () {
                        $toolbar.find(".richeditor-toolbar-outdent").click();
                    },
                    idx: index,
                    body: $body
                });
            }
        });

        $(".richeditor-toolbar-outdent").css("cssText", "background-color: orange !important").attr("title", "Decrease indent (Key Indent enabled)");
        $(".richeditor-toolbar-indent").css("cssText", "background-color: orange !important").attr("title", "Increase indent (Key Indent enabled)");

        var frames = target.last()
            .find(".workitemcontrol")
            .find(".richeditor-editarea iframe").contents().find("body");


        frames.each(function (index) {
            var $body = $(this);
            var keyFunc = function (event) {
                var currentIdx = $body.data("idx");
                var match = $.grep(contentItems, function (item) {
                    return item.idx === currentIdx;
                });
                if (match.length === 1) {
                    if (event.which === 73 && event.altKey) {
                        match[0].indent();
                    }
                    if (event.which === 79 && event.altKey) {
                        match[0].outdent();
                    }
                }
            };
            $body.off("keyup", keyFunc);
            $body.on("keyup", keyFunc);
        });
    }
};

