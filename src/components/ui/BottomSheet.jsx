import { Ico } from '../icons';

/**
 * Bottom sheet affiché au tap sur une case de la cave.
 * Propose : voir les bouteilles / ajouter une bouteille.
 */
export default function BottomSheet({ slot, slotData, MAX, onClose, onList, onAdd }) {
  const localIdx = ((slot - 1) % 8) + 1;
  const count    = slotData[localIdx]?.count || 0;
  const free     = MAX - count;

  return (
    <>
      <div className="bkdrop" onClick={onClose} />
      <div className="bsheet">
        <div className="bsh-handle" />
        <div className="bsh-title">
          Case {slot} · {count} / {MAX} bouteilles
        </div>

        <button className="bsh-btn" onClick={onList}>
          <div className="bsh-icon">{Ico.list}</div>
          <div>
            <div>Voir les bouteilles</div>
            <div className="bsh-sub">
              {count} bouteille{count !== 1 ? 's' : ''} dans cette case
            </div>
          </div>
        </button>

        {count < MAX && (
          <button className="bsh-btn" onClick={onAdd}>
            <div className="bsh-icon">{Ico.plus}</div>
            <div>
              <div>Ajouter une bouteille</div>
              <div className="bsh-sub">
                {free} emplacement{free > 1 ? 's' : ''} libre{free > 1 ? 's' : ''}
              </div>
            </div>
          </button>
        )}
      </div>
    </>
  );
}
