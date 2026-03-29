import { useMemo } from 'react';
import { Ico } from '../icons';
import ConfirmDialog from '../ui/ConfirmDialog';
import { wc, isReady } from '../../utils/helpers';

const COLOR_CHIPS = [
  { label: 'Rouge', color: '#9b2030' },
  { label: 'Blanc', color: '#c4a245' },
  { label: 'Rosé',  color: '#c97080' },
];

/**
 * Vue complète de tous les vins, avec recherche textuelle,
 * filtres couleur / "à boire", édition et suppression.
 */
export default function AllWinesView({
  bottles,
  goBack, navTo, openEdit,
  confirm, setConfirm, removeBottle,
  allFilter, setAllFilter,
  allColorFilter, setAllColorFilter,
  allReadyFilter, setAllReadyFilter,
}) {
  // Exclure les bouteilles archivées (rangement = 0)
  const activeBottles = useMemo(() =>
    bottles.filter(b => Number(b.rangement) !== 0),
    [bottles]
  );

  const filtered = useMemo(() => {
    const q = allFilter.trim().toLowerCase();
    return [...activeBottles]
      .filter(b => {
        const matchText = !q ||
          (b.nom || '').toLowerCase().includes(q) ||
          (b.producteur || '').toLowerCase().includes(q) ||
          (b.cepage || '').toLowerCase().includes(q) ||
          (b.region || '').toLowerCase().includes(q) ||
          (b.appellation || '').toLowerCase().includes(q);

        const matchColor = !allColorFilter ||
          b.couleur === allColorFilter ||
          (allColorFilter === 'Rosé' && (b.couleur === 'Rose' || b.couleur === 'Rosé'));

        const matchReady = !allReadyFilter || isReady(b);

        return matchText && matchColor && matchReady;
      })
      .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr'));
  }, [bottles, allFilter, allColorFilter, allReadyFilter]);

  const hasFilters = allColorFilter || allReadyFilter;

  return (
    <div className="panel">
      {/* Header */}
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="phdr-title">Tous les vins</div>
          <div className="phdr-sub">
            {filtered.length !== activeBottles.length
              ? `${filtered.length} / ${activeBottles.length} bouteille${activeBottles.length > 1 ? 's' : ''}`
              : `${activeBottles.length} bouteille${activeBottles.length > 1 ? 's' : ''}`}
          </div>
        </div>
        <button className="ibtn" onClick={() => navTo('history')} title="Historique">
          🗂
        </button>
        <button className="ibtn" onClick={() => navTo('settings')} title="Paramètres">
          {Ico.settings}
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="sbar" style={{ paddingBottom: 8 }}>
        <div className="sbar-inner">
          {Ico.search}
          <input
            className="sbar-input"
            placeholder="Filtrer…"
            value={allFilter}
            onChange={e => setAllFilter(e.target.value)}
          />
          {allFilter && (
            <button
              style={{ background: 'none', border: 'none', color: '#5a4a3a', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              onClick={() => setAllFilter('')}
            >×</button>
          )}
        </div>
      </div>

      {/* Chips de filtre */}
      <div className="fchips">
        {/* "À boire" */}
        <button
          className={`fchip ${allReadyFilter ? 'fchip-ready-on' : ''}`}
          onClick={() => setAllReadyFilter(v => !v)}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke={allReadyFilter ? '#4caf50' : 'currentColor'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          À boire
        </button>

        {/* Couleurs */}
        {COLOR_CHIPS.map(({ label, color }) => (
          <button
            key={label}
            className={`fchip ${allColorFilter === label ? 'fchip-on' : ''}`}
            style={allColorFilter === label
              ? { borderColor: color + 'cc', color, background: color + '1a' }
              : {}}
            onClick={() => setAllColorFilter(v => v === label ? '' : label)}
          >
            <span className="fchip-dot" style={{ background: color }} />
            {label}
          </button>
        ))}

        {/* Effacer tout */}
        {hasFilters && (
          <button
            className="fchip"
            style={{ color: '#5a4a3a', borderStyle: 'dashed' }}
            onClick={() => { setAllColorFilter(''); setAllReadyFilter(false); }}
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="no-bottles">
          {hasFilters || allFilter
            ? 'Aucun vin ne correspond à ces filtres'
            : 'Aucune bouteille dans la cave'}
        </div>
      ) : (
        filtered.map(b => (
        </div>
      ) : (
        filtered.map(b => (
          <div key={b.ref} className="brow">
            <div className="bthumb">
              {b.image ? <img src={b.image} alt={b.nom} /> : '🍾'}
              <span className="bthumb-dot" style={{ background: wc(b.couleur) }} />
            </div>

            <div className="binfo" onClick={() => navTo('detail', { bottle: b })}>
              <span className="bname">
                {b.nom || '—'}
                {isReady(b) && (
                  <span className="ready-badge" style={{ marginLeft: 6 }} title={`À boire dès ${b.boireDes}`}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    À boire
                  </span>
                )}
              </span>
              <span className="bprod">
                {b.producteur || ''}
                {b.producteur && b.annee ? <span className="bannee"> · {b.annee}</span> : b.annee ? <span className="bannee">{b.annee}</span> : null}
                {b.rangement ? <span className="bannee"> · Case {b.rangement}</span> : null}
              </span>
            </div>

            <div className="bactions">
              <button className="abtn" onClick={() => openEdit(b)} title="Modifier">{Ico.edit}</button>
              <button className="abtn del" onClick={() => setConfirm(b)} title="Archiver">{Ico.trash}</button>
            </div>
          </div>
        ))
      )}

      {/* Confirm overlay */}
      {confirm && (
        <ConfirmDialog
          bottle={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={removeBottle}
          overlay
        />
      )}
    </div>
  );
}
