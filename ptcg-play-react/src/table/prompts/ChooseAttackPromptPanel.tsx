import { useEffect, useState } from 'react';
import type { TFunction } from 'i18next';
import type { Card, ChooseAttackPrompt } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { CardFace } from '../../components/cards/CardFace';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import type { CardInfoTableAction } from '../../card-info/CardInfoPane';
import { ShellButton } from '../../components/ui/ShellButton';
import { useSnackbar } from '../../context/SnackbarContext';
import styles from './TablePromptLayer.module.css';

export type ChooseAttackPromptPanelProps = {
  prompt: ChooseAttackPrompt;
  localGame: LocalGameState;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function ChooseAttackPromptPanel(props: ChooseAttackPromptPanelProps) {
  const { prompt, localGame, catalog, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel } = prompt.options;
  const { showSnackbar } = useSnackbar();
  const [detail, setDetail] = useState<{ card: Card; index: number } | null>(null);

  useEffect(() => {
    setDetail(null);
  }, [prompt.id]);

  const title = t('PROMPT_CHOOSE_ATTACK_TITLE', { defaultValue: 'Choose attack' });
  const enableAttack = !localGame.deleted;

  const onAttackSelected = (index: number, action: CardInfoTableAction): boolean => {
    if (!action.attack) {
      return true;
    }
    const blocked = prompt.options.blocked.some(
      (b) => b.index === index && b.attack === action.attack,
    );
    if (blocked) {
      showSnackbar(gameMessageText(t, prompt.options.blockedMessage));
      return false;
    }
    resolve(prompt.id, { index, attack: action.attack });
    return true;
  };

  return (
    <>
      <div className={styles.backdrop} role="presentation">
        <div className={`${styles.panel} ${styles.panelWide}`} role="dialog" aria-modal="true">
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>

          <div className={styles.chooseCardsGrid}>
            {prompt.cards.map((card, index) => (
              <button
                key={`${index}-${card.id}-${card.fullName}`}
                type="button"
                className={styles.chooseCardBtn}
                onClick={() => setDetail({ card, index })}
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
            ))}
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
          </div>
        </div>
      </div>
      {detail ? (
        <CardInfoPopup
          card={detail.card}
          catalog={catalog}
          players={localGame.state.players}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
          isInGame
          options={{ enableAttack }}
          onTableAction={(action) => onAttackSelected(detail.index, action)}
        />
      ) : null}
    </>
  );
}
