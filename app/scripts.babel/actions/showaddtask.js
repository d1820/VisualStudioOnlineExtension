var vsoExtShowAddTask = function () {
    if ($ === window.jQuery) {

        var detailTab = $(".work-item-form-tab[title='Details']");
        var linkTab = $(".work-item-form-tab[title='Links']");
        linkTab.click();
        detailTab.click();

        var mainCon = $("div.workitemcontrol li[command=\"links-control-link-to-new\"]");
        mainCon.click();
    }
};
