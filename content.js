
function generateRandomText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function fillInputs() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
    inputs.forEach(input => {
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

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fillForms") {
        fillInputs();
        sendResponse({ status: "forms filled" });
    }
});
