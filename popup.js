document.addEventListener('DOMContentLoaded', () => {
    const statusBtn = document.getElementById('statusBtn');
    const scanBtn = document.getElementById('scanBtn');

    // Aktuellen Status aus dem Chrome-Speicher laden
    chrome.storage.local.get(['enabled'], (data) => {
        const isEnabled = data.enabled !== false;
        updateUI(isEnabled);
    });

    // Umschalten des Status (AN/AUS)
    statusBtn.onclick = () => {
        chrome.storage.local.get(['enabled'], (data) => {
            const newState = data.enabled === false;
            chrome.storage.local.set({ enabled: newState }, () => {
                updateUI(newState);
                // Seite neu laden, um die Engine zu stoppen/starten
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    };

    // Befehl "Seite scannen" an die Webseite senden
    scanBtn.onclick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "SCAN_FULL_PAGE" });
            }
        });
    };

    function updateUI(isEnabled) {
        statusBtn.innerText = isEnabled ? 'AN' : 'AUS';
        statusBtn.className = isEnabled ? 'toggle on' : 'toggle off';
    }
});