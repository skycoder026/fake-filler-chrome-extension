chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: fillInputs
  });
});

function fillInputs() {
  const inputs = document.querySelectorAll("input[type='text'], textarea");
  inputs.forEach(input => {
    input.value = "RandomText_" + Math.floor(Math.random() * 1000);
  });
}
