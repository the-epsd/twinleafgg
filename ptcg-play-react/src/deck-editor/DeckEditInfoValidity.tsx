import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Card } from 'ptcg-server';
import { Format, SuperType } from 'ptcg-server';
import { formatOptionLabel } from './formatLabelI18n';
import { FormatValidator } from './formatValidator';
import type { DeckSlot } from './types';
import styles from './DeckEditInfoValidity.module.css';

export type DeckEditInfoValidityProps = {
  slots: DeckSlot[];
  allCards: Card[];
};

export function DeckEditInfoValidity({ slots, allCards }: DeckEditInfoValidityProps) {
  const { t } = useTranslation();
  const { total, pokemon, trainer, energy } = useMemo(() => {
    let t = 0;
    let p = 0;
    let tr = 0;
    let e = 0;
    for (const s of slots) {
      t += s.count;
      if (s.card.superType === SuperType.POKEMON) {
        p += s.count;
      } else if (s.card.superType === SuperType.TRAINER) {
        tr += s.count;
      } else if (s.card.superType === SuperType.ENERGY) {
        e += s.count;
      }
    }
    return { total: t, pokemon: p, trainer: tr, energy: e };
  }, [slots]);

  const flatCards = useMemo(() => {
    const list: Card[] = [];
    for (const s of slots) {
      for (let i = 0; i < s.count; i++) {
        list.push(s.card);
      }
    }
    return list;
  }, [slots]);

  const deferredFlat = useDeferredValue(flatCards);
  const deferredAll = useDeferredValue(allCards);

  const [validFormats, setValidFormats] = useState<Format[]>([]);

  useEffect(() => {
    if (deferredFlat.length === 0) {
      startTransition(() => setValidFormats([]));
      return;
    }
    startTransition(() => {
      setValidFormats(FormatValidator.getValidFormatsForCardList(deferredFlat, deferredAll));
    });
  }, [deferredFlat, deferredAll]);

  return (
    <footer className={styles.bar}>
      <div className={styles.counts}>
        <span>{t('DECK_VALIDITY_CARDS_TOTAL', { count: total })}</span>
        <span>{t('DECK_VALIDITY_POKEMON', { count: pokemon })}</span>
        <span>{t('DECK_VALIDITY_TRAINER', { count: trainer })}</span>
        <span>{t('DECK_VALIDITY_ENERGY', { count: energy })}</span>
      </div>
      <div className={styles.formats}>
        {flatCards.length === 0 ? (
          <span className={styles.chipMuted}>{t('DECK_VALIDITY_ADD_CARDS')}</span>
        ) : deferredFlat.length !== flatCards.length ? (
          <span className={styles.chipMuted}>{t('DECK_VALIDITY_UPDATING')}</span>
        ) : validFormats.length === 0 ? (
          <span className={styles.chipMuted}>{t('DECK_VALIDITY_NO_FORMATS')}</span>
        ) : (
          validFormats.map((f) => (
            <span key={f} className={styles.chip} title={t('DECK_EDIT_LEGAL_FOR_CARD')}>
              {formatOptionLabel(t, f)}
            </span>
          ))
        )}
      </div>
    </footer>
  );
}
