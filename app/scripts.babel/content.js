
class vsoController {
  constructor(view, storage, runtime, messagingService) {
    this.view = view;
    this.storage = storage;
    this.runtime = runtime;
    this._messagingService = messagingService;
    this._jpConsoleOptions = {};
    this.vsoDefaultOptions = {
      autoOpenConsole: false
    };
  }

  initalize() {
    const self = this;
    this.storage.local.get(this.vsoDefaultOptions, (options) => {
      self._jpConsoleOptions = options;
      if (options.autoOpenConsole) {
      }
    });

    this.storage.onChanged.addListener(function (changes) {

      for (const k in changes) {
        if (self._jpConsoleOptions.hasOwnProperty(k)) {
          self._jpConsoleOptions[k] = changes[k].newValue;
        }
      }
    });

    this.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      self._extensionInfo = (request.extInfo ? request.extInfo : self._extensionInfo);
      switch (request.action) {
        case "showconsoleviewer":
          {
            if (self._showConsoleAndLoadIcons(self._isDevelopment(), sendResponse)) {
              break;
            }
            const err = self._createError("failure:notSuportedPage", "Not a supported page for the Jenkins Console Viewer");
            self._messagingService.warning(err.error);
            if (sendResponse) {
              sendResponse(err);
            }
            break;
          }
        default:
          if (sendResponse) {
            sendResponse(self._createError("failure:invalidAction", "Unknown action recieved in content script. Action: " + request.action));
          }
          break;
      }
      return true;
    });
  }

  _createError(errorId, error) {
    return {
      status: "failure",
      errorId: errorId,
      error: error
    };
  }

}

class vsoView {

}



class MessagingService {
  constructor(jquery, templateService) {
    this._templateService = templateService;
    this.$ = jquery;
    this.ToastrPosition = {
      TopRight: 1,
      BottomRight: 2,
      BottomLeft: 3,
      TopLeft: 4,
      TopCenter: 5,
      BottomCenter: 6
    };
    this.ToastrType = {
      Success: 1,
      Info: 2,
      Warning: 3,
      Error: 4
    };
    this._toastContainer;
    this._useAlerts = false;

  }

  initialize() {
    this._toastContainer = this.$("<div class='vso-toastr'><div id='vso-toast-container'></div>");
    const body = this.$("body");
    if (body.length > 0) {
      body.append(this._toastContainer);
    } else {
      this._useAlerts = true;
    }
  }

  lookupTypeClass(toastrType) {
    switch (toastrType) {
      case this.ToastrType.Success:
        return "toast-success";
      case this.ToastrType.Info:
        return "toast-info";
      case this.ToastrType.Warning:
        return "toast-warning";
      case this.ToastrType.Error:
        return "toast-error";
      default:
        return "";
    }
  }

  setTimer(id, timeout) {
    const self = this;
    return setTimeout(() => {
      self.$("#" + id).remove();
      if (self._toastContainer.find("#vso-toast-container .toast").length === 0) {
        self._toastContainer.hide();
      }
    }, timeout);
  }
  addToast(toast) {

    const self = this;
    if (self._useAlerts) {
      alert(toast.message);
      return;
    }
    const template = "<div class='toast toast-top-right' style='display: block;'><div class='toast-progress'></div><div class='toast-message'></div></div>";
    const toastr = self.$(template);
    const id = Math.random().toString(36).substr(2, 9);
    toastr.addClass(self.lookupTypeClass(toast.type));
    toastr.prop("id", id);
    this._toastContainer.find("#vso-toast-container").append(toastr);
    let cancelTimer = this.setTimer(id, toast.timeout);
    self._toastContainer.show();
    self.$("#" + id + " .toast-message").text(toast.message).hover(() => {
      clearTimeout(cancelTimer);
    }, () => {
      cancelTimer = self.setTimer(id, toast.timeout);
    });

  }

  error(message) {
    const toast = { type: this.ToastrType.Error, timeout: 7000, message: message };
    this.addToast(toast);

  }
  info(message) {
    const toast = { type: this.ToastrType.Info, timeout: 5000, message: message };
    this.addToast(toast);
  }
  success(message) {
    const toast = { type: this.ToastrType.Success, timeout: 5000, message: message };
    this.addToast(toast);
  }
  warning(message) {
    const toast = { type: this.ToastrType.Warning, timeout: 5000, message: message };
    this.addToast(toast);
  }

}

var vsopopout = vsopopout || (function () {

  // An object that will contain the "methods"
  // we can use from our event script.
  var methods = {};
  var templatedata = null;
  var pageContainer = ".main-container";
  var toolbarContainer = "#page-vsoext-toolbar-container";
  // This method will eventually return
  // background colors from the current page.
  methods.showVsoExtenstion = function () {

    if (!templatedata) {
      $.ajax(
        {
          url: chrome.extension.getURL('/content.html'),
          cache: false,
          success: function (data) {
            templatedata = data;
            if ($(pageContainer).length > 0) {
              $(pageContainer).before($(data));
            }
            _resolveContainerItems();
          }
        });
    } else {
      _removeToolbar();
      $(pageContainer).before($(templatedata));
      _resolveContainerItems();
    }

  };

  methods.hideVsoExtenstion = function () {

    _removeToolbar();

  };

  function _removeToolbar() {

    var vsoContainer = $(toolbarContainer);
    if (vsoContainer.length > 0) {
      vsoContainer.remove();
    }
    $(pageContainer).removeClass("main-container-offset");

  }

  function _resolveContainerItems() {
    $(pageContainer).addClass("main-container-offset");
    $("#page-vsoext-toolbar-close").click(function () {
      _removeToolbar();
      chrome.runtime.sendMessage({ method: "setState", data: false });
    }).attr("src", chrome.extension.getURL("images/close.png"));

    var showmyvsotasksButton = document.getElementById('showmyvsotasks');
    showmyvsotasksButton.removeEventListener('click');
    showmyvsotasksButton.addEventListener('click', _showVsoTask, false);

    var addtaskButton = document.getElementById('addtask');
    addtaskButton.removeEventListener('click');
    addtaskButton.addEventListener('click', _showAddTask, false);

    var addtemplateButton = document.getElementById('addtemplate');
    addtemplateButton.removeEventListener('click');
    addtemplateButton.addEventListener('click', _addTemplate, false);

    var exportdataButton = document.getElementById('exportdata');
    exportdataButton.removeEventListener('click');
    exportdataButton.addEventListener('click', _export, false);

    var notifyPullRequestButton = document.getElementById('notifyPullRequest');
    notifyPullRequestButton.removeEventListener('click');
    notifyPullRequestButton.addEventListener('click', _notifyPullrequest, false);

    var enableKeyIndenter = document.getElementById("enablekeyindenter");
    enableKeyIndenter.removeEventListener('click');
    enableKeyIndenter.addEventListener('click', _enableKeyIndenting, false);

  }

  function _enableKeyIndenting() {
    vsoKeyIndentingTemplate();
  }

  function _showVsoTask() {

    if (!_checkUrl()) {
      return;
    }
    vsoextShowMyVsoTasks();

  }

  function _showAddTask() {
    if (!_checkUrl()) {
      return;
    }
    vsoExtShowAddTask();

  }

  function _notifyPullrequest() {
    if (!_checkUrl()) {
      return;
    }
    vsoExtNotifyPullRequest();

  }

  function _addTemplate() {
    if (!_checkUrl()) {
      return;
    }
    vsoExtAddScrumTemplate();
  }

  function _export() {

    if (!_checkUrl()) {
      return;
    }
    vsoExtExportData();

  }

  function _checkUrl() {
    if (window.location.href.indexOf("visualstudio.com") === -1) {
      alert("Extension can only run when Visual Studio Online is the active tab");
      return false;
    }
    return true;
  }
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    // If the method the extension has requested
    // exists, call it and assign its response
    // to data.
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    // Send the response back to our extension.
    sendResponse({ data: data });
    return true;
  });

  return true;
})();
