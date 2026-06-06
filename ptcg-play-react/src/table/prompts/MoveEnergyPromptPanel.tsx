import {
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import type { Card, CardTarget, MoveEnergyPrompt } from 'ptcg-server';
import { PlayerType } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { CardFace } from '../../components/cards/CardFace';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import { snapshotPokemonRows } from './attachEnergyPromptModel';
import {
  appendMoveResult,
  buildBlockedCardsForSource,
  buildMoveEnergyResolvePayload,
  buildOriginalCardIndexMap,
  canDropOnTarget,
  canSelectSource,
  computeMoveEnergyInvalid,
  filterEligibleEnergyCards,
  hasMoveEnergyTransferLimit,
  moveEnergyBetweenRows,
  type MoveEnergyTransfer,
} from './moveEnergyPromptModel';
import { buildPokemonPromptRows, type PokemonItem, type PokemonRow } from './pokemonPromptRows';
import { findItemByTarget, targetsEqual } from './removeDamagePromptModel';
import styles from './MoveEnergyPromptPanel.module.css';

function energyDragId(card: Card): string {
  return `move-energy-${card.fullName}-${card.id ?? card.name}`;
}

function pokeDropId(target: CardTarget): string {
  return `move-poke-${target.player}-${target.slot}-${target.index}`;
}

function parseEnergyDragId(id: string, eligibleCards: Card[]): Card | null {
  for (const card of eligibleCards) {
    if (energyDragId(card) === id) {
      return card;
    }
  }
  return null;
}

function parsePokeDropId(id: string): CardTarget | null {
  const m = /^move-poke-(\d+)-(\d+)-(\d+)$/.exec(id);
  if (!m) {
    return null;
  }
  return {
    player: parseInt(m[1], 10),
    slot: parseInt(m[2], 10),
    index: parseInt(m[3], 10),
  };
}

function displayPokemonCard(item: PokemonItem): Card | undefined {
  return item.cardList.getPokemonCard() as Card | undefined;
}

function EnergyDraggable(props: {
  card: Card;
  getScanUrl: (c: Card) => string;
  disabled: boolean;
}) {
  const { card, getScanUrl, disabled } = props;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: energyDragId(card),
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        styles.cardPrompt,
        styles.energyDraggable,
        isDragging && styles.energyDraggableDragging,
        disabled && styles.energyDraggableDisabled,
      )}
      {...listeners}
      {...attributes}
    >
      <CardFace card={card} src={getScanUrl(card)} name={card.name} />
    </div>
  );
}

function PokemonDroppable(props: {
  id: string;
  disabled: boolean;
  showBlocked?: boolean;
  children: React.ReactNode;
}) {
  const { id, disabled, showBlocked = false, children } = props;
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        styles.dropSlot,
        isOver && !disabled && styles.dropSlotOver,
        showBlocked && styles.dropSlotBlocked,
      )}
    >
      {children}
    </div>
  );
}

export type MoveEnergyPromptPanelProps = {
  prompt: MoveEnergyPrompt;
  localGame: LocalGameState;
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function MoveEnergyPromptPanel(props: MoveEnergyPromptPanelProps) {
  const { prompt, localGame, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel, min, max, blockedFrom, blockedTo, blockedMap } = prompt.options;

  const initialRowsRef = useRef<PokemonRow[]>([]);
  const indexMapRef = useRef<Map<Card, number>>(new Map());

  const [rows, setRows] = useState<PokemonRow[]>([]);
  const [selectedSource, setSelectedSource] = useState<CardTarget | undefined>(undefined);
  const [transfers, setTransfers] = useState<MoveEnergyTransfer[]>([]);
  const rowsRef = useRef(rows);
  const selectedSourceRef = useRef(selectedSource);
  const transfersRef = useRef(transfers);
  rowsRef.current = rows;
  selectedSourceRef.current = selectedSource;
  transfersRef.current = transfers;

  useEffect(() => {
    const built = buildPokemonPromptRows(
      localGame.state,
      prompt.playerId,
      prompt.playerType,
      prompt.slots,
    );
    const snap = snapshotPokemonRows(built);
    initialRowsRef.current = snap;
    indexMapRef.current = buildOriginalCardIndexMap(snap);
    setRows(snapshotPokemonRows(built));
    setSelectedSource(undefined);
    setTransfers([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prompt identity
  }, [prompt.id]);

  const selectedItem = useMemo(
    () => findItemByTarget(rows, selectedSource),
    [rows, selectedSource],
  );

  const eligibleEnergyCards = useMemo(() => {
    if (!selectedItem) {
      return [];
    }
    const blockedCards = buildBlockedCardsForSource(selectedItem, blockedMap ?? []);
    return filterEligibleEnergyCards(selectedItem, prompt.filter, blockedCards);
  }, [selectedItem, prompt.filter, blockedMap]);

  const movedCardSet = useMemo(() => new Set(transfers.map((tr) => tr.card)), [transfers]);

  const visibleEnergyCards = useMemo(
    () => eligibleEnergyCards.filter((card) => !movedCardSet.has(card)),
    [eligibleEnergyCards, movedCardSet],
  );

  const isInvalid = useMemo(
    () => computeMoveEnergyInvalid(transfers, { min, max }),
    [transfers, min, max],
  );

  const atMaxTransfers = hasMoveEnergyTransferLimit(max) && transfers.length >= max;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const [overlayCard, setOverlayCard] = useState<Card | null>(null);

  const onSelectSource = useCallback(
    (item: PokemonItem) => {
      if (!canSelectSource(item, blockedFrom ?? [])) {
        return;
      }
      setSelectedSource({ ...item.target });
    },
    [blockedFrom],
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const card = parseEnergyDragId(String(event.active.id), eligibleEnergyCards);
      setOverlayCard(card);
    },
    [eligibleEnergyCards],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setOverlayCard(null);
      const { active, over } = event;
      if (!over) {
        return;
      }
      const source = selectedSourceRef.current;
      if (source === undefined) {
        return;
      }
      const card = parseEnergyDragId(String(active.id), eligibleEnergyCards);
      const to = parsePokeDropId(String(over.id));
      if (card === null || to === null) {
        return;
      }
      if (targetsEqual(source, to)) {
        return;
      }
      const prevRows = rowsRef.current;
      const toItem = findItemByTarget(prevRows, to);
      if (!toItem || !canDropOnTarget(toItem, source, blockedTo ?? [])) {
        return;
      }
      if (atMaxTransfers && !transfersRef.current.some((tr) => tr.card === card)) {
        return;
      }
      const nextTransfer: MoveEnergyTransfer = { from: source, to, card };
      setRows(moveEnergyBetweenRows(prevRows, source, to, card));
      setTransfers((prev) => appendMoveResult(prev, nextTransfer));
    },
    [eligibleEnergyCards, blockedTo, atMaxTransfers],
  );

  const onDragCancel = useCallback(() => {
    setOverlayCard(null);
  }, []);

  const reset = useCallback(() => {
    setRows(snapshotPokemonRows(initialRowsRef.current));
    setTransfers([]);
  }, []);

  const onConfirm = useCallback(() => {
    if (isInvalid) {
      return;
    }
    resolve(prompt.id, buildMoveEnergyResolvePayload(transfers, indexMapRef.current));
  }, [isInvalid, prompt.id, resolve, transfers]);

  const title = t('PROMPT_MOVE_ENERGY_TITLE', { defaultValue: 'Move energy' });

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={onDragCancel}>
      <div className={styles.backdrop} role="presentation">
        <div className={styles.panel} role="dialog" aria-modal="true">
          <div className={styles.promptTitle}>
            <h2 className={styles.title}>{title}</h2>
          </div>

          <div className={styles.promptContent}>
            <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>

            <div className={styles.pokemonPane}>
              {rows.map((row, rowIdx) => (
                <div
                  key={`${row.playerType}-${row.items[0]?.target.slot ?? 's'}-${rowIdx}`}
                  className={cn(
                    styles.pokemonRow,
                    row.playerType === PlayerType.TOP_PLAYER && styles.pokemonRowUpsideDown,
                  )}
                >
                  {row.items.map((item) => {
                    const empty = item.cardList.cards.length === 0;
                    const card = displayPokemonCard(item);
                    const src = !empty && card ? getScanUrl(card) : '';
                    const dropId = pokeDropId(item.target);
                    const isSource = selectedSource !== undefined && targetsEqual(item.target, selectedSource);
                    const sourceDisabled = !canSelectSource(item, blockedFrom ?? []);
                    const dropDisabled =
                      selectedSource === undefined ||
                      empty ||
                      !canDropOnTarget(item, selectedSource, blockedTo ?? []) ||
                      atMaxTransfers;
                    const showDropBlocked =
                      selectedSource !== undefined &&
                      (empty || !canDropOnTarget(item, selectedSource, blockedTo ?? []) || atMaxTransfers);
                    return (
                      <div key={dropId} className={styles.pokeCardWrap}>
                        <PokemonDroppable
                          id={dropId}
                          disabled={dropDisabled}
                          showBlocked={showDropBlocked}
                        >
                          <div
                            role="button"
                            tabIndex={sourceDisabled ? -1 : 0}
                            className={cn(
                              styles.sourceButton,
                              isSource && styles.sourceSelected,
                              sourceDisabled && styles.sourceButtonDisabled,
                            )}
                            onClick={() => !sourceDisabled && onSelectSource(item)}
                            onKeyDown={(e) => {
                              if (!sourceDisabled && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault();
                                onSelectSource(item);
                              }
                            }}
                            aria-pressed={isSource}
                            aria-disabled={sourceDisabled}
                          >
                            <div className={cn(styles.slotInner, styles.cardPrompt)}>
                              {empty ? (
                                <div className={styles.emptySlot} />
                              ) : (
                                <CardFace card={card ?? null} src={src} name={card?.name ?? ''} />
                              )}
                            </div>
                          </div>
                        </PokemonDroppable>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.energyViewport}>
              {selectedItem ? (
                <div className={styles.energyList}>
                  {visibleEnergyCards.map((card) => (
                    <EnergyDraggable
                      key={energyDragId(card)}
                      card={card}
                      getScanUrl={getScanUrl}
                      disabled={atMaxTransfers}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles.energyHint}>
                  {t('REACT_MOVE_ENERGY_SELECT_SOURCE', {
                    defaultValue: 'Select a Pokémon to move energy from.',
                  })}
                </p>
              )}
            </div>
          </div>

          <div className={styles.promptActions}>
            <ShellButton type="button" variant="secondary" onClick={reset} disabled={transfers.length === 0}>
              {t('PROMPT_RESET', { defaultValue: 'Reset' })}
            </ShellButton>
            <div className={styles.actionsGrow} aria-hidden />
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

      <DragOverlay zIndex={2000} dropAnimation={null} className={styles.dragOverlay}>
        {overlayCard ? (
          <div className={cn(styles.cardPrompt, styles.energyDraggable, styles.dragOverlayCard)}>
            <CardFace card={overlayCard} src={getScanUrl(overlayCard)} name={overlayCard.name} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
