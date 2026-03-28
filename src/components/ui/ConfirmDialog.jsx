/**
 * Dialogue de confirmation de suppression d'une bouteille.
 * Peut s'afficher en inline (ListView) ou en overlay (AllWinesView).
 */
export default function ConfirmDialog({ bottle, onCancel, onConfirm, overlay = false }) {
  const inner = (
    <div className="confirm-box" onClick={e => e.stopPropagation()}>
      <div className="confirm-t">Retirer cette bouteille ?</div>
      <div className="confirm-d">
        <strong>{bottle.nom}</strong>
        {bottle.producteur ? ` — ${bottle.producteur}` : ''}
        {bottle.annee ? ` (${bottle.annee})` : ''}
      </div>
      <div className="confirm-acts">
        <button className="bghst" onClick={onCancel}>Annuler</button>
        <button className="bdang" onClick={() => onConfirm(bottle.ref)}>Retirer</button>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          zIndex: 30, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}
        onClick={onCancel}
      >
        <div style={{ background: '#1e1812', border: '1px solid #322619', borderRadius: '16px 16px 0 0', padding: 20, width: '100%', maxWidth: 560 }}
          onClick={e => e.stopPropagation()}>
          <div className="confirm-t">Retirer cette bouteille ?</div>
          <div className="confirm-d" style={{ marginTop: 6 }}>
            <strong>{bottle.nom}</strong>
            {bottle.producteur ? ` — ${bottle.producteur}` : ''}
            {bottle.annee ? ` (${bottle.annee})` : ''}
          </div>
          <div className="confirm-acts" style={{ marginTop: 16 }}>
            <button className="bghst" onClick={onCancel}>Annuler</button>
            <button className="bdang" onClick={() => onConfirm(bottle.ref)}>Retirer</button>
          </div>
        </div>
      </div>
    );
  }

  return <div className="confirm-wrap">{inner}</div>;
}
