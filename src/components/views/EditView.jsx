import BottleForm from '../ui/BottleForm';

/**
 * Vue d'édition d'une bouteille existante.
 */
export default function EditView({ editForm, setEditForm, efset, saveEdit, loading, goBack }) {
  if (!editForm) return null;

  return (
    <div className="panel">
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div className="phdr-title">Modifier la bouteille</div>
      </div>

      <div className="aform">
        <BottleForm
          values={editForm}
          onChange={efset}
          onColorChange={c => setEditForm(f => ({ ...f, couleur: c }))}
        />
      </div>

      <div className="stick-btn">
        <button
          className="btnp"
          onClick={saveEdit}
          disabled={!editForm.nom?.trim() || loading}
        >
          {loading ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </div>
    </div>
  );
}
