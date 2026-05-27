/**
 * Liste de résultats de recherche rapide.
 * Utilisé dans CaveView (inline) et SearchView (plein écran).
 */
export default function SearchList({ results, onSelect }) {
  if (results.length === 0) {
    return (
      <div className="sempty">Tapez au moins 2 caractères pour rechercher</div>
    );
  }

  return (
    <div>
      {results.map(b => (
        <div
          key={b.ref}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 20px', borderBottom: '1px solid #1c1610', cursor: 'pointer',
          }}
          onClick={() => onSelect(b)}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 8,
            background: '#1e1812', border: '1px solid #322619',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            {b.image
              ? <img src={b.image} alt={b.nom} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              : '🍾'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: '#e0d4c0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {b.nom}
            </div>
            <div style={{ fontSize: 12, color: '#6a5a4a', marginTop: 2 }}>
              {[b.producteur, b.annee, b.rangement ? `Case ${b.rangement}` : null]
                .filter(Boolean).join(' · ')}
            </div>
          </div>

          <div style={{ color: '#3a2d22', fontSize: 18 }}>›</div>
        </div>
      ))}
    </div>
  );
}
