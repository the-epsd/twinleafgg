import { useEffect, useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import type { TFunction } from 'i18next';
import type { Card, ChooseEnergyPrompt, EnergyMap } from 'ptcg-server';
import { StateUtils } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { CardFace } from '../../components/cards/CardFace';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { EnergyTypeIcon } from '../../card-info/EnergyTypeIcon';
import { ShellButton } from '../../components/ui/ShellButton';
import styles from './TablePromptLayer.module.css';

export type ChooseEnergyPromptPanelProps = {
  prompt: ChooseEnergyPrompt;
  localGame: LocalGameState;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function ChooseEnergyPromptPanel(props: ChooseEnergyPromptPanelProps) {
  const { prompt, localGame, catalog, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel } = prompt.options;
  const cost = prompt.cost;
  const max = cost.length;
  const cards = useMemo(() => prompt.energy.map((e) => e.card), [prompt.energy]);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [detail, setDetail] = useState<Card | null>(null);

  useEffect(() => {
    setSelectedIndices([]);
    setDetail(null);
  }, [prompt.id]);

  const selectedSet = useMemo(() => new Set(selectedIndices), [selectedIndices]);

  const isValid = useMemo(() => {
    const energy: EnergyMap[] = selectedIndices.map((i) => prompt.energy[i]);
    return StateUtils.checkExactEnergy(energy, cost);
  }, [selectedIndices, prompt.energy, cost]);

  const toggleCard = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    const card = cards[index];
    if (e.shiftKey && card) {
      setDetail(card);
      return;
    }
    const pos = selectedIndices.indexOf(index);
    if (pos !== -1) {
      setSelectedIndices((prev) => prev.filter((_, i) => i !== pos));
      return;
    }
    if (selectedIndices.length < max) {
      setSelectedIndices((prev) => [...prev, index]);
    }
  };

  const removeSlot = (slotIndex: number) => {
    setSelectedIndices((prev) => prev.filter((_, i) => i !== slotIndex));
  };

  const title = t('PROMPT_CHOOSE_ENERGY_TITLE', { defaultValue: 'Select Energy' });

  return (
    <>
      <div className={styles.backdrop} role="presentation">
        <div className={`${styles.panel} ${styles.panelWide}`} role="dialog" aria-modal="true">
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>

          <p className={styles.chooseSelectionMeta}>
            {t('REACT_CHOOSE_ENERGY_COUNT', {
              defaultValue: 'Selected {{n}} / {{max}}',
              n: selectedIndices.length,
              max,
            })}
          </p>

          <div className={styles.chooseCardsGrid}>
            {cards.map((card, index) => {
              if (selectedSet.has(index)) {
                return null;
              }
              return (
                <button
                  key={`${index}-${card.id}-${card.fullName}`}
                  type="button"
                  className={styles.chooseCardBtn}
                  disabled={selectedIndices.length >= max}
                  onClick={(e) => toggleCard(index, e)}
                  title={t('REACT_CHOOSE_CARDS_CARD_HINT', {
                    defaultValue: '{{name}} — Shift+click for card info',
                    name: card.name,
                  })}
                >
                  <CardFace
                    card={card}
                    src={getScanUrl(card)}
                    name={card.name}
                    style={{ width: 100, height: 140 }}
                  />
                </button>
              );
            })}
          </div>

          <div
            className={styles.chooseEnergySlots}
            aria-label={t('REACT_CHOOSE_ENERGY_SLOTS', { defaultValue: 'Energy cost slots' })}
          >
            {cost.map((costType, slotIndex) => {
              const energyIndex = selectedIndices[slotIndex];
              const selectedCard = energyIndex !== undefined ? cards[energyIndex] : undefined;
              return (
                <button
                  key={`slot-${slotIndex}-${prompt.id}`}
                  type="button"
                  className={styles.chooseEnergySlot}
                  onClick={() => {
                    if (selectedCard) {
                      removeSlot(slotIndex);
                    }
                  }}
                  disabled={!selectedCard}
                  aria-label={
                    selectedCard
                      ? t('REACT_CHOOSE_ENERGY_SLOT_SELECTED', {
                          defaultValue: 'Selected {{name}}, click to remove',
                          name: selectedCard.name,
                        })
                      : t('REACT_CHOOSE_ENERGY_SLOT_EMPTY', { defaultValue: 'Empty slot' })
                  }
                >
                  {selectedCard ? (
                    <CardFace
                      card={selectedCard}
                      src={getScanUrl(selectedCard)}
                      name={selectedCard.name}
                      style={{ width: 87, height: 120 }}
                    />
                  ) : (
                    <EnergyTypeIcon type={costType} className={styles.chooseEnergySlotIcon} />
                  )}
                </button>
              );
            })}
          </div>

          <div className={styles.actions}>
            {allowCancel ? (
              <ShellButton
                type="button"
                variant="secondary"
                onClick={() => resolve(prompt.id, null)}
                disabled={!!localGame.deleted}
              >
                {t('BUTTON_CANCEL')}
              </ShellButton>
            ) : null}
            <ShellButton
              type="button"
              disabled={!!localGame.deleted || !isValid}
              onClick={() => {
                if (isValid) {
                  resolve(prompt.id, selectedIndices);
                }
              }}
            >
              {t('BUTTON_OK')}
            </ShellButton>
          </div>
        </div>
      </div>
      {detail ? (
        <CardInfoPopup
          card={detail}
          players={localGame.state.players}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
          isInGame
        />
      ) : null}
    </>
  );
}
