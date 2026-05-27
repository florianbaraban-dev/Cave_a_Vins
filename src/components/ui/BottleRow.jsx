import { wc, isReady } from '../../utils/helpers';
import { Ico } from '../icons';

/**
 * Une ligne de bouteille avec vignette, infos et actions (info + supprimer).
 * Utilisé dans ListView.
 */
export default function BottleRow({ b, onInfo, onDel }) {
  return (
    <div className="brow">
      <div className="bthumb">
        {b.image ? <img src={b.image} alt={b.nom} /> : '🍾'}
        <span className="bthumb-dot" style={{ background: wc(b.couleur) }} />
      </div>

      <div className="binfo" onClick={onInfo}>
        <span className="bname">{b.nom || '—'}</span>
        {isReady(b) && (
          <span className="ready-badge" title={`À boire dès ${b.boireDes}`}>
            {Ico.check}
            À boire
          </span>
        )}
        <span className="bprod">
          {b.producteur || ''}
          {b.producteur && b.annee
            ? <span className="bannee"> · {b.annee}</span>
            : b.annee
              ? <span className="bannee">{b.annee}</span>
              : null}
        </span>
      </div>

      <div className="bactions">
        <button className="abtn" onClick={onInfo} title="Informations">{Ico.info}</button>
        <button className="abtn del" onClick={onDel}  title="Retirer">{Ico.trash}</button>
      </div>
    </div>
  );
}
