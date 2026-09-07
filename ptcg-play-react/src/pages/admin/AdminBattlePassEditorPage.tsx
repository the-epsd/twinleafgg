import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  adminGetSeasonRewards,
  adminReplaceSeasonRewards,
  adminUpdateSeason,
} from '../../api/battlePassAdminApi';
import { adminListAvatars } from '../../api/avatarCatalogApi';
import { adminListSleeves } from '../../api/sleeveAdminApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { useSnackbar } from '../../context/SnackbarContext';
import type {
  AvatarCatalogItem,
  BattlePassReward,
  BattlePassSeason,
  BattlePassSeasonStatus,
  SleeveCatalogItem,
} from '../../types/battlePass';
import { resolveAssetUrl } from '../../utils/assetUrl';
import styles from './AdminPages.module.css';

type DraftReward = {
  key: string;
  level: number;
  type: 'avatar' | 'sleeve';
  item: string;
  name: string;
};

function toDraft(rewards: BattlePassReward[]): DraftReward[] {
  return rewards.map((r, i) => ({
    key: `${r.id ?? i}-${r.item}`,
    level: r.level,
    type: r.type === 'sleeve' ? 'sleeve' : 'avatar',
    item: r.item,
    name: r.name,
  }));
}

export function AdminBattlePassEditorPage() {
  const { seasonId = '' } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [season, setSeason] = useState<BattlePassSeason | null>(null);
  const [rewards, setRewards] = useState<DraftReward[]>([]);
  const [avatars, setAvatars] = useState<AvatarCatalogItem[]>([]);
  const [sleeves, setSleeves] = useState<SleeveCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMeta, setSavingMeta] = useState(false);
  const [savingRewards, setSavingRewards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [seasonRes, avatarRes, sleeveRes] = await Promise.all([
        adminGetSeasonRewards(seasonId),
        adminListAvatars(),
        adminListSleeves(),
      ]);
      setSeason(seasonRes.season);
      setRewards(toDraft(seasonRes.rewards));
      setAvatars(avatarRes.avatars);
      setSleeves(sleeveRes.sleeves);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load season');
    } finally {
      setLoading(false);
    }
  }, [seasonId]);

  useEffect(() => {
    void load();
  }, [load]);

  const catalogOptions = useMemo(() => {
    return {
      avatar: avatars,
      sleeve: sleeves,
    };
  }, [avatars, sleeves]);

  function previewUrl(type: 'avatar' | 'sleeve', itemId: string): string {
    if (type === 'avatar') {
      const hit = avatars.find((a) => a.identifier === itemId);
      return resolveAssetUrl(hit?.imageUrl);
    }
    const hit = sleeves.find((s) => s.identifier === itemId);
    return resolveAssetUrl(hit?.imageUrl);
  }

  async function saveMeta() {
    if (!season) return;
    setSavingMeta(true);
    try {
      const res = await adminUpdateSeason(season.seasonId, {
        name: season.name,
        startDate: String(season.startDate).slice(0, 10),
        endDate: season.endDate ? String(season.endDate).slice(0, 10) : null,
        status: (season.status ?? 'draft') as BattlePassSeasonStatus,
        maxLevel: season.maxLevel,
        baseXpPerLevel: season.baseXpPerLevel ?? 1000,
        xpIncreasePerLevel: season.xpIncreasePerLevel ?? 0,
      });
      setSeason(res.season);
      showSnackbar('Season saved');
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Save failed', { variant: 'error' });
    } finally {
      setSavingMeta(false);
    }
  }

  async function saveRewards() {
    setSavingRewards(true);
    try {
      const payload = rewards.map((r, i) => ({
        level: r.level,
        type: r.type,
        item: r.item,
        name: r.name || r.item,
        sortOrder: i,
      }));
      const res = await adminReplaceSeasonRewards(seasonId, payload);
      setRewards(toDraft(res.rewards));
      showSnackbar('Reward track saved');
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Reward save failed', { variant: 'error' });
    } finally {
      setSavingRewards(false);
    }
  }

  function addReward() {
    setRewards((rows) => [
      ...rows,
      {
        key: `new-${Date.now()}`,
        level: (rows[rows.length - 1]?.level ?? 0) + 1,
        type: 'avatar',
        item: avatars[0]?.identifier ?? '',
        name: avatars[0]?.name ?? '',
      },
    ]);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Loading season…</p>
      </div>
    );
  }

  if (!season) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error ?? 'Season not found'}</p>
        <ShellButton variant="secondary" onClick={() => navigate('/admin/battle-pass')}>
          Back
        </ShellButton>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit season</h1>
      <p className={styles.sub}>
        <code>{season.seasonId}</code>
      </p>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label htmlFor="edit-name">Name</label>
          <input
            id="edit-name"
            value={season.name}
            onChange={(e) => setSeason({ ...season, name: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-start">Start date</label>
          <input
            id="edit-start"
            type="date"
            value={String(season.startDate).slice(0, 10)}
            onChange={(e) => setSeason({ ...season, startDate: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-end">End date</label>
          <input
            id="edit-end"
            type="date"
            value={season.endDate ? String(season.endDate).slice(0, 10) : ''}
            onChange={(e) => setSeason({ ...season, endDate: e.target.value || null })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-status">Status</label>
          <select
            id="edit-status"
            value={season.status ?? 'draft'}
            onChange={(e) => setSeason({ ...season, status: e.target.value as BattlePassSeasonStatus })}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-max">Max level</label>
          <input
            id="edit-max"
            type="number"
            value={season.maxLevel}
            onChange={(e) => setSeason({ ...season, maxLevel: Number(e.target.value) || 1 })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-base-xp">Base XP / level</label>
          <input
            id="edit-base-xp"
            type="number"
            value={season.baseXpPerLevel ?? 1000}
            onChange={(e) => setSeason({ ...season, baseXpPerLevel: Number(e.target.value) || 0 })}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="edit-xp-inc">XP increase / level</label>
          <input
            id="edit-xp-inc"
            type="number"
            value={season.xpIncreasePerLevel ?? 0}
            onChange={(e) => setSeason({ ...season, xpIncreasePerLevel: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className={styles.toolbar}>
        <ShellButton disabled={savingMeta} onClick={() => void saveMeta()}>
          {savingMeta ? 'Saving…' : 'Save season'}
        </ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin/battle-pass')}>
          Back to list
        </ShellButton>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Reward track</h2>
        <p className={styles.muted}>Avatars and sleeves only for now. Save replaces the full track.</p>

        {rewards.map((row, index) => {
          const options = catalogOptions[row.type];
          const preview = previewUrl(row.type, row.item);
          return (
            <div key={row.key} className={styles.rewardRow}>
              <div className={styles.field}>
                <label>Level</label>
                <input
                  type="number"
                  min={1}
                  value={row.level}
                  onChange={(e) => {
                    const level = Number(e.target.value) || 1;
                    setRewards((rows) => rows.map((r, i) => (i === index ? { ...r, level } : r)));
                  }}
                />
              </div>
              <div className={styles.field}>
                <label>Type</label>
                <select
                  value={row.type}
                  onChange={(e) => {
                    const type = e.target.value as 'avatar' | 'sleeve';
                    const first = type === 'avatar' ? avatars[0] : sleeves[0];
                    setRewards((rows) =>
                      rows.map((r, i) =>
                        i === index
                          ? {
                              ...r,
                              type,
                              item: first ? ('identifier' in first ? first.identifier : '') : '',
                              name: first?.name ?? '',
                            }
                          : r
                      )
                    );
                  }}
                >
                  <option value="avatar">avatar</option>
                  <option value="sleeve">sleeve</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Catalog item</label>
                <select
                  value={row.item}
                  onChange={(e) => {
                    const item = e.target.value;
                    const hit = options.find((o) => o.identifier === item);
                    setRewards((rows) =>
                      rows.map((r, i) => (i === index ? { ...r, item, name: hit?.name ?? r.name } : r))
                    );
                  }}
                >
                  <option value="">Select…</option>
                  {options.map((o) => (
                    <option key={o.identifier} value={o.identifier}>
                      {o.name} ({o.identifier})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Display name</label>
                <input
                  value={row.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setRewards((rows) => rows.map((r, i) => (i === index ? { ...r, name } : r)));
                  }}
                />
              </div>
              <div className={styles.catalogActions}>
                {preview ? <img src={preview} alt="" className={styles.rewardPreview} /> : null}
                <ShellButton
                  variant="plain"
                  onClick={() => setRewards((rows) => rows.filter((_, i) => i !== index))}
                >
                  Remove
                </ShellButton>
              </div>
            </div>
          );
        })}

        <div className={styles.toolbar}>
          <ShellButton variant="secondary" onClick={addReward}>
            Add reward
          </ShellButton>
          <ShellButton disabled={savingRewards} onClick={() => void saveRewards()}>
            {savingRewards ? 'Saving…' : 'Save rewards'}
          </ShellButton>
        </div>
      </section>
    </div>
  );
}
