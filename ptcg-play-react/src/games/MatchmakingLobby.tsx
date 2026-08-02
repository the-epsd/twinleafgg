import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Format, type Archetype } from 'ptcg-server';
import { formatOptionLabel } from '../deck-editor/formatLabelI18n';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSettings } from '../context/SettingsContext';
import { getDeck, getDeckList } from '../api/deckApi';
import type { DeckListEntry } from '../types/responses';
import { ApiError } from '../api/apiError';
import { getSocketManager } from '../socket/socketManager';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TwinleafCtaButton, twinleafCtaLabelStyles } from '../components/ui/TwinleafCtaButton';
import { ArchetypeIcon } from './ArchetypeIcon';
import { archetypeToSlug, gen9SpriteUrl } from './archetypeSlug';
import { deckArchetypeForDisplay } from './deckArchetypeDisplay';
import { MATCH_FORMAT_VALUES } from './matchFormats';
import { pickDefaultDeckIdForFormat } from './deckDefaultPreferences';
import styles from './MatchmakingLobby.module.css';

const SMALL_PAGE_SIZE = 3;

function decksForFormat(all: DeckListEntry[], format: Format): DeckListEntry[] {
  return all.filter((d) => Array.isArray(d.format) && d.format.includes(format));
}

function computeDefaultSelections(
  all: DeckListEntry[],
  formatList: Format[],
): Partial<Record<Format, number>> {
  const next: Partial<Record<Format, number>> = {};
  for (const f of formatList) {
    const list = decksForFormat(all, f);
    const id = pickDefaultDeckIdForFormat(list, f);
    if (id != null) {
      next[f] = id;
    }
  }
  return next;
}

function archetypeSpriteUrls(value: Archetype | Archetype[]): string[] {
  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.map((a) => gen9SpriteUrl(archetypeToSlug(a))))];
}

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}

async function preloadFormatSprites(
  decks: DeckListEntry[],
  selections: Partial<Record<Format, number>>,
  formats: Format[],
): Promise<void> {
  const urls = new Set<string>();
  for (const f of formats) {
    const id = selections[f];
    if (id == null) {
      continue;
    }
    const deck = decksForFormat(decks, f).find((d) => d.id === id);
    if (!deck) {
      continue;
    }
    for (const url of archetypeSpriteUrls(deckArchetypeForDisplay(deck))) {
      urls.add(url);
    }
  }
  await Promise.all([...urls].map(preloadImage));
}

export interface MatchmakingLobbyProps {
  onError: (message: string) => void;
}

export function MatchmakingLobby({ onError }: MatchmakingLobbyProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenFormats } = useSettings();
  const { connected, joinMatchmaking, leaveMatchmaking } = useCoreSession();
  const visibleMatchFormats = useMemo(
    () => MATCH_FORMAT_VALUES.filter((f) => !hiddenFormats.includes(f)),
    [hiddenFormats],
  );
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const [allDecks, setAllDecks] = useState<DeckListEntry[]>([]);
  const [selectedDeckByFormat, setSelectedDeckByFormat] = useState<Partial<Record<Format, number>>>({});
  const [selectedFormat, setSelectedFormat] = useState<Format | null>(null);
  const [editingFormat, setEditingFormat] = useState<Format | null>(null);
  const [smallPage, setSmallPage] = useState(0);
  const [formatCounts, setFormatCounts] = useState<Record<number, number>>({});
  const [inQueue, setInQueue] = useState(false);
  const [ready, setReady] = useState(false);
  const matchActionLockRef = useRef(false);
  const selectedDeckByFormatRef = useRef(selectedDeckByFormat);
  selectedDeckByFormatRef.current = selectedDeckByFormat;

  const loadDeckSummaries = useCallback(async () => {
    setReady(false);
    try {
      const res = await getDeckList({ summary: true });
      const computed = computeDefaultSelections(res.decks, visibleMatchFormats);
      const merged: Partial<Record<Format, number>> = { ...computed };
      const prev = selectedDeckByFormatRef.current;
      for (const f of visibleMatchFormats) {
        const list = decksForFormat(res.decks, f);
        if (list.length && prev[f] != null && list.some((d) => d.id === prev[f])) {
          merged[f] = prev[f]!;
        }
      }
      const initialFormat =
        visibleMatchFormats.find((f) => decksForFormat(res.decks, f).length > 0) ?? null;
      setAllDecks(res.decks);
      setSelectedDeckByFormat(merged);
      setSelectedFormat(initialFormat);
      await preloadFormatSprites(res.decks, merged, visibleMatchFormats);
    } catch (e) {
      onErrorRef.current(e instanceof ApiError ? e.message : t('REACT_ERROR_LOAD_DECKS'));
    } finally {
      setReady(true);
    }
  }, [t, visibleMatchFormats]);

  useEffect(() => {
    void loadDeckSummaries();
  }, [loadDeckSummaries]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    const socket = getSocketManager();
    const onGameCreated = (payload: { gameId: number }) => {
      setInQueue(false);
      navigate(`/table/${payload.gameId}`);
    };
    socket.raw.on('matchmaking:gameCreated', onGameCreated);
    return () => {
      socket.raw.off('matchmaking:gameCreated', onGameCreated);
    };
  }, [connected, navigate]);

  useEffect(() => {
    if (!connected) {
      return;
    }
    const socket = getSocketManager();
    const handler = (...args: unknown[]) => {
      const data = args[0] as { formatCounts?: Record<number, number> } | undefined;
      if (data?.formatCounts) {
        setFormatCounts(data.formatCounts);
      }
    };
    socket.on('matchmaking:queueUpdate', handler);
    void socket
      .emit<void, { players: string[]; formatCounts: Record<number, number> }>('matchmaking:getQueueData', undefined)
      .then((d) => {
        if (d?.formatCounts) {
          setFormatCounts(d.formatCounts);
        }
      })
      .catch(() => {});

    return () => {
      socket.off('matchmaking:queueUpdate', handler);
    };
  }, [connected]);

  useEffect(() => {
    if (!ready || allDecks.length === 0) {
      return;
    }
    setSelectedFormat((prev) => {
      if (
        prev != null &&
        visibleMatchFormats.includes(prev) &&
        decksForFormat(allDecks, prev).length > 0
      ) {
        return prev;
      }
      return visibleMatchFormats.find((f) => decksForFormat(allDecks, f).length > 0) ?? null;
    });
  }, [allDecks, ready, visibleMatchFormats]);

  const largeFormats = useMemo(() => visibleMatchFormats.slice(0, 2), [visibleMatchFormats]);
  const smallFormatsAll = useMemo(() => visibleMatchFormats.slice(2), [visibleMatchFormats]);
  const smallMaxPage = Math.max(0, Math.ceil(smallFormatsAll.length / SMALL_PAGE_SIZE) - 1);

  useEffect(() => {
    setSmallPage((p) => Math.min(p, smallMaxPage));
  }, [smallMaxPage]);

  const smallFormats = useMemo(() => {
    const start = smallPage * SMALL_PAGE_SIZE;
    return smallFormatsAll.slice(start, start + SMALL_PAGE_SIZE);
  }, [smallFormatsAll, smallPage]);

  const getDeckEntry = (f: Format): DeckListEntry | undefined => {
    const id = selectedDeckByFormat[f];
    if (id == null) {
      return undefined;
    }
    return decksForFormat(allDecks, f).find((d) => d.id === id);
  };

  const hasValidDeck = (f: Format) => getDeckEntry(f) !== undefined;

  const queueLabel = (n: number) =>
    n === 1 ? t('REACT_QUEUE_PLAYER', { count: n }) : t('REACT_QUEUE_PLAYERS', { count: n });

  const pickFormat = (f: Format) => {
    if (inQueue || !hasValidDeck(f)) {
      return;
    }
    setSelectedFormat(f);
    setEditingFormat(null);
  };

  const onCardKeyDown = (f: Format, e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      pickFormat(f);
    }
  };

  const toggleDeckPicker = (f: Format, e: MouseEvent) => {
    e.stopPropagation();
    if (inQueue) {
      return;
    }
    setEditingFormat((cur) => (cur === f ? null : f));
  };

  const selectDeckForFormat = (f: Format, deckId: number) => {
    setSelectedDeckByFormat((prev) => ({ ...prev, [f]: deckId }));
    setEditingFormat(null);
  };

  async function joinQueue() {
    if (matchActionLockRef.current || !selectedFormat || !connected) {
      return;
    }
    const deck = getDeckEntry(selectedFormat);
    if (!deck) {
      return;
    }
    matchActionLockRef.current = true;
    try {
      const cards =
        deck.cards && deck.cards.length > 0 ? deck.cards : (await getDeck(deck.id)).deck.cards;
      await joinMatchmaking(selectedFormat, cards, deck.artworks, deck.id, deck.sleeveImagePath);
      setInQueue(true);
    } catch (e) {
      onErrorRef.current(e instanceof ApiError ? e.message : t('REACT_ERROR_JOIN_QUEUE'));
    } finally {
      matchActionLockRef.current = false;
    }
  }

  async function leaveQueueFn() {
    if (matchActionLockRef.current) {
      return;
    }
    matchActionLockRef.current = true;
    try {
      await leaveMatchmaking();
      setInQueue(false);
    } catch (e) {
      onErrorRef.current(e instanceof ApiError ? e.message : t('REACT_ERROR_LEAVE_QUEUE'));
    } finally {
      matchActionLockRef.current = false;
    }
  }

  const selectedDeck = selectedFormat != null ? getDeckEntry(selectedFormat) : undefined;
  const canStartMatch = connected && selectedFormat != null && selectedDeck != null;
  const playLabelIdle =
    !selectedFormat || !selectedDeck
      ? t('REACT_GAMES_LOBBY_CTA_SELECT')
      : t('REACT_GAMES_LOBBY_CTA_FIND');
  const playAriaLabel = inQueue ? t('REACT_GAMES_LOBBY_CTA_LEAVE') : playLabelIdle;

  const focusBlurb = useMemo(() => {
    if (inQueue && selectedFormat != null) {
      return t('REACT_GAMES_LOBBY_FOOTER_QUEUED', {
        format: formatOptionLabel(t, selectedFormat),
      });
    }
    if (selectedFormat == null) {
      return t('REACT_GAMES_LOBBY_FOOTER_PICK');
    }
    if (!selectedDeck) {
      return t('REACT_GAMES_LOBBY_FOOTER_NO_DECK', {
        format: formatOptionLabel(t, selectedFormat),
      });
    }
    const q = formatCounts[selectedFormat] ?? 0;
    const queue =
      q === 1 ? t('REACT_QUEUE_PLAYER', { count: q }) : t('REACT_QUEUE_PLAYERS', { count: q });
    return t('REACT_GAMES_LOBBY_FOOTER_READY', {
      format: formatOptionLabel(t, selectedFormat),
      deck: selectedDeck.name,
      queue,
    });
  }, [formatCounts, inQueue, selectedDeck, selectedFormat, t]);

  const canSmallPrev = smallPage > 0 && !inQueue;
  const canSmallNext = smallPage < smallMaxPage && !inQueue;

  const renderLargeCard = (f: Format, revealDelayMs: number) => {
    const deck = getDeckEntry(f);
    const q = formatCounts[f] ?? 0;
    const isSelected = selectedFormat === f;
    const disabled = !hasValidDeck(f);
    const dimWhileQueued = inQueue && !isSelected;
    return (
      <div
        key={f}
        role="button"
        tabIndex={disabled || inQueue ? -1 : 0}
        className={`${styles.largeCard} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${dimWhileQueued ? styles.locked : ''}`}
        style={{ '--lp-delay': `${revealDelayMs}ms` } as CSSProperties}
        onClick={() => pickFormat(f)}
        onKeyDown={(e) => onCardKeyDown(f, e)}
      >
        {isSelected ? <span className={styles.selectedCaret} aria-hidden /> : null}
        <div className={styles.largeArt}>
          {q > 0 ? (
            <div className={styles.queueBadge} role="status">
              {queueLabel(q)}
            </div>
          ) : null}
          {isSelected && !inQueue ? (
            <button type="button" className={styles.changeDeckBtn} onClick={(e) => toggleDeckPicker(f, e)}>
              {t('MATCHMAKING_CHANGE_DECK')}
            </button>
          ) : null}
          <div className={styles.largeArtInner}>
            <ArchetypeIcon archetypes={deck ? deckArchetypeForDisplay(deck) : undefined} scale={4.2} />
          </div>
        </div>
        <div className={styles.largeMeta}>
          <div className={styles.largeTitle}>{formatOptionLabel(t, f)}</div>
          <div className={styles.largeSubtitle}>{deck?.name ?? t('NO_DECK')}</div>
        </div>
      </div>
    );
  };

  const renderSmallCard = (f: Format, revealDelayMs: number) => {
    const deck = getDeckEntry(f);
    const q = formatCounts[f] ?? 0;
    const isSelected = selectedFormat === f;
    const disabled = !hasValidDeck(f);
    const dimWhileQueued = inQueue && !isSelected;
    return (
      <div
        key={f}
        role="button"
        tabIndex={disabled || inQueue ? -1 : 0}
        className={`${styles.smallCard} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${dimWhileQueued ? styles.locked : ''}`}
        style={{ '--lp-delay': `${revealDelayMs}ms` } as CSSProperties}
        onClick={() => pickFormat(f)}
        onKeyDown={(e) => onCardKeyDown(f, e)}
      >
        {isSelected ? <span className={styles.selectedCaret} aria-hidden /> : null}
        <div className={styles.smallCopy}>
          <div className={styles.smallTitle}>{formatOptionLabel(t, f)}</div>
          <div className={styles.smallSubtitle}>
            {deck?.name ?? t('NO_DECK')}
            {q > 0 ? ` · ${queueLabel(q)}` : ''}
          </div>
        </div>
        <div className={styles.smallArt}>
          <ArchetypeIcon archetypes={deck ? deckArchetypeForDisplay(deck) : undefined} scale={1.6} />
        </div>
      </div>
    );
  };

  if (!ready) {
    return (
      <section className={styles.section} aria-busy="true" aria-label={t('DECK_LIST_LOADING')}>
        <div className={styles.loading}>
          <LoadingSpinner size={48} className={styles.loadingSpinner} />
        </div>
      </section>
    );
  }

  const smallRevealStart = largeFormats.length * 70 + 40;
  const smallRevealStep = 110;
  const footerRevealDelay =
    smallRevealStart +
    (smallFormats.length > 0 ? (smallFormats.length - 1) * smallRevealStep + 120 : 40);

  return (
    <section className={`${styles.section} ${styles.reveal}`}>
      <div className={styles.grid}>
        <div className={styles.largeColumn}>
          {largeFormats.map((f, i) => renderLargeCard(f, i * 70))}
          {largeFormats.length === 0 ? (
            <p className={styles.emptyHint}>{t('REACT_GAMES_LOBBY_NO_FORMATS')}</p>
          ) : null}
        </div>

        {smallFormatsAll.length > 0 ? (
          <div className={styles.smallColumn}>
            <div className={styles.smallStack}>
              {smallFormats.map((f, i) => renderSmallCard(f, smallRevealStart + i * smallRevealStep))}
            </div>
            {smallMaxPage > 0 ? (
              <div className={styles.smallPager}>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  disabled={!canSmallPrev}
                  onClick={() => canSmallPrev && setSmallPage((p) => p - 1)}
                  aria-label={t('REACT_MATCHMAKING_PREV_FORMATS')}
                >
                  ‹
                </button>
                <span className={styles.pagerLabel}>
                  {smallPage + 1}/{smallMaxPage + 1}
                </span>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  disabled={!canSmallNext}
                  onClick={() => canSmallNext && setSmallPage((p) => p + 1)}
                  aria-label={t('REACT_MATCHMAKING_NEXT_FORMATS')}
                >
                  ›
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {editingFormat != null && !inQueue ? (
        <div className={styles.deckPicker}>
          <div className={styles.deckPickerTitle}>{t('MATCHMAKING_SELECT_DECK')}</div>
          <div className={styles.deckGrid}>
            {decksForFormat(allDecks, editingFormat).map((d) => {
              const picked = selectedDeckByFormat[editingFormat] === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`${styles.deckTile} ${picked ? styles.deckTileSelected : ''}`}
                  onClick={() => selectDeckForFormat(editingFormat, d.id)}
                >
                  <div className={styles.tileArt}>
                    <ArchetypeIcon archetypes={deckArchetypeForDisplay(d)} scale={1.8} />
                  </div>
                  <div className={styles.tileName}>{d.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <footer
        className={styles.footer}
        style={{ '--lp-delay': `${footerRevealDelay}ms` } as CSSProperties}
      >
        <p className={styles.footerBlurb}>{focusBlurb}</p>
        <TwinleafCtaButton
          type="button"
          variant={inQueue ? 'muted' : 'primary'}
          disabled={!connected || (!inQueue && !canStartMatch)}
          aria-label={playAriaLabel}
          onClick={() => (inQueue ? void leaveQueueFn() : void joinQueue())}
        >
          <span
            className={`${twinleafCtaLabelStyles.label} ${inQueue ? twinleafCtaLabelStyles.labelHidden : ''}`}
            aria-hidden={inQueue}
          >
            {playLabelIdle}
          </span>
          <span
            className={`${twinleafCtaLabelStyles.label} ${inQueue ? '' : twinleafCtaLabelStyles.labelHidden}`}
            aria-hidden={!inQueue}
          >
            {t('REACT_GAMES_LOBBY_CTA_LEAVE')}
          </span>
        </TwinleafCtaButton>
      </footer>
    </section>
  );
}
