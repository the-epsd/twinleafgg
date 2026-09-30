import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateDeckBox,
  adminDeleteDeckBox,
  adminListDeckBoxes,
  adminUpdateDeckBox,
  adminUploadDeckBoxImage,
} from '../../api/deckBoxAdminApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { Modal } from '../../components/ui/Modal';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { useSnackbar } from '../../context/SnackbarContext';
import type { DeckBoxCatalogItem } from '../../types/battlePass';
import { resolveAssetUrl } from '../../utils/assetUrl';
import styles from './AdminPages.module.css';

type DeckBoxForm = {
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
};

const emptyForm: DeckBoxForm = {
  identifier: '',
  name: '',
  imagePath: '',
  isDefault: false,
  requiresUnlock: true,
  sortOrder: 0,
};

export function AdminDeckBoxesPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [deckBoxes, setDeckBoxes] = useState<DeckBoxCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<DeckBoxCatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<DeckBoxForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListDeckBoxes();
      setDeckBoxes(res.deckBoxes);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load deck boxes');
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

  function openEdit(box: DeckBoxCatalogItem) {
    setCreating(false);
    setEditing(box);
    setForm({
      identifier: box.identifier,
      name: box.name,
      imagePath: box.imagePath,
      isDefault: box.isDefault,
      requiresUnlock: box.requiresUnlock,
      sortOrder: box.sortOrder,
    });
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadDeckBoxImage(file);
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
        await adminUpdateDeckBox(editing.id, form);
        showSnackbar('Deck box updated');
      } else {
        await adminCreateDeckBox(form);
        showSnackbar('Deck box created');
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

  async function onDelete(box: DeckBoxCatalogItem) {
    if (!window.confirm(`Delete deck box ${box.identifier}?`)) return;
    try {
      await adminDeleteDeckBox(box.id);
      showSnackbar('Deck box deleted');
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Delete failed', { variant: 'error' });
    }
  }

  const showModal = creating || editing != null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Deck box catalog</h1>
      <p className={styles.sub}>Deck boxes for deck customization and Battle Pass rewards.</p>

      <div className={styles.toolbar}>
        <ShellButton onClick={openCreate}>Add deck box</ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin')}>
          Admin hub
        </ShellButton>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.muted}>Loading…</p> : null}

      <div className={styles.catalogGrid}>
        {deckBoxes.map((box) => (
          <div key={box.id} className={styles.catalogCard}>
            <img src={resolveAssetUrl(box.imageUrl)} alt={box.name} className={styles.catalogPreview} />
            <div className={styles.catalogMeta}>
              <strong>{box.name}</strong>
              <span>
                <code>{box.identifier}</code>
              </span>
              <span className={styles.muted}>
                {box.isDefault ? 'Default' : box.requiresUnlock ? 'Requires unlock' : 'Open'}
              </span>
            </div>
            <div className={styles.catalogActions}>
              <ShellButton variant="secondary" onClick={() => openEdit(box)}>
                Edit
              </ShellButton>
              <ShellButton variant="plain" onClick={() => void onDelete(box)}>
                Delete
              </ShellButton>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className={styles.modalOverlay}>
          <Modal className={styles.modalPanel}>
            <h2>{editing ? 'Edit deck box' : 'Add deck box'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="db-id">Identifier</label>
                <input
                  id="db-id"
                  value={form.identifier}
                  onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="db-name">Name</label>
                <input
                  id="db-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="db-path">Image path</label>
                <input
                  id="db-path"
                  value={form.imagePath}
                  onChange={(e) => setForm((f) => ({ ...f, imagePath: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="db-sort">Sort order</label>
                <input
                  id="db-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="db-upload">Upload image</label>
                <input
                  id="db-upload"
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
