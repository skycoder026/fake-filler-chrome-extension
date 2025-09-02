document.getElementById("fillButton").addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let options = {
    inputs: document.getElementById("fillInputs").checked,
    textareas: document.getElementById("fillTextareas").checked,
    checkboxes: document.getElementById("fillCheckboxes").checked,
    radios: document.getElementById("fillRadios").checked,
    selects: document.getElementById("fillSelects").checked
  };

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: fillElements,
    args: [options]
  });
});

function fillElements(options) {
  function generateRandomText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  if (options.inputs) {
    document.querySelectorAll("input[type='text'], input[type='email'], input[type='password'], input:not([type])").forEach(input => {
      if (input.type === 'password') {
        input.value = generateRandomText(12); // Generate a longer random string for passwords
      } else if (input.type === 'email') {
        input.value = generateRandomText(8) + '@example.com'; // Generate a random email
      } else {
        input.value = generateRandomText(10); // Default length for other text inputs
      }
      // Dispatch input and change events to ensure frameworks react to the change
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  if (options.textareas) {
    document.querySelectorAll("textarea").forEach(area => {
      area.value = generateRandomText(50); // Generate longer text for textareas
      area.dispatchEvent(new Event('input', { bubbles: true }));
      area.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  if (options.checkboxes) {
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
      checkbox.checked = Math.random() > 0.5;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  if (options.radios) {
    let radios = {};
    document.querySelectorAll("input[type='radio']").forEach(radio => {
      if (!radios[radio.name]) radios[radio.name] = [];
      radios[radio.name].push(radio);
    });
    for (let group in radios) {
      let items = radios[group];
      items[Math.floor(Math.random() * items.length)].checked = true;
      items[Math.floor(Math.random() * items.length)].dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  if (options.selects) {
    document.querySelectorAll("select").forEach(select => {
      let opts = select.options;
      if (opts.length > 0) {
        select.selectedIndex = Math.floor(Math.random() * opts.length);
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Handle Select2 elements
      if (select.classList.contains('select2-hidden-accessible')) {
        // For Select2, setting selectedIndex and dispatching change might not be enough.
        // We need to trigger a custom event that Select2 listens for.
        // A common approach is to trigger a 'change' event on the original select element.
        // If that doesn't work, we might need to simulate a selection.
        // For now, we'll rely on the standard change event.
        // If the Select2 is initialized on a hidden input, we might need to find that input.
        // However, the 'select2-hidden-accessible' class is usually on the original <select>.
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }
}
