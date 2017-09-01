/* eslint no-undef:off */
class VsoController {
  constructor(view, storage, runtime, messagingService) {
    this.view = view;
    this.storage = storage;
    this.runtime = runtime;
    this._messagingService = messagingService;
    this._vsoOptions = {};
    this.vsoDefaultOptions = {
      autoOpenToolbar: false
    };
    this.templatedata = null;
  }

  initalize() {
    const self = this;
    this.storage.local.get(this.vsoDefaultOptions, (options) => {
      self._vsoOptions = options;
      if (options.autoOpenToolbar) {
        self._renderToolbar(self.view);
        self.runtime.sendMessage({
          action: "setState",
          data: { isShowing: true }
        });
      }
    });
    this.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      self._extensionInfo = (request.extInfo ? request.extInfo : self._extensionInfo);
      switch (request.action) {
        case "showVsoExtenstion":
          {
            self._renderToolbar(self.view);
            if (sendResponse) {
              sendResponse({ status: "successfully opened" });
            }
            break;
          }
        default:
          self._removeToolbar(self.view);
          if (sendResponse) {
            sendResponse({ status: "successfully closed" });
          }
          break;
      }
      return true;
    });

    this._vsoExtAddScrumTemplate = new vsoExtAddScrumTemplate(this.view.getJquery());
    this._vsoExtExportData = new vsoExtExportData(this.view.getJquery(), this._messagingService);
    this._vsoKeyIndentingTemplate = new vsoKeyIndentingTemplate(this.view.getJquery());
    this._vsoExtNotifyPullRequest = new vsoExtNotifyPullRequest(this.view.getJquery(), self._messagingService);
    this._vsoExtShowAddTask = new vsoExtShowAddTask(this.view.getJquery());
    this._vsoextShowMyVsoTasks = new vsoextShowMyVsoTasks(this.view.getJquery());
  }

  _renderToolbar(view) {
    const self = this;
    const pageContainer = view.getPageContainer();
    if (!self.templatedata) {
      $.ajax(
        {
          url: chrome.extension.getURL("/toolbar.html"),
          cache: false,
          success: function (data) {
            self.templatedata = data;
            if (pageContainer.length > 0) {
              pageContainer.before($(data));
            }
            self._addToolbarItems(view);
          }
        });
    } else {
      self._removeToolbar(view);
      pageContainer.before($(self.templatedata));
      self._addToolbarItems(view);
    }
  }

  _removeToolbar(view) {
    const vsoContainer = view.getToolbarContainer();
    if (vsoContainer.length > 0) {
      vsoContainer.remove();
    }
    view.removePageContainerClass();
  }

  _addToolbarItems(view) {
    const self = this;
    view.addPageContainerClass();
    view.closeToolbarClick(() => {
      self._removeToolbar(view);
      chrome.runtime.sendMessage({ action: "setState", data: false });
    });
    view.bugToolbarClick(() => {
      self.runtime.sendMessage({
        action: "openInNewTab",
        data: { url: "https://github.com/d1820/VisualStudioOnlineExtension/issues" }
      });
    });
    view.optionsToolbarClick(() => {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        self.runtime.sendMessage({
          action: "openInNewTab",
          data: { url: "chrome://extensions/?options=" + chrome.runtime.id }
        });
      }
    });
    view.showMyTasksButtonRegisterClick(() => {
      this._checkAndCall(this._vsoextShowMyVsoTasks.execute);
    });
    view.addTaskButtonRegisterClick(() => {
      this._checkAndCall(this._vsoExtShowAddTask.execute);
    });
    view.addTemplateButtonRegisterClick(() => {
      this._checkAndCall(this._vsoExtAddScrumTemplate.execute);
    });
    view.exportDataButtonRegisterClick(() => {
      this._checkAndCall(this._vsoExtExportData.execute);
    });
    view.notifyPullRequestButtonRegisterClick(() => {
      this._checkAndCall(this._vsoExtNotifyPullRequest.execute);
    });
    view.enableKeyIndentingButtonRegisterClick(() => {
      this._checkAndCall(this._vsoKeyIndentingTemplate.execute);
    });

    view.showCriteriaSelections();

    view.selectCriteria(() => {
      const _vsoAcceptanceCriteriaTemplate = new vsoAcceptanceCriteriaTemplate(view.getJquery(), view.getCheckboxCollection());
      this._checkAndCall(_vsoAcceptanceCriteriaTemplate.execute);
      view.hideCriteriaSelections();
      view.resetCheckboxCollection();
    });
  }

  _checkAndCall(callback) {
    if (!this._checkUrl()) {
      return;
    }
    callback();
  }

  _createError(errorId, error) {
    return {
      status: "failure",
      errorId: errorId,
      error: error
    };
  }

  _checkUrl(messagingService) {
    if (window.location.href.indexOf("visualstudio.com") === -1) {
      messagingService.warning("Extension can only run when Visual Studio Online is the active tab");
      return false;
    }
    return true;
  }
}

class VsoView {

  constructor(jqueryyRef) {
    this.$ = jqueryyRef;
  }
  getJquery() {
    return this.$;
  }
  getPageContainer() {
    return this.$(".main-container");
  }
  getToolbarContainer() {
    return this.$("#page-vsoext-toolbar-container");
  }
  showMyTasksButtonRegisterClick(clickCallback) {
    this.$("#showmyvsotasks").off().click(clickCallback);
  }
  addTaskButtonRegisterClick(clickCallback) {
    this.$("#addtask").off().click(clickCallback);
  }
  addTemplateButtonRegisterClick(clickCallback) {
    this.$("#addtemplate").off().click(clickCallback);
  }
  exportDataButtonRegisterClick(clickCallback) {
    this.$("#exportdata").off().click(clickCallback);
  }
  notifyPullRequestButtonRegisterClick(clickCallback) {
    this.$("#notifyPullRequest").off().click(clickCallback);
  }
  enableKeyIndentingButtonRegisterClick(clickCallback) {
    this.$("#enablekeyindenter").off().click(clickCallback);
  }
  removePageContainerClass() {
    const pageContainer = this.getPageContainer();
    pageContainer.removeClass("main-container-offset");
  }
  addPageContainerClass() {
    const pageContainer = this.getPageContainer();
    pageContainer.addClass("main-container-offset");
  }
  closeToolbarClick(callback) {
    this.$("#page-vsoext-toolbar-close").click(callback);
  }

  bugToolbarClick(callback) {
    this.$("#page-vsoext-toolbar-bug").click(callback);
  }

  optionsToolbarClick(callback) {
    this.$("#page-vsoext-toolbar-options").click(callback);
  }
  showCriteriaSelections() {
    this.isAcceptanceCriteriaShowing = false;
    this.$("#addcriteria").off().click(() => {
      if (!this.isAcceptanceCriteriaShowing) {
        this.$("#criteriaoptions").show();
      } else {
        this.$("#criteriaoptions").hide();
      }
      this.isAcceptanceCriteriaShowing = !this.isAcceptanceCriteriaShowing;
    });
  }
  hideCriteriaSelections() {
    this.$("#criteriaoptions").hide();
    this.isAcceptanceCriteriaShowing = false;
  }

  getCheckboxCollection() {
    return this.$("#criteriaoptions input[type='checkbox']:checked");
  }

  resetCheckboxCollection() {
    this.$("#criteriaoptions input[type='checkbox']:checked").each((idx, node) => {
      $(node).prop("checked", false);
    });
  }

  selectCriteria(callback) {
    this.$("#btnSelectCriteria").click(callback);
  }
}

class MessagingService {
  constructor(jquery) {
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

const _view = new VsoView(jQuery);
const _messagingService = new MessagingService(jQuery);
const _controller = new VsoController(_view, chrome.storage, chrome.runtime, _messagingService);

_messagingService.initialize();
_controller.initalize();