document.addEventListener('DOMContentLoaded', async () => {
    // Sprache ermitteln
    const userLang = (navigator.language || navigator.userLanguage).split('-')[0];
    let lang = sgoviI18n[userLang] || sgoviI18n.de;

    // UI Texte setzen
    document.getElementById('text-enable').innerText = lang.popupTitle || "Website Checker";
    document.getElementById('text-scan').innerText = lang.scanBtn || "Scan Page";

    const checkEnabled = document.getElementById('check-enabled');

    // Status laden
    const data = await chrome.storage.local.get(['enabled']);
    checkEnabled.checked = data.enabled !== false;

    // Status speichern
    checkEnabled.onchange = () => {
        chrome.storage.local.set({ enabled: checkEnabled.checked });
    };

    // Bulk Scan auslösen mit Fehler-Handling
    document.getElementById('btn-scan').onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "SCAN_FULL_PAGE" }, (response) => {
                    if (chrome.runtime.lastError) {
                        alert(userLang === 'de' ? "Bitte lade die Seite neu." : "Please refresh the page.");
                    }
                });
            }
        });
    };
});