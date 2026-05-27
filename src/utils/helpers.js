import { WINE } from '../constants';

/** Retourne la couleur CSS dot d'un type de vin. */
export const wc = (c) => (WINE[c] || WINE.Rouge).dot;

/** Crée un formulaire vide pour l'ajout d'une bouteille. */
export function emptyForm(rangement = '') {
  return {
    nom: '', producteur: '', couleur: 'Rouge', annee: '',
    region: '', appellation: '', sousRegion: '', cepage: '',
    dateAchat: '', prixAchat: '', lieuAchat: '',
    boireDes: '', boireJusque: '', image: '',
    emplacement: '', rangement: String(rangement),
  };
}

/**
 * Retourne true si la bouteille est prête à boire
 * (boireDes est défini et dans le passé ou aujourd'hui).
 */
export function isReady(b) {
  if (!b.boireDes) return false;
  const parts = b.boireDes.split('/');
  let d;
  if (parts.length === 3) {
    d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  } else {
    d = new Date(b.boireDes);
  }
  if (isNaN(d)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d <= today;
}
