# Website Checker
Trage dazu bei, das SgoVi-Web sicherer zu machen. Reiche neue Domains ein, melde Verstöße gegen die Suchmaschinen-Richtlinien und filtere unsichere Inhalte direkt im Browser.

# 🛡️ SgoVi Website Checker Extension

[![Lizenz: MIT](https://img.shields.io/badge/Lizenz-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Community Project](https://img.shields.io/badge/SgoVi-Open%20Source-blue.svg)]()

Die **SgoVi Website Checker Extension** ist ein kollaboratives Werkzeug, um das **SgoVi-Web** sicher auf- und auszubauen. Mit dieser Extension kann jeder Nutzer aktiv dazu beitragen, neue Webseiten in die SgoVi-Warteschlange einzureichen oder Domains zu identifizieren, die gegen die Richtlinien verstoßen.

Gemeinsam filtern wir das Internet und sorgen für eine saubere, vertrauenswürdige Suchmaschine.

---

## 🚀 Hauptfunktionen

Die Extension fungiert als intelligenter Gatekeeper vor der Indexierung in der SgoVi-Suchmaschine:

### 1. Intelligente Warteschlange
* **Domain-Submission:** Füge Webseiten hinzu, die noch nicht im SgoVi-Web erfasst sind.
* **Status-Einsicht:** Sieh direkt im Browser, ob eine Seite bereits geprüft, in der Warteschlange oder gesperrt ist.

### 2. Automatisierte Filter-Logik
Bevor eine Domain zur Warteschlange hinzugefügt werden kann, führt die Extension folgende Prüfungen durch:

* **🔒 Protokoll-Validierung:** Erkennt automatisch `http` vs. `https`. Unsichere `http`-Verbindungen werden **strikt abgelehnt**.
* **🚫 Ban-System:** Gleicht die URL mit der globalen SgoVi-Ban-Liste ab. Bereits gebannte Seiten können nicht erneut eingereicht werden.
* **🙊 Badword-Filter:** Prüft die Domain und Metadaten gegen eine integrierte Verbotsliste (Badword-List). Verstöße führen zum sofortigen Block des Eintrags.

---

## 🛠️ Installation (Entwickler-Modus)

Da sich dieses Projekt im Aufbau befindet, installierst du die Extension manuell in deinem Browser:

1.  **Repository klonen oder laden:**
    * Klicke oben auf `<> Code` -> `Download ZIP` und entpacke die Datei.
    * *Oder via Terminal:* `git clone https://github.com/SgobboVista/WebsiteChecker.git`
2.  **Chrome Erweiterungen öffnen:**
    * Gib `chrome://extensions/` in die Adresszeile ein.
3.  **Entwicklermodus aktivieren:**
    * Schalte den Schalter oben rechts auf **An**.
4.  **Extension laden:**
    * Klicke auf **"Entpackte Erweiterung laden"**.
    * Wähle den Ordner aus, der die Datei `manifest.json` enthält.

---

## 🤝 Mitwirken (Contributing)

Dieses Projekt lebt von deiner Hilfe! Jeder kann beitragen:

* **Fehler finden:** Melde Probleme über die [Issues](https://github.com/SgobboVista/WebsiteChecker/issues).
* **Listen pflegen:** Hilf uns, die Badword-Listen und Ban-Kriterien aktuell zu halten.
* **Code verbessern:** Optimiere die Erkennungs-Logik oder das Design.

### Workflow für Entwickler:
1.  **Forke** das Projekt.
2.  Erstelle einen neuen **Branch** (`git checkout -b feature/mein-update`).
3.  Speichere deine Änderungen (**Commit**) und lade sie hoch (**Push**).
4.  Erstelle einen **Pull Request**.

---

## ⚖️ Copyright & Lizenz

**Copyright © 2026 SgoVi & Community Mitwirkende**

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert. Du darfst den Code frei verwenden, modifizieren und teilen, sofern der Urheberrechtshinweis erhalten bleibt. Details findest du in der Datei [LICENSE](LICENSE).

---

## 📢 Wichtiger Hinweis
> Diese Extension dient der Vorfilterung durch die Community. Die endgültige Aufnahme einer Webseite in den offiziellen SgoVi-Index erfolgt nach einer finalen technischen Prüfung durch unsere Server-Systeme.
