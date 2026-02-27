/**
 * SGOVI CONTENT SCRIPT v13.6 - FULL VERSION
 * Behebt: 'Context Invalidated', + Button & Bulk Scan
 */

const API_URL = 'https://sgobbovista.de/api_check.php';
const SUBMIT_URL = 'https://sgobbovista.de/submit_api.php';

// Sprache ermitteln
const userLang = (navigator.language || navigator.userLanguage).split('-')[0];
let lang = { noSsl: "SSL?", found: "✔", bulkConfirm: "Alle Domains hinzufügen?", bulkSuccess: "Erfolgreich!", noDomains: "Keine Domains gefunden.", error: "Fehler" };

function getCleanDomain(urlStr) {
    try {
        if (!urlStr || urlStr.startsWith('#') || urlStr.startsWith('javascript:')) return null;
        const u = new URL(urlStr);
        if (u.hostname.includes('google') || u.hostname.includes('sgobbovista')) return null;
        return u.hostname.toLowerCase().replace('www.', '');
    } catch (e) { return null; }
}

async function sgoviMain() {
    // 1. Kontext-Check (Verhindert den sekündlichen Fehler)
    if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.id) return;

    try {
        const data = await chrome.storage.local.get(['enabled']);
        if (data && data.enabled === false) return;

        const links = document.querySelectorAll('a[href^="http"]:not([data-sgovi-checked])');
        if (!links.length) return;

        const linkItems = [];
        const domainsToQuery = [];

        links.forEach(l => {
            l.setAttribute('data-sgovi-checked', 'true');
            const d = getCleanDomain(l.href);
            if (d) {
                linkItems.push({ domain: d, element: l, href: l.href });
                domainsToQuery.push(d);
            }
        });

        if (domainsToQuery.length === 0) return;

        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: [...new Set(domainsToQuery)] })
        });
        const result = await res.json();

        linkItems.forEach(item => {
            if (item.element.querySelector('.sgovi-container')) return;

            const isFound = result.existing?.includes(item.domain);
            const tagText = result.tags?.[item.domain] || "";
            const isBanned = tagText.includes('🚫');
            const isNoSSL = item.href.startsWith('http:');

            const container = document.createElement('span');
            container.className = 'sgovi-container';
            container.style.cssText = "margin-left:8px; font-size:12px; display:inline-flex; align-items:center; gap:4px;";

            if (isNoSSL) {
                container.innerHTML += `<span style="background:#ef4444;color:white;padding:1px 4px;border-radius:3px;font-size:9px;">SSL?</span>`;
            }

            if (tagText) {
                container.innerHTML += `<span style="background:${isBanned ? '#ef4444' : '#3b82f6'};color:white;padding:1px 4px;border-radius:3px;font-size:9px;font-weight:bold;">${tagText}</span>`;
            }

            const statusIcon = document.createElement('span');
            statusIcon.style.fontWeight = "bold";
            statusIcon.style.color = isFound ? '#22c55e' : '#ef4444';
            statusIcon.innerText = isFound ? ' ✔' : ' ✘';
            container.appendChild(statusIcon);

            // BUTTON: Nur wenn nicht indexiert, nicht gebannt und SSL vorhanden
            if (!isFound && !isBanned && !isNoSSL) {
                const btn = document.createElement('button');
                btn.innerText = '+';
                btn.style.cssText = "padding:0 5px; font-size:10px; cursor:pointer; background:#6366f1; color:white; border:none; border-radius:3px; line-height:14px;";
                
                btn.onclick = async (e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (typeof chrome === 'undefined' || !chrome.runtime?.id) return;
                    btn.innerText = '...';
                    try {
                        const s = await fetch(SUBMIT_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: "https://" + item.domain })
                        });
                        if (s.ok) { btn.remove(); statusIcon.innerText = ' ⏳'; statusIcon.style.color = '#f59e0b'; }
                    } catch(err) { btn.innerText = '?'; }
                };
                container.appendChild(btn);
            }

            if (isBanned) {
                item.element.style.opacity = "0.5";
                item.element.style.textDecoration = "line-through";
            }

            const target = item.element.querySelector('h3') || item.element;
            target.appendChild(container);
        });
    } catch (e) {
        if (e.message?.includes("context invalidated")) clearInterval(sgoviInterval);
    }
}

// RESTLICHER TEIL: Bulk Scan & Message Listener
async function scanPage() {
    const allLinks = Array.from(document.querySelectorAll('a[href^="http"]'));
    const unique = [...new Set(allLinks.map(l => getCleanDomain(l.href)).filter(Boolean))];
    
    if (!unique.length) { alert(lang.noDomains); return; }
    if (!confirm(`${unique.length} ${lang.bulkConfirm}`)) return;

    try {
        const res = await fetch(SUBMIT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: unique.map(d => "https://" + d) })
        });
        const r = await res.json();
        if (r.status === "success") alert(lang.bulkSuccess);
    } catch(e) { alert(lang.error); }
}

// Listener für Nachrichten vom Popup (z.B. Button "Ganze Seite scannen")
chrome.runtime.onMessage.addListener((m) => { 
    if (m.action === "SCAN_FULL_PAGE") scanPage(); 
});

const sgoviInterval = setInterval(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
        sgoviMain();
    } else {
        clearInterval(sgoviInterval);
    }
}, 4000);

sgoviMain();