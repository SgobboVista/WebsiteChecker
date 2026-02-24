const API_URL = 'https://sgobbovista.de/api_check.php';
const SUBMIT_URL = 'https://sgobbovista.de/submit_api.php';

async function sgoviMain() {
    // 1. Hole alle ungeprüften Links
    const links = document.querySelectorAll('a[href^="http"]:not([data-sgovi-checked])');
    if (!links.length) return;

    // Markiere sie SOFORT als geprüft, damit sie nicht doppelt verarbeitet werden
    const domainsToQuery = [];
    const linkMap = [];

    links.forEach(l => {
        try {
            const u = new URL(l.href);
            if (u.hostname.includes('google') || u.hostname.includes('sgobbovista')) {
                l.setAttribute('data-sgovi-checked', 'true');
                return;
            }
            const d = u.hostname.toLowerCase().replace('www.', '');
            l.setAttribute('data-sgovi-checked', 'true');
            domainsToQuery.push(d);
            linkMap.push({ domain: d, element: l });
        } catch(e) {}
    });

    if (domainsToQuery.length === 0) return;

    // 2. API Abfrage mit Fehler-Toleranz
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domains: [...new Set(domainsToQuery)] }) // Eindeutige Domains
        });

        if (!res.ok) throw new Error("API Offline");
        const data = await res.json();

        // 3. Icons zeichnen
        linkMap.forEach(item => {
            const isFound = data.existing?.includes(item.domain);
            const tagText = data.tags?.[item.domain] || "";
            
            // Container bauen (nur wenn noch nicht da)
            if (item.element.querySelector('.sgovi-container')) return;
            const b = document.createElement('span');
            b.className = 'sgovi-container';
            b.style.cssText = "margin-left:8px; font-size:12px; display:inline-flex; align-items:center; gap:4px;";

            // Tag-Anzeige (Bannlisten)
            if (tagText) {
                const isBan = tagText.includes('🚫');
                b.innerHTML += `<span style="background:${isBan ? '#ef4444' : '#4b5563'}; color:white; padding:1px 4px; border-radius:3px; font-size:9px;">${tagText}</span>`;
            }

            // Status Icon
            const icon = document.createElement('span');
            icon.style.fontWeight = "bold";
            if (isFound) {
                icon.innerText = ' ✔'; icon.style.color = '#22c55e';
                b.appendChild(icon);
            } else {
                icon.innerText = ' ✘'; icon.style.color = '#ef4444';
                b.appendChild(icon);

                // Add Button (nur wenn kein Ban)
                if (!tagText) {
                    const btn = document.createElement('button');
                    btn.innerText = '+';
                    btn.style.cssText = "padding:0 5px; font-size:10px; cursor:pointer; background:#6366f1; color:white; border:none; border-radius:3px;";
                    btn.onclick = async (e) => {
                        e.preventDefault(); e.stopPropagation();
                        btn.innerText = '...';
                        const s = await fetch(SUBMIT_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ url: "https://" + item.domain })
                        });
                        if (s.ok) { 
                            btn.remove(); 
                            icon.innerText = ' ✔'; icon.style.color = '#22c55e'; 
                        }
                    };
                    b.appendChild(btn);
                }
            }
            const target = item.element.querySelector('h3') || item.element;
            target.appendChild(b);
        });
    } catch (e) {
        console.error("SGOVI Fehler:", e);
    }
}

// Intervall deutlich langsamer machen, um PHP nicht zu killen
setInterval(sgoviMain, 4000);
sgoviMain();