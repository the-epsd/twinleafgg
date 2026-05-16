import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Format } from 'ptcg-server';
import {
  createDeck,
  deleteDeck,
  duplicateDeck,
  getDeck,
  getDeckList,
  renameDeck,
} from '../api/deckApi';
import type { DeckListEntry } from '../types/responses';
import { ApiError } from '../api/apiError';
import { useSettings } from '../context/SettingsContext';
import { FormAlert } from '../components/ui/FormAlert';
import { ShellButton } from '../components/ui/ShellButton';
import { CheckboxField } from '../components/ui/CheckboxField';
import { deckListExportText } from '../deck-editor/deckListExportText';
import styles from './DeckListPage.module.css';

const LS_DEFAULT_DECK_ID = 'defaultDeckId';
const LS_FORMAT_DEFAULTS = 'formatDefaultDecks';
const LS_SHOW_THEME = 'showThemeDecksInAllTab';

const PRIMARY_TAB_KEYS = [
  'all',
  'standard',
  'standard_nightly',
  'glc',
  'expanded',
  'RSPK',
  'retro',
  'unlimited',
  'eternal',
] as const;

const MORE_TAB_KEYS = ['theme', 'swsh', 'sm', 'xy', 'bw'] as const;

type TabKey = (typeof PRIMARY_TAB_KEYS)[number] | (typeof MORE_TAB_KEYS)[number];

const TAB_TO_FORMAT: Record<string, Format> = {
  standard: Format.STANDARD,
  standard_nightly: Format.STANDARD_NIGHTLY,
  glc: Format.GLC,
  expanded: Format.EXPANDED,
  RSPK: Format.RSPK,
  retro: Format.RETRO,
  unlimited: Format.UNLIMITED,
  eternal: Format.ETERNAL,
  theme: Format.THEME,
  swsh: Format.SWSH,
  sm: Format.SM,
  xy: Format.XY,
  bw: Format.BW,
};

function formatLabelKey(tab: string): string {
  const keys: Record<string, string> = {
    all: 'FORMAT_ALL',
    standard: 'FORMAT_STANDARD',
    standard_nightly: 'FORMAT_STANDARD_NIGHTLY',
    glc: 'FORMAT_GLC',
    expanded: 'FORMAT_EXPANDED',
    RSPK: 'FORMAT_RSPK',
    retro: 'FORMAT_RETRO',
    unlimited: 'FORMAT_UNLIMITED',
    eternal: 'FORMAT_ETERNAL',
    theme: 'FORMAT_THEME',
    swsh: 'LABEL_SWSH',
    sm: 'LABEL_SM',
    xy: 'LABEL_XY',
    bw: 'LABEL_BW',
  };
  return keys[tab] ?? tab;
}

function readDefaultDeckId(): number | null {
  const v = localStorage.getItem(LS_DEFAULT_DECK_ID);
  if (!v) {
    return null;
  }
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function readFormatDefaults(): Record<string, number> {
  try {
    const raw = localStorage.getItem(LS_FORMAT_DEFAULTS);
    if (!raw) {
      return {};
    }
    const o = JSON.parse(raw) as Record<string, number>;
    return typeof o === 'object' && o !== null ? o : {};
  } catch {
    return {};
  }
}

function readShowThemeDecks(): boolean {
  try {
    const raw = localStorage.getItem(LS_SHOW_THEME);
    if (raw === null) {
      return false;
    }
    return JSON.parse(raw) as boolean;
  } catch {
    return false;
  }
}

function isFormatTabHidden(tab: string, hiddenFormats: Format[]): boolean {
  if (tab === 'all') {
    return false;
  }
  const fmt = TAB_TO_FORMAT[tab];
  if (fmt === undefined) {
    return false;
  }
  return hiddenFormats.includes(fmt);
}

function hasVisibleMoreFormats(hiddenFormats: Format[]): boolean {
  return MORE_TAB_KEYS.some((k) => !isFormatTabHidden(k, hiddenFormats));
}

function filterDecks(
  decks: DeckListEntry[],
  selectedFormat: TabKey,
  showThemeDecksInAll: boolean,
): DeckListEntry[] {
  if (selectedFormat === 'theme') {
    return decks.filter((d) => Array.isArray(d.format) && d.format.includes(Format.THEME));
  }
  if (selectedFormat === 'all') {
    if (showThemeDecksInAll) {
      return decks;
    }
    return decks.filter((d) => !Array.isArray(d.format) || !d.format.includes(Format.THEME));
  }
  const fmt = TAB_TO_FORMAT[selectedFormat];
  if (fmt === undefined) {
    return decks;
  }
  return decks.filter((d) => Array.isArray(d.format) && d.format.includes(fmt));
}

function promptName(
  t: TFunction,
  title: string,
  initial: string,
  existingLower: Set<string>,
): string | null {
  const raw = window.prompt(title, initial);
  if (raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  if (trimmed.length < 3 || trimmed.length > 32) {
    window.alert(t('REACT_DECK_NAME_RULES'));
    return null;
  }
  if (existingLower.has(trimmed.toLowerCase())) {
    window.alert(t('ERROR_DECK_NAME_DUPLICATE'));
    return null;
  }
  return trimmed;
}

export function DeckListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenFormats } = useSettings();

  const [decks, setDecks] = useState<DeckListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<TabKey>('all');
  const [showThemeDecksInAllTab, setShowThemeDecksInAllTab] = useState(readShowThemeDecks);
  const [defaultDeckId, setDefaultDeckId] = useState<number | null>(readDefaultDeckId);
  const [formatDefaultDecks, setFormatDefaultDecks] = useState<Record<string, number>>(readFormatDefaults);
  const [openMenuDeckId, setOpenMenuDeckId] = useState<number | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDeckList({ summary: true, limit: 100, offset: 0 });
      setDecks(res.decks);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_LOAD_DECKS'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (selectedFormat !== 'all' && isFormatTabHidden(selectedFormat, hiddenFormats)) {
      setSelectedFormat('all');
    }
  }, [hiddenFormats, selectedFormat]);

  useEffect(() => {
    function onDocClick() {
      setOpenMenuDeckId(null);
      setMoreOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const existingNamesLower = useMemo(
    () => new Set(decks.map((d) => d.name.trim().toLowerCase()).filter(Boolean)),
    [decks],
  );

  const filteredDecks = useMemo(
    () => filterDecks(decks, selectedFormat, showThemeDecksInAllTab),
    [decks, selectedFormat, showThemeDecksInAllTab],
  );

  const visiblePrimaryTabs = useMemo(
    () => PRIMARY_TAB_KEYS.filter((k) => k === 'all' || !isFormatTabHidden(k, hiddenFormats)),
    [hiddenFormats],
  );

  const showMoreFormatsBtn = hasVisibleMoreFormats(hiddenFormats);

  function getFormatDisplayName(tab: string): string {
    return t(formatLabelKey(tab));
  }

  function isFormatDefaultDeck(deckId: number): boolean {
    if (selectedFormat === 'all') {
      return defaultDeckId === deckId;
    }
    const fid = formatDefaultDecks[selectedFormat];
    return fid === deckId;
  }

  function onShowThemeToggle(checked: boolean) {
    setShowThemeDecksInAllTab(checked);
    localStorage.setItem(LS_SHOW_THEME, JSON.stringify(checked));
  }

  async function onCreate() {
    setError(null);
    const name = promptName(t, t('DECK_ENTER_NAME_TITLE'), '', existingNamesLower);
    if (!name) {
      return;
    }
    try {
      const res = await createDeck(name);
      await refresh();
      navigate(`/deck/${res.deck.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_CREATE_DECK'));
    }
  }

  async function onCreateFromClipboard() {
    setError(null);
    let clipboardText: string;
    try {
      clipboardText = await navigator.clipboard.readText();
    } catch {
      setError(t('ERROR_CLIPBOARD_ACCESS'));
      return;
    }
    const name = promptName(t, t('DECK_ENTER_NAME_TITLE'), '', existingNamesLower);
    if (!name) {
      return;
    }
    try {
      const res = await createDeck(name);
      await refresh();
      navigate(`/deck/${res.deck.id}`, { state: { importFromClipboard: clipboardText } });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_CREATE_DECK'));
    }
  }

  async function onDeleteDeck(id: number) {
    if (!window.confirm(t('DECK_DELETE_SELECTED'))) {
      return;
    }
    try {
      await deleteDeck(id);
      if (defaultDeckId === id) {
        setDefaultDeckId(null);
        localStorage.removeItem(LS_DEFAULT_DECK_ID);
      }
      const nextFmt = { ...formatDefaultDecks };
      let changed = false;
      for (const k of Object.keys(nextFmt)) {
        if (nextFmt[k] === id) {
          delete nextFmt[k];
          changed = true;
        }
      }
      if (changed) {
        setFormatDefaultDecks(nextFmt);
        localStorage.setItem(LS_FORMAT_DEFAULTS, JSON.stringify(nextFmt));
      }
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('REACT_ERROR_DELETE_DECK'));
    }
  }

  async function onRenameDeck(id: number, previousName: string) {
    const others = new Set(
      decks
        .filter((x) => x.id !== id)
        .map((x) => x.name.trim().toLowerCase())
        .filter(Boolean),
    );
    const raw = window.prompt(t('DECK_ENTER_NAME_TITLE'), previousName);
    if (raw === null) {
      return;
    }
    const trimmed = raw.trim();
    if (trimmed.length < 3 || trimmed.length > 32) {
      window.alert(t('REACT_DECK_NAME_RULES'));
      return;
    }
    if (trimmed.toLowerCase() === previousName.trim().toLowerCase()) {
      return;
    }
    if (others.has(trimmed.toLowerCase())) {
      window.alert(t('ERROR_DECK_NAME_DUPLICATE'));
      return;
    }
    const name = trimmed;
    try {
      await renameDeck(id, name);
      setToast(t('BUTTON_RENAME') + ' — OK');
      window.setTimeout(() => setToast(null), 2400);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    }
  }

  async function onDuplicateDeck(id: number) {
    const name = promptName(t, t('DECK_ENTER_NAME_TITLE'), '', existingNamesLower);
    if (!name) {
      return;
    }
    try {
      await duplicateDeck(id, name);
      setToast(`${t('DECK_DUPLICATE')} — OK`);
      window.setTimeout(() => setToast(null), 2400);
      await refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    }
  }

  async function onExportDeck(deck: DeckListEntry) {
    try {
      const res = await getDeck(deck.id);
      const lines = res.deck.cards ?? [];
      const text = deckListExportText(lines);
      await navigator.clipboard.writeText(text);
      setToast(t('DECK_EXPORTED_TO_CLIPBOARD'));
      window.setTimeout(() => setToast(null), 2400);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('ERROR_CLIPBOARD_ACCESS'));
    }
  }

  function setAsDefault(deckId: number) {
    setDefaultDeckId(deckId);
    localStorage.setItem(LS_DEFAULT_DECK_ID, String(deckId));
    setToast(t('DECK_SET_AS_DEFAULT'));
    window.setTimeout(() => setToast(null), 2400);
  }

  function setAsFormatDefault(deckId: number, formatKey: TabKey) {
    if (formatKey === 'all' || formatKey === 'theme') {
      return;
    }
    const next = { ...formatDefaultDecks, [formatKey]: deckId };
    setFormatDefaultDecks(next);
    localStorage.setItem(LS_FORMAT_DEFAULTS, JSON.stringify(next));
    setToast(t('DECK_SET_AS_FORMAT_DEFAULT', { format: getFormatDisplayName(formatKey) }));
    window.setTimeout(() => setToast(null), 2400);
  }

  if (loading) {
    return <div className={styles.loading}>{t('DECK_LIST_LOADING')}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>{t('DECK_TITLE')}</h1>
        {selectedFormat !== 'theme' && (
          <div className={styles.themeToggle}>
            <CheckboxField
              id="show-theme-decks"
              checked={showThemeDecksInAllTab}
              onChange={(e) => onShowThemeToggle(e.target.checked)}
            >
              {t('SHOW_THEME_DECKS')}
            </CheckboxField>
          </div>
        )}
      </div>

      {error ? <FormAlert>{error}</FormAlert> : null}
      {toast ? <div className={styles.toast}>{toast}</div> : null}

      <div className={styles.formatRow}>
        <div className={styles.formatTabs}>
          {visiblePrimaryTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`${styles.formatTab} ${selectedFormat === tab ? styles.formatTabActive : ''}`}
              onClick={() => setSelectedFormat(tab)}
            >
              {t(formatLabelKey(tab))}
            </button>
          ))}
          <div
            className={`${styles.moreWrap} ${!showMoreFormatsBtn ? styles.moreHidden : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.moreSummary}
              onClick={(e) => {
                e.stopPropagation();
                setMoreOpen((v) => !v);
              }}
            >
              {t('MORE_FORMATS')}
            </button>
            {moreOpen ? (
              <div className={styles.moreMenu} role="menu">
                {MORE_TAB_KEYS.filter((k) => !isFormatTabHidden(k, hiddenFormats)).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="menuitem"
                    className={`${styles.moreMenuItem} ${selectedFormat === tab ? styles.moreMenuItemActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFormat(tab);
                      setMoreOpen(false);
                    }}
                  >
                    {t(formatLabelKey(tab))}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.actions}>
          <ShellButton variant="plain" onClick={() => void onCreate()}>
            {t('DECK_CREATE')}
          </ShellButton>
          <ShellButton variant="plain" onClick={() => void onCreateFromClipboard()}>
            {t('DECK_CREATE_FROM_CLIPBOARD')}
          </ShellButton>
        </div>
      </div>

      <div className={styles.gridWrap}>
        {filteredDecks.length > 0 ? (
          <div className={styles.grid}>
            {filteredDecks.map((d) => (
              <div key={d.id} className={styles.tile}>
                <div
                  className={styles.card}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t('BUTTON_EDIT')}: ${d.name}`}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('[data-no-deck-nav]')) {
                      return;
                    }
                    navigate(`/deck/${d.id}`);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') {
                      return;
                    }
                    e.preventDefault();
                    if ((e.target as HTMLElement).closest('[data-no-deck-nav]')) {
                      return;
                    }
                    navigate(`/deck/${d.id}`);
                  }}
                >
                  <div className={styles.status}>
                    <div
                      className={`${styles.validity} ${d.isValid ? styles.validityValid : styles.validityInvalid}`}
                    >
                      {d.isValid ? t('DECK_VALID') : t('DECK_INVALID')}
                    </div>
                    {isFormatDefaultDeck(d.id) ? (
                      <div className={styles.defaultWrap}>
                        <span className={styles.defaultStar} title={t('DEFAULT')} aria-hidden>
                          {'★'}
                        </span>
                        {selectedFormat !== 'all' ? (
                          <div className={styles.defaultTip}>
                            {getFormatDisplayName(selectedFormat)} {t('DEFAULT')}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.nameRow}>
                    <div className={styles.deckName}>{d.name}</div>
                    <div
                      className={styles.menuAnchor}
                      data-no-deck-nav
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <button
                        type="button"
                        className={styles.menuBtn}
                        aria-label={t('REACT_DECK_MENU_ARIA')}
                        aria-expanded={openMenuDeckId === d.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setOpenMenuDeckId((cur) => (cur === d.id ? null : d.id));
                        }}
                      >
                        {'\u22EE'}
                      </button>
                      {openMenuDeckId === d.id ? (
                        <div
                          className={styles.menuPanel}
                          role="menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            className={styles.menuItem}
                            to={`/deck/${d.id}`}
                            role="menuitem"
                            onClick={() => setOpenMenuDeckId(null)}
                          >
                            {t('BUTTON_EDIT')}
                          </Link>
                          {defaultDeckId !== d.id && d.isValid ? (
                            <button
                              type="button"
                              className={styles.menuItem}
                              onClick={() => {
                                setOpenMenuDeckId(null);
                                setAsDefault(d.id);
                              }}
                            >
                              {t('DECK_SET_AS_DEFAULT')}
                            </button>
                          ) : null}
                          {selectedFormat !== 'all' && !isFormatDefaultDeck(d.id) && d.isValid ? (
                            <button
                              type="button"
                              className={styles.menuItem}
                              onClick={() => {
                                setOpenMenuDeckId(null);
                                setAsFormatDefault(d.id, selectedFormat);
                              }}
                            >
                              {t('DECK_SET_AS_FORMAT_DEFAULT', {
                                format: getFormatDisplayName(selectedFormat),
                              })}
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setOpenMenuDeckId(null);
                              void onExportDeck(d);
                            }}
                          >
                            {t('BUTTON_EXPORT_DECKLIST')}
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setOpenMenuDeckId(null);
                              void onDeleteDeck(d.id);
                            }}
                          >
                            {t('BUTTON_DELETE')}
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setOpenMenuDeckId(null);
                              void onRenameDeck(d.id, d.name);
                            }}
                          >
                            {t('BUTTON_RENAME')}
                          </button>
                          <button
                            type="button"
                            className={styles.menuItem}
                            onClick={() => {
                              setOpenMenuDeckId(null);
                              void onDuplicateDeck(d.id);
                            }}
                          >
                            {t('DECK_DUPLICATE')}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>
              {'\u2139\uFE0F'}
            </div>
            {selectedFormat === 'all' ? (
              <p>{t('DECK_NO_DECKS')}</p>
            ) : (
              <p>{t('DECK_NO_DECKS_FORMAT', { format: getFormatDisplayName(selectedFormat) })}</p>
            )}
            <ShellButton variant="plain" onClick={() => void onCreate()}>
              {t('DECK_CREATE')}
            </ShellButton>
            <ShellButton variant="plain" onClick={() => void onCreateFromClipboard()}>
              {t('DECK_CREATE_FROM_CLIPBOARD')}
            </ShellButton>
          </div>
        )}
      </div>
    </div>
  );
}
