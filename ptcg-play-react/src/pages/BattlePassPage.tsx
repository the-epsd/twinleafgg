import { useCallback, useEffect, useState } from 'react';
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
import { ApiError } from '../api/apiError';

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

export function BattlePassPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAdmin = user?.roleId === 4;

  const [season, setSeason] = useState<BattlePassSeason | undefined>();
  const [progress, setProgress] = useState<BattlePassProgress | undefined>();
  const [levels, setLevels] = useState<BattlePassLevelRow[]>([]);
  const [seasons, setSeasons] = useState<Array<{ seasonId: string; name: string; startDate: string }>>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [loading, setLoading] = useState(true);
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
    async function init() {
      setLoading(true);
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

  async function onSeasonChange(nextId: string) {
    if (!nextId) {
      return;
    }
    setSelectedSeasonId(nextId);
    setSwitchingSeason(true);
    setError(null);
    try {
      await setBattlePassActiveSeason(nextId);
      await loadSeasonData(nextId);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_FAILED_SWITCH'));
    } finally {
      setSwitchingSeason(false);
    }
  }

  function isClaimable(level: number): boolean {
    if (!progress || claimingLevel === level) {
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
    return Number.isNaN(pct) ? 0 : pct;
  }

  async function onDebugExp() {
    setError(null);
    try {
      await addBattlePassDebugExp(100);
      const pr = await getBattlePassProgress(selectedSeasonId || undefined);
      setProgress(pr.progress);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('BATTLE_PASS_DEBUG_FAILED'));
    }
  }

  if (loading && !season) {
    return <p>{t('BATTLE_PASS_LOADING')}</p>;
  }

  if (!loading && !season) {
    return (
      <div>
        <h1>{t('BATTLE_PASS_TITLE')}</h1>
        <p>
          {noSeasonsAvailable ? t('BATTLE_PASS_NONE_SEASONS') : t('BATTLE_PASS_NONE_ACTIVE')}
        </p>
      </div>
    );
  }

  return (
    <div style={{ opacity: switchingSeason ? 0.7 : 1 }}>
      <h1>{t('BATTLE_PASS_TITLE')}</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {seasons.length > 0 && (
        <label style={{ display: 'block', marginBottom: 16 }}>
          {t('BATTLE_PASS_SEASON_LABEL')}{' '}
          <select
            value={selectedSeasonId}
            onChange={(e) => void onSeasonChange(e.target.value)}
            disabled={switchingSeason}
          >
            {seasons.map((s) => (
              <option key={s.seasonId} value={s.seasonId}>
                {s.name} ({s.startDate})
              </option>
            ))}
          </select>
        </label>
      )}

      {season && progress && (
        <>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 8px' }}>{season.name}</h2>
            <p style={{ margin: 0 }}>
              <strong>
                {t('BATTLE_PASS_LEVEL_PREFIX')} {displayLevel()}
              </strong>
              {' — '}
              {t('BATTLE_PASS_XP_IN_LEVEL', {
                current: getCurrentLevelExp(),
                total: getTotalLevelExp(),
              })}
            </p>
            <div
              style={{
                height: 12,
                background: '#e0e0e0',
                borderRadius: 6,
                maxWidth: 400,
                marginTop: 8,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, expPercentage())}%`,
                  background: '#0b57d0',
                  borderRadius: 6,
                }}
              />
            </div>
          </div>

          {isAdmin && (
            <p>
              <button type="button" onClick={() => void onDebugExp()}>
                {t('BATTLE_PASS_DEBUG_XP')}
              </button>
            </p>
          )}

          <h3>{t('BATTLE_PASS_REWARDS_FREE')}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {levels.map((row) => (
              <li
                key={row.level}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span style={{ width: 48 }}>{t('BATTLE_PASS_LEVEL_ABBR', { level: row.level })}</span>
                <span style={{ flex: 1 }}>
                  {row.freeReward ? `${row.freeReward.name} (${row.freeReward.type})` : '—'}
                </span>
                {isClaimable(row.level) && (
                  <button type="button" disabled={claimingLevel !== null} onClick={() => void claim(row.level)}>
                    {t('BATTLE_PASS_CLAIM')}
                  </button>
                )}
                {progress.claimedRewards.includes(row.level) && (
                  <span style={{ color: 'green' }}>{t('BATTLE_PASS_CLAIMED')}</span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
