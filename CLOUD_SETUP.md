# Cloud Sync setup (Google Sheet) — ~10 minutes, no coding

This turns one Google Sheet into a shared collection point. Hospitals tap **Submit my data**; you (AMR Unit) tap **Collect all** to pull every submission into one master view.

You only need a **Google account**. Do this once.

## Steps
1. Go to **sheets.google.com** and create a **new blank spreadsheet**. Name it e.g. *AMS Submissions 2026*.
2. In the menu: **Extensions ▸ Apps Script**. A code editor opens in a new tab.
3. Delete anything in the editor, then **paste the entire contents of `cloud/Code.gs`** (included with the app).
   - Optional: to restrict access, set `SHARED_CODE` (e.g. `var SHARED_CODE = 'AMR2026';`). Use the same code in the app's *Shared code* box.
4. Click **Deploy ▸ New deployment**. Choose type **Web app**. Set:
   - **Execute as:** *Me*
   - **Who has access:** *Anyone*
   Click **Deploy**, then **Authorize access** and allow the permissions (it's your own script).
5. Copy the **Web app URL** it shows (it ends in `/exec`).
6. In the AMS app, open **Cloud**, paste that URL into **Cloud link**, (optionally type your **Shared code**), and tap **Save link**.

That's it.

## How everyone uses it
- **Each hospital:** open the app (with the same Cloud link + code already saved, or paste it once), complete the checklist, then **Cloud ▸ Submit my data**.
- **You (AMR Unit):** open your master copy and tap **Cloud ▸ Collect all**. Every submission loads in, de‑duplicated by hospital name (newest wins). Switch to **Overview** to present the combined results.

## Tips
- **Pre‑fill the link for hospitals:** the easiest distribution is to host the app once (GitHub Pages / MOH intranet) and have each hospital open that link, then paste the Cloud link once. Or ask me to bake your URL into the app so it's already set.
- **Refresh:** *Collect all* pulls the latest each time you tap it (it's on‑demand, not a constant live stream).
- **Privacy:** anyone with the Web app URL + code can submit/read. Keep the link internal to MOH. This tool stores self‑assessment answers only — no patient data.
- **Records:** every submission is also a row in your Google Sheet, so you always have the raw log.
