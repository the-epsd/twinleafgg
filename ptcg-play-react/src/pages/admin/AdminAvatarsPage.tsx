import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateAvatar,
  adminDeleteAvatar,
  adminListAvatars,
  adminUpdateAvatar,
  adminUploadAvatarImage,
} from '../../api/avatarCatalogApi';
import { ApiError } from '../../api/apiError';
import { ShellButton } from '../../components/ui/ShellButton';
import { Modal } from '../../components/ui/Modal';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { useSnackbar } from '../../context/SnackbarContext';
import type { AvatarCatalogItem } from '../../types/battlePass';
import { resolveAssetUrl } from '../../utils/assetUrl';
import styles from './AdminPages.module.css';

type AvatarForm = {
  identifier: string;
  name: string;
  fileName: string;
  isDefault: boolean;
  sortOrder: number;
};

const emptyForm: AvatarForm = {
  identifier: '',
  name: '',
  fileName: '',
  isDefault: false,
  sortOrder: 0,
};

export function AdminAvatarsPage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [avatars, setAvatars] = useState<AvatarCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AvatarCatalogItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<AvatarForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListAvatars();
      setAvatars(res.avatars);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load avatars');
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

  function openEdit(avatar: AvatarCatalogItem) {
    setCreating(false);
    setEditing(avatar);
    setForm({
      identifier: avatar.identifier,
      name: avatar.name,
      fileName: avatar.fileName,
      isDefault: avatar.isDefault,
      sortOrder: avatar.sortOrder,
    });
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const res = await adminUploadAvatarImage(file);
      setForm((f) => ({ ...f, fileName: res.fileName }));
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
        await adminUpdateAvatar(editing.id, form);
        showSnackbar('Avatar updated');
      } else {
        await adminCreateAvatar(form);
        showSnackbar('Avatar created');
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

  async function onDelete(avatar: AvatarCatalogItem) {
    if (!window.confirm(`Delete avatar ${avatar.identifier}?`)) return;
    try {
      await adminDeleteAvatar(avatar.id);
      showSnackbar('Avatar deleted');
      await load();
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : 'Delete failed', { variant: 'error' });
    }
  }

  const showModal = creating || editing != null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Avatar catalog</h1>
      <p className={styles.sub}>Global unlockable and default avatars for Battle Pass rewards.</p>

      <div className={styles.toolbar}>
        <ShellButton onClick={openCreate}>Add avatar</ShellButton>
        <ShellButton variant="secondary" onClick={() => navigate('/admin')}>
          Admin hub
        </ShellButton>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <p className={styles.muted}>Loading…</p> : null}

      <div className={styles.catalogGrid}>
        {avatars.map((avatar) => (
          <div key={avatar.id} className={styles.catalogCard}>
            <img src={resolveAssetUrl(avatar.imageUrl)} alt={avatar.name} className={styles.catalogPreview} />
            <div className={styles.catalogMeta}>
              <strong>{avatar.name}</strong>
              <span>
                <code>{avatar.identifier}</code>
              </span>
              <span className={styles.muted}>{avatar.isDefault ? 'Default' : 'Unlockable'}</span>
            </div>
            <div className={styles.catalogActions}>
              <ShellButton variant="secondary" onClick={() => openEdit(avatar)}>
                Edit
              </ShellButton>
              <ShellButton variant="plain" onClick={() => void onDelete(avatar)}>
                Delete
              </ShellButton>
            </div>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className={styles.modalOverlay}>
          <Modal className={styles.modalPanel}>
            <h2>{editing ? 'Edit avatar' : 'Add avatar'}</h2>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="av-id">Identifier</label>
                <input
                  id="av-id"
                  value={form.identifier}
                  onChange={(e) => setForm((f) => ({ ...f, identifier: e.target.value }))}
                  placeholder="avatar_mew"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="av-name">Name</label>
                <input
                  id="av-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="av-file">File name</label>
                <input
                  id="av-file"
                  value={form.fileName}
                  onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="av-sort">Sort order</label>
                <input
                  id="av-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="av-upload">Upload image</label>
                <input
                  id="av-upload"
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                />
              </div>
              <CheckboxField
                checked={form.isDefault}
                onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
              >
                Always available (default)
              </CheckboxField>
            </div>
            <div className={styles.toolbar}>
              <ShellButton
                disabled={saving || !form.identifier.trim() || !form.name.trim() || !form.fileName.trim()}
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
