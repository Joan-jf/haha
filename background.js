// save scan results to localStorage
function saveScanHistory(sender, title, result) {
    const timestamp = new Date().toLocaleString();

    // Get the current scan history from localStorage or initialize it
    const scanHistory = JSON.parse(localStorage.getItem('scanHistory')) || [];

    // Add the new scan to the history
    scanHistory.push({
        sender,
        title,
        result,
        timestamp
    });

    // Save back to localStorage
    localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
}

// Context menu item for scanning emails
chrome.contextMenus.create({
    id: "scanEmail",
    title: "Scan Email for Phishing",
    contexts: ["all"]
});

// Add an event listener for the context menu click
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "scanEmail") {
        // Send a message to the content script to get the email content
        chrome.tabs.sendMessage(tab.id, { action: 'getEmailDetails' }, function(response) {
            if (response && response.emailContent) {
                const { emailContent, sender, title } = response;

                // Send the email content to the Flask API for phishing detection
                fetch('http://localhost:5000/detect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email_text: emailContent })
                })
                .then(response => response.json())
                .then(data => {
                    const result = data.result;

                    // Send the scan result to the content script to show the modal
                    chrome.tabs.sendMessage(tab.id, { action: 'showResult', result });

                    // Save scan details to localStorage
                    saveScanHistory(sender, title, result);

                    
                })
                
            } else {
                chrome.tabs.executeScript(tab.id, {
                    code: `alert('Could not extract email details.')`
                });
            }
        });
    }
});