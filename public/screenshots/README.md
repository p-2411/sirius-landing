# App screenshots

Drop real Sirius app captures here; the landing `ScreenshotFrame` swaps the
placeholder for the image automatically once `src` points at the file.

Capture from the running Sirius app and name exactly:

- `voice-orb.png` — `/` home (orb voice screen)
- `work-chat.png` — `/work` (chat + composer)
- `workflow-detail.png` — `/workflows/[name]` (two-pane DAG + workflow chat) — flagship
- `workflows-index.png` — `/workflows` (table + status pills)

Recommended: PNG or WebP, ~1600×1000 (16:10), dark theme, no OS chrome.
After adding a file, set the matching `src` prop in the section component
(grep `ScreenshotFrame` to find the slots).
