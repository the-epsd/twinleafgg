import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  adminCreateSeason,
  adminDeleteSeason,
  adminListSeasons,
} from '../../api/battlePassAdminApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { Modal } from '../../components/ui/Modal';
import { useSnackbar } from '../../context/SnackbarContext';
import type { BattlePassSeason, BattlePassSeasonStatus } from '../../types/battlePass';
import { cn } from '../../utils/cn';
import styles from './AdminPages.module.css';

function statusClass(status?: BattlePassSeasonStatus): string {
  if (status === 'published') return styles.badgePublished;
  if (status === 'archived') return styles.badgeArchived;
  return styles.badgeDraft;
}

export function AdminBattlePassListPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [seasons, setSeasons] = useState<BattlePassSeason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    seasonId: '',
    name: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    status: 'draft' as BattlePassSeasonStatus,
    maxLevel: 100,
    baseXpPerLevel: 1000,
    xpIncreasePerLevel: 0,
  });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListSeasons();
      setSeasons(res.seasons);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load seasons');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate() {
    setCreating(true);
    try {
      const res = await adminCreateSeason({
        seasonId: form.seasonId.trim(),
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate || null,
        status: form.status,
        maxLevel: form.maxLevel,
        baseXpPerLevel: form.baseXpPerLevel,
        xpIncreasePerLevel: form.xpIncreasePerLevel,
      });
      showSnackbar('Season created');
      setShowCreate(false);
      navigate(`/admin/battle-pass/${encodeURIComponent(res.season.seasonId)}`);
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Create failed', { variant: 'error' });
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(seasonId: string, status?: BattlePassSeasonStatus) {
    const label = status === 'draft' ? 'Delete this draft season?' : 'Archive this season?';
    if (!window.confirm(label)) {
      return;
    }
    try {
      await adminDeleteSeason(seasonId);
      showSnackbar(status === 'draft' ? 'Season deleted' : 'Season archived');
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Delete failed', { variant: 'error' });
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Battle Pass Seasons</h1>
      <p className={styles.sub}>Create and edit seasons, date ranges, and reward tracks.</p>

      <div className={styles.toolbar}>
        <ShellButton onClick={() => setShowCreate(true)}>New season</ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin')}>
          Admin hub
        </ShellButton>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.muted}>Loading…</p> : null}

      {!loading && seasons.length === 0 ? (
        <p className={styles.muted}>No seasons yet.</p>
      ) : null}

      {seasons.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>ID</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Rewards</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {seasons.map((season) => (
              <tr key={season.seasonId}>
                <td>{season.name}</td>
                <td>
                  <code>{season.seasonId}</code>
                </td>
                <td>
                  {String(season.startDate).slice(0, 10)}
                  {season.endDate ? ` → ${String(season.endDate).slice(0, 10)}` : ' → open'}
                </td>
                <td>
                  <span className={cn(styles.badge, statusClass(season.status))}>{season.status ?? 'published'}</span>
                </td>
                <td>{season.rewardCount ?? 0}</td>
                <td>
                  <div className={styles.catalogActions}>
                    <Link to={`/admin/battle-pass/${encodeURIComponent(season.seasonId)}`}>
                      <ShellButton variant="secondary">Edit</ShellButton>
                    </Link>
                    <ShellButton variant="plain" onClick={() => void onDelete(season.seasonId, season.status)}>
                      {season.status === 'draft' ? 'Delete' : 'Archive'}
                    </ShellButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {showCreate ? (
        <div className={styles.modalOverlay}>
          <Modal className={styles.modalPanel}>
            <h2>Create season</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="bp-season-id">Season ID</label>
                <input
                  id="bp-season-id"
                  value={form.seasonId}
                  onChange={(e) => setForm((f) => ({ ...f, seasonId: e.target.value }))}
                  placeholder="2026-summer"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="bp-name">Name</label>
                <input
                  id="bp-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="bp-start">Start date</label>
                <input
                  id="bp-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="bp-end">End date</label>
                <input
                  id="bp-end"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="bp-status">Status</label>
                <select
                  id="bp-status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as BattlePassSeasonStatus }))}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="bp-max">Max level</label>
                <input
                  id="bp-max"
                  type="number"
                  value={form.maxLevel}
                  onChange={(e) => setForm((f) => ({ ...f, maxLevel: Number(e.target.value) || 1 }))}
                />
              </div>
            </div>
            <div className={styles.toolbar}>
              <ShellButton disabled={creating || !form.seasonId.trim() || !form.name.trim()} onClick={() => void onCreate()}>
                {creating ? 'Creating…' : 'Create'}
              </ShellButton>
              <ShellButton variant="secondary" onClick={() => setShowCreate(false)}>
                Cancel
              </ShellButton>
            </div>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}
