# Meridian Geo — site vitrine

Site statique (HTML/CSS/JS vanilla). Aucune dépendance, aucun build.

## Lancer en local
```bash
cd meridian-geo
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
Ou simplement ouvrir `index.html` dans le navigateur.

## Travailler avec Claude Code
Depuis le dossier `meridian-geo/` :
```bash
claude
```
Le fichier `CLAUDE.md` donne le contexte et le backlog de corrections
(priorités P0 → P4). Exemple de prompt : « Applique les tâches P0 du
backlog en respectant les design tokens et la règle de retenue. »

## Structure
- `index.html` — structure de la page
- `assets/css/styles.css` — styles
- `assets/js/main.js` — interactions (loader, curseur, canvas, reveals, tilt)
- `assets/favicon.svg` — la marque

## Déploiement (Netlify)
Glisser-déposer le dossier sur app.netlify.com, ou :
```bash
npx netlify deploy --prod --dir .
```
Brancher ensuite le domaine `meridiangeo.sn` dans les réglages Netlify.
