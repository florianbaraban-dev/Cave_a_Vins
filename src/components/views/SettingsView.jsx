import { Ico } from '../icons';
import { GAS_CODE } from '../../constants';

/**
 * Vue Paramètres : connexion Google Sheets, copie du script GAS,
 * et état de synchronisation.
 */
export default function SettingsView({
  goBack,
  gasUrl, gasInput, setGasInput,
  saveGas, loadFromGas,
  bottles, loading, isDemo,
  copied, copyGas,
}) {
  return (
    <div className="panel">
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div className="phdr-title">Paramètres</div>
      </div>

      <div className="sett">
        {/* ── Intro ── */}
        <div className="sett-h">Connexion Google Sheets</div>
        <div className="sett-d">
          {gasUrl
            ? '✓ Connecté à votre Google Sheet.'
            : "Suivez les étapes ci-dessous pour synchroniser l'application avec votre fichier Google Sheets."}
        </div>

        {/* ── Étape 1 ── */}
        <div className="sett-h" style={{ marginTop: 20, marginBottom: 12 }}>
          Étape 1 — Déployez le script
        </div>
        <ol className="sett-steps">
          <li>Ouvrez votre Google Sheet → menu <em>Extensions</em> → <em>Apps Script</em></li>
          <li>Supprimez le code existant et collez le code ci-dessous</li>
          <li>Cliquez <em>Déployer</em> → <em>Nouveau déploiement</em></li>
          <li>Type : <em>Application Web</em> — Accès : <em>Tout le monde</em></li>
          <li>Autorisez et copiez l'URL générée</li>
        </ol>

        {/* ── Code GAS ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }}>
          <span className="sett-h" style={{ margin: 0 }}>Code Google Apps Script</span>
          <button
            className="ibtn"
            style={{ fontSize: 12, gap: 5, display: 'flex', alignItems: 'center', color: copied ? '#c4a35a' : '#7a6050' }}
            onClick={copyGas}
          >
            {Ico.copy} {copied ? 'Copié !' : 'Copier'}
          </button>
        </div>
        <div className="sett-code">{GAS_CODE}</div>

        {/* ── Étape 2 ── */}
        <div className="sett-h" style={{ marginTop: 20 }}>Étape 2 — Collez l'URL ici</div>
        <input
          className="finput"
          value={gasInput}
          onChange={e => setGasInput(e.target.value)}
          placeholder="https://script.google.com/macros/s/…"
          style={{ marginBottom: 12 }}
        />
        <button className="btnp" onClick={saveGas}>
          {loading ? 'Connexion…' : 'Enregistrer et synchroniser'}
        </button>

        <hr className="hr" />

        {/* ── État ── */}
        <div className="sett-h">État</div>
        <div className="sett-d">
          {isDemo
            ? 'Mode démo — les données ne sont pas synchronisées avec Google Sheets.'
            : `Connecté. ${bottles.length} bouteille${bottles.length > 1 ? 's' : ''} chargée${bottles.length > 1 ? 's' : ''}.`}
        </div>
        {gasUrl && (
          <button
            className="bghst"
            style={{ marginTop: 8, width: '100%' }}
            onClick={() => loadFromGas(gasUrl)}
          >
            Synchroniser maintenant
          </button>
        )}
      </div>
    </div>
  );
}
