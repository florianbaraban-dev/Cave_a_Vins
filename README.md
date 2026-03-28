# 🍷 Ma Cave à Vin

Application mobile-first de gestion de cave à vin, synchronisée avec Google Sheets.

## Structure du projet

```
src/
├── constants/        → GAS_URL, MAX, WINE, GAS_CODE
├── utils/            → helpers (wc, isReady, emptyForm)
├── styles/           → app.css (thème sombre + clair)
├── hooks/
│   └── useCave.js    → tout l'état et la logique métier
├── components/
│   ├── icons/        → icônes SVG
│   ├── ui/           → BottleRow, SearchList, BottomSheet, ValeurModal
│   └── views/        → CaveView, ListView, DetailView, AddView,
│                        EditView, SearchView, AllWinesView, SettingsView
├── App.jsx           → routeur de vues + overlays
└── main.jsx          → point d'entrée React
```

## Démarrage

```bash
npm install
npm run dev
```

## Déploiement

### Netlify
```bash
npm run build
# Drag & drop du dossier dist/ sur netlify.com/drop
# ou : connectez le repo, Build command: npm run build, Publish dir: dist
```

### GitHub Pages
```bash
# Si le repo est username.github.io/cave-a-vin,
# changez base: './' → base: '/cave-a-vin/' dans vite.config.js

npm install -D gh-pages
# Ajoutez dans package.json → "deploy": "gh-pages -d dist"
npm run build && npm run deploy
```

## Connexion Google Sheets

Dans l'app → **Tous les vins** → ⚙️ **Paramètres**
Suivez les étapes pour déployer le Google Apps Script et coller l'URL générée.
