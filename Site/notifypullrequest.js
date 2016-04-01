var checker = null;
var vsoExtNotifyPullRequest = function () {
    if ($ === window.jQuery) {

        var currentLocation = window.location.href;
        if (currentLocation.indexOf("/pullrequest/") === -1) {
            alert("Pull Request Notify can only run when Visual Studio Online is the active tab and a pull request is open.");
            return;
        }
        var title = $(".vc-pullrequests-details-titleArea").text();
        var state = $(".vc-pullrequest-view-details-item-status .vc-pullrequest-view-details-action-text[data-bind='text: statusString']").text();
        if (state.indexOf("succeeded") > -1) {
            alert(title + " - Build Completed!");
            return;
        }
        if (!checker) {
            checker = setInterval(function () {
                var state = $(".vc-pullrequest-view-details-item-status .vc-pullrequest-view-details-action-text[data-bind='text: statusString']").text();
                if (state.indexOf("succeeded") > -1) {
                    clearInterval(checker);
                    alert(title + " - Build Completed!");
                }
            }, 15000);
            alert("Pull request registered for notification.");
        }

    }
};
