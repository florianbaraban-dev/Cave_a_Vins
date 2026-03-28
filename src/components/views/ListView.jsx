import { Ico } from '../icons';
import BottleRow from '../ui/BottleRow';
import ConfirmDialog from '../ui/ConfirmDialog';

/**
 * Vue liste des bouteilles d'une case.
 * Affiche une confirmation inline avant suppression.
 */
export default function ListView({
  slot, slotBottles, MAX,
  confirm, setConfirm,
  goBack, navTo, openAdd, removeBottle,
}) {
  return (
    <div className="panel">
      {/* Header */}
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div style={{ flex: 1 }}>
          <div className="phdr-title">Case {slot}</div>
          <div className="phdr-sub">
            {slotBottles.length} / {MAX} bouteille{slotBottles.length !== 1 ? 's' : ''}
          </div>
        </div>
        {slotBottles.length < MAX && (
          <button className="ibtn" onClick={openAdd}>
            {Ico.plus}
          </button>
        )}
      </div>

      {/* Confirm inline ou liste */}
      {confirm ? (
        <ConfirmDialog
          bottle={confirm}
          onCancel={() => setConfirm(null)}
          onConfirm={removeBottle}
        />
      ) : slotBottles.length === 0 ? (
        <div className="no-bottles">Aucune bouteille dans cette case</div>
      ) : (
        slotBottles.map(b => (
          <BottleRow
            key={b.ref}
            b={b}
            onInfo={() => navTo('detail', { bottle: b })}
            onDel={() => setConfirm(b)}
          />
        ))
      )}
    </div>
  );
}
