import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Format, GamePhase, GameSettings } from 'ptcg-server';
import { getDeck, getDeckList } from '../api/deckApi';
import { ApiError } from '../api/apiError';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSettings } from '../context/SettingsContext';
import { formatOptionLabel } from '../deck-editor/formatLabelI18n';
import { MATCH_FORMAT_VALUES } from '../games/matchFormats';
import type { DeckListEntry } from '../types/responses';
import styles from './GamesPage.module.css';

function decksForFormat(all: DeckListEntry[], format: Format): DeckListEntry[] {
  return all.filter((d) => d.isValid && Array.isArray(d.format) && d.format.includes(format));
}

function gamePhaseLabel(phase: GamePhase): string {
  switch (phase) {
    case GamePhase.WAITING_FOR_PLAYERS:
      return 'Waiting';
    case GamePhase.SETUP:
      return 'Setup';
    case GamePhase.PLAYER_TURN:
      return 'In progress';
    case GamePhase.FINISHED:
      return 'Finished';
    default:
      return 'Game';
  }
}

export function GamesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hiddenFormats } = useSettings();
  const { connected, error, clientId, clients, usersById, games, createGame } = useCoreSession();
  const [decks, setDecks] = useState<DeckListEntry[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<Format>(Format.THEME);
  const [selectedDeckId, setSelectedDeckId] = useState<number | null>(null);
  const [selectedOpponentId, setSelectedOpponentId] = useState<number | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const visibleFormats = useMemo(
    () => MATCH_FORMAT_VALUES.filter((f) => !hiddenFormats.includes(f)),
    [hiddenFormats],
  );

  const playableDecks = useMemo(
    () => decksForFormat(decks, selectedFormat),
    [decks, selectedFormat],
  );

  const opponents = useMemo(
    () =>
      clients
        .filter((c) => c.clientId !== clientId)
        .map((c) => ({ clientId: c.clientId, user: usersById[c.userId] }))
        .filter((c) => c.user != null),
    [clientId, clients, usersById],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await getDeckList({ summary: true });
        if (!cancelled) {
          setDecks(res.decks);
          setPageError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setPageError(e instanceof ApiError ? e.message : t('REACT_ERROR_LOAD_DECKS'));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (visibleFormats.length > 0 && !visibleFormats.includes(selectedFormat)) {
      setSelectedFormat(visibleFormats[0]!);
    }
  }, [selectedFormat, visibleFormats]);

  useEffect(() => {
    setSelectedDeckId((current) => {
      if (current != null && playableDecks.some((d) => d.id === current)) {
        return current;
      }
      return playableDecks[0]?.id ?? null;
    });
  }, [playableDecks]);

  useEffect(() => {
    setSelectedOpponentId((current) => {
      if (current != null && opponents.some((o) => o.clientId === current)) {
        return current;
      }
      return opponents[0]?.clientId ?? null;
    });
  }, [opponents]);

  const startGame = useCallback(async () => {
    if (!selectedDeckId || !selectedOpponentId || busy) {
      return;
    }
    setBusy(true);
    try {
      const deck = await getDeck(selectedDeckId);
      const settings = new GameSettings();
      settings.format = selectedFormat;
      const game = await createGame(
        deck.deck.cards,
        settings,
        selectedOpponentId,
        deck.deck.id,
      );
      navigate(`/table/${game.gameId}`);
    } catch (e) {
      setPageError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    } finally {
      setBusy(false);
    }
  }, [busy, createGame, navigate, selectedDeckId, selectedFormat, selectedOpponentId, t]);

  const selectedDeck = playableDecks.find((d) => d.id === selectedDeckId);
  const canStart = connected && selectedDeck != null && selectedOpponentId != null && !busy;

  return (
    <div className={styles.page}>
      <div className={styles.alerts}>
        {!connected && (
          <p className={styles.alert}>
            {error ? t('REACT_SOCKET_PREFIX', { message: error }) : t('REACT_CONNECTING')}
          </p>
        )}
        {pageError ? <p className={styles.alert}>{pageError}</p> : null}
      </div>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h1>{t('MAIN_GAMES')}</h1>
          <Link to="/deck">{t('DECK_TITLE')}</Link>
        </div>

        <div className={styles.controls}>
          <label>
            <span>{t('GAMES_FORMAT')}</span>
            <select value={selectedFormat} onChange={(e) => setSelectedFormat(Number(e.target.value) as Format)}>
              {visibleFormats.map((format) => (
                <option key={format} value={format}>
                  {formatOptionLabel(t, format)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>{t('DECK_TITLE')}</span>
            <select
              value={selectedDeckId ?? ''}
              onChange={(e) => setSelectedDeckId(Number(e.target.value))}
              disabled={playableDecks.length === 0}
            >
              {playableDecks.length === 0 ? (
                <option value="">{t('NO_DECK')}</option>
              ) : (
                playableDecks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    {deck.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <label>
            <span>{t('GAMES_OPPONENT', { defaultValue: 'Opponent' })}</span>
            <select
              value={selectedOpponentId ?? ''}
              onChange={(e) => setSelectedOpponentId(Number(e.target.value))}
              disabled={opponents.length === 0}
            >
              {opponents.length === 0 ? (
                <option value="">{t('GAMES_NO_OPPONENTS', { defaultValue: 'No opponents online' })}</option>
              ) : (
                opponents.map((opponent) => (
                  <option key={opponent.clientId} value={opponent.clientId}>
                    {opponent.user.name}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        <button type="button" className={styles.primaryAction} disabled={!canStart} onClick={startGame}>
          {busy
            ? t('REACT_LOADING')
            : t('GAMES_START_GAME', { defaultValue: 'Start game' })}
        </button>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>{t('GAMES_ACTIVE_GAMES', { defaultValue: 'Active games' })}</h2>
        </div>
        {games.length === 0 ? (
          <p className={styles.empty}>{t('GAMES_NO_ACTIVE_GAMES', { defaultValue: 'No active games' })}</p>
        ) : (
          <div className={styles.gameList}>
            {games.map((game) => (
              <button
                type="button"
                key={game.gameId}
                className={styles.gameRow}
                onClick={() => navigate(`/table/${game.gameId}`)}
              >
                <span>#{game.gameId}</span>
                <span>{gamePhaseLabel(game.phase)}</span>
                <span>{game.players.map((p) => p.name).join(' vs ') || t('REACT_LOADING')}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
