import SearchList from '../ui/SearchList';

/**
 * Vue de recherche plein écran.
 */
export default function SearchView({ search, setSearch, searchResults, navTo, goBack }) {
  return (
    <div className="panel">
      <div className="phdr">
        <button className="back" onClick={goBack}>‹</button>
        <div style={{ flex: 1, paddingRight: 4 }}>
          <input
            className="finput"
            autoFocus
            style={{ padding: '9px 13px' }}
            placeholder="Producteur, cépage, nom…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <SearchList
        results={searchResults}
        onSelect={b => navTo('detail', { bottle: b })}
      />
    </div>
  );
}
