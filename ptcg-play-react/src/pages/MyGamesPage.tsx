import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Format, type GameInfo, type UserInfo } from 'ptcg-server';
import { useAuth } from '../context/AuthContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSnackbar } from '../context/SnackbarContext';
import { ApiError } from '../api/apiError';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import { formatOptionLabel } from '../deck-editor/formatLabelI18n';
import { OnlinePlayersSidebar } from '../games/OnlinePlayersSidebar';
import { opponentPlayerIndex, partitionMyGames } from '../games/myGamesClassify';
import { declineGameInvite } from '../games/myGamesActions';
import styles from './MyGamesPage.module.css';

function resolveOpponentUser(
  game: GameInfo,
  clientId: number,
  userId: number,
  clients: { clientId: number; userId: number }[],
  usersById: Record<number, UserInfo>,
): { name: string; user?: UserInfo; online: boolean } {
  const oppIndex = opponentPlayerIndex(game, clientId, userId);
  const player = game.players[oppIndex];
  const uid = game.playerUserIds?.[oppIndex];
  const client = player ? clients.find((c) => c.clientId === player.clientId) : undefined;
  const user =
    (client && usersById[client.userId]) ||
    (uid != null ? usersById[uid] : undefined);
  const online = client != null || (uid != null && clients.some((c) => c.userId === uid));
  return {
    name: user?.name ?? player?.name ?? '…',
    user,
    online,
  };
}

type ChallengeCardProps = {
  game: GameInfo;
  clientId: number;
  myUserId: number;
  busy: boolean;
  onAccept: () => void;
  onDecline: () => void;
};

function ChallengeCard({
  game,
  clientId,
  myUserId,
  busy,
  onAccept,
  onDecline,
}: ChallengeCardProps) {
  const { t } = useTranslation();
  const { serverConfig } = useAuth();
  const { clients, usersById } = useCoreSession();
  const opp = resolveOpponentUser(game, clientId, myUserId, clients, usersById);
  const avatarUrl = resolveAvatarUrl(opp.user?.avatarFile, serverConfig);
  const format = game.format ?? Format.STANDARD;

  return (
    <article className={`${styles.challenge} ${styles.challengeIncoming}`}>
      <div className={styles.challengeGlow} aria-hidden />
      <div className={styles.challengeInner}>
        <div className={styles.challengeTop}>
          <span className={`${styles.directionPill} ${styles.pillIn}`}>
            {t('REACT_MY_GAMES_PILL_INCOMING')}
          </span>
          <span className={styles.formatRibbon}>{formatOptionLabel(t, format)}</span>
        </div>

        <div className={styles.challengeBody}>
          <div className={styles.avatarStage}>
            {avatarUrl ? (
              <img className={styles.challengeAvatar} src={avatarUrl} alt="" width={72} height={72} />
            ) : (
              <div className={styles.challengeAvatarFallback} aria-hidden>
                {(opp.name[0] ?? '?').toUpperCase()}
              </div>
            )}
            <span
              className={`${styles.presence} ${opp.online ? styles.presenceOn : ''}`}
              title={opp.online ? t('REACT_FRIENDS_ONLINE') : t('REACT_FRIENDS_OFFLINE')}
            />
          </div>

          <div className={styles.challengeCopy}>
            <p className={styles.challengeEyebrow}>{t('REACT_MY_GAMES_CHALLENGE_FROM')}</p>
            {opp.user ? (
              <Link className={styles.challengeName} to={`/profile/${opp.user.userId}`}>
                {opp.name}
              </Link>
            ) : (
              <span className={styles.challengeName}>{opp.name}</span>
            )}
            <p className={styles.challengeMeta}>
              #{game.gameId}
              <span aria-hidden> · </span>
              {opp.online ? t('REACT_FRIENDS_ONLINE') : t('REACT_FRIENDS_OFFLINE')}
            </p>
          </div>
        </div>

        <div className={styles.challengeActions}>
          <button
            type="button"
            className={styles.btnGhost}
            disabled={busy}
            onClick={onDecline}
          >
            {t('REACT_MY_GAMES_DECLINE')}
          </button>
          <button
            type="button"
            className={styles.btnPlay}
            disabled={busy}
            onClick={onAccept}
          >
            {t('REACT_MY_GAMES_ACCEPT')}
          </button>
        </div>
      </div>
    </article>
  );
}

export function MyGamesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { games, clientId, connected, error: socketError } = useCoreSession();
  const { showSnackbar } = useSnackbar();

  const myUserId = user?.userId ?? 0;
  const incoming = useMemo(
    () => partitionMyGames(games, clientId, myUserId).incoming,
    [games, clientId, myUserId],
  );

  const [busyGameId, setBusyGameId] = useState<number | null>(null);

  const onDecline = useCallback(
    async (gameId: number) => {
      if (!window.confirm(t('REACT_MY_GAMES_DECLINE_CONFIRM'))) {
        return;
      }
      setBusyGameId(gameId);
      try {
        await declineGameInvite(gameId);
        showSnackbar(t('REACT_MY_GAMES_DECLINED_OK'));
      } catch (e) {
        showSnackbar(e instanceof ApiError ? e.message : t('REACT_MY_GAMES_ACTION_FAILED'), {
          variant: 'error',
        });
      } finally {
        setBusyGameId(null);
      }
    },
    [showSnackbar, t],
  );

  return (
    <div className={styles.screen}>
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.dots} aria-hidden />

      <div className={styles.layout}>
        <div className={styles.main}>
          <header className={styles.hero}>
            <h1 className={styles.title}>{t('MAIN_MY_GAMES')}</h1>
            {!connected ? (
              <p className={styles.alert}>
                {socketError
                  ? t('REACT_SOCKET_PREFIX', { message: socketError })
                  : t('REACT_CONNECTING')}
              </p>
            ) : null}
          </header>

          {incoming.length === 0 ? (
            <div className={styles.emptyPanel}>
              <div className={styles.emptySunburst} aria-hidden />
              <div className={styles.emptyInner}>
                <h2 className={styles.emptyTitle}>{t('REACT_MY_GAMES_EMPTY_ALL_TITLE')}</h2>
                <p className={styles.emptyBody}>{t('REACT_MY_GAMES_EMPTY_ALL_BODY')}</p>
                <Link className={styles.emptyCta} to="/games">
                  {t('REACT_MY_GAMES_EMPTY_CTA')}
                </Link>
              </div>
            </div>
          ) : (
            <section className={styles.incomingSection} aria-labelledby="my-games-incoming">
              <div className={styles.columnHead}>
                <h2 id="my-games-incoming" className={styles.columnTitle}>
                  {t('REACT_MY_GAMES_SECTION_INCOMING')}
                </h2>
                <span className={`${styles.columnCount} ${styles.columnCountHot}`}>
                  {incoming.length}
                </span>
              </div>
              <div className={styles.challengeStack}>
                {incoming.map((game) => (
                  <ChallengeCard
                    key={game.gameId}
                    game={game}
                    clientId={clientId}
                    myUserId={myUserId}
                    busy={busyGameId === game.gameId}
                    onAccept={() => navigate(`/table/${game.gameId}`)}
                    onDecline={() => void onDecline(game.gameId)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.playersMount} aria-label={t('REACT_SIDEBAR_FRIENDS_AND_ONLINE')}>
          <div className={styles.playersShellStroke}>
            <div className={styles.playersGlassPanel} aria-hidden />
            <div className={styles.playersGlassTab} aria-hidden />
            <svg
              className={styles.playersTabEdge}
              viewBox="0 0 36 44"
              width="36"
              height="44"
              fill="none"
              aria-hidden
            >
              {/* Tab left contour: diagonals + bottom join (no top edge) */}
              <path
                d="M11 0.5 L0.5 11 V33 L11 43.5 H35.5"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinejoin="miter"
                strokeLinecap="square"
              />
            </svg>
            <span className={styles.playersPanelEdge} aria-hidden />
            <div className={styles.playersShell}>
              <div className={styles.playersTab} aria-hidden>
                <svg className={styles.playersTabIcon} viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div className={styles.playersPanel}>
                <div className={styles.playersMenuTitle}>
                  <span className={styles.playersMenuIcon} aria-hidden>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                    </svg>
                  </span>
                  <span>{t('REACT_MY_GAMES_PLAYERS_MENU')}</span>
                </div>
                <OnlinePlayersSidebar appearance="arena" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
