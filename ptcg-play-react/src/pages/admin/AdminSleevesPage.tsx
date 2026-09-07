import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateSleeve,
  adminDeleteSleeve,
  adminListSleeves,
  adminUpdateSleeve,
  adminUploadSleeveImage,
} from '../../api/sleeveAdminApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { Modal } from '../../components/ui/Modal';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { useSnackbar } from '../../context/SnackbarContext';
import type { SleeveCatalogItem } from '../../types/battlePass';
import { resolveAssetUrl } from '../../utils/assetUrl';
import styles from './AdminPages.module.css';

type SleeveForm = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
};

const emptyForm: SleeveForm = {
  identifier: '',
  name: '',
  imagePath: '',
  isDefault: false,
  requiresUnlock: true,
  sortOrder: 0,
};

export function AdminSleevesPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [sleeves, setSleeves] = useState<SleeveCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<SleeveCatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<SleeveForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListSleeves();
      setSleeves(res.sleeves);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load sleeves');
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

  function openEdit(sleeve: SleeveCatalogItem) {
    setCreating(false);
    setEditing(sleeve);
    setForm({
      identifier: sleeve.identifier,
      name: sleeve.name,
      imagePath: sleeve.imagePath,
      isDefault: sleeve.isDefault,
      requiresUnlock: sleeve.requiresUnlock,
      sortOrder: sleeve.sortOrder,
    });
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadSleeveImage(file);
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
        await adminUpdateSleeve(editing.id, form);
        showSnackbar('Sleeve updated');
      } else {
        await adminCreateSleeve(form);
        showSnackbar('Sleeve created');
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

  async function onDelete(sleeve: SleeveCatalogItem) {
    if (!window.confirm(`Delete sleeve ${sleeve.identifier}?`)) return;
    try {
      await adminDeleteSleeve(sleeve.id);
      showSnackbar('Sleeve deleted');
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Delete failed', { variant: 'error' });
    }
  }

  const showModal = creating || editing != null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Sleeve catalog</h1>
      <p className={styles.sub}>Card sleeves for decks and Battle Pass rewards.</p>

      <div className={styles.toolbar}>
        <ShellButton onClick={openCreate}>Add sleeve</ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin')}>
          Admin hub
        </ShellButton>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.muted}>Loading…</p> : null}

      <div className={styles.catalogGrid}>
        {sleeves.map((sleeve) => (
          <div key={sleeve.id} className={styles.catalogCard}>
            <img src={resolveAssetUrl(sleeve.imageUrl)} alt={sleeve.name} className={styles.catalogPreview} />
            <div className={styles.catalogMeta}>
              <strong>{sleeve.name}</strong>
              <span>
                <code>{sleeve.identifier}</code>
              </span>
              <span className={styles.muted}>
                {sleeve.isDefault ? 'Default' : sleeve.requiresUnlock ? 'Requires unlock' : 'Open'}
              </span>
            </div>
            <div className={styles.catalogActions}>
              <ShellButton variant="secondary" onClick={() => openEdit(sleeve)}>
                Edit
              </ShellButton>
              <ShellButton variant="plain" onClick={() => void onDelete(sleeve)}>
                Delete
              </ShellButton>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className={styles.modalOverlay}>
          <Modal className={styles.modalPanel}>
            <h2>{editing ? 'Edit sleeve' : 'Add sleeve'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="sl-id">Identifier</label>
                <input
                  id="sl-id"
                  value={form.identifier}
                  onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="sl-name">Name</label>
                <input
                  id="sl-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="sl-path">Image path</label>
                <input
                  id="sl-path"
                  value={form.imagePath}
                  onChange={(e) => setForm((f) => ({ ...f, imagePath: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="sl-sort">Sort order</label>
                <input
                  id="sl-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="sl-upload">Upload image</label>
                <input
                  id="sl-upload"
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
