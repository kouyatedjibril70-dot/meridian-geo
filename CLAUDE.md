# Meridian Geo — site vitrine

Contexte projet pour Claude Code. Lis ce fichier avant toute modification.

## Ce qu'est ce projet
Site vitrine (une seule page, statique) de **Meridian Geo**, cabinet de
Djibril Kouyaté : solutions géospatiales & transformation numérique pour
les organisations d'Afrique de l'Ouest. Pas de framework, pas de build :
HTML + CSS + JS vanilla, déployable tel quel (Netlify).

## Structure
```
meridian-geo/
├── index.html            # structure seule (pas de CSS/JS inline)
├── assets/
│   ├── css/styles.css     # tous les styles
│   ├── js/main.js         # tout le JS (loader, curseur, canvas, reveals, tilt)
│   └── favicon.svg        # la marque
├── CLAUDE.md              # ce fichier
└── README.md
```

## Règle d'or de la marque
**Un seul accent (ambre), de la retenue.** L'identité dit « discipline » ;
le code ne doit pas la contredire par une surcharge d'animations. En cas de
doute entre deux options, choisir la plus sobre. Voir la charte visuelle.

## Design tokens — NE PAS MODIFIER (valeurs partagées avec la charte)
| Token            | Valeur      | Usage                                  |
|------------------|-------------|----------------------------------------|
| `--abyss`        | `#0A1416`   | fond sombre principal                  |
| `--petrol`       | `#0F6E73`   | couleur de marque (teal cartographique)|
| `--bathymetric`  | `#08383C`   | panneaux profonds, bandeaux            |
| `--amber`        | `#E9A23B`   | **accent unique** (méridien, actions)  |
| `--paper`        | `#F5F7F6`   | surface claire / fond body             |
| `--slate`        | `#5F6E6E`   | texte secondaire                       |
| `--mist`         | `#C7D2D0`   | texte sur fond sombre                  |

Typo : Space Grotesk (titres) · IBM Plex Sans (texte) · IBM Plex Mono (données).
Le logo (méridien ambre) **ne tourne pas et ne se déplace pas** : c'est « une position ».

---

## Backlog de corrections (par priorité)

### P0 — Robustesse (le site doit rester lisible si le JS échoue ou est lent)
- [ ] **Piège du loader.** `#loader` ne reçoit `.done` que via `window.load`
  + `setTimeout(1800)`. Si le JS plante ou si `load` tarde (il attend TOUTES
  les ressources, polices comprises), la page reste masquée. → Déclencher le
  masquage sur `DOMContentLoaded` + un `setTimeout` de secours court (~600 ms),
  et ajouter un filet CSS : `<noscript>` qui force `#loader{display:none}`.
- [ ] **Contenu masqué sans JS.** `.reveal`, `#hero-sub`, `#hero-actions`,
  `h2.big`, `.lead` partent à `opacity:0` et ne réapparaissent que par JS.
  → Pattern « progressive enhancement » : ajouter `document.documentElement
  .classList.add('js')` tout en haut du JS, et ne cacher l'état initial que
  sous `.js` (`html:not(.js) .reveal{opacity:1;transform:none}`). Sans JS,
  tout est visible.
- [ ] **Lien email non fonctionnel sans JS.** `<a id="copy-email">` n'a pas de
  `href`. → Ajouter `href="mailto:contact@meridiangeo.sn"` ; garder la copie
  presse-papier comme bonus (ne `preventDefault` que si `navigator.clipboard`
  existe).

### P1 — Accessibilité & mouvement
- [ ] **`prefers-reduced-motion` incomplet.** Seul le tracé du globe est géré.
  Ajouter un bloc `@media (prefers-reduced-motion: reduce)` qui neutralise :
  loader pulsé, `gridPulse`, `pulseGlow`/`pulseRing`, `word-reveal`, compteurs,
  parallax, tilt — et, côté JS, **ne pas lancer** la boucle canvas ni les
  écouteurs de parallax/tilt si l'utilisateur a demandé moins de mouvement
  (`matchMedia('(prefers-reduced-motion: reduce)').matches`).
- [ ] **Navigation mobile absente.** Sous 820 px les liens `.nl` sont masqués
  sans menu de remplacement. → Ajouter un menu burger minimal (ou au moins
  garder Approche/Solutions/Contact accessibles).
- [ ] **Curseur personnalisé.** Lier `cursor:none` à la classe `.js` et au
  media `(hover:hover) and (pointer:fine)` uniquement ; nettoyer la règle
  `body{cursor:auto}` égarée hors media-query (bloc CUSTOM CURSOR).

### P2 — Performance (connexions ouest-africaines, appareils modestes)
- [ ] **Canvas constellation.** Boucle `requestAnimationFrame` en O(n²) sans
  arrêt. → Mettre en pause quand le hero sort du viewport (IntersectionObserver),
  plafonner à `devicePixelRatio` raisonnable, désactiver sur `pointer:coarse`
  et reduced-motion.
- [ ] **Parallax globe + tilt cartes.** Lisent la mise en page dans des
  handlers `scroll`/`mousemove` non throttlés. → Batcher via `rAF`, transformer
  uniquement, désactiver au tactile.

### P3 — Choix « wow vs sobre » (décision de Djibril, pas un bug)
- [ ] Regrouper les 3 effets les plus lourds (canvas, tilt/parallax du globe,
  curseur perso) derrière **un seul interrupteur** en haut de `main.js`
  (`const ENABLE_FX = true;`). On peut ainsi comparer la version démo et la
  version production en une ligne, sans casser le reste.
- [ ] Rappel charte : le globe ne devrait ni pivoter ni se décaler au scroll
  (`.globe:hover{transform:...}` + parallax). À trancher.

### P4 — Mise en production
- [ ] Remplacer le texte des **Solutions** (JO'TALI, Portail SERA) selon ce que
  l'employeur autorise (nom de l'ONG, chiffres).
- [ ] Ajouter les balises `og:image` / `twitter:card` (aperçus de lien) — visuel
  = la marque sur fond abysse.
- [ ] Formulaire de contact optionnel via **Netlify Forms** (sans backend).
- [ ] Déploiement Netlify, puis brancher le domaine `meridiangeo.sn`.

## Comment tester
Ouvre `index.html` dans le navigateur (ou `python3 -m http.server` à la racine).
Vérifie : JS désactivé → tout reste lisible ; DevTools « Emulate reduced motion »
→ animations calmées ; largeur mobile → navigation utilisable.
