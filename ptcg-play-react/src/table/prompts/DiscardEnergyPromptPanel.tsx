import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import type { Card, CardTarget, DiscardEnergyPrompt } from 'ptcg-server';
import { PlayerType } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { CardFace } from '../../components/cards/CardFace';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import {
  buildDiscardEnergyResolvePayload,
  canSelectDiscardSource,
  computeDiscardEnergyInvalid,
  eligibleEnergyCardsForSource,
  hasDiscardEnergySelectionLimit,
  removeDiscardEnergySelection,
  toggleDiscardEnergySelection,
  type DiscardEnergySelection,
} from './discardEnergyPromptModel';
import { buildOriginalCardIndexMap } from './moveEnergyPromptModel';
import { buildPokemonPromptRows, type PokemonItem, type PokemonRow } from './pokemonPromptRows';
import { getPromptPerspectivePlayerId } from './promptPerspective';
import { findItemByTarget, targetsEqual } from './removeDamagePromptModel';
import moveStyles from './MoveEnergyPromptPanel.module.css';
import styles from './DiscardEnergyPromptPanel.module.css';

const s = { ...moveStyles, ...styles };

function displayPokemonCard(item: PokemonItem): Card | undefined {
  return item.cardList.getPokemonCard() as Card | undefined;
}

export type DiscardEnergyPromptPanelProps = {
  prompt: DiscardEnergyPrompt;
  localGame: LocalGameState;
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function DiscardEnergyPromptPanel(props: DiscardEnergyPromptPanelProps) {
  const { prompt, localGame, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel, min, max, blockedFrom, blockedMap } = prompt.options;

  const indexMapRef = useRef<Map<Card, number>>(new Map());
  const [rows, setRows] = useState<PokemonRow[]>([]);
  const [selectedSource, setSelectedSource] = useState<CardTarget | undefined>(undefined);
  const [selections, setSelections] = useState<DiscardEnergySelection[]>([]);

  useEffect(() => {
    const built = buildPokemonPromptRows(
      localGame.state,
      getPromptPerspectivePlayerId(prompt),
      prompt.playerType,
      prompt.slots,
    );
    indexMapRef.current = buildOriginalCardIndexMap(built);
    setRows(built);
    setSelectedSource(undefined);
    setSelections([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prompt identity
  }, [prompt.id]);

  const selectedItem = useMemo(
    () => findItemByTarget(rows, selectedSource),
    [rows, selectedSource],
  );

  const availableEnergyCards = useMemo(() => {
    if (!selectedItem) {
      return [];
    }
    return eligibleEnergyCardsForSource(
      selectedItem,
      prompt.filter,
      blockedMap ?? [],
      selections,
    );
  }, [selectedItem, prompt.filter, blockedMap, selections]);

  const isInvalid = useMemo(
    () => computeDiscardEnergyInvalid(selections, { min, max }),
    [selections, min, max],
  );

  const atMaxSelections = hasDiscardEnergySelectionLimit(max) && selections.length >= max;

  const onSelectSource = useCallback(
    (item: PokemonItem) => {
      if (!canSelectDiscardSource(item, blockedFrom ?? [], prompt.filter, blockedMap ?? [], selections)) {
        return;
      }
      setSelectedSource({ ...item.target });
    },
    [blockedFrom, blockedMap, prompt.filter, selections],
  );

  const onToggleEnergy = useCallback(
    (card: Card) => {
      if (selectedSource === undefined) {
        return;
      }
      setSelections((prev) => toggleDiscardEnergySelection(prev, selectedSource, card, max));
    },
    [selectedSource, max],
  );

  const onRemoveSelection = useCallback((selection: DiscardEnergySelection) => {
    setSelections((prev) => removeDiscardEnergySelection(prev, selection));
  }, []);

  const reset = useCallback(() => {
    setSelections([]);
    setSelectedSource(undefined);
  }, []);

  const onConfirm = useCallback(() => {
    if (isInvalid) {
      return;
    }
    resolve(
      prompt.id,
      buildDiscardEnergyResolvePayload(selections, indexMapRef.current),
    );
  }, [isInvalid, prompt.id, resolve, selections]);

  const title = t('PROMPT_DISCARD_ENERGY_TITLE', { defaultValue: 'Discard energy' });
  const selectionCountLabel =
    hasDiscardEnergySelectionLimit(max) ? `${selections.length}/${max}` : `${selections.length}`;

  return (
    <div className={s.backdrop} role="presentation">
      <div className={s.panel} role="dialog" aria-modal="true">
        <div className={s.promptTitle}>
          <h2 className={s.title}>{title}</h2>
        </div>

        <div className={s.promptContent}>
          <p className={s.message}>{gameMessageText(t, prompt.message)}</p>

          <div className={s.pokemonPane}>
            {rows.map((row, rowIdx) => (
              <div
                key={`${row.playerType}-${row.items[0]?.target.slot ?? 's'}-${rowIdx}`}
                className={cn(
                  s.pokemonRow,
                  row.playerType === PlayerType.TOP_PLAYER && s.pokemonRowUpsideDown,
                )}
              >
                {row.items.map((item) => {
                  const empty = item.cardList.cards.length === 0;
                  const card = displayPokemonCard(item);
                  const src = !empty && card ? getScanUrl(card) : '';
                  const isSource =
                    selectedSource !== undefined && targetsEqual(item.target, selectedSource);
                  const sourceDisabled =
                    empty ||
                    !canSelectDiscardSource(
                      item,
                      blockedFrom ?? [],
                      prompt.filter,
                      blockedMap ?? [],
                      selections,
                    );
                  return (
                    <div key={`${item.target.player}-${item.target.slot}-${item.target.index}`} className={s.pokeCardWrap}>
                      <button
                        type="button"
                        className={cn(
                          s.sourceButton,
                          isSource && s.sourceSelected,
                          sourceDisabled && s.sourceButtonDisabled,
                        )}
                        disabled={sourceDisabled}
                        onClick={() => onSelectSource(item)}
                        aria-pressed={isSource}
                      >
                        <div className={cn(s.slotInner, s.cardPrompt)}>
                          {empty ? (
                            <div className={s.emptySlot} />
                          ) : (
                            <CardFace card={card ?? null} src={src} name={card?.name ?? ''} />
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={s.energyViewport}>
            {selectedItem ? (
              availableEnergyCards.length > 0 ? (
                <div className={s.energyList}>
                  {availableEnergyCards.map((card) => {
                    const selected = selections.some(
                      (s) =>
                        s.card === card &&
                        selectedSource !== undefined &&
                        targetsEqual(s.from, selectedSource),
                    );
                    return (
                      <button
                        key={`${card.fullName}-${card.id ?? card.name}`}
                        type="button"
                        className={cn(
                          s.cardPrompt,
                          s.energySelectable,
                          selected && s.energySelected,
                          atMaxSelections && !selected && s.energySelectableDisabled,
                        )}
                        disabled={atMaxSelections && !selected}
                        onClick={() => onToggleEnergy(card)}
                        aria-pressed={selected}
                      >
                        <CardFace card={card} src={getScanUrl(card)} name={card.name} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className={s.energyHint}>
                  {t('REACT_DISCARD_ENERGY_NONE_ON_POKEMON', {
                    defaultValue: 'No eligible energy cards on this Pokémon.',
                  })}
                </p>
              )
            ) : (
              <p className={s.energyHint}>
                {t('REACT_DISCARD_ENERGY_SELECT_SOURCE', {
                  defaultValue: 'Select a Pokémon to discard energy from.',
                })}
              </p>
            )}
          </div>

          <div className={s.selectedPane}>
            <h3 className={s.selectedHeading}>
              {t('REACT_DISCARD_ENERGY_SELECTED', { defaultValue: 'Selected energy' })}
              {' '}
              <span
                className={cn(
                  s.selectionCount,
                  isInvalid && selections.length > 0 && s.selectionCountInvalid,
                )}
              >
                ({selectionCountLabel})
              </span>
            </h3>
            {selections.length > 0 ? (
              <div className={s.selectedList}>
                {selections.map((selection) => (
                  <button
                    key={`${selection.from.player}-${selection.from.slot}-${selection.from.index}-${selection.card.fullName}`}
                    type="button"
                    className={cn(s.cardPrompt, s.selectedCard)}
                    onClick={() => onRemoveSelection(selection)}
                    title={t('REACT_DISCARD_ENERGY_REMOVE', { defaultValue: 'Remove' })}
                  >
                    <CardFace
                      card={selection.card}
                      src={getScanUrl(selection.card)}
                      name={selection.card.name}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <p className={s.selectedEmpty}>
                {t('REACT_DISCARD_ENERGY_NONE_SELECTED', {
                  defaultValue: 'No energy selected.',
                })}
              </p>
            )}
          </div>
        </div>

        <div className={s.promptActions}>
          <ShellButton type="button" variant="secondary" onClick={reset} disabled={selections.length === 0}>
            {t('PROMPT_RESET', { defaultValue: 'Reset' })}
          </ShellButton>
          <div className={s.actionsGrow} aria-hidden />
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
            variant="secondary"
            disabled={!!localGame.deleted || isInvalid}
            onClick={onConfirm}
          >
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
    </div>
  );
}
