
const toggleSelectionButton = document.getElementById('toggleSelection');

toggleSelectionButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleDivSelection' });
    });

    window.close();
});
