import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Format } from 'ptcg-server';
import { formatOptionLabel } from '../deck-editor/formatLabelI18n';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { getDeck, getDeckList } from '../api/deckApi';
import type { DeckListEntry } from '../types/responses';
import { ApiError } from '../api/apiError';
import { getSocketManager } from '../socket/socketManager';
import { ArchetypeIcon } from './ArchetypeIcon';
import { deckArchetypeForDisplay } from './deckArchetypeDisplay';
import { MATCH_FORMAT_VALUES } from './matchFormats';
import styles from './MatchmakingLobby.module.css';

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
    if (list.length) {
      next[f] = list[0]!.id;
    }
  }
  return next;
}

export interface MatchmakingLobbyProps {
  onError: (message: string) => void;
}

export function MatchmakingLobby({ onError }: MatchmakingLobbyProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenFormats, defaultSandboxMode } = useSettings();
  const { user } = useAuth();
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
  const [visibleFormatCount, setVisibleFormatCount] = useState(4);
  const [currentPage, setCurrentPage] = useState(0);
  const [formatCounts, setFormatCounts] = useState<Record<number, number>>({});
  const [inQueue, setInQueue] = useState(false);
  const matchActionLockRef = useRef(false);

  const loadDeckSummaries = useCallback(async () => {
    try {
      const res = await getDeckList({ summary: true });
      setAllDecks(res.decks);
      setSelectedDeckByFormat((prev) => {
        const computed = computeDefaultSelections(res.decks, visibleMatchFormats);
        const merged: Partial<Record<Format, number>> = { ...computed };
        for (const f of visibleMatchFormats) {
          const list = decksForFormat(res.decks, f);
          if (list.length && prev[f] != null && list.some((d) => d.id === prev[f])) {
            merged[f] = prev[f]!;
          }
        }
        return merged;
      });
    } catch (e) {
      onErrorRef.current(e instanceof ApiError ? e.message : t('REACT_ERROR_LOAD_DECKS'));
    }
  }, [t, visibleMatchFormats]);

  useEffect(() => {
    void loadDeckSummaries();
  }, [loadDeckSummaries]);

  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth;
      if (w <= 767) {
        setVisibleFormatCount(1);
      } else if (w <= 1079) {
        setVisibleFormatCount(2);
      } else if (w <= 1439) {
        setVisibleFormatCount(3);
      } else {
        setVisibleFormatCount(4);
      }
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  const maxPage = Math.max(0, Math.ceil(visibleMatchFormats.length / visibleFormatCount) - 1);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, maxPage));
  }, [maxPage, visibleFormatCount]);

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
      .catch(() => { });

    return () => {
      socket.off('matchmaking:queueUpdate', handler);
    };
  }, [connected]);

  useEffect(() => {
    if (allDecks.length === 0) {
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
      return (
        visibleMatchFormats.find((f) => decksForFormat(allDecks, f).length > 0) ?? null
      );
    });
  }, [allDecks, visibleMatchFormats]);

  const visibleFormats = useMemo(() => {
    const start = currentPage * visibleFormatCount;
    return visibleMatchFormats.slice(start, start + visibleFormatCount);
  }, [currentPage, visibleFormatCount, visibleMatchFormats]);

  const formatRowStyle = useMemo((): CSSProperties => {
    const slots = Math.max(1, visibleFormatCount);
    const gaps = Math.max(0, slots - 1);
    return {
      ['--format-card-w']: `calc((100% - ${gaps} * var(--format-gap)) / ${slots})`,
    } as CSSProperties;
  }, [visibleFormatCount]);

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
      const sandboxMode = user?.roleId === 4 && defaultSandboxMode ? true : undefined;
      await joinMatchmaking(selectedFormat, cards, deck.artworks, deck.id, deck.sleeveImagePath, sandboxMode);
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

  const canPrev = currentPage > 0 && !inQueue;
  const canNext = currentPage < maxPage && !inQueue;
  const selectedDeck = selectedFormat != null ? getDeckEntry(selectedFormat) : undefined;
  const canStartMatch = connected && selectedFormat != null && selectedDeck != null;
  const playLabelIdle =
    !selectedFormat || !selectedDeck ? t('LABEL_SELECT_FORMAT') : t('BUTTON_FIND_MATCH');
  const playAriaLabel = inQueue ? t('GAMES_LEAVE_QUEUE') : playLabelIdle;

  return (
    <section className={styles.section}>
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          disabled={!canPrev}
          onClick={() => canPrev && setCurrentPage((p) => p - 1)}
          aria-label={t('REACT_MATCHMAKING_PREV_FORMATS')}
        >
          ‹
        </button>

        <div className={styles.formatRow} style={formatRowStyle}>
          {visibleFormats.map((f) => {
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
                className={`${styles.formatBox} ${isSelected ? styles.selected : ''} ${disabled ? styles.disabled : ''} ${dimWhileQueued ? styles.locked : ''}`}
                onClick={() => pickFormat(f)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pickFormat(f);
                  }
                }}
              >
                <div className={styles.artwork}>
                  {q > 0 ? (
                    <div className={styles.queueOverlay} role="status">
                      {queueLabel(q)}
                    </div>
                  ) : null}
                  {isSelected && !inQueue ? (
                    <button
                      type="button"
                      className={styles.changeDeckBtn}
                      onClick={(e) => toggleDeckPicker(f, e)}
                    >
                      {t('MATCHMAKING_CHANGE_DECK')}
                    </button>
                  ) : null}
                  <div className={styles.artworkInner}>
                    {deck ? (
                      <ArchetypeIcon archetypes={deckArchetypeForDisplay(deck)} scale={3} />
                    ) : (
                      <ArchetypeIcon archetypes={undefined} scale={3} />
                    )}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.formatName}>{formatOptionLabel(t, f)}</div>
                  <div className={styles.deckName}>{deck?.name ?? t('NO_DECK')}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.navBtn}
          disabled={!canNext}
          onClick={() => canNext && setCurrentPage((p) => p + 1)}
          aria-label={t('REACT_MATCHMAKING_NEXT_FORMATS')}
        >
          ›
        </button>
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

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.playBtn}
          disabled={!connected || (!inQueue && !canStartMatch)}
          aria-label={playAriaLabel}
          onClick={() => (inQueue ? void leaveQueueFn() : void joinQueue())}
        >
          <span
            className={`${styles.playBtnLabel} ${inQueue ? styles.playBtnLabelHidden : ''}`}
            aria-hidden={inQueue}
          >
            {playLabelIdle}
          </span>
          <span
            className={`${styles.playBtnLabel} ${inQueue ? '' : styles.playBtnLabelHidden}`}
            aria-hidden={!inQueue}
          >
            {t('GAMES_LEAVE_QUEUE')}
          </span>
        </button>
      </div>
    </section>
  );
}
