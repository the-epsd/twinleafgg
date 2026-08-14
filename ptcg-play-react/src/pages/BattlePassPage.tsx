import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BattlePassProgress, BattlePassReward, BattlePassSeason } from '../types/battlePass';
import {
  addBattlePassDebugExp,
  claimBattlePassReward,
  getBattlePassActiveSeason,
  getBattlePassCurrent,
  getBattlePassProgress,
  getBattlePassSeason,
  getBattlePassSeasons,
  setBattlePassActiveSeason,
} from '../api/battlePassApi';
import { useAuth } from '../context/AuthContext';
import { SelectField } from '../components/ui/SelectField';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ApiError } from '../api/apiError';
import { cn } from '../utils/cn';
import { playSfx } from '../sfx';
import styles from './BattlePassPage.module.css';

const MIN_LOADING_MS = 480;

interface BattlePassLevelRow {
  level: number;
  freeReward?: BattlePassReward;
}

function groupRewardsByLevel(rewards: BattlePassReward[]): BattlePassLevelRow[] {
  const levelMap = new Map<number, BattlePassLevelRow>();
  for (const reward of rewards) {
    if (reward?.isPremium) {
      continue;
    }
    if (!levelMap.has(reward.level)) {
      levelMap.set(reward.level, { level: reward.level });
    }
    const row = levelMap.get(reward.level)!;
    row.freeReward = reward;
  }
  return Array.from(levelMap.values()).sort((a, b) => a.level - b.level);
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function BattlePassPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.roleId === 4;
  const trackRef = useRef<HTMLDivElement>(null);
  const loadStartedAt = useRef(Date.now());

  const [season, setSeason] = useState<BattlePassSeason | undefined>();
  const [progress, setProgress] = useState<BattlePassProgress | undefined>();
  const [levels, setLevels] = useState<BattlePassLevelRow[]>([]);
  const [seasons, setSeasons] = useState<Array<{ seasonId: string; name: string; startDate: string }>>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [xpFillReady, setXpFillReady] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [switchingSeason, setSwitchingSeason] = useState(false);
  const [noSeasonsAvailable, setNoSeasonsAvailable] = useState(false);
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSeasonData = useCallback(async (seasonId: string) => {
    const [seasonData, progressData] = await Promise.all([
      getBattlePassSeason(seasonId),
      getBattlePassProgress(seasonId),
    ]);
    setSeason(seasonData.season);
    setProgress(progressData.progress);
    setLevels(groupRewardsByLevel(seasonData.season.rewards));
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadStartedAt.current = Date.now();
    async function init() {
      setLoading(true);
      setShowLoader(true);
      setRevealed(false);
      setXpFillReady(false);
      setError(null);
      try {
        const seasonsRes = await getBattlePassSeasons();
        if (cancelled) {
          return;
        }
        setSeasons(seasonsRes.seasons);
        if (seasonsRes.seasons.length === 0) {
          setNoSeasonsAvailable(true);
          setSeason(undefined);
          setProgress(undefined);
          setLevels([]);
          return;
        }
        const defaultId = seasonsRes.seasons[0]?.seasonId ?? '';
        let savedId: string | null = null;
        try {
          const active = await getBattlePassActiveSeason();
          savedId = active.seasonId ?? null;
        } catch {
          savedId = null;
        }
        const isValidSaved = savedId && seasonsRes.seasons.some((s) => s.seasonId === savedId);
        let pick = defaultId;
        if (isValidSaved) {
          pick = savedId!;
          setSelectedSeasonId(pick);
        } else {
          try {
            const current = await getBattlePassCurrent();
            pick = current.season.seasonId || defaultId;
          } catch {
            pick = defaultId;
          }
          setSelectedSeasonId(pick);
        }
        await loadSeasonData(pick);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_FAILED_LOAD'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, [loadSeasonData, t]);

  useEffect(() => {
    if (loading) {
      return;
    }
    const elapsed = Date.now() - loadStartedAt.current;
    const wait = prefersReducedMotion() ? 0 : Math.max(0, MIN_LOADING_MS - elapsed);
    const revealTimer = window.setTimeout(() => {
      setShowLoader(false);
      setRevealed(true);
      setContentKey((k) => k + 1);
    }, wait);
    return () => window.clearTimeout(revealTimer);
  }, [loading]);

  useEffect(() => {
    if (!revealed) {
      setXpFillReady(false);
      return;
    }
    if (prefersReducedMotion()) {
      setXpFillReady(true);
      return;
    }
    setXpFillReady(false);
    const timer = window.setTimeout(() => setXpFillReady(true), 220);
    return () => window.clearTimeout(timer);
  }, [revealed, contentKey]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !revealed) {
      return;
    }
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }
      el.scrollLeft += event.deltaY;
      event.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [revealed, season, levels.length, contentKey]);

  async function onSeasonChange(nextId: string) {
    if (!nextId || nextId === selectedSeasonId) {
      return;
    }
    setSelectedSeasonId(nextId);
    setSwitchingSeason(true);
    setXpFillReady(false);
    setError(null);
    try {
      await setBattlePassActiveSeason(nextId);
      await loadSeasonData(nextId);
      setContentKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_FAILED_SWITCH'));
    } finally {
      setSwitchingSeason(false);
    }
  }

  function isClaimable(level: number): boolean {
    if (!progress) {
      return false;
    }
    const reached = progress.level >= level;
    const claimed = progress.claimedRewards.includes(level);
    return reached && !claimed;
  }

  async function claim(level: number) {
    if (!selectedSeasonId || claimingLevel !== null || !progress || progress.claimedRewards.includes(level)) {
      return;
    }
    setClaimingLevel(level);
    setError(null);
    playSfx('uiButton');
    try {
      await claimBattlePassReward(level, selectedSeasonId);
      setProgress((p) =>
        p
          ? {
              ...p,
              claimedRewards: [...p.claimedRewards, level],
            }
          : p
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_CLAIM_FAILED'));
    } finally {
      setClaimingLevel(null);
    }
  }

  function displayLevel(): number {
    if (!progress) {
      return 1;
    }
    const lv = progress.level;
    return typeof lv === 'number' && !Number.isNaN(lv) ? lv : 1;
  }

  function getCurrentLevelExp(): number {
    if (!progress) {
      return 0;
    }
    const exp = (progress.exp ?? 0) - (progress.totalXpForCurrentLevel ?? 0);
    return Number.isNaN(exp) ? 0 : exp;
  }

  function getTotalLevelExp(): number {
    if (!progress) {
      return 0;
    }
    const xp = progress.nextLevelXp ?? 0;
    return Number.isNaN(xp) ? 0 : xp;
  }

  function expPercentage(): number {
    const cur = getCurrentLevelExp();
    const tot = getTotalLevelExp();
    if (tot <= 0 || Number.isNaN(tot)) {
      return 0;
    }
    const pct = (cur / tot) * 100;
    return Number.isNaN(pct) ? 0 : Math.min(100, pct);
  }

  async function onDebugExp() {
    setError(null);
    try {
      await addBattlePassDebugExp(100, selectedSeasonId || undefined);
      const pr = await getBattlePassProgress(selectedSeasonId || undefined);
      setProgress(pr.progress);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_DEBUG_FAILED'));
    }
  }

  const empty = !loading && !season;
  const hasContent = !!season;

  return (
    <div className={styles.screen}>
      <div className={styles.cornerTL} aria-hidden />
      <div className={styles.cornerBR} aria-hidden />
      <div className={styles.dots} aria-hidden />

      <div
        className={cn(
          styles.loaderOverlay,
          !showLoader && styles.loaderOverlayHidden,
        )}
        aria-hidden={!showLoader}
      >
        <div
          className={styles.loaderPanel}
          role="status"
          aria-live="polite"
          aria-busy={showLoader}
          aria-label={t('BATTLE_PASS_LOADING')}
        >
          <LoadingSpinner size={72} className={styles.loaderSpinner} />
          <p className={styles.loaderLabel}>{t('BATTLE_PASS_LOADING')}</p>
        </div>
      </div>

      {empty ? (
        <div className={cn(styles.centeredState, revealed && styles.revealed)}>
          <div className={styles.statePanel}>
            <h1 className={styles.stateTitle}>{t('BATTLE_PASS_TITLE')}</h1>
            <p className={styles.stateBody}>
              {noSeasonsAvailable ? t('BATTLE_PASS_NONE_SEASONS') : t('BATTLE_PASS_NONE_ACTIVE')}
            </p>
            {error ? <p className={styles.alert}>{error}</p> : null}
          </div>
        </div>
      ) : null}

      {hasContent ? (
        <div
          key={contentKey}
          className={cn(
            styles.container,
            revealed && styles.revealed,
            switchingSeason && styles.containerSwitching,
          )}
        >
          {switchingSeason ? (
            <div className={styles.switchingOverlay} aria-hidden>
              <div className={styles.switchingSpinner} />
            </div>
          ) : null}

          <header className={styles.header}>
            <div className={styles.headerBg}>
              <div className={styles.headerContent}>
                <div className={cn(styles.logoBlock, styles.enterItem)} style={{ ['--enter-delay' as string]: '0ms' }}>
                  <p className={styles.logoEyebrow}>Twinleaf</p>
                  <h1 className={styles.logoTitle}>{season?.name ?? t('BATTLE_PASS_TITLE')}</h1>
                </div>

                {season && progress ? (
                  <div
                    className={cn(styles.levelProgress, styles.enterItem)}
                    style={{ ['--enter-delay' as string]: '80ms' }}
                  >
                    <div className={styles.levelDisplay}>
                      <div className={styles.levelNumber}>{displayLevel()}</div>
                      <div className={styles.xpBadge}>
                        <span>{getCurrentLevelExp()}</span>
                        <span className={styles.xpSep}>/</span>
                        <span>{getTotalLevelExp()}</span>
                      </div>
                    </div>
                    <div
                      className={styles.xpBar}
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(expPercentage())}
                      aria-label={t('BATTLE_PASS_XP_IN_LEVEL', {
                        current: getCurrentLevelExp(),
                        total: getTotalLevelExp(),
                      })}
                    >
                      <div
                        className={styles.xpFill}
                        style={{ width: `${xpFillReady ? expPercentage() : 0}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <div
                  className={cn(styles.statusRow, styles.enterItem)}
                  style={{ ['--enter-delay' as string]: '150ms' }}
                >
                  <div className={styles.statusBadge}>{t('BATTLE_PASS_TITLE')}</div>
                  {seasons.length > 1 ? (
                    <SelectField
                      className={styles.seasonSelect}
                      value={selectedSeasonId}
                      onChange={(e) => void onSeasonChange(e.target.value)}
                      disabled={switchingSeason || showLoader}
                      aria-label={t('BATTLE_PASS_SEASON_LABEL')}
                    >
                      {seasons.map((s) => (
                        <option key={s.seasonId} value={s.seasonId}>
                          {s.name}
                        </option>
                      ))}
                    </SelectField>
                  ) : null}
                  {season ? (
                    <div className={styles.started}>
                      <span className={styles.startedLabel}>Started:</span>
                      <span className={styles.startedValue}>{season.startDate}</span>
                    </div>
                  ) : null}
                  {isAdmin ? (
                    <button type="button" className={styles.debugBtn} onClick={() => void onDebugExp()}>
                      {t('BATTLE_PASS_DEBUG_XP')}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          {error ? <p className={styles.alert}>{error}</p> : null}

          <section className={styles.trackSection} aria-label={t('BATTLE_PASS_REWARDS_FREE')}>
            <div className={styles.trackScroller} ref={trackRef}>
              <div className={styles.track}>
                {levels.map((row, index) => {
                  const unlocked = !!progress && progress.level >= row.level;
                  const current = !!progress && progress.level === row.level;
                  const claimed = !!progress && progress.claimedRewards.includes(row.level);
                  const claimable = isClaimable(row.level);
                  const claiming = claimingLevel === row.level;
                  const stagger = Math.min(index, 14) * 45;

                  return (
                    <div
                      key={row.level}
                      className={cn(
                        styles.trackLevel,
                        styles.enterTrack,
                        unlocked && styles.trackLevelUnlocked,
                        current && styles.trackLevelCurrent,
                      )}
                      style={{ ['--enter-delay' as string]: `${220 + stagger}ms` }}
                    >
                      {row.freeReward ? (
                        <div className={styles.itemPanel}>
                          <div className={styles.itemContent}>
                            <div className={styles.itemImage}>
                              <div className={styles.placeholderImage} aria-hidden />
                            </div>
                            <p className={styles.rewardName}>{row.freeReward.name}</p>
                          </div>
                          {claimable || claiming ? (
                            <button
                              type="button"
                              className={styles.claimBtn}
                              disabled={claimingLevel !== null}
                              onClick={() => void claim(row.level)}
                            >
                              {claiming ? '…' : t('BATTLE_PASS_CLAIM')}
                            </button>
                          ) : null}
                          {claimed ? (
                            <div className={cn(styles.completionCheck, styles.checkPop)} title={t('BATTLE_PASS_CLAIMED')}>
                              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                              </svg>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className={styles.itemPanel}>
                          <div className={styles.itemContent}>
                            <div className={styles.itemImage}>
                              <div className={styles.placeholderImage} aria-hidden />
                            </div>
                            <p className={styles.rewardName}>—</p>
                          </div>
                        </div>
                      )}

                      <div className={styles.levelRail}>
                        <div className={cn(styles.railLine, styles.railLineLeft)} />
                        <div
                          className={cn(styles.railBadge, unlocked && styles.railBadgeUnlocked)}
                          aria-label={t('BATTLE_PASS_LEVEL_ABBR', { level: row.level })}
                        >
                          {unlocked ? (
                            <span>{row.level}</span>
                          ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.lockIcon} aria-hidden>
                              <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                            </svg>
                          )}
                        </div>
                        <div className={cn(styles.railLine, styles.railLineRight)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
