import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Base64, GameWinner, Replay } from 'ptcg-server';
import {
  deleteReplay,
  downloadReplayFile,
  getReplayData,
  getReplayList,
  importReplay,
  renameReplay,
  type ReplayInfo,
} from '../api/replayApi';
import { ApiError } from '../api/apiError';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { appConfig } from '../env/config';
import { FormAlert } from '../components/ui/FormAlert';
import { Modal } from '../components/ui/Modal';
import { ShellButton } from '../components/ui/ShellButton';
import styles from './ReplaysPage.module.css';

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

function formatReplayDate(created: number): string {
  try {
    return new Date(created).toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return String(created);
  }
}

function PlayerCell({
  user,
  winner,
}: {
  user: ReplayInfo['player1'];
  winner: boolean;
}) {
  const { t } = useTranslation();
  return (
    <span className={winner ? styles.winner : undefined}>
      <Link className={styles.playerLink} to={`/profile/${user.userId}`}>
        {user.name}
      </Link>
      {winner ? <span className={styles.winnerBadge}>{t('REPLAY_WINNER')}</span> : null}
    </span>
  );
}

type ImportDialogProps = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

function ImportReplayDialog({ open, onClose, onImported }: ImportDialogProps) {
  const { t } = useTranslation();
  const { serverConfig } = useAuth();
  const { showSnackbar } = useSnackbar();
  const maxFileSize = serverConfig?.replayFileSize ?? 512 * 1024;

  const [name, setName] = useState('');
  const [replayData, setReplayData] = useState('');
  const [fileLabel, setFileLabel] = useState('');
  const [preview, setPreview] = useState<{
    created: number;
    player1: string;
    player2: string;
    winner: GameWinner;
    states: number;
    turns: number;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setReplayData('');
      setFileLabel('');
      setPreview(null);
      setFileError(null);
      setLoading(false);
      setDragOver(false);
    }
  }, [open]);

  const parseFile = useCallback(
    (file: File) => {
      setFileError(null);
      setPreview(null);
      setReplayData('');
      setFileLabel(file.name);

      if (file.size > maxFileSize) {
        setFileError(t('VALIDATION_MAX_FILE_SIZE'));
        return;
      }

      setLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result ?? '');
        try {
          const replay = new Replay({ indexEnabled: false });
          const base64 = new Base64();
          replay.deserialize(base64.decode(data));
          setReplayData(data);
          setPreview({
            created: replay.created,
            player1: replay.player1.name,
            player2: replay.player2.name,
            winner: replay.winner,
            states: replay.getStateCount(),
            turns: replay.getTurnCount(),
          });
          setName((prev) => {
            if (prev.trim()) {
              return prev;
            }
            const base = file.name.replace(/\.rep$/i, '').trim();
            return base.length >= 3 && base.length <= 32 ? base : prev;
          });
          setFileError(null);
        } catch {
          setFileError(t('VALIDATION_INVALID_REPLAY'));
        } finally {
          setLoading(false);
        }
      };
      reader.onerror = () => {
        setLoading(false);
        setFileError(t('CANNOT_READ_REPLAY_FILE', { defaultValue: 'Could not read replay file.' }));
      };
      reader.readAsText(file);
    },
    [maxFileSize, t],
  );

  const onSubmit = async () => {
    const trimmed = name.trim();
    if (!replayData || trimmed.length < 3 || trimmed.length > 32) {
      return;
    }
    setLoading(true);
    try {
      await importReplay(replayData, trimmed);
      showSnackbar(t('REPLAY_SAVED'));
      onImported();
      onClose();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : t('ERROR_UNKNOWN');
      showSnackbar(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  const canImport =
    !!replayData && name.trim().length >= 3 && name.trim().length <= 32 && !loading && !fileError;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <Modal
        className={styles.dialog}
        aria-labelledby="import-replay-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="import-replay-title" className={styles.dialogTitle}>
          {t('REPLAY_IMPORT_TITLE')}
        </h2>
        <div className={styles.dialogBody}>
          <div
            className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files?.[0];
              if (file && !loading) {
                parseFile(file);
              }
            }}
          >
            <p>{t('REACT_REPLAY_DROP_HINT', { defaultValue: 'Drag and drop a .rep file here' })}</p>
            <p>
              <ShellButton
                type="button"
                variant="secondary"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
              >
                {t('BUTTON_IMPORT_FROM_FILE')}
              </ShellButton>
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".rep,text/plain"
              hidden
              disabled={loading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  parseFile(file);
                }
                e.target.value = '';
              }}
            />
            {fileLabel ? <p>{fileLabel}</p> : null}
          </div>

          <div className={styles.field}>
            <label htmlFor="replay-import-name">{t('REPLAY_NAME')}</label>
            <input
              id="replay-import-name"
              type="text"
              value={name}
              maxLength={32}
              disabled={loading}
              placeholder={t('REPLAY_NAME')}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {fileError ? <FormAlert>{fileError}</FormAlert> : null}

          {preview && !fileError ? (
            <div className={styles.preview}>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>{t('LABEL_DATE')}</span>
                <span>{formatReplayDate(preview.created)}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>{t('LABEL_PLAYER_1')}</span>
                <span>
                  {preview.player1}
                  {preview.winner === GameWinner.PLAYER_1 ? (
                    <span className={styles.winnerBadge}>{t('REPLAY_WINNER')}</span>
                  ) : null}
                </span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>{t('LABEL_PLAYER_2')}</span>
                <span>
                  {preview.player2}
                  {preview.winner === GameWinner.PLAYER_2 ? (
                    <span className={styles.winnerBadge}>{t('REPLAY_WINNER')}</span>
                  ) : null}
                </span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>{t('REPLAY_STATES')}</span>
                <span>{preview.states}</span>
              </div>
              <div className={styles.previewRow}>
                <span className={styles.previewLabel}>{t('REPLAY_TURNS')}</span>
                <span>{preview.turns}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.dialogActions}>
          <ShellButton type="button" variant="plain" disabled={loading} onClick={onClose}>
            {t('BUTTON_CANCEL')}
          </ShellButton>
          <ShellButton type="button" variant="primary" disabled={!canImport} onClick={() => void onSubmit()}>
            {t('BUTTON_IMPORT')}
          </ShellButton>
        </div>
      </Modal>
    </div>
  );
}

export function ReplaysPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [replays, setReplays] = useState<ReplayInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounced(searchInput, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const pageSize = appConfig.defaultPageSize;

  const prevDebounced = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebounced.current !== debouncedSearch) {
      prevDebounced.current = debouncedSearch;
      setPageIndex(0);
    }
  }, [debouncedSearch]);

  const load = useCallback(
    async (page: number, query: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getReplayList(page, query);
        setReplays(res.replays);
        setTotal(res.total);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    void load(pageIndex, debouncedSearch);
  }, [pageIndex, debouncedSearch, load]);

  const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const pageCount = maxPage + 1;

  const onShow = (replayId: number) => {
    navigate(`/table/saved-replay/${replayId}`);
  };

  const onExport = async (replayId: number, name: string) => {
    setBusyId(replayId);
    try {
      const res = await getReplayData(replayId);
      downloadReplayFile(res.replayData, `${name}.rep`);
      showSnackbar(t('REPLAY_EXPORTED'));
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    } finally {
      setBusyId(null);
    }
  };

  const onDelete = async (replayId: number) => {
    if (!window.confirm(t('REACT_REPLAY_DELETE_CONFIRM', { defaultValue: 'Delete the selected replay?' }))) {
      return;
    }
    setBusyId(replayId);
    try {
      await deleteReplay(replayId);
      await load(pageIndex, debouncedSearch);
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    } finally {
      setBusyId(null);
    }
  };

  const onRename = async (replayId: number, previousName: string) => {
    const raw = window.prompt(t('REPLAY_ENTER_NAME'), previousName);
    if (raw === null) {
      return;
    }
    const trimmed = raw.trim();
    if (trimmed.length < 3 || trimmed.length > 32) {
      window.alert(t('REACT_DECK_NAME_RULES'));
      return;
    }
    setBusyId(replayId);
    try {
      await renameReplay(replayId, trimmed);
      await load(pageIndex, debouncedSearch);
    } catch (e) {
      showSnackbar(e instanceof ApiError ? e.message : t('ERROR_UNKNOWN'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('REPLAY_TITLE')}</h1>
        <div className={styles.controls}>
          <input
            className={styles.search}
            type="search"
            placeholder={t('RANKING_SEARCH_PLACEHOLDER')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <ShellButton type="button" variant="primary" onClick={() => setImportOpen(true)}>
            {t('BUTTON_IMPORT_FROM_FILE')}
          </ShellButton>
        </div>
      </div>

      {error ? <FormAlert>{error}</FormAlert> : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('LABEL_NAME')}</th>
              <th>{t('LABEL_PLAYER_1')}</th>
              <th>{t('LABEL_PLAYER_2')}</th>
              <th>{t('LABEL_DATE')}</th>
              <th>{t('LABEL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {loading && replays.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.loading}>
                  {t('RANKING_TABLE_LOADING')}
                </td>
              </tr>
            ) : replays.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  {t('REACT_REPLAYS_EMPTY', { defaultValue: 'No replays yet. Import a .rep file to get started.' })}
                </td>
              </tr>
            ) : (
              replays.map((replay) => {
                const rowBusy = busyId === replay.replayId || loading;
                return (
                  <tr key={replay.replayId}>
                    <td>{replay.name}</td>
                    <td>
                      <PlayerCell
                        user={replay.player1}
                        winner={replay.winner === GameWinner.PLAYER_1}
                      />
                    </td>
                    <td>
                      <PlayerCell
                        user={replay.player2}
                        winner={replay.winner === GameWinner.PLAYER_2}
                      />
                    </td>
                    <td>{formatReplayDate(replay.created)}</td>
                    <td>
                      <div className={styles.actions}>
                        <ShellButton
                          type="button"
                          variant="primary"
                          disabled={rowBusy}
                          onClick={() => onShow(replay.replayId)}
                        >
                          {t('BUTTON_SHOW')}
                        </ShellButton>
                        <ShellButton
                          type="button"
                          variant="secondary"
                          disabled={rowBusy}
                          onClick={() => void onExport(replay.replayId, replay.name)}
                        >
                          {t('BUTTON_EXPORT')}
                        </ShellButton>
                        <ShellButton
                          type="button"
                          variant="plain"
                          disabled={rowBusy}
                          onClick={() => void onRename(replay.replayId, replay.name)}
                        >
                          {t('BUTTON_RENAME')}
                        </ShellButton>
                        <ShellButton
                          type="button"
                          variant="plain"
                          disabled={rowBusy}
                          onClick={() => void onDelete(replay.replayId)}
                        >
                          {t('BUTTON_DELETE')}
                        </ShellButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <ShellButton
          type="button"
          variant="plain"
          disabled={pageIndex <= 0 || loading}
          onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
        >
          {t('RANKING_PREV_PAGE')}
        </ShellButton>
        <span className={styles.pageHint}>
          {t('RANKING_PAGE_OF', { current: pageIndex + 1, total: pageCount || 1 })}
          {loading ? ` · ${t('RANKING_UPDATING')}` : ''}
        </span>
        <ShellButton
          type="button"
          variant="plain"
          disabled={pageIndex >= maxPage || loading}
          onClick={() => setPageIndex((p) => p + 1)}
        >
          {t('RANKING_NEXT_PAGE')}
        </ShellButton>
      </div>

      <ImportReplayDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={() => {
          setPageIndex(0);
          void load(0, debouncedSearch);
        }}
      />
    </div>
  );
}
