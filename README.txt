A135 VIRTUAL OFFICE — ONE-FOLDER EDITION
========================================

QUICK START
1. Extract this ZIP.
2. All project files are in this single folder.
3. Open index.html to use the dashboard locally.
4. To host the website, upload index.html to a static host such as Netlify or GitHub Pages.

CLOUD ACCESS FROM ANYWHERE
Hosting index.html alone does not sync data between devices.
1. Follow FIREBASE_SETUP.txt to create a Firebase project, enable Google sign-in and Firestore, and set secure rules.
2. Open the hosted website, go to Settings & Data → Cloud sync setup, paste the Firebase web config JSON, then sign in with Google.
3. Use the same Google account on all devices.

OTHER FILES
- HOSTING_README.txt: live hosting and cloud setup.
- Google_Apps_Script_Code.gs / Google_Apps_Script_Setup.txt: Google Forms to master database.
- Docker_Compose.yml / n8n_Setup.txt: optional n8n automation.
- *_Template.csv: importable spreadsheet templates.
- *_Prompt.txt: AI agent prompts.

SECURITY
- Never publish API keys, passwords, service-account files, or bot tokens.
- Use the secure Firestore rules provided in FIREBASE_SETUP.txt.
- Export JSON backups regularly.

RESPONSIVE DESIGN
The dashboard adapts its navigation, cards, forms, tables and buttons for mobile phones, tablets, laptops and desktop screens. Tables scroll horizontally on small screens where needed.
