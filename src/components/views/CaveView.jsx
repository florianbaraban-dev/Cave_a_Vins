import { Ico } from '../icons';
import SearchList from '../ui/SearchList';
import { wc } from '../../utils/helpers';

/**
 * Vue principale : grille des cases de la cave sélectionnée,
 * barre de stats, recherche rapide et onglets de caves.
 */
export default function CaveView({
  bottles, cave, caves, offset, slotData, MAX,
  totalBottles, rougeCount, blancCount,
  search, setSearch, searchResults,
  theme, toggleTheme,
  navTo, openSlot, addCave, deleteCave, setCave, setShowValeur,
}) {
  return (
    <>
      {/* ── Header ── */}
      <div className="hdr">
        <div>
          <div className="hdr-title">Ma Cave</div>
          <div className="hdr-sub">
            {totalBottles} bouteille{totalBottles !== 1 ? 's' : ''} rangée{totalBottles !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="hdr-right">
          <button className="ibtn" onClick={() => setShowValeur(true)} title="Valeur de la cave">
            {Ico.euro}
          </button>
          <button className="ibtn" onClick={toggleTheme} title="Changer le thème">
            {theme === 'dark' ? Ico.sun : Ico.moon}
          </button>
          <button className="ibtn" onClick={() => navTo('allwines')} title="Tous les vins">
            {Ico.list}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats">
        <div className="stat">
          <div className="stat-n" style={{ color: '#9b2030' }}>{rougeCount}</div>
          <div className="stat-l">Rouge</div>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <div className="stat-n" style={{ color: '#c4a245' }}>{blancCount}</div>
          <div className="stat-l">Blanc</div>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <div className="stat-n" style={{ color: '#c97080' }}>
            {bottles.filter(b => b.couleur === 'Rosé' || b.couleur === 'Rose').length}
          </div>
          <div className="stat-l">Rosé</div>
        </div>
        <div className="stat-div" />
        <div className="stat">
          <div className="stat-n">{bottles.length}</div>
          <div className="stat-l">Total</div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="sbar">
        <div className="sbar-inner">
          {Ico.search}
          <input
            className="sbar-input"
            placeholder="Producteur, cépage, nom..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              style={{ background: 'none', border: 'none', color: '#5a4a3a', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
              onClick={() => setSearch('')}
            >×</button>
          )}
        </div>
      </div>

      {/* ── Résultats inline ou grille ── */}
      {search.length >= 2 ? (
        <SearchList results={searchResults} onSelect={b => navTo('detail', { bottle: b })} />
      ) : (
        <>
          {/* Onglets caves */}
          <div className="cave-tabs">
            {caves.map(c => (
              <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <CaveTab c={c} active={cave === c} onClick={() => setCave(c)} />
                {cave === c && caves.length > 1 && (
                  <button
                    onClick={() => deleteCave(c)}
                    title="Supprimer cette cave"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#7a2030', fontSize: 16, lineHeight: 1,
                      padding: '2px 4px', marginLeft: -4,
                      borderRadius: '0 20px 20px 0', opacity: 0.7,
                    }}
                  >×</button>
                )}
              </span>
            ))}
            {caves.length < 4 && (
              <button className="ctab add" onClick={addCave}>+ Cave</button>
            )}
          </div>

          {/* Grille des cases */}
          <div className="cave-wrap">
            <div className="cave-frame">
              <div className="cave-top">
                <span className="cave-top-label">
                  Cave {cave} · Cases {offset + 1}–{offset + 8}
                </span>
                <span className="cave-top-count">
                  {Object.values(slotData).reduce((s, d) => s + d.count, 0)} / {8 * MAX}
                </span>
              </div>

              {[8, 7, 6, 5, 4, 3, 2, 1].map(i => {
                const d         = slotData[i];
                const pct       = Math.min(100, (d.count / MAX) * 100);
                const mainColor = d.colors[0] ? wc(d.colors[0]) : '#ffffff';
                return (
                  <div key={i} className="slot" onClick={() => openSlot(i)}>
                    <div className="slot-fill" style={{ width: `${pct}%`, background: mainColor }} />
                    <div className="slot-num">{offset + i}</div>
                    <div className="slot-body">
                      {d.count > 0 ? (
                        <>
                          <div className="slot-dots">
                            {d.colors.map(c => (
                              <div key={c} className="dot" style={{ background: wc(c) }} />
                            ))}
                          </div>
                          <div className={`slot-count ${d.count >= MAX ? 'full' : ''}`}>
                            {d.count} / {MAX} bouteille{d.count > 1 ? 's' : ''}
                          </div>
                          <div className="slot-names">
                            {d.bottles.slice(0, 2).map(b => b.nom).join(' · ')}
                            {d.bottles.length > 2 ? ' …' : ''}
                          </div>
                        </>
                      ) : (
                        <div className="slot-empty">Case vide</div>
                      )}
                    </div>
                    <div className="slot-arrow">›</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

/** Onglet de sélection de cave — gère le clic via le parent pour éviter le prop drilling. */
function CaveTab({ c, active, onClick }) {
  return (
    <button className={`ctab ${active ? 'on' : ''}`} onClick={onClick}>
      Cave {c}
    </button>
  );
}
