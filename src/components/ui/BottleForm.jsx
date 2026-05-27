import { wc } from '../../utils/helpers';

/**
 * Champs de formulaire partagés entre AddView et EditView.
 * `values`  → objet form ou editForm
 * `onChange` → handler générique (k) => (e) => ...
 * `onColorChange` → (couleur: string) => void
 */
export default function BottleForm({ values, onChange, onColorChange }) {
  // Normalise 'Rose' (retour GAS sans accent) → 'Rosé' pour le sélecteur
  const couleurAffichee = values.couleur === 'Rose' ? 'Rosé' : (values.couleur || 'Rouge');
  return (
    <>
      <div>
        <label className="flabel">Nom *</label>
        <input className="finput" value={values.nom || ''} onChange={onChange('nom')} placeholder="Ex : Château Pétrus" />
      </div>

      <div>
        <label className="flabel">Producteur</label>
        <input className="finput" value={values.producteur || ''} onChange={onChange('producteur')} placeholder="Ex : Domaine Mayard" />
      </div>

      <div>
        <label className="flabel">Couleur</label>
        <div className="cpicker">
          {['Rouge', 'Blanc', 'Rosé'].map(c => (
            <button
              key={c}
              className="copt"
              style={couleurAffichee === c ? {
                borderColor: wc(c) + 'cc',
                color: wc(c),
                background: wc(c) + '18',
              } : {}}
              onClick={() => onColorChange(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="frow">
        <div>
          <label className="flabel">Millésime</label>
          <input className="finput" type="number" value={values.annee || ''} onChange={onChange('annee')} placeholder="2022" min="1900" max="2030" />
        </div>
        <div>
          <label className="flabel">Case</label>
          <input className="finput" type="number" value={values.rangement || ''} onChange={onChange('rangement')} min="1" />
        </div>
      </div>

      <div>
        <label className="flabel">Région</label>
        <input className="finput" value={values.region || ''} onChange={onChange('region')} placeholder="Ex : Rhône" />
      </div>

      <div>
        <label className="flabel">Appellation</label>
        <input className="finput" value={values.appellation || ''} onChange={onChange('appellation')} placeholder="Ex : Châteauneuf-du-Pape" />
      </div>

      <div>
        <label className="flabel">Sous-région</label>
        <input className="finput" value={values.sousRegion || ''} onChange={onChange('sousRegion')} placeholder="Ex : Vaucluse" />
      </div>

      <div>
        <label className="flabel">Cépage</label>
        <input className="finput" value={values.cepage || ''} onChange={onChange('cepage')} placeholder="Ex : Grenache, Syrah" />
      </div>

      <div className="frow">
        <div>
          <label className="flabel">Date d'achat</label>
          <input className="finput" type="date" value={values.dateAchat || ''} onChange={onChange('dateAchat')} />
        </div>
        <div>
          <label className="flabel">Prix</label>
          <input className="finput" value={values.prixAchat || ''} onChange={onChange('prixAchat')} placeholder="Ex : 35,00 €" />
        </div>
      </div>

      <div>
        <label className="flabel">Lieu d'achat</label>
        <input className="finput" value={values.lieuAchat || ''} onChange={onChange('lieuAchat')} placeholder="Ex : Mr Vin" />
      </div>

      <div className="frow">
        <div>
          <label className="flabel">Boire dès</label>
          <input className="finput" type="date" value={values.boireDes || ''} onChange={onChange('boireDes')} />
        </div>
        <div>
          <label className="flabel">Boire jusque</label>
          <input className="finput" type="date" value={values.boireJusque || ''} onChange={onChange('boireJusque')} />
        </div>
      </div>

      <div>
        <label className="flabel">Image (URL)</label>
        <input className="finput" value={values.image || ''} onChange={onChange('image')} placeholder="https://..." />
      </div>

      <div>
        <label className="flabel">Emplacement précis</label>
        <input className="finput" value={values.emplacement || ''} onChange={onChange('emplacement')} placeholder="Position dans la case (optionnel)" />
      </div>
    </>
  );
}
