import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getCardImagesUrl, getNightlyImagesUrl } from '../api/profileApi';
import type { ProfileJsonUrlResponse } from '../types/responses';
import { useAuth } from '../context/AuthContext';
import { useCardImagesRefresh } from '../context/CardImagesContext';
import { useSnackbar } from '../context/SnackbarContext';
import {
  RESET_CARD_IMAGES_JSON_URL,
  applyCustomCardImagesUrl,
  applyNightlyCardImagesUrl,
} from '../settings/cardImagesApply';
import styles from './SettingsPage.module.css';

export function SettingsCardImagesPanel() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const refreshFromStorage = useCardImagesRefresh();
  const { showSnackbar } = useSnackbar();

  const isAdmin = user?.roleId === 4;

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [jsonUrl, setJsonUrl] = useState('');
  const [nightlyImagesJsonUrl, setNightlyImagesJsonUrl] = useState('');

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      try {
        const requests: Promise<ProfileJsonUrlResponse>[] = [
          getCardImagesUrl().catch(() => ({ ok: false, jsonUrl: '' })),
        ];
        if (isAdmin) {
          requests.push(getNightlyImagesUrl().catch(() => ({ ok: false, jsonUrl: '' })));
        }

        const responses = await Promise.all(requests);
        if (cancelled) {
          return;
        }

        if (responses[0]?.jsonUrl) {
          setJsonUrl(responses[0].jsonUrl);
        }
        if (isAdmin && responses[1]?.jsonUrl) {
          setNightlyImagesJsonUrl(responses[1].jsonUrl);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const onSave = useCallback(async () => {
    if (!jsonUrl.trim()) {
      return;
    }
    setBusy(true);
    try {
      await applyCustomCardImagesUrl(jsonUrl.trim(), isAuthenticated);
      refreshFromStorage();
      showSnackbar(t('PROFILE_CHANGE_CARD_IMAGES_SUCCESS'));
    } catch {
      showSnackbar(t('PROFILE_CHANGE_CARD_IMAGES_ERROR', { message: 'Did not work' }), {
        variant: 'error',
      });
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated, jsonUrl, refreshFromStorage, showSnackbar, t]);

  const onReset = useCallback(async () => {
    setBusy(true);
    try {
      await applyCustomCardImagesUrl(RESET_CARD_IMAGES_JSON_URL, isAuthenticated);
      setJsonUrl(RESET_CARD_IMAGES_JSON_URL);
      refreshFromStorage();
      showSnackbar(t('PROFILE_RESET_CARD_IMAGES_SUCCESS'));
    } catch {
      showSnackbar(t('PROFILE_RESET_CARD_IMAGES_ERROR', { message: 'Reset failed' }), {
        variant: 'error',
      });
    } finally {
      setBusy(false);
    }
  }, [isAuthenticated, refreshFromStorage, showSnackbar, t]);

  const onSaveNightly = useCallback(async () => {
    if (!nightlyImagesJsonUrl.trim()) {
      return;
    }
    setBusy(true);
    try {
      await applyNightlyCardImagesUrl(nightlyImagesJsonUrl.trim());
      refreshFromStorage();
      showSnackbar(t('PROFILE_CHANGE_CARD_IMAGES_SUCCESS'));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Did not work';
      showSnackbar(t('PROFILE_CHANGE_CARD_IMAGES_ERROR', { message }), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  }, [nightlyImagesJsonUrl, refreshFromStorage, showSnackbar, t]);

  const disabled = loading || busy;

  return (
    <div className={styles.imagesPanel}>
      <section className={styles.imagesSection}>
        <h2 className={styles.sectionTitle}>{t('PROFILE_CARD_IMAGES_SECTION')}</h2>
        <p className={styles.hint}>{t('PROFILE_CARD_IMAGES_DESCRIPTION')}</p>
        <div className={styles.inputBlock}>
          <label htmlFor="settings-card-images-json-url">{t('LABEL_JSON_URL')}</label>
          <input
            id="settings-card-images-json-url"
            type="url"
            className={styles.textInput}
            value={jsonUrl}
            onChange={(e) => setJsonUrl(e.target.value)}
            disabled={disabled}
            required
          />
        </div>
      </section>

      {isAdmin ? (
        <section className={styles.imagesSection}>
          <h2 className={styles.sectionTitle}>{t('PROFILE_NIGHTLY_IMAGES_SECTION')}</h2>
          <p className={styles.hint}>{t('PROFILE_NIGHTLY_IMAGES_DESCRIPTION')}</p>
          <div className={styles.inputBlock}>
            <label htmlFor="settings-nightly-images-json-url">{t('LABEL_JSON_URL')}</label>
            <input
              id="settings-nightly-images-json-url"
              type="url"
              className={styles.textInput}
              value={nightlyImagesJsonUrl}
              onChange={(e) => setNightlyImagesJsonUrl(e.target.value)}
              disabled={disabled}
            />
          </div>
        </section>
      ) : null}

      <div className={styles.imagesActions}>
        <div className={styles.imagesActionsLeft}>
          <button type="button" className={styles.btn} disabled={disabled} onClick={() => void onReset()}>
            {t('PROMPT_RESET')}
          </button>
        </div>
        <div className={styles.imagesActionsRight}>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={disabled || !jsonUrl.trim()}
            onClick={() => void onSave()}
          >
            {t('BUTTON_SAVE')}
          </button>
          {isAdmin ? (
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={disabled || !nightlyImagesJsonUrl.trim()}
              onClick={() => void onSaveNightly()}
            >
              {t('BUTTON_SAVE_NIGHTLY_IMAGES')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
