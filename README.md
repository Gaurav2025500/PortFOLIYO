# Portfolio Frontend – Gaurav Ayodhya Shivhare

Static website: `index.html`, `style.css`, `script.js`, `profile.json`.
All content lives in `profile.json` (links, skills, topics, projects).

## Run in VS Code
- Easiest: right-click `index.html` > Open with Live Server (the page reads `profile.json`, so it needs a server; double-clicking the file will not work).
- Or: `npm install` then `npm start`, open http://localhost:3000

## Upload to GitHub
Create a repository and push the contents of this folder to it.

## Deploy on Railway
1. New Project > Deploy from GitHub repo > pick the repo.
2. Railway detects `package.json` and runs `npm start`. No settings needed.
3. Settings > Networking > Generate Domain.

(GitHub Pages also works: Settings > Pages > deploy from the main branch, root folder.)
