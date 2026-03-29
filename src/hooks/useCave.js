import { useState, useMemo, useEffect, useRef } from 'react';
import { GAS_URL, GAS_CODE, MAX } from '../constants';
import { emptyForm } from '../utils/helpers';

/**
 * useCave — cœur de l'application.
 * Regroupe tout l'état (bottles, navigation, formulaires, thème)
 * et toute la logique métier (CRUD GAS, navigation, caves).
 *
 * Retourne un objet "state" étalé sur les vues via {...state}.
 */
export function useCave() {
  // ── Données ────────────────────────────────────────────────────
  const [bottles, setBottles]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [gasUrl, setGasUrl]     = useState(GAS_URL);
  const [gasInput, setGasInput] = useState(GAS_URL);

  // ── Navigation ─────────────────────────────────────────────────
  const [view, setView]         = useState('cave');
  const [navStack, setNavStack] = useState([]);
  const [slot, setSlot]         = useState(null);
  const [bottle, setBottle]     = useState(null);  // détail courant

  // ── Caves ──────────────────────────────────────────────────────
  const [cave, setCave]         = useState(1);
  const [caves, setCaves]       = useState([1]);

  // ── UI / overlays ──────────────────────────────────────────────
  const [sheet, setSheet]         = useState(false);
  const [showValeur, setShowValeur] = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [toast, setToast]         = useState(null);
  const [copied, setCopied]       = useState(false);
  const [theme, setTheme]         = useState(
    () => localStorage.getItem('cave_theme') || 'dark'
  );
  const toastRef = useRef(null);

  // ── Formulaires ────────────────────────────────────────────────
  const [form, setForm]           = useState(emptyForm());
  const [editRef, setEditRef]     = useState(null);
  const [editForm, setEditForm]   = useState(null);

  // ── Filtres (vue "Tous les vins") ──────────────────────────────
  const [search, setSearch]               = useState('');
  const [allFilter, setAllFilter]         = useState('');
  const [allColorFilter, setAllColorFilter] = useState('');
  const [allReadyFilter, setAllReadyFilter] = useState(false);

  // ══ INIT ════════════════════════════════════════════════════════
  useEffect(() => {
    const savedUrl   = localStorage.getItem('cave_gas') || GAS_URL;
    const savedCaves = localStorage.getItem('cave_list');
    setGasUrl(savedUrl);
    setGasInput(savedUrl);
    if (savedCaves) setCaves(JSON.parse(savedCaves));
    loadFromGas(savedUrl);
    // Applique la couleur de fond au body selon le thème sauvegardé
    const savedTheme = localStorage.getItem('cave_theme') || 'dark';
    document.body.style.background = savedTheme === 'light' ? '#f5f0e8' : '#181210';
  }, []);

  // ══ DÉRIVÉ ══════════════════════════════════════════════════════
  const offset = (cave - 1) * 8;
  const isDemo = !gasUrl;

  /** Données agrégées par case (1–8) pour la cave courante. */
  const slotData = useMemo(() => {
    const r = {};
    for (let i = 1; i <= 8; i++) {
      const sn = offset + i;
      const bs = bottles
        .filter(b => Number(b.rangement) === sn)
        .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr'));
      r[i] = { bottles: bs, count: bs.length, colors: [...new Set(bs.map(b => b.couleur))] };
    }
    return r;
  }, [bottles, offset]);

  /** Bouteilles de la case actuellement ouverte (ListView). */
  const slotBottles = useMemo(() => {
    if (!slot) return [];
    return bottles
      .filter(b => Number(b.rangement) === slot)
      .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr'));
  }, [bottles, slot]);

  /** Résultats de la recherche rapide. */
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return bottles
      .filter(b =>
        (b.nom || '').toLowerCase().includes(q) ||
        (b.producteur || '').toLowerCase().includes(q) ||
        (b.cepage || '').toLowerCase().includes(q)
      )
      .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr'));
  }, [bottles, search]);

  /** Statistiques globales (hors archivés). */
  const totalBottles = bottles.filter(b => b.rangement != null && b.rangement !== '' && Number(b.rangement) !== 0).length;

  /** Bouteilles archivées (rangement = '0'). */
  const archivedBottles = useMemo(() =>
    bottles
      .filter(b => Number(b.rangement) === 0)
      .sort((a, b) => (a.nom || '').localeCompare(b.nom || '', 'fr')),
    [bottles]
  );
  const rougeCount   = bottles.filter(b => b.couleur === 'Rouge').length;
  const blancCount   = bottles.filter(b => b.couleur === 'Blanc').length;

  const totalValeur = useMemo(() => {
    let sum = 0, count = 0;
    bottles.forEach(b => {
      if (!b.prixAchat) return;
      const clean = b.prixAchat.toString().replace(/[^0-9,\.]/g, '').replace(',', '.');
      const val   = parseFloat(clean);
      if (!isNaN(val) && val > 0) { sum += val; count++; }
    });
    return { sum, count };
  }, [bottles]);

  // ══ MÉTHODES ════════════════════════════════════════════════════

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2100);
  }

  /** Navigue vers une nouvelle vue en empilant la vue courante. */
  function navTo(v, params = {}) {
    setNavStack(s => [...s, view]);
    if (params.bottle !== undefined) setBottle(params.bottle);
    setView(v);
  }

  /** Revient à la vue précédente. */
  function goBack() {
    const prev = navStack[navStack.length - 1] || 'cave';
    setNavStack(s => s.slice(0, -1));
    setView(prev);
    setConfirm(null);
  }

  function openSlot(i) {
    setSlot(offset + i);
    setSheet(true);
  }

  function openList() {
    setSheet(false);
    navTo('list');
  }

  function openAdd() {
    setSheet(false);
    setForm(emptyForm(slot));
    navTo('add');
  }

  // ── API Google Apps Script ─────────────────────────────────────

  async function loadFromGas(url, silent = false) {
    if (!url) return;
    setLoading(true);
    try {
      const r    = await fetch(`${url}?action=get`);
      const data = await r.json();
      if (Array.isArray(data)) {
        setBottles(data);
        if (!silent) showToast('Données chargées ✓');
      }
    } catch {
      showToast('Connexion impossible');
    }
    setLoading(false);
  }

  async function addBottle() {
    if (!form.nom.trim()) return;
    setLoading(true);
    if (gasUrl) {
      try {
        const encoded = encodeURIComponent(JSON.stringify(form));
        await fetch(`${gasUrl}?action=add&data=${encoded}`);
        await loadFromGas(gasUrl, true);
        showToast('Bouteille ajoutée ✓');
        goBack();
      } catch { showToast('Erreur de connexion'); }
    } else {
      const nextRef = String(Math.max(0, ...bottles.map(b => Number(b.ref) || 0)) + 1);
      setBottles(prev => [...prev, { ...form, ref: nextRef }]);
      showToast('Bouteille ajoutée ✓');
      goBack();
    }
    setLoading(false);
  }

  async function archiveBottle(ref) {
    setConfirm(null);
    setLoading(true);
    const target = bottles.find(b => b.ref === ref);
    if (!target) { setLoading(false); return; }
    if (gasUrl) {
      try {
        await fetch(`${gasUrl}?action=remove&ref=${encodeURIComponent(ref)}`);
        const archived = encodeURIComponent(JSON.stringify({ ...target, rangement: '0' }));
        await fetch(`${gasUrl}?action=add&data=${archived}`);
        await loadFromGas(gasUrl, true);
        showToast('Bouteille archivée ✓');
      } catch { showToast('Erreur de connexion'); }
    } else {
      setBottles(prev => prev.map(b => b.ref === ref ? { ...b, rangement: '0' } : b));
      showToast('Bouteille archivée ✓');
    }
    setLoading(false);
  }

  async function restoreBottle(ref) {
    setLoading(true);
    const target = bottles.find(b => b.ref === ref);
    if (!target) { setLoading(false); return; }
    if (gasUrl) {
      try {
        await fetch(`${gasUrl}?action=remove&ref=${encodeURIComponent(ref)}`);
        const restored = encodeURIComponent(JSON.stringify({ ...target, rangement: '' }));
        await fetch(`${gasUrl}?action=add&data=${restored}`);
        await loadFromGas(gasUrl, true);
        showToast('Bouteille restaurée ✓');
      } catch { showToast('Erreur de connexion'); }
    } else {
      setBottles(prev => prev.map(b => b.ref === ref ? { ...b, rangement: '' } : b));
      showToast('Bouteille restaurée ✓');
    }
    setLoading(false);
  }

  function openEdit(b) {
    setEditRef(b.ref);
    setEditForm({ ...b });
    navTo('edit');
  }

  async function saveEdit() {
    if (!editForm || !editForm.nom.trim()) return;
    setLoading(true);
    if (gasUrl) {
      try {
        await fetch(`${gasUrl}?action=remove&ref=${encodeURIComponent(editRef)}`);
        const encoded = encodeURIComponent(JSON.stringify({ ...editForm, ref: editRef }));
        await fetch(`${gasUrl}?action=add&data=${encoded}`);
        await loadFromGas(gasUrl, true);
        showToast('Bouteille modifiée ✓');
        goBack();
      } catch { showToast('Erreur de connexion'); }
    } else {
      setBottles(prev => prev.map(b => b.ref === editRef ? { ...editForm, ref: editRef } : b));
      showToast('Bouteille modifiée ✓');
      goBack();
    }
    setLoading(false);
  }

  // ── Caves ──────────────────────────────────────────────────────

  function addCave() {
    const next = caves.length + 1;
    const newC = [...caves, next];
    setCaves(newC);
    localStorage.setItem('cave_list', JSON.stringify(newC));
    setCave(next);
  }

  function deleteCave(c) {
    const off    = (c - 1) * 8;
    const hasBtl = bottles.some(b => {
      const r = Number(b.rangement);
      return r >= off + 1 && r <= off + 8;
    });
    if (hasBtl) { showToast('Retirez d\'abord les bouteilles de cette cave'); return; }
    const newC = caves.filter(x => x !== c);
    setCaves(newC);
    localStorage.setItem('cave_list', JSON.stringify(newC));
    if (cave === c) setCave(newC[newC.length - 1] || 1);
    showToast('Cave supprimée');
  }

  // ── Paramètres ─────────────────────────────────────────────────

  function saveGas() {
    localStorage.setItem('cave_gas', gasInput);
    setGasUrl(gasInput);
    loadFromGas(gasInput);
  }

  function copyGas() {
    navigator.clipboard.writeText(GAS_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('cave_theme', next);
    document.body.style.background = next === 'light' ? '#f5f0e8' : '#181210';
  }

  // ── Helpers de formulaire ──────────────────────────────────────

  /** Retourne un handler onChange pour le champ `k` du formulaire d'ajout. */
  const fset  = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  /** Retourne un handler onChange pour le champ `k` du formulaire d'édition. */
  const efset = (k) => (e) => setEditForm(f => ({ ...f, [k]: e.target.value }));

  // ══ EXPORT ══════════════════════════════════════════════════════
  return {
    // données
    bottles, loading, gasUrl, gasInput, setGasInput, isDemo,
    // navigation
    view, navStack, navTo, goBack,
    slot, setSlot, bottle,
    // caves
    cave, setCave, caves, offset, slotData, slotBottles,
    // UI
    sheet, setSheet, showValeur, setShowValeur,
    confirm, setConfirm, toast, copied, theme,
    // formulaires
    form, setForm, editRef, editForm, setEditForm,
    // filtres
    search, setSearch, searchResults,
    allFilter, setAllFilter,
    allColorFilter, setAllColorFilter,
    allReadyFilter, setAllReadyFilter,
    // stats
    totalBottles, rougeCount, blancCount, totalValeur,
    archivedBottles,
    // actions
    loadFromGas, addBottle, archiveBottle, restoreBottle, openEdit, saveEdit,
    addCave, deleteCave, saveGas, copyGas, toggleTheme,
    openSlot, openList, openAdd,
    fset, efset,
    MAX,
  };
}
