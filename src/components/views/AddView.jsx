import BottleForm from '../ui/BottleForm';

/**
 * Vue d'ajout d'une nouvelle bouteille.
 */
export default function AddView({ form, setForm, fset, addBottle, loading, goBack }) {
  return (
    <div className="panel">
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div className="phdr-title">Ajouter une bouteille</div>
      </div>

      <div className="aform">
        <BottleForm
          values={form}
          onChange={fset}
          onColorChange={c => setForm(f => ({ ...f, couleur: c }))}
        />
      </div>

      <div className="stick-btn">
        <button
          className="btnp"
          onClick={addBottle}
          disabled={!form.nom?.trim() || loading}
        >
          {loading ? 'Enregistrement…' : 'Ajouter la bouteille'}
        </button>
      </div>
    </div>
  );
}
