function getEmailDetails() {
    // Get the email body content
    const emailBody = document.querySelector('div.ii.gt');
    const emailContent = emailBody ? emailBody.innerText : '';

    // Get the sender's email
    const sender = document.querySelector('.gD') ? document.querySelector('.gD').innerText : 'Unknown Sender';

    // Get the email title (subject)
    const title = document.querySelector('.hP') ? document.querySelector('.hP').innerText : 'No Title';

    return { emailContent, sender, title };
}

// Function to show a modal with the scan result
function showModal(result) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '300px';
    modal.style.backgroundColor = '#FFFFFF';
    modal.style.padding = '20px';
    modal.style.borderRadius = '15px';
    modal.style.border = '1px solid #A91D3A';
    modal.style.zIndex = 9999;
    modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

    

    // Add the result text
    const resultText = document.createElement('p');
    resultText.innerText = `Prediction: ${result}`;
    resultText.style.gridColumn = '1 / 4'; // Span across all columns
    resultText.style.textAlign = 'center';
    resultText.style.margin = '0';
    modal.appendChild(resultText);

    // Close button in the bottom right
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.display = 'block';
    closeButton.style.margin = '15px auto 0';
    closeButton.style.padding = '8px 12px';
    closeButton.style.backgroundColor = '#C73659';
    closeButton.style.color = '#FFFFFF';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.onclick = function () {
        document.body.removeChild(modal);
    };

    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}


// Listen for the result and show modal
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getEmailDetails') {
        const emailDetails = getEmailDetails();
        sendResponse(emailDetails);
    }else if (request.action === 'showResult') {
        showModal(
            
            `${request.result}`);
    }
});