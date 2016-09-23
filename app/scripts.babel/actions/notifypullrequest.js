
const vsoExtNotifyPullRequest = function ($, messagingService) {
  let checker = null;
  function execute() {
    if ($) {

      const currentLocation = window.location.href;
      if (currentLocation.indexOf("/pullrequest/") === -1) {
        alert("Pull Request Notify can only run when Visual Studio Online is the active tab and a pull request is open.");
        return;
      }
      const title = $(".vc-pullrequests-details-titleArea").text();
      const state = $(".vc-pullrequest-view-details-item-status .vc-pullrequest-view-details-action-text[data-bind='text: statusString']").text();
      if (state.indexOf("succeeded") > -1) {
        messagingService.success(title + " - Build Completed!");
        return;
      }
      if (!checker) {
        checker = setInterval(function () {
          const stateNow = $(".vc-pullrequest-view-details-item-status .vc-pullrequest-view-details-action-text[data-bind='text: statusString']").text();
          if (stateNow.indexOf("succeeded") > -1) {
            clearInterval(checker);
            messagingService.success(title + " - Build Completed!");
          }
        }, 15000);
        messagingService.info("Pull request registered for notification.");
      }
    }
  }
  return {
    execute: execute
  };
};
