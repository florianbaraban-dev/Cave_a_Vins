import { useCave } from './hooks/useCave';

// ── Vues ──────────────────────────────────────────────────────────
import CaveView     from './components/views/CaveView';
import ListView     from './components/views/ListView';
import DetailView   from './components/views/DetailView';
import AddView      from './components/views/AddView';
import EditView     from './components/views/EditView';
import SearchView   from './components/views/SearchView';
import AllWinesView from './components/views/AllWinesView';
import SettingsView from './components/views/SettingsView';
import HistoryView  from './components/views/HistoryView';

// ── UI overlay ────────────────────────────────────────────────────
import BottomSheet from './components/ui/BottomSheet';
import ValeurModal from './components/ui/ValeurModal';

/**
 * App — assemble les vues et les overlays.
 * Tout l'état et la logique métier viennent de useCave().
 */
export default function App() {
  const s = useCave();

  return (
    <div className={`app ${s.theme}`}>

      {/* ══ VUES ══════════════════════════════════════════════════ */}

      {s.view === 'cave' && (
        <CaveView
          bottles={s.bottles}
          cave={s.cave}
          caves={s.caves}
          offset={s.offset}
          slotData={s.slotData}
          MAX={s.MAX}
          totalBottles={s.totalBottles}
          rougeCount={s.rougeCount}
          blancCount={s.blancCount}
          search={s.search}
          setSearch={s.setSearch}
          searchResults={s.searchResults}
          theme={s.theme}
          toggleTheme={s.toggleTheme}
          navTo={s.navTo}
          openSlot={s.openSlot}
          addCave={s.addCave}
          deleteCave={s.deleteCave}
          setCave={s.setCave}
          setShowValeur={s.setShowValeur}
        />
      )}

      {s.view === 'list' && (
        <ListView
          slot={s.slot}
          slotBottles={s.slotBottles}
          MAX={s.MAX}
          confirm={s.confirm}
          setConfirm={s.setConfirm}
          goBack={s.goBack}
          navTo={s.navTo}
          openAdd={s.openAdd}
          removeBottle={s.archiveBottle}
        />
      )}

      {s.view === 'detail' && (
        <DetailView bottle={s.bottle} goBack={s.goBack} />
      )}

      {s.view === 'add' && (
        <AddView
          form={s.form}
          setForm={s.setForm}
          fset={s.fset}
          addBottle={s.addBottle}
          loading={s.loading}
          goBack={s.goBack}
        />
      )}

      {s.view === 'edit' && (
        <EditView
          editForm={s.editForm}
          setEditForm={s.setEditForm}
          efset={s.efset}
          saveEdit={s.saveEdit}
          loading={s.loading}
          goBack={s.goBack}
        />
      )}

      {s.view === 'search' && (
        <SearchView
          search={s.search}
          setSearch={s.setSearch}
          searchResults={s.searchResults}
          navTo={s.navTo}
          goBack={s.goBack}
        />
      )}

      {s.view === 'allwines' && (
        <AllWinesView
          bottles={s.bottles}
          goBack={s.goBack}
          navTo={s.navTo}
          openEdit={s.openEdit}
          confirm={s.confirm}
          setConfirm={s.setConfirm}
          removeBottle={s.archiveBottle}
          allFilter={s.allFilter}
          setAllFilter={s.setAllFilter}
          allColorFilter={s.allColorFilter}
          setAllColorFilter={s.setAllColorFilter}
          allReadyFilter={s.allReadyFilter}
          setAllReadyFilter={s.setAllReadyFilter}
        />
      )}

      {s.view === 'history' && (
        <HistoryView
          archivedBottles={s.archivedBottles}
          goBack={s.goBack}
          navTo={s.navTo}
          restoreBottle={s.restoreBottle}
          loading={s.loading}
        />
      )}

      {s.view === 'settings' && (
        <SettingsView
          goBack={s.goBack}
          gasUrl={s.gasUrl}
          gasInput={s.gasInput}
          setGasInput={s.setGasInput}
          saveGas={s.saveGas}
          loadFromGas={s.loadFromGas}
          bottles={s.bottles}
          loading={s.loading}
          isDemo={s.isDemo}
          copied={s.copied}
          copyGas={s.copyGas}
        />
      )}

      {/* ══ OVERLAYS ══════════════════════════════════════════════ */}

      {s.sheet && (
        <BottomSheet
          slot={s.slot}
          slotData={s.slotData}
          MAX={s.MAX}
          onClose={() => s.setSheet(false)}
          onList={s.openList}
          onAdd={s.openAdd}
        />
      )}

      {s.showValeur && (
        <ValeurModal
          totalValeur={s.totalValeur}
          bottles={s.bottles}
          onClose={() => s.setShowValeur(false)}
        />
      )}

      {s.toast && (
        <div className="toast" key={s.toast + Date.now()}>{s.toast}</div>
      )}

    </div>
  );
}
