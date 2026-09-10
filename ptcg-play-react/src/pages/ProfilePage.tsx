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
  const primary =
    playerId === match.player1Id ? match.player1Archetype : match.player2Archetype;
  const secondary =
    playerId === match.player1Id ? match.player1Archetype2 : match.player2Archetype2;
  const parts = [primary, secondary]
    .map((p) => (typeof p === 'string' ? p.trim() : ''))
    .filter((p) => p.length > 0 && p.toUpperCase() !== 'UNKNOWN');
  return parts.length > 0 ? parts.join('/') : 'unown';
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

type EmblemTone = 'sage' | 'gold' | 'slate' | 'copper' | 'sky' | 'crimson';

type ProfileEmblem = {
  id: string;
  titleKey: string;
  subtitleKey: string;
  tone: EmblemTone;
  mark: 'leaf' | 'crown' | 'shield' | 'star' | 'bolt' | 'ban';
};

function buildFeaturedEmblems(user: UserInfo): ProfileEmblem[] {
  const emblems: ProfileEmblem[] = [];

  if (user.rank === Rank.BANNED || user.roleId === 1) {
    emblems.push({
      id: 'banned',
      titleKey: 'REACT_PROFILE_EMBLEM_BANNED_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_BANNED_SUB',
      tone: 'crimson',
      mark: 'ban',
    });
  } else if (user.rank === Rank.MASTER) {
    emblems.push({
      id: 'rank-master',
      titleKey: 'REACT_PROFILE_EMBLEM_MASTER_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_RANK_SUB',
      tone: 'gold',
      mark: 'crown',
    });
  } else if (user.rank === Rank.ULTRA) {
    emblems.push({
      id: 'rank-ultra',
      titleKey: 'REACT_PROFILE_EMBLEM_ULTRA_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_RANK_SUB',
      tone: 'sky',
      mark: 'star',
    });
  } else if (user.rank === Rank.GREAT) {
    emblems.push({
      id: 'rank-great',
      titleKey: 'REACT_PROFILE_EMBLEM_GREAT_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_RANK_SUB',
      tone: 'sky',
      mark: 'shield',
    });
  } else {
    emblems.push({
      id: 'rank-poke',
      titleKey: 'REACT_PROFILE_EMBLEM_POKE_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_RANK_SUB',
      tone: 'sage',
      mark: 'leaf',
    });
  }

  if (user.roleId === 4) {
    emblems.push({
      id: 'role-admin',
      titleKey: 'REACT_PROFILE_EMBLEM_ADMIN_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_ROLE_SUB',
      tone: 'copper',
      mark: 'bolt',
    });
  } else if (user.roleId === 3) {
    emblems.push({
      id: 'role-mod',
      titleKey: 'REACT_PROFILE_EMBLEM_MOD_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_ROLE_SUB',
      tone: 'slate',
      mark: 'shield',
    });
  } else {
    emblems.push({
      id: 'role-trainer',
      titleKey: 'REACT_PROFILE_EMBLEM_TRAINER_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_ROLE_SUB',
      tone: 'sage',
      mark: 'leaf',
    });
  }

  if (user.ranking >= 2500) {
    emblems.push({
      id: 'standing-legend',
      titleKey: 'REACT_PROFILE_EMBLEM_LEGEND_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_STANDING_SUB',
      tone: 'gold',
      mark: 'crown',
    });
  } else if (user.ranking >= 1000) {
    emblems.push({
      id: 'standing-elite',
      titleKey: 'REACT_PROFILE_EMBLEM_ELITE_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_STANDING_SUB',
      tone: 'copper',
      mark: 'star',
    });
  } else if (user.ranking >= 250) {
    emblems.push({
      id: 'standing-contender',
      titleKey: 'REACT_PROFILE_EMBLEM_CONTENDER_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_STANDING_SUB',
      tone: 'sky',
      mark: 'bolt',
    });
  } else {
    emblems.push({
      id: 'standing-rookie',
      titleKey: 'REACT_PROFILE_EMBLEM_ROOKIE_TITLE',
      subtitleKey: 'REACT_PROFILE_EMBLEM_STANDING_SUB',
      tone: 'sage',
      mark: 'leaf',
    });
  }

  return emblems.slice(0, 3);
}

function EmblemMark({ mark }: { mark: ProfileEmblem['mark'] }) {
  switch (mark) {
    case 'crown':
      return (
        <path
          d="M18 34h44l-4-18-10 8-8-14-8 14-10-8-4 18zm4 6h36v6H22v-6z"
          fill="currentColor"
        />
      );
    case 'shield':
      return (
        <path
          d="M40 14l22 8v14c0 14-10 24-22 28-12-4-22-14-22-28V22l22-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );
    case 'star':
      return (
        <path
          d="M40 16l6.2 12.6 13.8 2-10 9.8 2.4 13.8L40 47.6 27.6 54.2l2.4-13.8-10-9.8 13.8-2L40 16z"
          fill="currentColor"
        />
      );
    case 'bolt':
      return <path d="M44 14L28 40h12l-4 18 20-28H44l4-16z" fill="currentColor" />;
    case 'ban':
      return (
        <>
          <circle cx="40" cy="36" r="16" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M28 48L52 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'leaf':
    default:
      return (
        <path
          d="M40 14c14 8 22 20 22 34-12 0-22-4-28-12 2 10 8 16 18 20-18-2-28-14-28-30 10-2 16-6 16-12z"
          fill="currentColor"
        />
      );
  }
}

function FeaturedEmblem({ emblem }: { emblem: ProfileEmblem }) {
  const { t } = useTranslation();
  const toneClass =
    emblem.tone === 'gold'
      ? styles.emblemGold
      : emblem.tone === 'slate'
        ? styles.emblemSlate
        : emblem.tone === 'copper'
          ? styles.emblemCopper
          : emblem.tone === 'sky'
            ? styles.emblemSky
            : emblem.tone === 'crimson'
              ? styles.emblemCrimson
              : styles.emblemSage;

  return (
    <li className={`${styles.emblem} ${toneClass}`}>
      <div className={styles.emblemMedal} aria-hidden>
        <svg className={styles.emblemSvg} viewBox="0 0 80 72" role="presentation">
          <defs>
            <linearGradient id={`rim-${emblem.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--emblem-rim-hi)" />
              <stop offset="55%" stopColor="var(--emblem-rim)" />
              <stop offset="100%" stopColor="var(--emblem-rim-lo)" />
            </linearGradient>
          </defs>
          <polygon
            points="40,4 72,22 72,50 40,68 8,50 8,22"
            fill={`url(#rim-${emblem.id})`}
            className={styles.emblemRim}
          />
          <polygon points="40,12 64,26 64,46 40,60 16,46 16,26" className={styles.emblemFace} />
          <g className={styles.emblemMark}>
            <EmblemMark mark={emblem.mark} />
          </g>
        </svg>
      </div>
      <div className={styles.emblemCopy}>
        <span className={styles.emblemTitle}>{t(emblem.titleKey)}</span>
        <span className={styles.emblemSub}>{t(emblem.subtitleKey)}</span>
      </div>
    </li>
  );
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

  const formatJoined = useCallback(
    (ms: number) => {
      try {
        return new Intl.DateTimeFormat(i18n.language, { month: 'short', year: 'numeric' }).format(new Date(ms));
      } catch {
        return new Date(ms).getFullYear().toString();
      }
    },
    [i18n.language],
  );

  const featuredEmblems = useMemo(
    () => (profileUser ? buildFeaturedEmblems(profileUser) : []),
    [profileUser],
  );

  if (profileUserId === null) {
    return null;
  }

  if (profileLoading || !profileUser) {
    return (
      <div className={styles.page}>
      <div className={styles.ambience} aria-hidden>
        <div className={styles.spotlight} />
      </div>
      <div className={styles.loading}>{t('REACT_PROFILE_PAGE_LOADING')}</div>
      </div>
    );
  }

  const avatarSrc = resolveAvatarUrl(profileUser.avatarFile, serverConfig);
  const ringExtra = rankRingModifier(profileUser.rank);

  return (
    <div className={styles.page}>
      <div className={styles.ambience} aria-hidden>
        <div className={styles.spotlight} />
      </div>

      <div className={styles.scroll}>
        <div className={styles.banner} aria-hidden>
          <div className={styles.bannerStripes} />
          <div className={styles.bannerSheen} />
        </div>

        <div className={styles.surface}>
          {profileError ? <FormAlert>{profileError}</FormAlert> : null}

          <header className={styles.identityStack}>
            <div className={`${styles.avatarRing} ${ringExtra}`.trim()}>
              {avatarSrc ? (
                <img className={styles.avatarImg} src={avatarSrc} alt="" width={128} height={128} />
              ) : (
                <div className={styles.avatarImgPlaceholder} aria-hidden />
              )}
            </div>

            <p className={styles.rankLine}>
              {t('REACT_PROFILE_RANK_LINE', {
                tier: profileUser.rank,
                points: profileUser.ranking,
              })}
            </p>

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

            <p className={styles.joinedLine}>
              {t('REACT_PROFILE_JOINED', { date: formatJoined(profileUser.registered) })}
              {profileUser.connected ? (
                <span className={styles.onlineDot} title={t('REACT_PROFILE_ONLINE')}>
                  {t('REACT_PROFILE_ONLINE')}
                </span>
              ) : null}
            </p>

            {(!isOwner && sessionUser) || (isAdmin && !isOwner) ? (
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
                        ? { borderColor: 'rgba(220, 38, 38, 0.55)', color: '#f87171' }
                        : undefined
                    }
                  >
                    {t(isBanned ? 'PROFILE_UNBAN_USER' : 'PROFILE_BAN_USER')}
                  </ShellButton>
                ) : null}
              </div>
            ) : null}
          </header>

          <section className={styles.emblemsSection} aria-labelledby="profile-emblems-heading">
            <div className={styles.emblemsHeading}>
              <span className={styles.emblemsRule} aria-hidden />
              <h2 id="profile-emblems-heading" className={styles.emblemsTitle}>
                {t('REACT_PROFILE_EMBLEMS_TITLE')}
              </h2>
              <span className={styles.emblemsRule} aria-hidden />
            </div>

            <div className={styles.emblemGallery}>
              <ul className={styles.emblemRow}>
                {featuredEmblems.map((emblem) => (
                  <FeaturedEmblem key={emblem.id} emblem={emblem} />
                ))}
              </ul>
              <div className={styles.emblemShelf} aria-hidden />
            </div>
            <p className={styles.emblemsCaption}>{t('REACT_PROFILE_EMBLEMS_FEATURED')}</p>
          </section>

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
                              compact
                            />
                          </div>
                          <span className={styles.vs}>VS</span>
                          <div className={styles.playerMini}>
                            <ArchetypeIcon
                              archetypes={matchupArchetypesFromLabel(oppArchetype)}
                              compact
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
                        <ShellButtonLink
                          variant="plain"
                          to={`/table/replay/${match.matchId}`}
                          className={styles.replayLink}
                        >
                          {t('BUTTON_REPLAY')}
                        </ShellButtonLink>
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
                  className={styles.pageBtn}
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
                  className={styles.pageBtn}
                >
                  {t('RANKING_NEXT_PAGE')}
                </ShellButton>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
