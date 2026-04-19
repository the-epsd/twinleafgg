import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { GameWinner, type GameInfo, type MatchInfo, type UserInfo } from 'ptcg-server';
import { getMatchHistory } from '../api/profileApi';
import { ApiError } from '../api/apiError';
import { useCoreSession } from '../context/CoreSessionContext';
import { appConfig } from '../env/config';
import { ShellButton } from '../components/ui/ShellButton';
import { ShellButtonLink } from '../components/ui/ShellButtonLink';
import { FormAlert } from '../components/ui/FormAlert';
import styles from './SpectatePage.module.css';

function mergeUsers(into: Record<number, UserInfo>, list: UserInfo[]): Record<number, UserInfo> {
  const next = { ...into };
  for (const u of list) {
    next[u.userId] = u;
  }
  return next;
}

export function SpectatePage() {
  const { t } = useTranslation();
  const { games, clients, usersById, connected, error: socketError } = useCoreSession();

  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [matchUsers, setMatchUsers] = useState<Record<number, UserInfo>>({});
  const [matchesTotal, setMatchesTotal] = useState(0);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const pageSize = appConfig.defaultPageSize;
  const maxPage = Math.max(0, Math.ceil(matchesTotal / pageSize) - 1);

  const activeRows = useMemo(() => {
    return games.map((game: GameInfo) => {
      const users = game.players.map((player) => {
        const c = clients.find((x) => x.clientId === player.clientId);
        return c ? usersById[c.userId] : undefined;
      });
      return { game, users };
    });
  }, [games, clients, usersById]);

  useEffect(() => {
    let cancelled = false;
    setMatchesLoading(true);
    setMatchesError(null);

    void (async () => {
      try {
        const res = await getMatchHistory(0, pageIndex);
        if (cancelled) {
          return;
        }
        setMatches(res.matches);
        setMatchesTotal(res.total);
        setMatchUsers((m) => mergeUsers(m, res.users));
      } catch (e) {
        if (!cancelled) {
          setMatchesError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
        }
      } finally {
        if (!cancelled) {
          setMatchesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pageIndex, t]);

  const formatDate = useCallback((ms: number) => {
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(ms));
    } catch {
      return new Date(ms).toISOString();
    }
  }, []);

  return (
    <div className={styles.page}>
      {!connected ? (
        <p className={styles.alert}>
          {socketError ? t('REACT_SOCKET_PREFIX', { message: socketError }) : t('REACT_CONNECTING')}
        </p>
      ) : null}

      <section aria-labelledby="spectate-active-heading">
        <h2 id="spectate-active-heading" className={styles.sectionTitle}>
          {t('GAMES_ACTIVE_GAMES_TITLE')}
        </h2>
        {activeRows.length === 0 ? (
          <p className={styles.empty}>{t('REACT_SPECTATE_NO_ACTIVE')}</p>
        ) : (
          <div className={styles.gamesGrid}>
            {activeRows.map(({ game, users }) => {
              const u0 = users[0];
              const u1 = users[1];
              const p0 = game.players[0];
              const p1 = game.players[1];
              return (
                <article key={game.gameId} className={styles.gameCard}>
                  <div className={styles.gameCardHeader}>
                    <span className={styles.gameId}>#{game.gameId}</span>
                    <span className={styles.statusPill}>Active</span>
                  </div>
                  <div className={styles.playersRow}>
                    <div className={styles.playerBlock}>
                      <div className={styles.playerName}>
                        {u0 ? <Link to={`/profile/${u0.userId}`}>{u0.name}</Link> : '…'}
                      </div>
                      {p0 ? (
                        <div className={styles.playerMeta}>
                          {p0.prizes} {t('GAMES_PRIZES')}
                        </div>
                      ) : null}
                    </div>
                    <span className={styles.vs}>VS</span>
                    <div className={styles.playerBlock} style={{ textAlign: 'right' }}>
                      <div className={styles.playerName}>
                        {u1 ? <Link to={`/profile/${u1.userId}`}>{u1.name}</Link> : '…'}
                      </div>
                      {p1 ? (
                        <div className={styles.playerMeta}>
                          {p1.prizes} {t('GAMES_PRIZES')}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.gameMeta}>
                    <span>
                      {t('GAMES_TURN')}: {game.turn}
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <ShellButtonLink variant="primary" to={`/table/${game.gameId}`}>
                      {t('BUTTON_JOIN')}
                    </ShellButtonLink>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-labelledby="spectate-recent-heading">
        <h2 id="spectate-recent-heading" className={styles.sectionTitle}>
          {t('GAMES_RECENT_GAMES_TITLE')}
        </h2>
        {matchesError ? <FormAlert>{matchesError}</FormAlert> : null}
        {matchesLoading && matches.length === 0 ? (
          <p className={styles.empty}>{t('RANKING_TABLE_LOADING')}</p>
        ) : matches.length === 0 && !matchesLoading ? (
          <p className={styles.empty}>{t('REACT_SPECTATE_NO_RECENT')}</p>
        ) : (
          <div className={styles.matchesGrid}>
            {matches.map((match) => {
              const u1 = matchUsers[match.player1Id];
              const u2 = matchUsers[match.player2Id];
              return (
                <article key={match.matchId} className={styles.matchCard}>
                  <div className={styles.matchCardHeader}>
                    <span>{formatDate(match.created)}</span>
                  </div>
                  <div className={styles.matchPlayers}>
                    <div
                      className={`${styles.playerBlock} ${
                        match.winner === GameWinner.PLAYER_1 ? styles.winner : ''
                      }`}
                    >
                      <div className={styles.playerName}>
                        {u1 ? <Link to={`/profile/${u1.userId}`}>{u1.name}</Link> : `#${match.player1Id}`}
                      </div>
                    </div>
                    <span className={styles.vs}>VS</span>
                    <div
                      className={`${styles.playerBlock} ${
                        match.winner === GameWinner.PLAYER_2 ? styles.winner : ''
                      }`}
                      style={{ textAlign: 'right' }}
                    >
                      <div className={styles.playerName}>
                        {u2 ? <Link to={`/profile/${u2.userId}`}>{u2.name}</Link> : `#${match.player2Id}`}
                      </div>
                    </div>
                  </div>
                  <div className={styles.playerMeta}>
                    {match.winner === GameWinner.DRAW
                      ? t('REACT_PROFILE_MATCH_DRAW')
                      : match.winner === GameWinner.NONE
                        ? '—'
                        : match.winner === GameWinner.PLAYER_1
                          ? u1?.name ?? `#${match.player1Id}`
                          : u2?.name ?? `#${match.player2Id}`}
                  </div>
                  <div className={styles.actions}>
                    <ShellButtonLink variant="primary" to={`/table/replay/${match.matchId}`}>
                      {t('BUTTON_REPLAY')}
                    </ShellButtonLink>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {matchesTotal > pageSize ? (
          <div className={styles.pagination}>
            <ShellButton
              type="button"
              variant="plain"
              disabled={pageIndex <= 0 || matchesLoading}
              onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
            >
              {t('RANKING_PREV_PAGE')}
            </ShellButton>
            <span className={styles.pageHint}>
              {t('RANKING_PAGE_OF', {
                current: pageIndex + 1,
                total: maxPage + 1 || 1,
              })}
            </span>
            <ShellButton
              type="button"
              variant="plain"
              disabled={pageIndex >= maxPage || matchesLoading}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              {t('RANKING_NEXT_PAGE')}
            </ShellButton>
          </div>
        ) : null}
      </section>
    </div>
  );
}
