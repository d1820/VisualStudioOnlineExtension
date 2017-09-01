/* eslint no-undefined:off, no-unused-vars:off */
const vsoExtShowAddTask = function ($) {
  function execute() {
    if ($) {
      const $div = $("div.add-links-container:last");
      const linkButton = $div.find("button.add-new-item-component:last");
      linkButton.click();
      const newItemLink = $div.find(".menu-popup .sub-menu li[command='link-to-new'] span:first");
      newItemLink.click();
    }
  }
  return {
    execute: execute
  };
};
