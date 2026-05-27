// ── URL du Google Apps Script déployé ──────────────────────────────
export const GAS_URL =
  'https://script.google.com/macros/s/AKfycbyJxFmzN7xJUn8H4WK76S25bwWik-aN46nqlV5PQ9gnDQHx6hgzjPHULTyFmK7XAkI/exec';

// ── Capacité maximale d'une case ────────────────────────────────────
export const MAX = 25;

// ── Couleurs par type de vin ────────────────────────────────────────
export const WINE = {
  Rouge: { dot: '#9b2030', light: '#c0283f' },
  Blanc: { dot: '#c4a245', light: '#d4b85a' },
  Rosé:  { dot: '#c97080', light: '#d98090' },
  Rose:  { dot: '#c97080', light: '#d98090' },
};

// ── Code Google Apps Script à déployer (affiché dans Paramètres) ────
export const GAS_CODE = `// ─────────────────────────────────────────────────────────────────
// Cave à vin — Google Apps Script v3
// - Lecture par nom d'en-tête (robuste si colonnes bougent)
// - Normalisation des en-têtes avec retours à la ligne
// - Tout en GET pour éviter les blocages CORS
// ─────────────────────────────────────────────────────────────────
const SHEET_ID   = '1z0UvtYSB7zvOSpdo-YPB2eBNi9FKKbYO-a2RcEp-dQ8';
const SHEET_NAME = 'Ma Cave';

const COL_MAP = {
  'ref':          'ref',
  'rangement':    'rangement',
  "date d'achat": 'dateAchat',
  "prix d'achat": 'prixAchat',
  "lieu d'achat": 'lieuAchat',
  'producteur':   'producteur',
  'nom':          'nom',
  'couleur':      'couleur',
  'annee':        'annee',
  'region':       'region',
  'appellation':  'appellation',
  'sous region':  'sousRegion',
  'cepage':       'cepage',
  'emplacement':  'emplacement',
  'boire des':    'boireDes',
  'boire jusque': 'boireJusque',
  'image':        'image',
};

function normHdr(h) {
  return h.toString()
    .replace(/\\r?\\n/g, ' ')
    .trim()
    .toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
}

function normCouleur(v) {
  if (!v) return '';
  const s = v.toString().trim().toLowerCase();
  if (s === 'rouge') return 'Rouge';
  if (s === 'blanc') return 'Blanc';
  if (s.startsWith('ros')) return 'Rose';
  return v.toString().trim().charAt(0).toUpperCase() + v.toString().trim().slice(1);
}

function fmtDate(v) {
  if (!v) return '';
  if (v instanceof Date) {
    const d = v.getDate().toString().padStart(2,'0');
    const m = (v.getMonth()+1).toString().padStart(2,'0');
    return d+'/'+m+'/'+v.getFullYear();
  }
  return v.toString().trim();
}

function fmtPrice(v) {
  if (!v && v !== 0) return '';
  if (typeof v === 'number') return v.toFixed(2).replace('.',',') + ' €';
  return v.toString().trim();
}

function fmtAnnee(v) {
  if (!v) return '';
  if (v instanceof Date) return v.getFullYear().toString();
  const n = parseInt(v.toString().trim());
  if (!isNaN(n) && n > 1800 && n < 2100) return String(n);
  return v.toString().trim();
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'get';
  const s    = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const all  = s.getDataRange().getValues();
  const rawHdrs = all[0];

  const idx = {};
  rawHdrs.forEach((h, i) => {
    const norm = normHdr(h);
    if (COL_MAP[norm]) idx[COL_MAP[norm]] = i;
  });

  function cell(row, key) {
    return idx[key] !== undefined ? row[idx[key]] : '';
  }

  if (action === 'debug') {
    return json({ raw: rawHdrs.map(String), normalized: rawHdrs.map(normHdr), idx });
  }

  if (action === 'get') {
    const refIdx = idx['ref'] !== undefined ? idx['ref'] : 0;
    const rows   = all.slice(1).filter(r => r[refIdx] !== '' && r[refIdx] !== null && r[refIdx] !== undefined);
    const data   = rows.map(r => ({
      ref:         String(cell(r,'ref')         || ''),
      rangement:   cell(r,'rangement') !== '' && cell(r,'rangement') !== null ? Number(cell(r,'rangement')) : null,
      dateAchat:   fmtDate(cell(r,'dateAchat')),
      prixAchat:   fmtPrice(cell(r,'prixAchat')),
      lieuAchat:   String(cell(r,'lieuAchat')   || ''),
      producteur:  String(cell(r,'producteur')  || ''),
      nom:         String(cell(r,'nom')         || ''),
      couleur:     normCouleur(cell(r,'couleur')),
      annee:       fmtAnnee(cell(r,'annee')),
      region:      String(cell(r,'region')      || ''),
      appellation: String(cell(r,'appellation') || ''),
      sousRegion:  String(cell(r,'sousRegion')  || ''),
      cepage:      String(cell(r,'cepage')      || ''),
      emplacement: String(cell(r,'emplacement') || ''),
      boireDes:    fmtDate(cell(r,'boireDes')),
      boireJusque: fmtDate(cell(r,'boireJusque')),
      image:       String(cell(r,'image')       || ''),
    }));
    return json(data);
  }

  if (action === 'add') {
    const b       = JSON.parse(decodeURIComponent(e.parameter.data || '{}'));
    const refIdx  = idx['ref'] !== undefined ? idx['ref'] : 0;
    const refs    = all.slice(1).map(r => Number(r[refIdx]) || 0);
    const nextRef = Math.max(0, ...refs) + 1;
    const row     = new Array(rawHdrs.length).fill('');
    rawHdrs.forEach((h, i) => {
      const norm = normHdr(h);
      const key  = COL_MAP[norm];
      if (key && b[key] !== undefined && b[key] !== '') row[i] = b[key];
    });
    row[refIdx] = nextRef;
    s.appendRow(row);
    return json({ ok: true, ref: nextRef });
  }

  if (action === 'remove') {
    const ref    = String(e.parameter.ref || '');
    const refIdx = idx['ref'] !== undefined ? idx['ref'] : 0;
    for (let i = all.length - 1; i >= 1; i--) {
      if (String(all[i][refIdx]) === ref) { s.deleteRow(i + 1); break; }
    }
    return json({ ok: true });
  }

  return json({ error: 'action inconnue' });
}

function json(d) {
  const o = ContentService.createTextOutput(JSON.stringify(d));
  o.setMimeType(ContentService.MimeType.JSON);
  return o;
}`;
