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
import type { AttachEnergyPrompt, Card } from 'ptcg-server';
import { PlayerType } from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { CardFace } from '../../components/cards/CardFace';
import { ShellButton } from '../../components/ui/ShellButton';
import { cn } from '../../utils/cn';
import {
  attachEnergyToRows,
  buildAttachEnergyFilterMap,
  computeAttachEnergyInvalid,
  isEnergyIndexEligible,
  matchesBlockedToTarget,
  snapshotPokemonRows,
  tryAssignDrop,
  type AttachAssignment,
} from './attachEnergyPromptModel';
import { buildPokemonPromptRows, type PokemonItem, type PokemonRow } from './pokemonPromptRows';
import { findItemByTarget } from './removeDamagePromptModel';
import styles from './AttachEnergyPromptPanel.module.css';

function energyDragId(originalIndex: number): string {
  return `attach-energy-${originalIndex}`;
}

function pokeDropId(target: PokemonItem['target']): string {
  return `attach-poke-${target.player}-${target.slot}-${target.index}`;
}

function parseEnergyDragId(id: string): number | null {
  const m = /^attach-energy-(\d+)$/.exec(id);
  return m ? parseInt(m[1], 10) : null;
}

function parsePokeDropId(id: string): PokemonItem['target'] | null {
  const m = /^attach-poke-(\d+)-(\d+)-(\d+)$/.exec(id);
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
  originalIndex: number;
  card: Card;
  getScanUrl: (c: Card) => string;
  disabled: boolean;
}) {
  const { originalIndex, card, getScanUrl, disabled } = props;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: energyDragId(originalIndex),
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
      <CardFace src={getScanUrl(card)} name={card.name} />
    </div>
  );
}

function PokemonDroppable(props: {
  id: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const { id, disabled, children } = props;
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      className={cn(styles.dropSlot, isOver && styles.dropSlotOver, disabled && styles.dropSlotDisabled)}
    >
      {children}
    </div>
  );
}

export type AttachEnergyPromptPanelProps = {
  prompt: AttachEnergyPrompt;
  localGame: LocalGameState;
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
};

export function AttachEnergyPromptPanel(props: AttachEnergyPromptPanelProps) {
  const { prompt, localGame, getScanUrl, t, gameMessageText, resolve } = props;
  const { allowCancel, max, blocked, blockedTo } = prompt.options;

  const sourceCards = prompt.cardList.cards;
  const filterMap = useMemo(
    () => buildAttachEnergyFilterMap(sourceCards, prompt.filter, blocked),
    [sourceCards, prompt.filter, blocked],
  );

  const initialRowsRef = useRef<PokemonRow[]>([]);
  const [rows, setRows] = useState<PokemonRow[]>([]);
  const [assignments, setAssignments] = useState<AttachAssignment[]>([]);
  const rowsRef = useRef(rows);
  const assignmentsRef = useRef(assignments);
  rowsRef.current = rows;
  assignmentsRef.current = assignments;

  useEffect(() => {
    const built = buildPokemonPromptRows(
      localGame.state,
      prompt.playerId,
      prompt.playerType,
      prompt.slots,
    );
    const snap = snapshotPokemonRows(built);
    initialRowsRef.current = snap;
    setRows(snapshotPokemonRows(built));
    setAssignments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prompt identity
  }, [prompt.id]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  /** Energy index currently dragged; rendered in `DragOverlay` so it is not clipped by scroll parents. */
  const [overlayEnergyIndex, setOverlayEnergyIndex] = useState<number | null>(null);

  const assignedIndices = useMemo(() => new Set(assignments.map((a) => a.originalIndex)), [assignments]);

  const availableEnergyIndices = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < sourceCards.length; i++) {
      if (assignedIndices.has(i)) {
        continue;
      }
      const card = sourceCards[i];
      if (isEnergyIndexEligible(filterMap, card)) {
        out.push(i);
      }
    }
    return out;
  }, [sourceCards, filterMap, assignedIndices]);

  const isInvalid = useMemo(
    () => computeAttachEnergyInvalid(assignments, prompt.options),
    [assignments, prompt.options],
  );

  const onDragStart = useCallback((event: DragStartEvent) => {
    const oi = parseEnergyDragId(String(event.active.id));
    setOverlayEnergyIndex(oi);
  }, []);

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setOverlayEnergyIndex(null);
      const { active, over } = event;
      if (!over) {
        return;
      }
      const oi = parseEnergyDragId(String(active.id));
      const to = parsePokeDropId(String(over.id));
      if (oi === null || to === null) {
        return;
      }
      const card = sourceCards[oi];
      if (!card || !isEnergyIndexEligible(filterMap, card)) {
        return;
      }
      const prevRows = rowsRef.current;
      const prevAssign = assignmentsRef.current;
      if (prevAssign.some((a) => a.originalIndex === oi)) {
        return;
      }
      const item = findItemByTarget(prevRows, to);
      if (!item || !tryAssignDrop(item, prevAssign, prompt.options)) {
        return;
      }
      setRows(attachEnergyToRows(prevRows, to, card));
      setAssignments([...prevAssign, { to, originalIndex: oi, card }]);
    },
    [sourceCards, filterMap, prompt.options],
  );

  const onDragCancel = useCallback(() => {
    setOverlayEnergyIndex(null);
  }, []);

  const reset = useCallback(() => {
    setRows(snapshotPokemonRows(initialRowsRef.current));
    setAssignments([]);
  }, []);

  const onConfirm = useCallback(() => {
    if (isInvalid) {
      return;
    }
    resolve(
      prompt.id,
      assignments.map((a) => ({ to: a.to, index: a.originalIndex })),
    );
  }, [assignments, isInvalid, prompt.id, resolve]);

  const title = t('PROMPT_ATTACH_ENERGY_TITLE', { defaultValue: 'Attach energy' });

  const overlayCard =
    overlayEnergyIndex !== null ? sourceCards[overlayEnergyIndex] : undefined;

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
                    const dropDisabled =
                      empty ||
                      matchesBlockedToTarget(item.target, blockedTo ?? []) ||
                      assignments.length >= max;
                    return (
                      <div key={dropId} className={styles.pokeCardWrap}>
                        <PokemonDroppable id={dropId} disabled={dropDisabled}>
                          <div className={cn(styles.slotInner, styles.cardPrompt)}>
                            {empty ? (
                              <div className={styles.emptySlot} />
                            ) : (
                              <CardFace src={src} name={card?.name ?? ''} />
                            )}
                          </div>
                        </PokemonDroppable>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={styles.energyViewport}>
              <div className={styles.energyList}>
                {availableEnergyIndices.map((i) => (
                  <EnergyDraggable
                    key={`e-${prompt.id}-${i}`}
                    originalIndex={i}
                    card={sourceCards[i]}
                    getScanUrl={getScanUrl}
                    disabled={assignments.length >= max}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.promptActions}>
            <ShellButton type="button" variant="secondary" onClick={reset} disabled={assignments.length === 0}>
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
            <CardFace src={getScanUrl(overlayCard)} name={overlayCard.name} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
