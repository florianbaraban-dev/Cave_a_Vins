# 🍷 Cave à Vins — Guide complet

> Ce README explique **chaque fichier du projet** pour que vous puissiez modifier l'application en toute confiance.

---

## Sommaire

1. [Structure générale](#1-structure-générale)
2. [Fichiers racine](#2-fichiers-racine)
3. [src/main.jsx — Point d'entrée](#3-srcmainjsx--point-dentrée)
4. [src/App.jsx — Routeur de vues](#4-srcappjsx--routeur-de-vues)
5. [src/constants/ — Valeurs globales](#5-srcconstants--valeurs-globales)
6. [src/utils/ — Fonctions utilitaires](#6-srcutils--fonctions-utilitaires)
7. [src/styles/ — CSS complet](#7-srcstyles--css-complet)
8. [src/hooks/ — Logique métier](#8-srchooks--logique-métier)
9. [src/components/icons/ — Icônes SVG](#9-srccomponentsicons--icônes-svg)
10. [src/components/ui/ — Composants réutilisables](#10-srccomponentsui--composants-réutilisables)
11. [src/components/views/ — Pages de l'app](#11-srccomponentsviews--pages-de-lapp)
12. [Démarrage & déploiement](#12-démarrage--déploiement)
13. [Exemples de modifications courantes](#13-exemples-de-modifications-courantes)

---

## 1. Structure générale

```
cave-a-vin/
├── index.html                          ← page HTML racine (ne pas toucher)
├── package.json                        ← dépendances npm
├── vite.config.js                      ← configuration du bundler
├── .gitignore
├── README.md                           ← ce fichier
└── src/
    ├── main.jsx                        ← démarre React
    ├── App.jsx                         ← routeur : affiche la bonne vue
    ├── constants/
    │   └── index.js                    ← ⚙️  réglages globaux (MAX, couleurs…)
    ├── utils/
    │   └── helpers.js                  ← fonctions pures réutilisables
    ├── styles/
    │   └── app.css                     ← tout le CSS (thème sombre + clair)
    ├── hooks/
    │   └── useCave.js                  ← tout l'état + les appels API
    └── components/
        ├── icons/
        │   └── index.jsx               ← toutes les icônes SVG
        ├── ui/                         ← petits composants réutilisables
        │   ├── BottleForm.jsx          ← champs formulaire bouteille
        │   ├── BottleRow.jsx           ← ligne dans une liste
        │   ├── BottomSheet.jsx         ← menu bas d'écran (case)
        │   ├── ConfirmDialog.jsx       ← confirmation suppression
        │   ├── SearchList.jsx          ← liste de résultats de recherche
        │   └── ValeurModal.jsx         ← pop-up valeur de la cave
        └── views/                      ← une vue = un "écran" de l'app
            ├── CaveView.jsx            ← écran principal (grille des cases)
            ├── ListView.jsx            ← liste des bouteilles d'une case
            ├── DetailView.jsx          ← fiche détail d'une bouteille
            ├── AddView.jsx             ← formulaire ajout bouteille
            ├── EditView.jsx            ← formulaire modification bouteille
            ├── SearchView.jsx          ← recherche plein écran
            ├── AllWinesView.jsx        ← tous les vins + filtres
            └── SettingsView.jsx        ← connexion Google Sheets
```

---

## 2. Fichiers racine

### `index.html`
Page HTML minimale. Elle contient uniquement `<div id="root">` où React s'injecte, et un `<script>` qui charge `src/main.jsx`. **Ne pas modifier** sauf pour changer le titre de l'onglet navigateur ou ajouter une favicon.

```html
<title>Ma Cave à Vin</title>  ← changez ici le titre de l'onglet
```

---

### `package.json`
Liste les dépendances et les commandes disponibles.

```json
"scripts": {
  "dev":     "vite",        ← npm run dev    → serveur local
  "build":   "vite build",  ← npm run build  → génère le dossier dist/
  "preview": "vite preview" ← npm run preview → prévisualise le build
}
```

Les seules dépendances sont **React 18** et **Vite**. Pas de bibliothèque externe.

---

### `vite.config.js`
Configuration du bundler. **Un seul réglage à connaître** : `base`.

```js
base: '/Cave_a_Vins/',   // ← nom exact de votre repo GitHub
```

Si vous renommez votre repo ou déployez sur Netlify (domaine racine), remplacez par `'./'`.

---

## 3. `src/main.jsx` — Point d'entrée

Démarre React. Importe le CSS global et monte le composant `<App>` dans le `<div id="root">` du HTML.

**Vous n'avez jamais besoin de modifier ce fichier.**

---

## 4. `src/App.jsx` — Routeur de vues

C'est le **chef d'orchestre** de l'application. Il :

1. Appelle `useCave()` pour récupérer tout l'état de l'app
2. Affiche la bonne vue selon `s.view` (une simple chaîne : `'cave'`, `'list'`, `'detail'`…)
3. Affiche les overlays par-dessus : BottomSheet, ValeurModal, Toast

```jsx
// Exemple : ajouter un nouvel écran
{s.view === 'monNouvelEcran' && (
  <MonNouvelEcran
    goBack={s.goBack}
    // ... autres props
  />
)}
```

**Navigation** : pour naviguer vers un écran, on appelle `s.navTo('nomEcran')`. Pour revenir, `s.goBack()`. L'historique est géré automatiquement dans `useCave`.

---

## 5. `src/constants/index.js` — Valeurs globales

C'est **le fichier de configuration principale** de l'app. Modifiez-le en premier si vous voulez changer le comportement global.

```js
// ① URL de votre Google Apps Script
export const GAS_URL = 'https://script.google.com/macros/s/VOTRE_ID/exec';
//   └─ Remplacez par votre propre URL après déploiement du script

// ② Capacité d'une case
export const MAX = 25;
//   └─ Changez ce nombre pour autoriser plus/moins de bouteilles par case

// ③ Couleurs des types de vin (utilisées pour les pastilles et les filtres)
export const WINE = {
  Rouge: { dot: '#9b2030' },  // ← changez le code couleur hex
  Blanc: { dot: '#c4a245' },
  Rosé:  { dot: '#c97080' },
};

// ④ GAS_CODE : le script Google Apps Script à coller dans Google Sheets
//   (affiché dans l'écran Paramètres de l'app — ne modifier que si vous
//    changez la structure de votre feuille Google Sheets)
```

---

## 6. `src/utils/helpers.js` — Fonctions utilitaires

Trois fonctions pures (sans état, sans effets) :

```js
// Retourne la couleur CSS d'un type de vin
wc('Rouge')  // → '#9b2030'
wc('Blanc')  // → '#c4a245'

// Retourne true si la bouteille est prête à boire
// (date boireDes atteinte ou dépassée)
isReady(bouteille)  // → true / false

// Crée un objet formulaire vide, avec optionnellement un numéro de case
emptyForm(3)  // → { nom: '', couleur: 'Rouge', rangement: '3', ... }
```

**Quand modifier ce fichier** : si vous ajoutez un nouveau champ à une bouteille, ajoutez-le dans `emptyForm()`.

---

## 7. `src/styles/app.css` — CSS complet

Tout le style de l'application en un seul fichier. Il est organisé en sections clairement commentées :

```css
/* ── VARIABLES ──    tailles, espacements, breakpoints */
/* ── APP SHELL ──    conteneur principal */
/* ── HEADER ──       barre du haut */
/* ── SLOT ──         cases de la cave */
/* ── PANEL ──        écrans qui glissent par-dessus */
/* ── BOTTLE LIST ──  lignes de bouteilles */
/* ── DETAIL VIEW ── fiche bouteille */
/* ── ADD/EDIT FORM ─ formulaires */
/* ── BOTTOM SHEET ── menu bas d'écran */
/* ── STATS BAR ──    compteurs en haut */
/* ── TOAST ──        notification temporaire */
/* ══ LIGHT THEME ══  tout le thème clair */
/* ══ RESPONSIVE ══   tablette et desktop */
```

### Changer les couleurs principales

Toutes les couleurs dorées de l'interface sont `#c4a35a`. Pour changer l'accent :

```css
/* Cherchez et remplacez #c4a35a par votre couleur */
/* Exemples d'endroits clés : */
.hdr-title   { color: #c4a35a; }  /* titre "Ma Cave" */
.ctab.on     { background: #c4a35a; }  /* onglet actif */
.btnp        { background: #c4a35a; }  /* bouton principal */
```

### Variables CSS

Les tailles s'adaptent automatiquement via `clamp()`. Pour changer la largeur max de l'app :

```css
:root {
  --app-w: min(100%, 600px);  /* ← largeur max sur grand écran */
}
```

---

## 8. `src/hooks/useCave.js` — Logique métier

C'est **le cerveau de l'application**. Tout l'état et toutes les actions sont ici. Les vues ne font qu'afficher ce que ce hook leur fournit.

### État principal

```js
bottles      // tableau de toutes les bouteilles chargées depuis GAS
loading      // true pendant un appel API
view         // écran affiché : 'cave' | 'list' | 'detail' | 'add' | 'edit' | ...
cave         // numéro de la cave active (1, 2, 3 ou 4)
caves        // liste des caves créées : [1] ou [1, 2] etc.
slot         // numéro de la case actuellement ouverte
theme        // 'dark' ou 'light', sauvegardé dans localStorage
```

### Actions principales

```js
navTo('nomEcran')          // naviguer vers un écran (empile l'historique)
goBack()                   // revenir à l'écran précédent

addBottle()                // envoie le formulaire `form` vers GAS
removeBottle(ref)          // supprime la bouteille avec cet identifiant
saveEdit()                 // sauvegarde les modifications de `editForm`

loadFromGas(url)           // recharge toutes les données depuis Google Sheets
saveGas()                  // sauvegarde l'URL GAS dans localStorage
toggleTheme()              // bascule sombre ↔ clair

addCave()                  // ajoute une cave (max 4)
deleteCave(c)              // supprime une cave si elle est vide
```

### Données calculées (useMemo)

Ces valeurs sont recalculées automatiquement quand `bottles` change :

```js
slotData      // { 1: { count, bottles, colors }, 2: ..., ... }  pour les 8 cases
slotBottles   // bouteilles de la case actuellement ouverte
searchResults // résultats filtrés selon le texte de recherche
totalValeur   // { sum, count } — somme des prix renseignés
```

### Ajouter un nouveau champ à une bouteille

1. Ajoutez le champ dans `emptyForm()` dans `helpers.js`
2. Ajoutez l'input dans `BottleForm.jsx`
3. Ajoutez l'affichage dans `DetailView.jsx` (tableau `FIELDS`)

---

## 9. `src/components/icons/index.jsx` — Icônes SVG

Toutes les icônes de l'app regroupées en un objet `Ico`.

```jsx
import { Ico } from '../icons';
// Utilisation :
{Ico.search}   // loupe
{Ico.plus}     // +
{Ico.trash}    // poubelle
{Ico.edit}     // crayon
{Ico.settings} // roue crantée
{Ico.euro}     // symbole €
{Ico.moon}     // lune (thème sombre)
{Ico.sun}      // soleil (thème clair)
{Ico.check}    // coche verte "À boire"
```

**Ajouter une icône** : ajoutez simplement une nouvelle entrée dans l'objet en copiant un SVG depuis [heroicons.com](https://heroicons.com) par exemple.

---

## 10. `src/components/ui/` — Composants réutilisables

### `BottleForm.jsx`
Tous les champs du formulaire d'une bouteille (nom, producteur, couleur, millésime, etc.). Utilisé à la fois par `AddView` et `EditView` pour éviter la duplication.

**Pour ajouter un champ** :
```jsx
<div>
  <label className="flabel">Mon nouveau champ</label>
  <input className="finput" value={values.monChamp || ''} onChange={onChange('monChamp')} />
</div>
```

---

### `BottleRow.jsx`
Une ligne dans une liste de bouteilles : vignette + nom + producteur + boutons action. Utilisé dans `ListView`.

```jsx
<BottleRow
  b={bouteille}
  onInfo={() => navTo('detail', { bottle: b })}  // clic sur infos
  onDel={() => setConfirm(b)}                     // clic sur supprimer
/>
```

---

### `BottomSheet.jsx`
Le menu qui monte par le bas quand on tape sur une case. Propose "Voir les bouteilles" et "Ajouter". Reçoit `slot` (numéro de case), `slotData` (données de la case), et les callbacks `onList` / `onAdd`.

---

### `ConfirmDialog.jsx`
Dialogue de confirmation avant suppression. Peut s'afficher en deux modes :
- `overlay={false}` (défaut) → intégré dans la page (ListView)
- `overlay={true}` → plein écran par-dessus tout (AllWinesView)

---

### `SearchList.jsx`
Affiche une liste de résultats de recherche. Reçoit `results` (tableau de bouteilles) et `onSelect` (callback au clic). Si `results` est vide, affiche un message d'invite.

---

### `ValeurModal.jsx`
Pop-up affichant la valeur totale estimée de la cave (somme des prix d'achat), le prix moyen, et le nombre de bouteilles sans prix renseigné.

---

## 11. `src/components/views/` — Pages de l'app

Chaque fichier = un écran complet. Ils reçoivent leurs données via des props venant de `App.jsx` (lui-même les tenant de `useCave`).

---

### `CaveView.jsx` — Écran principal
La grille des 8 cases de la cave active. Contient aussi :
- La barre de statistiques (rouge / blanc / rosé / total)
- La barre de recherche rapide (résultats inline si ≥ 2 caractères)
- Les onglets de sélection de cave

**Modifier le nombre de cases affichées** : les cases sont générées par `[8,7,6,5,4,3,2,1].map(...)`. Changez ce tableau pour afficher dans un ordre différent.

---

### `ListView.jsx` — Bouteilles d'une case
Liste toutes les bouteilles d'une case. Affiche la confirmation de suppression en ligne quand on clique sur 🗑.

---

### `DetailView.jsx` — Fiche bouteille
Affiche tous les détails d'une bouteille en lecture seule. Les champs affichés sont définis dans le tableau `FIELDS` en haut du fichier :

```js
const FIELDS = [
  ['Millésime',    'annee'],
  ['Région',       'region'],
  // ← ajoutez une ligne ici pour afficher un nouveau champ
  ['Mon champ',    'monChamp'],
];
```

---

### `AddView.jsx` — Ajouter une bouteille
Formulaire d'ajout. Utilise `BottleForm` pour les champs. Le bouton "Ajouter" appelle `addBottle()` du hook. Désactivé tant que le nom est vide.

---

### `EditView.jsx` — Modifier une bouteille
Identique à `AddView` mais pre-rempli avec les données de la bouteille existante. Appelle `saveEdit()` à la validation (supprime l'ancienne entrée dans GAS et en crée une nouvelle).

---

### `SearchView.jsx` — Recherche plein écran
Champ de recherche plein écran avec résultats en dessous. La recherche porte sur le nom, le producteur et le cépage.

**Étendre la recherche à d'autres champs** : modifiez dans `useCave.js` :
```js
const searchResults = useMemo(() => {
  return bottles.filter(b =>
    (b.nom || '').toLowerCase().includes(q) ||
    (b.producteur || '').toLowerCase().includes(q) ||
    (b.cepage || '').toLowerCase().includes(q) ||
    (b.region || '').toLowerCase().includes(q)  // ← ajoutez ici
  );
}, [bottles, search]);
```

---

### `AllWinesView.jsx` — Tous les vins
Liste complète avec :
- Recherche textuelle (nom, producteur, cépage, région, appellation)
- Filtre "À boire" (date boireDes atteinte)
- Filtres par couleur (Rouge / Blanc / Rosé)
- Bouton modifier (✏️) et supprimer (🗑) sur chaque ligne

**Ajouter un filtre** : ajoutez un state dans `useCave.js`, un chip dans la section `fchips`, et une condition dans le `useMemo` de `filtered`.

---

### `SettingsView.jsx` — Paramètres
Permet de configurer l'URL Google Apps Script et de copier le code GAS à déployer. Affiche l'état de connexion (mode démo si pas d'URL).

---

## 12. Démarrage & déploiement

### Développement local
```bash
npm install
npm run dev
# → ouvre http://localhost:5173
```

### Déploiement GitHub Pages
```bash
# vite.config.js : base: '/Cave_a_Vins/'
npm run build
npm install -D gh-pages
# Dans package.json, ajoutez : "deploy": "gh-pages -d dist"
npm run deploy
```

### Déploiement Netlify
```bash
# vite.config.js : base: './'
npm run build
# Drag & drop du dossier dist/ sur netlify.com/drop
# ou connectez le repo : Build command = npm run build, Publish dir = dist
```

---

## 13. Exemples de modifications courantes

### Changer la capacité max d'une case
```js
// src/constants/index.js
export const MAX = 30;  // était 25
```

### Ajouter un type de vin (ex : Pétillant)
```js
// src/constants/index.js
export const WINE = {
  Rouge:      { dot: '#9b2030' },
  Blanc:      { dot: '#c4a245' },
  Rosé:       { dot: '#c97080' },
  Pétillant:  { dot: '#7a9bc4' },  // ← ajout
};
```
Puis dans `BottleForm.jsx`, ajoutez `'Pétillant'` au tableau du sélecteur de couleur.

### Changer la couleur dorée de l'interface
Dans `src/styles/app.css`, remplacez toutes les occurrences de `#c4a35a` par votre couleur.

### Ajouter un champ "Note personnelle"
1. `src/utils/helpers.js` → ajoutez `note: ''` dans `emptyForm()`
2. `src/components/ui/BottleForm.jsx` → ajoutez un `<textarea>` ou `<input>`
3. `src/components/views/DetailView.jsx` → ajoutez `['Note', 'note']` dans `FIELDS`

### Autoriser plus de 4 caves
```js
// src/components/views/CaveView.jsx
{caves.length < 8 && (   // était < 4
  <button className="ctab add" onClick={addCave}>+ Cave</button>
)}
```

### Modifier les couleurs du thème clair
```css
/* src/styles/app.css — section LIGHT THEME */
.app.light {
  --c-gold: #6b4f10;  /* ← couleur accent thème clair */
  --c-bg:   #faf6ee;  /* ← couleur de fond */
}
```
