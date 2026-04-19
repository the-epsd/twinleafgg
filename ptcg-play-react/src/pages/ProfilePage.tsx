import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GameWinner, Rank, type MatchInfo, type UserInfo } from 'ptcg-server';
import { getMatchHistory, getProfileById, updateUserRole } from '../api/profileApi';
import { ApiError } from '../api/apiError';
import { useAuth } from '../context/AuthContext';
import { appConfig } from '../env/config';
import { ArchetypeIcon } from '../games/ArchetypeIcon';
import { matchupArchetypesFromLabel } from '../games/matchupArchetypeFromLabel';
import { resolveAvatarUrl } from '../utils/avatarUrl';
import { ShellButton } from '../components/ui/ShellButton';
import { ShellButtonLink } from '../components/ui/ShellButtonLink';
import { FormAlert } from '../components/ui/FormAlert';
import styles from './ProfilePage.module.css';

function parseUserId(raw: string | undefined): number | null {
  if (raw === undefined || raw === '') {
    return null;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function rankRingModifier(rank: Rank): string {
  switch (rank) {
    case Rank.BANNED:
      return styles.avatarRingBanned;
    case Rank.MASTER:
      return styles.avatarRingMaster;
    case Rank.ULTRA:
      return styles.avatarRingUltra;
    case Rank.GREAT:
      return styles.avatarRingGreat;
    case Rank.POKE:
      return styles.avatarRingPoke;
    case Rank.ADMIN:
      return styles.avatarRingAdmin;
    default:
      return '';
  }
}

function matchOutcomeForProfile(profileId: number, match: MatchInfo): 'win' | 'loss' | 'draw' {
  if (match.winner === GameWinner.DRAW) {
    return 'draw';
  }
  if (match.winner === GameWinner.NONE) {
    return 'loss';
  }
  if (profileId === match.player1Id) {
    return match.winner === GameWinner.PLAYER_1 ? 'win' : 'loss';
  }
  return match.winner === GameWinner.PLAYER_2 ? 'win' : 'loss';
}

function opponentForProfile(profileId: number, match: MatchInfo): number {
  return profileId === match.player1Id ? match.player2Id : match.player1Id;
}

function archetypeLabelForPlayer(match: MatchInfo, playerId: number): string {
  if (playerId === match.player1Id) {
    return match.player1Archetype ?? 'unown';
  }
  return match.player2Archetype ?? 'unown';
}

function deckNameForPlayer(match: MatchInfo, playerId: number): string | undefined {
  if (playerId === match.player1Id) {
    return match.player1DeckName;
  }
  return match.player2DeckName;
}

function mergeUsers(into: Record<number, UserInfo>, list: UserInfo[]): Record<number, UserInfo> {
  const next = { ...into };
  for (const u of list) {
    next[u.userId] = u;
  }
  return next;
}

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams<{ userId: string }>();
  const { user: sessionUser, serverConfig } = useAuth();

  const profileUserId = useMemo(() => parseUserId(userIdParam), [userIdParam]);

  const [profileUser, setProfileUser] = useState<UserInfo | null>(null);
  const [userMap, setUserMap] = useState<Record<number, UserInfo>>({});
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [matchesTotal, setMatchesTotal] = useState(0);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [banBusy, setBanBusy] = useState(false);

  const pageSize = appConfig.defaultPageSize;
  const maxPage = Math.max(0, Math.ceil(matchesTotal / pageSize) - 1);

  useEffect(() => {
    if (profileUserId === null) {
      navigate('/games', { replace: true });
      return;
    }

    let cancelled = false;
    setProfileLoading(true);
    setProfileError(null);

    void (async () => {
      try {
        const res = await getProfileById(profileUserId);
        if (cancelled) {
          return;
        }
        setProfileUser(res.user);
        setUserMap((m) => ({ ...m, [res.user.userId]: res.user }));
      } catch (e) {
        if (cancelled) {
          return;
        }
        setProfileError(e instanceof ApiError ? e.message : t('PROFILE_LOADING_ERROR'));
        navigate('/games', { replace: true });
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileUserId, navigate, t]);

  useEffect(() => {
    if (profileUserId === null) {
      return;
    }
    let cancelled = false;
    setMatchesLoading(true);
    setMatchesError(null);

    void (async () => {
      try {
        const res = await getMatchHistory(profileUserId, pageIndex);
        if (cancelled) {
          return;
        }
        setMatches(res.matches);
        setMatchesTotal(res.total);
        setUserMap((m) => mergeUsers(m, res.users));
      } catch (e) {
        if (cancelled) {
          return;
        }
        setMatchesError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
      } finally {
        if (!cancelled) {
          setMatchesLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileUserId, pageIndex, t]);

  const isOwner = sessionUser != null && profileUserId === sessionUser.userId;
  const isAdmin = sessionUser?.roleId === 4;
  const isBanned = profileUser?.roleId === 1;

  const onBanToggle = useCallback(async () => {
    if (profileUserId === null || !profileUser || !isAdmin) {
      return;
    }
    setBanBusy(true);
    try {
      const newRoleId = isBanned ? 2 : 1;
      await updateUserRole(profileUserId, newRoleId);
      const refreshed = await getProfileById(profileUserId);
      setProfileUser(refreshed.user);
      setUserMap((m) => ({ ...m, [refreshed.user.userId]: refreshed.user }));
    } catch (e) {
      setProfileError(e instanceof ApiError ? e.message : t(isBanned ? 'PROFILE_UNBAN_ERROR' : 'PROFILE_BAN_ERROR'));
    } finally {
      setBanBusy(false);
    }
  }, [profileUserId, profileUser, isAdmin, isBanned, t]);

  const formatDate = useCallback(
    (ms: number) => {
      try {
        return new Intl.DateTimeFormat(i18n.language, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(ms));
      } catch {
        return new Date(ms).toISOString();
      }
    },
    [i18n.language],
  );

  if (profileUserId === null) {
    return null;
  }

  if (profileLoading || !profileUser) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>{t('REACT_PROFILE_PAGE_LOADING')}</div>
      </div>
    );
  }

  const avatarSrc = resolveAvatarUrl(profileUser.avatarFile, serverConfig);
  const ringExtra = rankRingModifier(profileUser.rank);

  return (
    <div className={styles.page}>
      {profileError ? <FormAlert>{profileError}</FormAlert> : null}

      <div className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden />
      </div>

      <div className={styles.cardWrap}>
        <div className={styles.card}>
          <div className={styles.avatarBlock}>
            <div className={`${styles.avatarRing} ${ringExtra}`.trim()}>
              {avatarSrc ? (
                <img className={styles.avatarImg} src={avatarSrc} alt="" width={112} height={112} />
              ) : (
                <div className={styles.avatarImgPlaceholder} aria-hidden />
              )}
            </div>
            <div className={styles.identity}>
              <div className={styles.nameRow}>
                <h1 className={styles.userName}>{profileUser.name}</h1>
                <div className={styles.badges}>
                  {profileUser.roleId === 4 ? (
                    <span className={`${styles.badge} ${styles.badgeAdmin}`}>ADMIN</span>
                  ) : null}
                  {profileUser.roleId === 3 ? (
                    <span className={`${styles.badge} ${styles.badgeMod}`}>MOD</span>
                  ) : null}
                  {profileUser.rank === Rank.BANNED || profileUser.roleId === 1 ? (
                    <span className={`${styles.badge} ${styles.badgeBanned}`}>BANNED</span>
                  ) : null}
                </div>
              </div>
              <p className={styles.metaLine}>
                {t('REACT_PROFILE_RANK_LINE', {
                  tier: profileUser.rank,
                  points: profileUser.ranking,
                })}
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            {!isOwner && sessionUser ? (
              <ShellButtonLink variant="secondary" to={`/message/${profileUserId}`}>
                {t('BUTTON_SEND_MESSAGE')}
              </ShellButtonLink>
            ) : null}
            {isAdmin && !isOwner ? (
              <ShellButton
                variant="secondary"
                type="button"
                disabled={banBusy}
                onClick={() => void onBanToggle()}
                style={
                  !isBanned
                    ? { borderColor: 'rgba(185, 28, 28, 0.45)', color: '#b91c1c' }
                    : undefined
                }
              >
                {t(isBanned ? 'PROFILE_UNBAN_USER' : 'PROFILE_BAN_USER')}
              </ShellButton>
            ) : null}
            <ShellButtonLink variant="plain" to="/games">
              {t('REACT_PROFILE_BACK_LOBBY')}
            </ShellButtonLink>
          </div>
        </div>
      </div>

      <section className={styles.section} aria-labelledby="profile-matches-heading">
        <h2 id="profile-matches-heading" className={styles.sectionTitle}>
          {t('GAMES_RECENT_GAMES_TITLE')}
        </h2>
        {matchesError ? <FormAlert>{matchesError}</FormAlert> : null}
        {matchesLoading && matches.length === 0 ? (
          <div className={styles.loading}>{t('RANKING_TABLE_LOADING')}</div>
        ) : matches.length === 0 && !matchesLoading ? (
          <p className={styles.empty}>{t('REACT_PROFILE_MATCHES_EMPTY')}</p>
        ) : (
          <div className={styles.timeline}>
            {matches.map((match) => {
              const oppId = opponentForProfile(profileUserId, match);
              const opp = userMap[oppId];
              const outcome = matchOutcomeForProfile(profileUserId, match);
              const oppArchetype = archetypeLabelForPlayer(match, oppId);
              const selfArchetype = archetypeLabelForPlayer(match, profileUserId);
              const oppAvatar = resolveAvatarUrl(opp?.avatarFile, serverConfig);
              const selfAvatar = resolveAvatarUrl(profileUser.avatarFile, serverConfig);
              const oppDeck = deckNameForPlayer(match, oppId);
              const selfDeck = deckNameForPlayer(match, profileUserId);

              return (
                <article key={match.matchId} className={styles.timelineItem}>
                  <div className={styles.dateCol}>{formatDate(match.created)}</div>
                  <div className={styles.vsBlock}>
                    <div className={styles.vsRow}>
                      <div className={styles.playerMini}>
                        {selfAvatar ? (
                          <img className={styles.miniAvatar} src={selfAvatar} alt="" width={32} height={32} />
                        ) : (
                          <div className={styles.miniAvatar} aria-hidden />
                        )}
                        <span className={styles.selfName}>{profileUser.name}</span>
                        <ArchetypeIcon
                          archetypes={matchupArchetypesFromLabel(selfArchetype)}
                          scale={0.85}
                          className={styles.archetypeMini}
                        />
                      </div>
                      <span className={styles.vs}>VS</span>
                      <div className={styles.playerMini}>
                        <ArchetypeIcon
                          archetypes={matchupArchetypesFromLabel(oppArchetype)}
                          scale={0.85}
                          className={styles.archetypeMini}
                        />
                        {opp ? (
                          <Link className={styles.playerLink} to={`/profile/${opp.userId}`}>
                            {opp.name}
                          </Link>
                        ) : (
                          <span className={styles.selfName}>…</span>
                        )}
                        {oppAvatar ? (
                          <img className={styles.miniAvatar} src={oppAvatar} alt="" width={32} height={32} />
                        ) : (
                          <div className={styles.miniAvatar} aria-hidden />
                        )}
                      </div>
                    </div>
                    {(selfDeck || oppDeck) && (
                      <p className={styles.deckHint}>
                        {[selfDeck, oppDeck].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className={styles.outcomeCol}>
                    <span
                      className={`${styles.pill} ${
                        outcome === 'win'
                          ? styles.pillWin
                          : outcome === 'draw'
                            ? styles.pillDraw
                            : styles.pillLoss
                      }`}
                    >
                      {outcome === 'win'
                        ? t('REACT_PROFILE_MATCH_WIN')
                        : outcome === 'draw'
                          ? t('REACT_PROFILE_MATCH_DRAW')
                          : t('REACT_PROFILE_MATCH_LOSS')}
                    </span>
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
