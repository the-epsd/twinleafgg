import {
  DndContext,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Card } from 'ptcg-server';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { ApiError } from '../api/apiError';
import { deleteDeck, getDeck, saveDeck } from '../api/deckApi';
import { useDeckCardScanUrl } from '../context/CardImagesContext';
import { DeckBuildPane } from './DeckBuildPane';
import { DeckEditInfoValidity } from './DeckEditInfoValidity';
import { DeckEditToolbar } from './DeckEditToolbar';
import { DeckLibraryPane } from './DeckLibraryPane';
import { CardInfoPopup } from '../card-info/CardInfoPopup';
import {
  addCardToDeck,
  canAddOne,
  flatNamesFromSlots,
  removeOneCopy,
  reorderSlots,
  replaceSlotCard,
  slotsFromFlatNames,
} from './deckRules';
import { sortLibraryCatalog } from './filterLibrary';
import { useIncrementalFilteredLibrary } from './useIncrementalFilteredLibrary';
import { DECK_DEFAULT_SLOT_W } from './deckCardLayout';
import { defaultToolbarFilter, type DeckEditToolbarFilter, type DeckSlot } from './types';
import styles from './DeckEditView.module.css';

const LS_DEFAULT_DECK_ID = 'defaultDeckId';
const LS_FORMAT_DEFAULTS = 'formatDefaultDecks';

function clearStoredDeckDefaults(deletedId: number): void {
  const def = localStorage.getItem(LS_DEFAULT_DECK_ID);
  if (def !== null && parseInt(def, 10) === deletedId) {
    localStorage.removeItem(LS_DEFAULT_DECK_ID);
  }
  try {
    const raw = localStorage.getItem(LS_FORMAT_DEFAULTS);
    if (!raw) {
      return;
    }
    const o = JSON.parse(raw) as Record<string, number>;
    const next = { ...o };
    let changed = false;
    for (const k of Object.keys(next)) {
      if (next[k] === deletedId) {
        delete next[k];
        changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(LS_FORMAT_DEFAULTS, JSON.stringify(next));
    }
  } catch {
    /* ignore */
  }
}

function useNarrowLayout(breakpointPx: number): boolean {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(max-width: ${breakpointPx}px)`).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpointPx}px)`);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [breakpointPx]);

  return narrow;
}

function resolveImportLine(line: string, byFullName: Map<string, Card>): string | null {
  const t = line.trim();
  if (!t) {
    return null;
  }
  if (byFullName.has(t)) {
    return t;
  }
  const lower = t.toLowerCase();
  for (const c of byFullName.values()) {
    if (c.name.toLowerCase() === lower) {
      return c.fullName;
    }
  }
  return null;
}

function linesToResolvedFullNames(
  lines: string[],
  byFullName: Map<string, Card>,
): { names: string[]; unknown: string[] } {
  const names: string[] = [];
  const unknown: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    const m = trimmed.match(/^(\d+)\s+(.+)$/);
    const probe = m ? m[2]!.trim() : trimmed;
    const resolved = resolveImportLine(probe, byFullName);
    if (resolved) {
      const n = m ? Math.min(1000, Math.max(1, parseInt(m[1]!, 10))) : 1;
      for (let i = 0; i < n; i++) {
        names.push(resolved);
      }
    } else {
      unknown.push(trimmed);
    }
  }
  return { names, unknown };
}

export type DeckEditViewProps = {
  deckId: number;
};

export function DeckEditView({ deckId }: DeckEditViewProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const clipboardFromNavConsumed = useRef(false);
  const { cardsInfo, serverConfig, user } = useAuth();
  const { hiddenFormats } = useSettings();
  const isNarrow = useNarrowLayout(899);
  const [mobileTab, setMobileTab] = useState<'library' | 'deck'>('deck');
  const [libraryHidden, setLibraryHidden] = useState(false);

  const [deckName, setDeckName] = useState('');
  const [slots, setSlots] = useState<DeckSlot[]>([]);
  const [deckLinesFromServer, setDeckLinesFromServer] = useState<string[] | null>(null);
  const [importUnknown, setImportUnknown] = useState<string[]>([]);
  const [filter, setFilter] = useState<DeckEditToolbarFilter>(() => defaultToolbarFilter());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);
  const [cardInfoCard, setCardInfoCard] = useState<Card | null>(null);
  const [deckCardSlotW, setDeckCardSlotW] = useState(DECK_DEFAULT_SLOT_W);

  const isThemeDeck = deckId < 0;
  const disabled = isThemeDeck || loading;
  const isAdmin = user?.roleId === 4;

  const allCards = useMemo(
    () => sortLibraryCatalog(cardsInfo?.cards ?? []),
    [cardsInfo?.cards],
  );
  const byFullName = useMemo(() => {
    const m = new Map<string, Card>();
    for (const c of allCards) {
      m.set(c.fullName, c);
    }
    return m;
  }, [allCards]);

  const cardsCatalogHash = cardsInfo?.hash ?? '';

  const {
    cards: filteredLibrary,
    done: libraryScanComplete,
    requestScrollBoost,
  } = useIncrementalFilteredLibrary(allCards, filter);

  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);

  useEffect(() => {
    if (!Number.isFinite(deckId)) {
      setLoading(false);
      setError(t('REACT_INVALID_DECK'));
      return;
    }
    setDeckLinesFromServer(null);
    setSlots([]);
    setImportUnknown([]);
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getDeck(deckId);
        setDeckName(res.deck.name);
        const lines = (res.deck.cards ?? []).filter(Boolean);
        setDeckLinesFromServer(lines);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : t('REACT_ERROR_LOAD_SINGLE_DECK'));
        setDeckLinesFromServer(null);
        setSlots([]);
        setImportUnknown([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [deckId, t]);

  useEffect(() => {
    if (deckLinesFromServer === null) {
      return;
    }
    if (!cardsCatalogHash || byFullName.size === 0) {
      return;
    }
    const { slots: next, unknown } = slotsFromFlatNames(deckLinesFromServer, byFullName);
    setSlots(next);
    setImportUnknown(unknown);
  }, [deckLinesFromServer, cardsCatalogHash, byFullName]);

  useEffect(() => {
    clipboardFromNavConsumed.current = false;
  }, [deckId]);

  useEffect(() => {
    const raw = (location.state as { importFromClipboard?: string } | null)?.importFromClipboard;
    if (raw == null || typeof raw !== 'string') {
      return;
    }
    if (loading || disabled) {
      return;
    }
    if (!cardsCatalogHash || byFullName.size === 0) {
      return;
    }
    if (clipboardFromNavConsumed.current) {
      return;
    }
    clipboardFromNavConsumed.current = true;
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const { names, unknown } = linesToResolvedFullNames(lines, byFullName);
    const { slots: next, unknown: u2 } = slotsFromFlatNames(names, byFullName);
    setSlots(next);
    setImportUnknown([...unknown, ...u2]);
    setRuleMessage(
      unknown.length ? t('DECK_IMPORT_SKIP_UNKNOWN', { count: unknown.length }) : t('DECK_IMPORT_APPLIED_CLIPBOARD'),
    );
    window.setTimeout(() => setRuleMessage(null), 3200);
    navigate(location.pathname, { replace: true, state: {} });
  }, [
    location.pathname,
    location.state,
    loading,
    disabled,
    cardsCatalogHash,
    byFullName,
    navigate,
    t,
  ]);

  useEffect(() => {
    setFilter((f) => {
      const nextFormats = f.formats.filter((fmt) => !hiddenFormats.includes(fmt));
      if (nextFormats.length === f.formats.length) {
        return f;
      }
      return { ...f, formats: nextFormats };
    });
  }, [hiddenFormats]);

  const deckCount = useMemo(() => slots.reduce((s, x) => s + x.count, 0), [slots]);

  const inDeckCounts = useMemo(() => new Map(slots.map((s) => [s.card.fullName, s.count])), [slots]);

  const canAddCard = useCallback((card: Card) => canAddOne(slots, card).ok, [slots]);

  const tryAdd = useCallback(
    (card: Card) => {
      const res = addCardToDeck(slots, card);
      if (!res.ok) {
        setRuleMessage(res.reason);
        window.setTimeout(() => setRuleMessage(null), 3200);
        return;
      }
      setRuleMessage(null);
      setSlots(res.slots);
    },
    [slots],
  );

  const tryAddByFullName = useCallback(
    (fullName: string) => {
      const card = byFullName.get(fullName);
      if (card) {
        tryAdd(card);
      }
    },
    [byFullName, tryAdd],
  );

  const onSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await saveDeck(deckId, deckName.trim(), flatNamesFromSlots(slots));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_SAVE_DECK'));
    } finally {
      setSaving(false);
    }
  }, [deckId, deckName, slots, t]);

  const onDeleteDeck = useCallback(async () => {
    if (!window.confirm(t('DECK_DELETE_SELECTED'))) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await deleteDeck(deckId);
      clearStoredDeckDefaults(deckId);
      navigate('/deck');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_DELETE_DECK'));
    } finally {
      setDeleting(false);
    }
  }, [deckId, navigate, t]);

  const onExport = useCallback(() => {
    const text = flatNamesFromSlots(slots).join('\n');
    void navigator.clipboard.writeText(text);
    setRuleMessage(t('DECK_EXPORTED_TO_CLIPBOARD'));
    window.setTimeout(() => setRuleMessage(null), 2400);
  }, [slots, t]);

  const onImport = useCallback(() => {
    void navigator.clipboard.readText().then((text) => {
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const { names, unknown } = linesToResolvedFullNames(lines, byFullName);
      const { slots: next, unknown: u2 } = slotsFromFlatNames(names, byFullName);
      setSlots(next);
      setImportUnknown([...unknown, ...u2]);
      setRuleMessage(
        unknown.length
          ? t('DECK_IMPORT_SKIP_UNKNOWN', { count: unknown.length })
          : t('DECK_IMPORT_APPLIED_CLIPBOARD'),
      );
      window.setTimeout(() => setRuleMessage(null), 3200);
    });
  }, [byFullName, t]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const deckIds = useMemo(() => slots.map((s) => s.card.fullName), [slots]);

  const onDragEnd = useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      if (!over) {
        return;
      }
      const a = active.data.current as { source?: string; card?: Card } | undefined;
      if (a?.source === 'deck') {
        const aid = String(active.id);
        const oid = String(over.id);
        if (aid === oid) {
          return;
        }
        if (deckIds.includes(aid) && deckIds.includes(oid)) {
          setSlots((prev) => reorderSlots(prev, aid, oid));
        }
      }
    },
    [deckIds],
  );

  if (!Number.isFinite(deckId)) {
    return <p>Invalid deck</p>;
  }

  if (loading) {
    return <p style={{ padding: 20 }}>Loading deck…</p>;
  }

  const libraryPane = (
    <DeckLibraryPane
      cardSlotW={deckCardSlotW}
      cards={filteredLibrary}
      scanComplete={libraryScanComplete}
      onNearCatalogEnd={requestScrollBoost}
      getScanUrl={getScanUrl}
      showTypeBadge={isAdmin && filter.showLibraryCardTypeBadge}
      disabled={disabled}
      onAddCard={tryAdd}
      onRemoveOneFromDeck={(fullName) => setSlots((prev) => removeOneCopy(prev, fullName))}
      inDeckCounts={inDeckCounts}
      canAddCard={canAddCard}
      onOpenCardInfo={(c) => setCardInfoCard(c)}
    />
  );

  const deckPane = (
    <DeckBuildPane
      slots={slots}
      getScanUrl={getScanUrl}
      disabled={disabled}
      deckCount={deckCount}
      ruleMessage={ruleMessage}
      showLibraryToggle={!isNarrow}
      libraryHidden={libraryHidden}
      onToggleLibrary={() => setLibraryHidden((v) => !v)}
      onAddCopy={tryAddByFullName}
      onRemoveCopy={(fullName) => setSlots((prev) => removeOneCopy(prev, fullName))}
      onOpenCardInfo={(c) => setCardInfoCard(c)}
      onSlotWidthChange={setDeckCardSlotW}
    />
  );

  return (
    <div className={styles.noSelectWrap}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <div className={styles.shell}>
          <DeckEditToolbar
            deckName={deckName}
            filter={filter}
            onFilterChange={setFilter}
            allCards={allCards}
            disabled={disabled}
            isAdmin={isAdmin}
            saving={saving}
            onSave={() => void onSave()}
            onExport={onExport}
            onImport={onImport}
            onDelete={isThemeDeck ? undefined : () => void onDeleteDeck()}
            deleting={deleting}
          />
          {isThemeDeck && (
            <div className={styles.warnBanner}>{t('DECK_EDIT_THEME_READONLY')}</div>
          )}
          {error && <div className={styles.errorBanner}>{error}</div>}
          {!error &&
            !loading &&
            deckLinesFromServer !== null &&
            (!cardsCatalogHash || byFullName.size === 0) && (
              <div className={styles.warnBanner}>{t('DECK_EDIT_WAITING_CATALOG')}</div>
            )}
          {importUnknown.length > 0 && (
            <div className={styles.warnBanner}>
              {t('DECK_EDIT_UNKNOWN_ENTRIES', {
                count: importUnknown.length,
                preview: `${importUnknown.slice(0, 8).join('; ')}${importUnknown.length > 8 ? '…' : ''}`,
              })}
            </div>
          )}
          <div className={styles.panes}>
            {isNarrow && (
              <div className={styles.mobileTabs}>
                <button
                  type="button"
                  className={`${styles.tab} ${mobileTab === 'library' ? styles.tabActive : ''}`}
                  onClick={() => setMobileTab('library')}
                >
                  {t('LIBRARY_TITLE')}
                </button>
                <button
                  type="button"
                  className={`${styles.tab} ${mobileTab === 'deck' ? styles.tabActive : ''}`}
                  onClick={() => setMobileTab('deck')}
                >
                  {t('DECK_EDIT_TAB_DECK')}
                </button>
              </div>
            )}
            <div
              className={`${styles.libraryCol} ${libraryHidden && !isNarrow ? styles.libraryColHidden : ''} ${isNarrow && mobileTab !== 'library' ? styles.paneMobileInactive : ''
                }`}
            >
              {libraryPane}
            </div>
            <div
              className={`${styles.deckCol} ${isNarrow && mobileTab !== 'deck' ? styles.paneMobileInactive : ''
                }`}
            >
              {deckPane}
            </div>
          </div>
          <DeckEditInfoValidity slots={slots} allCards={allCards} />
        </div>
        {cardInfoCard && (
          <CardInfoPopup
            card={cardInfoCard}
            catalog={allCards}
            getScanUrl={getScanUrl}
            isInGame={false}
            onClose={() => setCardInfoCard(null)}
            onCardSwap={({ originalCard, replacementCard }) => {
              setSlots((prev) => replaceSlotCard(prev, originalCard.fullName, replacementCard));
              setCardInfoCard(replacementCard);
            }}
          />
        )}
      </DndContext>
    </div>
  );
}
