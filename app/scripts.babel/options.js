const jpDefaultOptions = {
  autoOpenToolbar: false
};

function saveOptions() {
  const autoOpen = document.getElementById("autoOpen").checked;
  const options = {
    autoOpenToolbar: autoOpen
  };
  chrome.storage.local.set(options, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById("status");
    if (chrome.runtime.lastError) {
      status.textContent = chrome.runtime.lastError;
    } else {
      status.textContent = "Options saved.";
    }

    status.style.display = "block";
    setTimeout(() => {
      status.textContent = "";
      status.style.display = "none";
    }, 2000);
  });

}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  chrome.storage.local.get(jpDefaultOptions, (options) => {
    document.getElementById("autoOpen").checked = options.autoOpenToolbar;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
