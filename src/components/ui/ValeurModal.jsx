/**
 * Bottom sheet affichant la valeur estimée de la cave
 * (somme des prix d'achat renseignés).
 */
export default function ValeurModal({ totalValeur, bottles, onClose }) {
  const { sum, count } = totalValeur;
  const sans = bottles.length - count;

  return (
    <>
      <div className="bkdrop" onClick={onClose} />
      <div className="bsheet">
        <div className="bsh-handle" />

        <div style={{ padding: '0 20px 8px', fontSize: 14, color: '#8a7060', letterSpacing: '0.05em' }}>
          Valeur estimée de la cave
        </div>

        <div style={{ padding: '16px 20px 0' }}>
          {/* Total */}
          <div style={{
            background: '#120e0a', border: '1px solid #322619', borderRadius: 12,
            padding: '24px 20px', textAlign: 'center', marginBottom: 16,
          }}>
            <div style={{ fontSize: 38, fontWeight: 'bold', color: '#c4a35a', letterSpacing: '0.02em' }}>
              {sum.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </div>
            <div style={{ fontSize: 12, color: '#5a4a3a', marginTop: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              sur {count} bouteille{count > 1 ? 's' : ''} renseignée{count > 1 ? 's' : ''}
            </div>
          </div>

          {/* Statistiques secondaires */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <div style={{
              flex: 1, background: '#1e1812', border: '1px solid #322619',
              borderRadius: 10, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, color: '#e0d4c0' }}>
                {count > 0
                  ? (sum / count).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : '—'} €
              </div>
              <div style={{ fontSize: 10, color: '#4a3a2a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Prix moyen
              </div>
            </div>

            <div style={{
              flex: 1, background: '#1e1812', border: '1px solid #322619',
              borderRadius: 10, padding: '14px 16px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, color: '#e0d4c0' }}>{sans}</div>
              <div style={{ fontSize: 10, color: '#4a3a2a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Sans prix
              </div>
            </div>
          </div>

          {/* Avertissement si prix manquants */}
          {sans > 0 && (
            <div style={{ fontSize: 12, color: '#4a3a2a', textAlign: 'center', paddingBottom: 8, fontStyle: 'italic' }}>
              La valeur réelle peut être supérieure —{' '}
              {sans} bouteille{sans > 1 ? 's' : ''} sans prix renseigné.
            </div>
          )}

          <button className="btnp" onClick={onClose} style={{ marginTop: 4 }}>Fermer</button>
        </div>
      </div>
    </>
  );
}
