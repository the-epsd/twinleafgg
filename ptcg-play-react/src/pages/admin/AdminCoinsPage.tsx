import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateCoin,
  adminDeleteCoin,
  adminListCoins,
  adminUpdateCoin,
  adminUploadCoinImage,
} from '../../api/coinAdminApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { Modal } from '../../components/ui/Modal';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { useSnackbar } from '../../context/SnackbarContext';
import type { CoinCatalogItem } from '../../types/battlePass';
import { resolveAssetUrl } from '../../utils/assetUrl';
import styles from './AdminPages.module.css';

type CoinForm = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
};

const emptyForm: CoinForm = {
  identifier: '',
  name: '',
  imagePath: '',
  isDefault: false,
  requiresUnlock: true,
  sortOrder: 0,
};

export function AdminCoinsPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [coins, setCoins] = useState<CoinCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<CoinCatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CoinForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListCoins();
      setCoins(res.coins);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load coins');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setCreating(true);
  }

  function openEdit(coin: CoinCatalogItem) {
    setCreating(false);
    setEditing(coin);
    setForm({
      identifier: coin.identifier,
      name: coin.name,
      imagePath: coin.imagePath,
      isDefault: coin.isDefault,
      requiresUnlock: coin.requiresUnlock,
      sortOrder: coin.sortOrder,
    });
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadCoinImage(file);
      setForm((f) => ({ ...f, imagePath: res.imagePath }));
      showSnackbar('Image uploaded');
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Upload failed', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  }

  async function onSave() {
    setSaving(true);
    try {
      if (editing) {
        await adminUpdateCoin(editing.id, form);
        showSnackbar('Coin updated');
      } else {
        await adminCreateCoin(form);
        showSnackbar('Coin created');
      }
      setEditing(null);
      setCreating(false);
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Save failed', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(coin: CoinCatalogItem) {
    if (!window.confirm(`Delete coin ${coin.identifier}?`)) return;
    try {
      await adminDeleteCoin(coin.id);
      showSnackbar('Coin deleted');
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Delete failed', { variant: 'error' });
    }
  }

  const showModal = creating || editing != null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Coin catalog</h1>
      <p className={styles.sub}>
        Coin fronts for flips and Battle Pass rewards. All coins share the Twinleaf back face.
      </p>

      <div className={styles.toolbar}>
        <ShellButton onClick={openCreate}>Add coin</ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin')}>
          Admin hub
        </ShellButton>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.muted}>Loading…</p> : null}

      <div className={styles.catalogGrid}>
        {coins.map((coin) => (
          <div key={coin.id} className={styles.catalogCard}>
            <img src={resolveAssetUrl(coin.imageUrl)} alt={coin.name} className={styles.catalogPreview} />
            <div className={styles.catalogMeta}>
              <strong>{coin.name}</strong>
              <span>
                <code>{coin.identifier}</code>
              </span>
              <span className={styles.muted}>
                {coin.isDefault ? 'Default' : coin.requiresUnlock ? 'Requires unlock' : 'Open'}
              </span>
            </div>
            <div className={styles.catalogActions}>
              <ShellButton variant="secondary" onClick={() => openEdit(coin)}>
                Edit
              </ShellButton>
              <ShellButton variant="plain" onClick={() => void onDelete(coin)}>
                Delete
              </ShellButton>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className={styles.modalOverlay}>
          <Modal className={styles.modalPanel}>
            <h2>{editing ? 'Edit coin' : 'Add coin'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="coin-id">Identifier</label>
                <input
                  id="coin-id"
                  value={form.identifier}
                  onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="coin-name">Name</label>
                <input
                  id="coin-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="coin-path">Front image path</label>
                <input
                  id="coin-path"
                  value={form.imagePath}
                  onChange={(e) => setForm((f) => ({ ...f, imagePath: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="coin-sort">Sort order</label>
                <input
                  id="coin-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="coin-upload">Upload front image</label>
                <input
                  id="coin-upload"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                />
              </div>
              <CheckboxField
                checked={form.isDefault}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    isDefault: e.target.checked,
                    requiresUnlock: e.target.checked ? false : f.requiresUnlock,
                  }))
                }
              >
                Default (always available)
              </CheckboxField>
              <CheckboxField
                checked={form.requiresUnlock}
                onChange={(e) => setForm((f) => ({ ...f, requiresUnlock: e.target.checked }))}
              >
                Requires Battle Pass unlock
              </CheckboxField>
            </div>
            <div className={styles.toolbar}>
              <ShellButton
                disabled={saving || !form.identifier.trim() || !form.name.trim() || !form.imagePath.trim()}
                onClick={() => void onSave()}
              >
                {saving ? 'Saving…' : 'Save'}
              </ShellButton>
              <ShellButton
                variant="secondary"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                Cancel
              </ShellButton>
            </div>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}
