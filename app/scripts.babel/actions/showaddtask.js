const vsoExtShowAddTask = function ($) {
  function execute() {
    if ($) {
      const detailTab = $(".work-item-form-tab[title='Details']");
      const linkTab = $(".work-item-form-tab[title='Links']");
      linkTab.click();
      detailTab.click();
      const mainCon = $("div.workitemcontrol li[command=\"links-control-link-to-new\"]");
      mainCon.click();
    }
  }
  return {
    execute: execute
  };
};
