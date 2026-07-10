import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Format } from 'ptcg-server';
import { useSettings } from '../context/SettingsContext';
import { DECK_FORMAT_OPTIONS } from '../deck-editor/deckFormatOptions';
import { SettingsCardImagesPanel } from './SettingsCardImagesPanel';
import styles from './SettingsPage.module.css';

type SettingsTabId = 'general' | 'images';

export function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const s = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTabId>('general');
  const [draft, setDraft] = useState(() => ({
    holoEnabled: s.holoEnabled,
    showCardName: s.showCardName,
    showTags: s.showTags,
    hiddenFormats: [...s.hiddenFormats],
    board2dPerspectiveEnabled: s.board2dPerspectiveEnabled,
    sfxEnabled: s.sfxEnabled,
    debugMarkersEnabled: s.debugMarkersEnabled,
  }));

  function onHiddenFormatsChange(format: Format, isHidden: boolean) {
    setDraft((d) => {
      if (isHidden) {
        if (d.hiddenFormats.includes(format)) {
          return d;
        }
        return { ...d, hiddenFormats: [...d.hiddenFormats, format] };
      }
      return { ...d, hiddenFormats: d.hiddenFormats.filter((f) => f !== format) };
    });
  }

  function isFormatHidden(format: Format): boolean {
    return draft.hiddenFormats.includes(format);
  }

  function save() {
    s.commitFromSave({
      holoEnabled: draft.holoEnabled,
      showCardName: draft.showCardName,
      showTags: draft.showTags,
      hiddenFormats: draft.hiddenFormats,
      use3dBoardDefault: true,
      board2dPerspectiveEnabled: draft.board2dPerspectiveEnabled,
      sfxEnabled: draft.sfxEnabled,
      debugMarkersEnabled: draft.debugMarkersEnabled,
      sfxVolumePercent: Math.round(s.sfxVolume * 100),
      cardSize: s.cardSize,
      cardTextKerning: s.cardTextKerning,
    });
    navigate(-1);
  }

  const sfxPercent = Math.round(s.sfxVolume * 100);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <nav className={styles.tabNavContainer} aria-label="Settings">
        <div className={styles.tabNav} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'general'}
            className={`${styles.tabButton} ${activeTab === 'general' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'images'}
            className={`${styles.tabButton} ${activeTab === 'images' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('images')}
          >
            {t('PROFILE_CHANGE_CARD_IMAGES')}
          </button>
        </div>
      </nav>

      {activeTab === 'general' ? (
        <div className={styles.content} role="tabpanel">
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.holoEnabled}
              onChange={(e) => setDraft((d) => ({ ...d, holoEnabled: e.target.checked }))}
            />
            Enable Holo Effects
          </label>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.showCardName}
              onChange={(e) => setDraft((d) => ({ ...d, showCardName: e.target.checked }))}
            />
            Show Card Names
          </label>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.showTags}
              onChange={(e) => setDraft((d) => ({ ...d, showTags: e.target.checked }))}
            />
            Show Tags
          </label>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.debugMarkersEnabled}
              onChange={(e) => setDraft((d) => ({ ...d, debugMarkersEnabled: e.target.checked }))}
            />
            Debug Markers Turned On
          </label>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.board2dPerspectiveEnabled}
              onChange={(e) =>
                setDraft((d) => ({ ...d, board2dPerspectiveEnabled: e.target.checked }))
              }
            />
            3D Board Perspective
          </label>

          <div className={styles.sliderBlock}>
            <label htmlFor="settings-card-size">Card Size</label>
            <input
              id="settings-card-size"
              type="range"
              min={50}
              max={200}
              step={10}
              value={s.cardSize}
              onChange={(e) => s.setCardSize(parseInt(e.target.value, 10))}
            />
            <span className={styles.sliderValue}>{s.cardSize}%</span>
          </div>

          <div className={styles.sliderBlock}>
            <label htmlFor="settings-kerning">Card Text Kerning</label>
            <input
              id="settings-kerning"
              type="range"
              min={-2}
              max={4}
              step={0.1}
              value={s.cardTextKerning}
              onChange={(e) => s.setCardTextKerning(parseFloat(e.target.value))}
            />
            <span className={styles.sliderValue}>{s.cardTextKerning.toFixed(1)}px</span>
          </div>

          <label className={styles.row}>
            <input
              type="checkbox"
              checked={draft.sfxEnabled}
              onChange={(e) => setDraft((d) => ({ ...d, sfxEnabled: e.target.checked }))}
            />
            Sound Effects
          </label>

          <div className={styles.sliderBlock}>
            <label htmlFor="settings-sfx-vol">Sound Effects Volume</label>
            <input
              id="settings-sfx-vol"
              type="range"
              min={0}
              max={100}
              step={5}
              value={sfxPercent}
              onChange={(e) => s.setSfxVolume(parseInt(e.target.value, 10) / 100)}
            />
            <span className={styles.sliderValue}>{sfxPercent}%</span>
          </div>

          <div className={styles.hiddenFormats}>
            <span className={styles.sectionLabel}>Hidden Formats</span>
            <div className={styles.formatList}>
              {DECK_FORMAT_OPTIONS.map(({ value, labelKey }) => (
                <label key={value}>
                  <input
                    type="checkbox"
                    checked={isFormatHidden(value)}
                    onChange={(e) => onHiddenFormatsChange(value, e.target.checked)}
                  />
                  {t(labelKey)}
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div role="tabpanel">
          <SettingsCardImagesPanel />
        </div>
      )}

      {activeTab === 'general' ? (
        <div className={styles.actions}>
          <button type="button" className={styles.btn} onClick={() => navigate(-1)}>
            {t('BUTTON_CANCEL')}
          </button>
          <button type="button" className={styles.btnPrimary} onClick={save}>
            {t('BUTTON_SAVE')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
