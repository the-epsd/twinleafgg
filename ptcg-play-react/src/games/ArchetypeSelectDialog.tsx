import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Archetype } from 'ptcg-server';
import { ShellButton } from '../components/ui/ShellButton';
import { ArchetypeIcon } from './ArchetypeIcon';
import { ARCHETYPE_SELECT_OPTIONS } from './archetypeSelectOptions';
import styles from './ArchetypeSelectDialog.module.css';

export type ArchetypeSlotValue = Archetype | null | undefined;

export type ArchetypeSelectDialogProps = {
  open: boolean;
  onClose: () => void;
  initialArchetype1?: Archetype;
  initialArchetype2?: Archetype;
  onSave: (archetype1: ArchetypeSlotValue, archetype2: ArchetypeSlotValue) => void;
};

function slotSelected(slot: ArchetypeSlotValue, mode: 'auto' | 'none' | 'value', value?: Archetype): boolean {
  if (mode === 'auto') {
    return slot === null;
  }
  if (mode === 'none') {
    return slot === undefined;
  }
  return slot === value;
}

export function ArchetypeSelectDialog({
  open,
  onClose,
  initialArchetype1,
  initialArchetype2,
  onSave,
}: ArchetypeSelectDialogProps) {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');
  const [selected1, setSelected1] = useState<ArchetypeSlotValue>(null);
  const [selected2, setSelected2] = useState<ArchetypeSlotValue>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSearchText('');
    setSelected1(initialArchetype1 ?? null);
    setSelected2(initialArchetype2 ?? null);
  }, [open, initialArchetype1, initialArchetype2]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const searchTrimmed = searchText.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!searchTrimmed) {
      return [];
    }
    return ARCHETYPE_SELECT_OPTIONS.filter((o) => o.label.includes(searchTrimmed));
  }, [searchTrimmed]);

  const onConfirm = useCallback(() => {
    onSave(selected1, selected2);
    onClose();
  }, [onSave, onClose, selected1, selected2]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archetype-select-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="archetype-select-title" className={styles.title}>
          {t('REACT_ARCHETYPE_SELECT_TITLE')}
        </h2>
        <div className={styles.content}>
          <div className={styles.searchField}>
            <label className={styles.searchLabel} htmlFor="archetype-select-search">
              {t('REACT_ARCHETYPE_SELECT_SEARCH_LABEL')}
            </label>
            <input
              id="archetype-select-search"
              className={styles.searchInput}
              type="search"
              autoComplete="off"
              placeholder={t('REACT_ARCHETYPE_SELECT_SEARCH_PLACEHOLDER')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <section className={styles.section} aria-labelledby="arch-primary">
            <h3 id="arch-primary" className={styles.sectionTitle}>
              {t('REACT_ARCHETYPE_SELECT_PRIMARY')}
            </h3>
            <div className={styles.quickRow}>
              <button
                type="button"
                className={`${styles.option} ${styles.optionQuick} ${slotSelected(selected1, 'auto') ? styles.optionSelected : ''}`}
                onClick={() => setSelected1(null)}
              >
                <span className={styles.optionLabel}>{t('REACT_ARCHETYPE_SELECT_AUTO')}</span>
              </button>
              <button
                type="button"
                className={`${styles.option} ${styles.optionQuick} ${slotSelected(selected1, 'none') ? styles.optionSelected : ''}`}
                onClick={() => setSelected1(undefined)}
              >
                <span className={styles.optionLabel}>{t('REACT_ARCHETYPE_SELECT_NONE')}</span>
              </button>
            </div>
            {!searchTrimmed ? (
              <p className={styles.typeHint}>{t('REACT_ARCHETYPE_SELECT_TYPE_HINT')}</p>
            ) : filtered.length === 0 ? (
              <p className={styles.noResults}>{t('REACT_ARCHETYPE_SELECT_NO_RESULTS')}</p>
            ) : (
              <div className={styles.gridViewport}>
                <div className={styles.grid}>
                  {filtered.map((archetype) => (
                    <button
                      key={`p-${archetype.value}`}
                      type="button"
                      className={`${styles.option} ${slotSelected(selected1, 'value', archetype.value) ? styles.optionSelected : ''}`}
                      onClick={() => setSelected1(archetype.value)}
                    >
                      <div className={styles.optionInner}>
                        <div className={styles.iconCell}>
                          <ArchetypeIcon archetypes={archetype.value} scale={1.2} />
                        </div>
                        <span className={styles.optionLabel}>{archetype.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className={`${styles.section} ${styles.sectionSecondary}`} aria-labelledby="arch-secondary">
            <h3 id="arch-secondary" className={styles.sectionTitle}>
              {t('REACT_ARCHETYPE_SELECT_SECONDARY')}
            </h3>
            <div className={styles.quickRow}>
              <button
                type="button"
                className={`${styles.option} ${styles.optionQuick} ${slotSelected(selected2, 'auto') ? styles.optionSelected : ''}`}
                onClick={() => setSelected2(null)}
              >
                <span className={styles.optionLabel}>{t('REACT_ARCHETYPE_SELECT_AUTO')}</span>
              </button>
              <button
                type="button"
                className={`${styles.option} ${styles.optionQuick} ${slotSelected(selected2, 'none') ? styles.optionSelected : ''}`}
                onClick={() => setSelected2(undefined)}
              >
                <span className={styles.optionLabel}>{t('REACT_ARCHETYPE_SELECT_NONE')}</span>
              </button>
            </div>
            {!searchTrimmed ? (
              <p className={styles.typeHint}>{t('REACT_ARCHETYPE_SELECT_TYPE_HINT')}</p>
            ) : filtered.length === 0 ? (
              <p className={styles.noResults}>{t('REACT_ARCHETYPE_SELECT_NO_RESULTS')}</p>
            ) : (
              <div className={styles.gridViewport}>
                <div className={styles.grid}>
                  {filtered.map((archetype) => (
                    <button
                      key={`s-${archetype.value}`}
                      type="button"
                      className={`${styles.option} ${slotSelected(selected2, 'value', archetype.value) ? styles.optionSelected : ''}`}
                      onClick={() => setSelected2(archetype.value)}
                    >
                      <div className={styles.optionInner}>
                        <div className={styles.iconCell}>
                          <ArchetypeIcon archetypes={archetype.value} scale={1.2} />
                        </div>
                        <span className={styles.optionLabel}>{archetype.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
        <div className={styles.footer}>
          <ShellButton type="button" variant="plain" onClick={onClose}>
            {t('BUTTON_CANCEL')}
          </ShellButton>
          <ShellButton type="button" variant="plain" onClick={onConfirm}>
            {t('BUTTON_SAVE')}
          </ShellButton>
        </div>
      </div>
    </div>
  );
}
