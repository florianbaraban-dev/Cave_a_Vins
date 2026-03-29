import { wc } from '../../utils/helpers';

/**
 * Historique des bouteilles archivées (rangement = '0').
 * Permet de consulter et de restaurer une bouteille dans la cave.
 */
export default function HistoryView({ archivedBottles, goBack, navTo, restoreBottle, loading }) {
  return (
    <div className="panel">
      {/* Header */}
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div style={{ flex: 1 }}>
          <div className="phdr-title">Historique</div>
          <div className="phdr-sub">
            {archivedBottles.length} bouteille{archivedBottles.length !== 1 ? 's' : ''} archivée{archivedBottles.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {archivedBottles.length === 0 ? (
        <div className="no-bottles">Aucune bouteille archivée</div>
      ) : (
        archivedBottles.map(b => {
          const color = wc(b.couleur);
          return (
            <div key={b.ref} className="brow" style={{ opacity: 0.75 }}>
              <div className="bthumb">
                {b.image ? <img src={b.image} alt={b.nom} /> : '🍾'}
                <span className="bthumb-dot" style={{ background: color }} />
              </div>

              <div className="binfo" onClick={() => navTo('detail', { bottle: b })} style={{ flex: 1 }}>
                <span className="bname">{b.nom || '—'}</span>
                <span className="bprod">
                  {b.producteur || ''}
                  {b.producteur && b.annee
                    ? <span className="bannee"> · {b.annee}</span>
                    : b.annee ? <span className="bannee">{b.annee}</span> : null}
                </span>
              </div>

              <div className="bactions">
                <button
                  className="abtn"
                  onClick={() => restoreBottle(b.ref)}
                  disabled={loading}
                  title="Restaurer dans la cave"
                  style={{ fontSize: 18 }}
                >
                  ↩
                </button>
              </div>
            </div>
          );
        })
      )}

      {archivedBottles.length > 0 && (
        <div style={{ padding: '16px 20px', color: '#5a4a3a', fontSize: 13, textAlign: 'center' }}>
          Appuyez sur ↩ pour remettre une bouteille dans la cave sans case assignée.
        </div>
      )}
    </div>
  );
}
