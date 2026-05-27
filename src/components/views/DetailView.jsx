import { wc, isReady } from '../../utils/helpers';
import { Ico } from '../icons';

/** Champs à afficher dans la fiche détail, dans l'ordre souhaité. */
const FIELDS = [
  ['Millésime',    'annee'],
  ['Région',       'region'],
  ['Appellation',  'appellation'],
  ['Sous-région',  'sousRegion'],
  ['Cépage',       'cepage'],
  ['Case',         b => b.rangement ? `Case ${b.rangement}` : null],
  ['Emplacement',  'emplacement'],
  ["Date d'achat", 'dateAchat'],
  ['Prix',         'prixAchat'],
  ["Lieu d'achat", 'lieuAchat'],
  ['Boire dès',    'boireDes'],
  ['Boire jusque', 'boireJusque'],
];

/**
 * Fiche complète d'une bouteille (lecture seule).
 */
export default function DetailView({ bottle, goBack }) {
  if (!bottle) return null;

  const color = wc(bottle.couleur);
  const ready = isReady(bottle);

  return (
    <div className="panel">
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div className="phdr-title">Fiche bouteille</div>
      </div>

      <div className="det">
        {/* ── Hero ── */}
        <div className="det-hero">
          <div className="det-img">
            {bottle.image
              ? <img src={bottle.image} alt={bottle.nom} onError={e => { e.target.style.display = 'none'; }} />
              : '🍾'}
          </div>

          <div className="det-meta">
            <div className="det-name">{bottle.nom || '—'}</div>
            <div className="det-prod">{bottle.producteur || ''}</div>

            {ready && (
              <div style={{ marginTop: 6 }}>
                <span className="ready-badge" style={{ fontSize: 11, padding: '3px 10px 3px 7px' }}>
                  {Ico.check}
                  À maturité depuis le {bottle.boireDes}
                </span>
              </div>
            )}

            {bottle.couleur && (
              <div style={{ marginTop: 8 }}>
                <span className="badge" style={{
                  background: color + '22',
                  color,
                  border: `1px solid ${color}44`,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block' }} />
                  {bottle.couleur}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Infos ── */}
        <div>
          {FIELDS.map(([label, key]) => {
            const value = typeof key === 'function' ? key(bottle) : bottle[key];
            if (!value) return null;
            return (
              <div key={label} className="irow">
                <div className="ilabel">{label}</div>
                <div className="ivalue">{value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
