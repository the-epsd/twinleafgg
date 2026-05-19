import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { merge } from 'rxjs';
import type {
  AlertPrompt,
  AttachEnergyPrompt,
  Card,
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  ChoosePrizePrompt,
  ConfirmCardsPrompt,
  ConfirmPrompt,
  PutDamagePrompt,
  RemoveDamagePrompt,
  SelectPrompt,
  ShowCardsPrompt,
  ShowMulliganPrompt,
  WaitPrompt,
  ChooseEnergyPrompt,
} from 'ptcg-server';
import type { LocalGameState } from '../types/localGameState';
import { activeGamePrompt } from '../activeGamePrompt';
import { BoardInteractionService } from '../BoardInteractionService';
import { ShellButton } from '../../components/ui/ShellButton';
import { CardFace } from '../../components/cards/CardFace';
import { CardInfoPopup } from '../../card-info/CardInfoPopup';
import { CheckboxField } from '../../components/ui/CheckboxField';
import styles from './TablePromptLayer.module.css';
import { AttachEnergyPromptPanel } from './AttachEnergyPromptPanel';
import { ChooseEnergyPromptPanel } from './ChooseEnergyPromptPanel';
import { PutDamageOverlay } from './PutDamageOverlay';
import { RemoveDamageOverlay } from './RemoveDamageOverlay';
import { scanBlockedOwnZeroDamageFromState } from './pokemonPromptRows';
import { BOARD3D_ATTACK_ANIMATION_DURATION_SEC } from '../board3d/services/board-3d-animation.service';

const CHOOSE_CARDS_CARD_BACK = '/assets/cardback.png';

/** Visual prize numbers (match Angular board layout). */
const PRIZE_SLOT_LABELS = [5, 6, 3, 4, 1, 2];

function buildChooseCardsFilterMap(
  cards: Card[],
  filter: ChooseCardsPrompt['filter'],
  blocked: number[],
): Record<string, boolean> {
  const filterMap: Record<string, boolean> = {};
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    let isBlocked = blocked.includes(i);
    if (!isBlocked) {
      for (const key in filter) {
        if (Object.prototype.hasOwnProperty.call(filter, key)) {
          isBlocked =
            isBlocked ||
            (filter as Record<string, unknown>)[key] !== (card as unknown as Record<string, unknown>)[key];
        }
      }
    }
    filterMap[card.fullName] = !isBlocked;
  }
  return filterMap;
}

export type TablePromptLayerProps = {
  localGame: LocalGameState;
  clientId: number;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  boardInteraction: BoardInteractionService;
  onResolvePrompt: (promptId: number, result: unknown) => void | Promise<void>;
  /** Hide Choose prize until 3D KO animation finishes (same server prompt, deferred UI). */
  suppressChoosePrizePrompt?: boolean;
};

function gameMessageText(t: TFunction, message: string | number): string {
  const key = `GAME_MESSAGES.${message}`;
  return t(key, { defaultValue: String(message) });
}

/** Matches legacy server WaitPrompt message used before attack damage (see game-effect useAttack). */
function isAttackAnimationWaitPrompt(wp: WaitPrompt): boolean {
  const m = wp.message;
  if (m === undefined || m === null) {
    return false;
  }
  return String(m).toLowerCase().includes('attack animation');
}

function AttackAnimationWaitPrompt(props: {
  promptId: number;
  boardInteraction: BoardInteractionService;
  resolve: (id: number, result: unknown) => void | Promise<void>;
}) {
  const { promptId, boardInteraction, resolve } = props;
  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      cancelled = true;
      void resolve(promptId, null);
    };

    const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

    void (async () => {
      const pollUntil = Date.now() + 900;
      let p: Promise<void> | null = null;
      while (Date.now() < pollUntil && !cancelled) {
        p = boardInteraction.getPendingAttackAnimationPromise();
        if (p) {
          break;
        }
        await sleep(16);
      }
      if (cancelled) {
        return;
      }
      if (p) {
        await p;
        finish();
        return;
      }
      await sleep(BOARD3D_ATTACK_ANIMATION_DURATION_SEC * 1000);
      finish();
    })();

    return () => {
      cancelled = true;
    };
  }, [promptId, boardInteraction, resolve]);

  return null;
}

function useLocalGameRef(localGame: LocalGameState) {
  const ref = useRef(localGame);
  ref.current = localGame;
  return ref;
}

function useChoosePokemonBoardEffect(
  localGameRef: React.MutableRefObject<LocalGameState>,
  clientId: number,
  boardInteraction: BoardInteractionService,
  onResolvePrompt: (promptId: number, result: unknown) => void,
  choosePokemonPromptId: number | null,
  replay: boolean | undefined,
) {
  useEffect(() => {
    if (choosePokemonPromptId == null) {
      return;
    }

    if (replay) {
      boardInteraction.setReplayMode(true);
      return () => {
        boardInteraction.setReplayMode(false);
      };
    }

    boardInteraction.setReplayMode(false);
    const game = localGameRef.current;
    const prompt = activeGamePrompt(game, clientId);
    if (!prompt || prompt.id !== choosePokemonPromptId || prompt.type !== 'Choose pokemon') {
      return;
    }

    const cp = prompt as ChoosePokemonPrompt;
    const pid = cp.id;
    boardInteraction.startBoardSelection(cp, (targets) => {
      void onResolvePrompt(pid, targets);
    });

    return () => {
      boardInteraction.endBoardSelection();
    };
  }, [choosePokemonPromptId, clientId, boardInteraction, onResolvePrompt, replay]);
}

function useRemoveDamageBoardEffect(
  localGameRef: React.MutableRefObject<LocalGameState>,
  clientId: number,
  boardInteraction: BoardInteractionService,
  removeDamagePromptId: number | null,
  replay: boolean | undefined,
) {
  useEffect(() => {
    if (removeDamagePromptId == null) {
      return;
    }

    if (replay) {
      boardInteraction.setReplayMode(true);
      return () => {
        boardInteraction.setReplayMode(false);
      };
    }

    boardInteraction.setReplayMode(false);
    const game = localGameRef.current;
    const prompt = activeGamePrompt(game, clientId);
    if (!prompt || prompt.id !== removeDamagePromptId || prompt.type !== 'Remove damage') {
      return;
    }

    const rdp = prompt as RemoveDamagePrompt;
    const extra = scanBlockedOwnZeroDamageFromState(
      game.state,
      rdp.playerId,
      rdp.playerType,
      rdp.slots,
    );
    boardInteraction.startRemoveDamageSelection(rdp, extra);

    return () => {
      boardInteraction.endBoardSelection();
    };
  }, [removeDamagePromptId, clientId, boardInteraction, replay]);
}

function usePutDamageBoardEffect(
  localGameRef: React.MutableRefObject<LocalGameState>,
  clientId: number,
  boardInteraction: BoardInteractionService,
  putDamagePromptId: number | null,
  replay: boolean | undefined,
) {
  useEffect(() => {
    if (putDamagePromptId == null) {
      return;
    }

    if (replay) {
      boardInteraction.setReplayMode(true);
      return () => {
        boardInteraction.setReplayMode(false);
      };
    }

    boardInteraction.setReplayMode(false);
    const game = localGameRef.current;
    const prompt = activeGamePrompt(game, clientId);
    if (!prompt || prompt.id !== putDamagePromptId || prompt.type !== 'Put damage') {
      return;
    }

    const pdp = prompt as PutDamagePrompt;
    boardInteraction.startPutDamageSelection(pdp, []);

    return () => {
      boardInteraction.endBoardSelection();
    };
  }, [putDamagePromptId, clientId, boardInteraction, replay]);
}

function ChoosePokemonActionBar(props: {
  boardInteraction: BoardInteractionService;
  message: string;
  allowCancel: boolean;
}) {
  const { t } = useTranslation();
  const { boardInteraction, message, allowCancel } = props;
  const [, setTick] = useState(0);

  useEffect(() => {
    const sub = merge(
      boardInteraction.selectionMode$,
      boardInteraction.selectedTargets$,
      boardInteraction.maxSelections$,
      boardInteraction.minSelections$,
    ).subscribe(() => setTick((x) => x + 1));
    return () => sub.unsubscribe();
  }, [boardInteraction]);

  const valid = boardInteraction.isSelectionValid();
  const active = boardInteraction.isSelectionActive();

  if (!active) {
    return null;
  }

  return (
    <div className={styles.chooseBar}>
      <div className={styles.chooseBarMessage}>{message}</div>
      <div className={styles.chooseBarActions}>
        {allowCancel ? (
          <ShellButton type="button" variant="secondary" onClick={() => boardInteraction.cancelSelection()}>
            {t('BUTTON_CANCEL')}
          </ShellButton>
        ) : null}
        <ShellButton type="button" disabled={!valid} onClick={() => boardInteraction.confirmSelection()}>
          {t('BUTTON_OK')}
        </ShellButton>
      </div>
    </div>
  );
}

export function TablePromptLayer({
  localGame,
  clientId,
  catalog,
  getScanUrl,
  boardInteraction,
  onResolvePrompt,
  suppressChoosePrizePrompt = false,
}: TablePromptLayerProps) {
  const { t } = useTranslation();
  const localGameRef = useLocalGameRef(localGame);
  const activePrompt = activeGamePrompt(localGame, clientId);
  const [, bumpAfterTrainerDelay] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const sub = boardInteraction.trainerEffectPromptDelayEnd$.subscribe(() => bumpAfterTrainerDelay());
    return () => sub.unsubscribe();
  }, [boardInteraction]);

  const suppressTrainerEffectPrompts =
    !localGame.replay && boardInteraction.shouldHideTrainerEffectPrompts();

  const choosePokemonId =
    activePrompt?.type === 'Choose pokemon' && !localGame.replay && !suppressTrainerEffectPrompts
      ? activePrompt.id
      : null;

  const removeDamageId =
    activePrompt?.type === 'Remove damage' && !localGame.replay && !suppressTrainerEffectPrompts
      ? activePrompt.id
      : null;

  const putDamageId =
    activePrompt?.type === 'Put damage' && !localGame.replay && !suppressTrainerEffectPrompts
      ? activePrompt.id
      : null;

  useChoosePokemonBoardEffect(
    localGameRef,
    clientId,
    boardInteraction,
    onResolvePrompt,
    choosePokemonId,
    !!localGame.replay,
  );

  useRemoveDamageBoardEffect(
    localGameRef,
    clientId,
    boardInteraction,
    removeDamageId,
    !!localGame.replay,
  );

  usePutDamageBoardEffect(
    localGameRef,
    clientId,
    boardInteraction,
    putDamageId,
    !!localGame.replay,
  );

  useEffect(() => {
    if (!localGame.replay) {
      return;
    }
    boardInteraction.setReplayMode(true);
    return () => {
      boardInteraction.setReplayMode(false);
    };
  }, [localGame.replay, boardInteraction]);

  const resolve = useCallback(
    (id: number, result: unknown) => {
      void onResolvePrompt(id, result);
    },
    [onResolvePrompt],
  );

  if (localGame.replay) {
    return null;
  }

  if (!activePrompt) {
    return null;
  }

  if (suppressTrainerEffectPrompts) {
    return null;
  }

  const p = activePrompt;

  if (suppressChoosePrizePrompt && p.type === 'Choose prize') {
    return null;
  }

  if (p.type === 'Choose pokemon') {
    const cp = p as ChoosePokemonPrompt;
    const msg = gameMessageText(t, cp.message);
    return (
      <ChoosePokemonActionBar
        boardInteraction={boardInteraction}
        message={msg}
        allowCancel={cp.options.allowCancel}
      />
    );
  }

  if (p.type === 'Confirm') {
    const cp = p as ConfirmPrompt;
    return (
      <div className={styles.backdrop} role="presentation">
        <div className={styles.panel} role="dialog" aria-modal="true">
          <h2 className={styles.title}>{t('PROMPT_CONFIRM_TITLE', { defaultValue: 'Confirm' })}</h2>
          <p className={styles.message}>{gameMessageText(t, cp.message)}</p>
          <div className={styles.actions}>
            <ShellButton variant="secondary" type="button" onClick={() => resolve(cp.id, false)}>
              {t('BUTTON_CANCEL')}
            </ShellButton>
            <ShellButton type="button" onClick={() => resolve(cp.id, true)}>
              {t('BUTTON_OK')}
            </ShellButton>
          </div>
        </div>
      </div>
    );
  }

  if (p.type === 'Alert') {
    const ap = p as AlertPrompt;
    return (
      <div className={styles.backdrop} role="presentation">
        <div className={styles.panel} role="dialog" aria-modal="true">
          <h2 className={styles.title}>{t('ALERT_MESSAGE_TITLE', { defaultValue: 'Message' })}</h2>
          <p className={styles.message}>{gameMessageText(t, ap.message)}</p>
          <div className={styles.actions}>
            <ShellButton type="button" onClick={() => resolve(ap.id, true)}>
              {t('BUTTON_OK')}
            </ShellButton>
          </div>
        </div>
      </div>
    );
  }

  if (p.type === 'Select') {
    const sp = p as SelectPrompt;
    return (
      <SelectPromptPanel key={sp.id} prompt={sp} t={t} gameMessageText={gameMessageText} resolve={resolve} />
    );
  }

  if (p.type === 'WaitPrompt') {
    const wp = p as WaitPrompt;
    // Server used to block attacks on this prompt; 3D board plays motion from the socket event instead.
    if (isAttackAnimationWaitPrompt(wp)) {
      return (
        <AttackAnimationWaitPrompt
          key={wp.id}
          promptId={wp.id}
          boardInteraction={boardInteraction}
          resolve={resolve}
        />
      );
    }
    return (
      <WaitPromptPanel key={wp.id} prompt={wp} t={t} gameMessageText={gameMessageText} resolve={resolve} />
    );
  }

  if (p.type === 'Show cards') {
    const sc = p as ShowCardsPrompt;
    return (
      <ShowCardsPanel
        key={sc.id}
        prompt={sc}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
        confirmResult={null}
      />
    );
  }

  if (p.type === 'Confirm cards') {
    const cc = p as ConfirmCardsPrompt;
    return (
      <ShowCardsPanel
        key={cc.id}
        prompt={cc}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
        confirmResult={true}
        allowCancel={cc.options.allowCancel}
      />
    );
  }

  if (p.type === 'Show mulligan') {
    const sm = p as ShowMulliganPrompt;
    return (
      <ShowMulliganPanel
        key={sm.id}
        prompt={sm}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
      />
    );
  }

  if (p.type === 'Choose cards') {
    const ccp = p as ChooseCardsPrompt;
    return (
      <ChooseCardsPanel
        key={ccp.id}
        prompt={ccp}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
        replay={!!localGame.replay}
      />
    );
  }

  if (p.type === 'Choose prize') {
    const cpp = p as ChoosePrizePrompt;
    return (
      <ChoosePrizePanel
        key={cpp.id}
        prompt={cpp}
        localGame={localGame}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
        replay={!!localGame.replay}
      />
    );
  }

  if (p.type === 'Remove damage') {
    const rdp = p as RemoveDamagePrompt;
    return (
      <RemoveDamageOverlay
        key={rdp.id}
        prompt={rdp}
        localGame={localGame}
        boardInteraction={boardInteraction}
        gameMessageText={gameMessageText}
        resolve={resolve}
      />
    );
  }

  if (p.type === 'Put damage') {
    const pdp = p as PutDamagePrompt;
    return (
      <PutDamageOverlay
        key={pdp.id}
        prompt={pdp}
        localGame={localGame}
        boardInteraction={boardInteraction}
        gameMessageText={gameMessageText}
        resolve={resolve}
      />
    );
  }

  if (p.type === 'Attach energy') {
    const aep = p as AttachEnergyPrompt;
    return (
      <AttachEnergyPromptPanel
        key={aep.id}
        prompt={aep}
        localGame={localGame}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
      />
    );
  }

  if (p.type === 'Choose energy') {
    const cep = p as ChooseEnergyPrompt;
    return (
      <ChooseEnergyPromptPanel
        key={cep.id}
        prompt={cep}
        localGame={localGame}
        catalog={catalog}
        getScanUrl={getScanUrl}
        t={t}
        gameMessageText={gameMessageText}
        resolve={resolve}
      />
    );
  }

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={styles.panel} role="dialog" aria-modal="true">
        <h2 className={styles.title}>
          {t('PROMPT_UNKNOWN_TYPE', {
            type: p.type,
            defaultValue: "Unknown prompt type: '{{type}}'.",
          })}
        </h2>
        <p className={styles.message}>
          {t(
            'REACT_PROMPT_NOT_IMPLEMENTED',
            'This prompt is not supported yet in the React client. You may need the Angular app for this action.',
          )}
        </p>
      </div>
    </div>
  );
}

function ChoosePrizePanel(props: {
  prompt: ChoosePrizePrompt;
  localGame: LocalGameState;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
  replay: boolean;
}) {
  const { prompt, localGame, catalog, getScanUrl, t, gameMessageText, resolve, replay } = props;
  const { count, allowCancel } = prompt.options;

  const { targetPlayer, prizeIndexByGrid } = useMemo(() => {
    const state = localGame.state;
    const promptPlayer = state.players.find((p) => p.id === prompt.playerId);
    const target = prompt.options.useOpponentPrizes
      ? state.players.find((p) => p.id !== prompt.playerId)
      : promptPlayer;
    if (!target) {
      return { targetPlayer: null as null | (typeof promptPlayer), prizeIndexByGrid: [] as (number | undefined)[] };
    }
    const ne = target.prizes.filter((p) => p.cards.length > 0);
    const map: (number | undefined)[] = [];
    for (let gridIdx = 0; gridIdx < 6; gridIdx++) {
      const pile = target.prizes[gridIdx];
      if (!pile || pile.cards.length === 0) {
        map[gridIdx] = undefined;
      } else {
        const idx = ne.indexOf(pile);
        map[gridIdx] = idx >= 0 ? idx : undefined;
      }
    }
    return { targetPlayer: target, prizeIndexByGrid: map };
  }, [localGame.state, prompt.playerId, prompt.options.useOpponentPrizes, prompt.id]);

  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [detail, setDetail] = useState<{ card: Card; facedown: boolean } | null>(null);

  useEffect(() => {
    setSelected([]);
    setRevealed(false);
    setDetail(null);
  }, [prompt.id]);

  const hasSecret = useMemo(() => {
    if (!targetPlayer) return false;
    return targetPlayer.prizes.some(
      (pile) =>
        pile.cards.length > 0 && (prompt.options.isSecret || pile.isSecret),
    );
  }, [targetPlayer, prompt.options.isSecret]);

  const onSlotClick = (gridIndex: number, e: MouseEvent<HTMLButtonElement>) => {
    const neIdx = prizeIndexByGrid[gridIndex];
    if (neIdx === undefined) {
      return;
    }
    const pile = targetPlayer!.prizes[gridIndex];
    const card = pile.cards[0];
    if (e.shiftKey && card) {
      const secretPile = !!(prompt.options.isSecret || pile.isSecret);
      setDetail({ card, facedown: secretPile && (!replay || !revealed) });
      return;
    }
    const isSelected = selected.includes(neIdx);
    if (count === 1) {
      if (isSelected) {
        setSelected([]);
      } else {
        setSelected([neIdx]);
      }
    } else if (isSelected) {
      setSelected((prev) => prev.filter((x) => x !== neIdx));
    } else if (selected.length < count) {
      setSelected((prev) => [...prev, neIdx]);
    }
  };

  const canConfirm =
    selected.length === count && new Set(selected).size === selected.length;

  const title = t('PROMPT_CHOOSE_PRIZE_TITLE', { defaultValue: 'Choose prize' });

  if (!targetPlayer) {
    return (
      <div className={styles.backdrop} role="presentation">
        <div className={styles.panel} role="dialog" aria-modal="true">
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>
            {t('REACT_CHOOSE_PRIZE_NO_PLAYER', { defaultValue: 'Could not resolve prize cards for this prompt.' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.prizeFullscreenRoot} role="presentation">
        <div className={styles.prizeFullscreenOverlay} aria-hidden />
        <div
          className={styles.prizeFullscreenContainer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="choose-prize-title"
        >
          <div className={styles.prizePromptTitle}>
            <h2 id="choose-prize-title">{title}</h2>
            <div className={styles.prizeTitleSpacer} aria-hidden />
          </div>

          <div className={styles.prizePromptMessage}>
            <p>{gameMessageText(t, prompt.message)}</p>
          </div>

          <div className={styles.prizePromptContent}>
            <div className={styles.prizePrizes}>
              <div
                className={styles.prizePrizesGrid}
                data-revealed={revealed ? 'true' : 'false'}
              >
                {prizeIndexByGrid.map((neIdx, gridIdx) => {
                  const pile = targetPlayer.prizes[gridIdx];
                  const empty = !pile || pile.cards.length === 0;
                  const card = pile?.cards[0];
                  const selectedSlot = neIdx !== undefined && selected.includes(neIdx);
                  const secret = !!(pile && (prompt.options.isSecret || pile.isSecret));
                  const useBack = secret && (!replay || !revealed);
                  const src =
                    empty || !card ? '' : useBack ? CHOOSE_CARDS_CARD_BACK : getScanUrl(card);
                  const label = PRIZE_SLOT_LABELS[gridIdx] ?? gridIdx + 1;
                  return (
                    <button
                      key={`prize-${gridIdx}-${prompt.id}`}
                      type="button"
                      disabled={empty}
                      className={`${styles.prizePrizeSlot} ${empty ? styles.prizePrizeSlotEmpty : ''} ${selectedSlot ? styles.prizePrizeSlotSelected : ''}`}
                      onClick={(e) => onSlotClick(gridIdx, e)}
                      title={
                        card
                          ? t('REACT_CHOOSE_CARDS_CARD_HINT', {
                              defaultValue: '{{name}} — Shift+click for card info',
                              name: card.name,
                            })
                          : undefined
                      }
                    >
                      <span className={styles.prizePrizeNumber}>{label}</span>
                      {empty ? (
                        <div className={styles.prizeEmptySlot} />
                      ) : (
                        <CardFace
                          card={useBack ? null : card ?? null}
                          src={src}
                          name={card?.name ?? ''}
                          style={{ width: 90, height: 125 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.prizePromptActions}>
            {replay && hasSecret ? (
              <section className={styles.prizeRevealSection}>
                <CheckboxField
                  id={`choose-prize-reveal-${prompt.id}`}
                  checked={revealed}
                  onChange={() => setRevealed((r) => !r)}
                >
                  {t('CARDS_REVEAL_CARDS', { defaultValue: 'Reveal cards' })}
                </CheckboxField>
              </section>
            ) : null}
            {allowCancel ? (
              <ShellButton
                type="button"
                variant="secondary"
                className={styles.prizePromptCancelBtn}
                onClick={() => resolve(prompt.id, null)}
              >
                {t('BUTTON_CANCEL')}
              </ShellButton>
            ) : null}
            <ShellButton
              type="button"
              variant="primary"
              className={styles.prizePromptConfirmBtn}
              disabled={!canConfirm}
              onClick={() => {
                if (canConfirm) {
                  resolve(prompt.id, selected);
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
          card={detail.card}
          facedown={detail.facedown}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
          isInGame
        />
      ) : null}
    </>
  );
}

function ChooseCardsPanel(props: {
  prompt: ChooseCardsPrompt;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
  replay: boolean;
}) {
  const { prompt, catalog, getScanUrl, t, gameMessageText, resolve, replay } = props;
  const cards = prompt.cards.cards;
  const blocked = prompt.options.blocked ?? [];
  const { min, max, allowCancel, isSecret } = prompt.options;

  const filterMap = useMemo(
    () => buildChooseCardsFilterMap(cards, prompt.filter, blocked),
    [cards, prompt.filter, blocked],
  );

  const items = useMemo(
    () =>
      cards.map((card, index) => ({
        card,
        index,
        isAvailable: filterMap[card.fullName] ?? false,
      })),
    [cards, filterMap],
  );

  const [tab, setTab] = useState<'valid' | 'all'>('valid');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [detail, setDetail] = useState<{ card: Card; index: number } | null>(null);

  useEffect(() => {
    setTab('valid');
    setSelectedIndices([]);
    setRevealed(false);
    setDetail(null);
  }, [prompt.id]);

  const visibleItems = tab === 'valid' ? items.filter((x) => x.isAvailable) : items;

  const toggleIndex = (index: number, isAvailable: boolean) => {
    if (!isAvailable) {
      return;
    }
    setSelectedIndices((prev) => {
      const pos = prev.indexOf(index);
      if (pos !== -1) {
        return [...prev.slice(0, pos), ...prev.slice(pos + 1)];
      }
      if (prev.length >= max) {
        return prev;
      }
      return [...prev, index];
    });
  };

  const selectedCards = selectedIndices.map((i) => cards[i]);
  const canConfirm = prompt.validate(selectedCards);

  const title = t('PROMPT_CHOOSE_CARDS_TITLE', { defaultValue: 'Choose cards' });
  /** Secret: facedown in live play; in replay, facedown until user checks Reveal. */
  const useCardBack = isSecret && (!replay || !revealed);
  const facedownForPopup = useCardBack;

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={`${styles.panel} ${styles.panelWide}`} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>

        {replay && isSecret ? (
          <div className={styles.chooseSecretRow}>
            <CheckboxField
              id={`choose-cards-reveal-${prompt.id}`}
              checked={revealed}
              onChange={() => setRevealed((r) => !r)}
            >
              {t('REACT_REVEAL_SECRET_CARDS', { defaultValue: 'Reveal cards' })}
            </CheckboxField>
          </div>
        ) : null}

        <div className={styles.chooseTabs} role="tablist" aria-label={t('REACT_CARD_FILTER_TABS', { defaultValue: 'Card filter' })}>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'valid'}
            className={`${styles.chooseTab} ${tab === 'valid' ? styles.chooseTabActive : ''}`}
            onClick={() => setTab('valid')}
          >
            {t('CARDS_VALID', { defaultValue: 'Valid' })}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'all'}
            className={`${styles.chooseTab} ${tab === 'all' ? styles.chooseTabActive : ''}`}
            onClick={() => setTab('all')}
          >
            {t('CARDS_ALL', { defaultValue: 'All' })}
          </button>
        </div>

        <p className={styles.chooseSelectionMeta}>
          {t('REACT_CHOOSE_CARDS_COUNT', {
            defaultValue: 'Selected {{n}} (min {{min}}, max {{max}})',
            n: selectedIndices.length,
            min,
            max,
          })}
        </p>

        <div className={styles.chooseCardsGrid}>
          {visibleItems.map(({ card, index, isAvailable }) => {
            const selected = selectedIndices.includes(index);
            const src = useCardBack ? CHOOSE_CARDS_CARD_BACK : getScanUrl(card);
            const disabled = !isAvailable;
            return (
              <button
                key={`${index}-${card.id}-${card.fullName}`}
                type="button"
                className={`${styles.chooseCardBtn} ${selected ? styles.chooseCardBtnSelected : ''} ${disabled ? styles.chooseCardBtnDisabled : ''}`}
                disabled={disabled}
                onClick={(e) => {
                  if (e.shiftKey && !disabled) {
                    setDetail({ card, index });
                    return;
                  }
                  toggleIndex(index, isAvailable);
                }}
                title={t('REACT_CHOOSE_CARDS_CARD_HINT', {
                  defaultValue: '{{name}} — Shift+click for card info',
                  name: card.name,
                })}
              >
                <CardFace
                  card={useCardBack ? null : card}
                  src={src}
                  name={card.name}
                  style={{ width: 100, height: 140 }}
                />
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          {allowCancel ? (
            <ShellButton type="button" variant="secondary" onClick={() => resolve(prompt.id, null)}>
              {t('BUTTON_CANCEL')}
            </ShellButton>
          ) : null}
          <ShellButton
            type="button"
            disabled={!canConfirm}
            onClick={() => {
              if (canConfirm) {
                resolve(prompt.id, selectedIndices);
              }
            }}
          >
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
      {detail ? (
        <CardInfoPopup
          card={detail.card}
          facedown={facedownForPopup}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
          isInGame
        />
      ) : null}
    </div>
  );
}

function SelectPromptPanel(props: {
  prompt: SelectPrompt;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
}) {
  const { prompt: sp, t, gameMessageText, resolve } = props;
  const [idx, setIdx] = useState(sp.options.defaultValue ?? 0);

  useEffect(() => {
    setIdx(sp.options.defaultValue ?? 0);
  }, [sp.id, sp.options.defaultValue]);

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={styles.panel} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{t('PROMPT_SELECT_TITLE', { defaultValue: 'Choose' })}</h2>
        <p className={styles.message}>{gameMessageText(t, sp.message)}</p>
        <div className={styles.selectList}>
          {sp.values.map((value, i) => (
            <label key={`${sp.id}-${i}`} className={styles.selectOption}>
              <input type="radio" name={`select-${sp.id}`} checked={idx === i} onChange={() => setIdx(i)} />
              <span>{t(value, { defaultValue: value })}</span>
            </label>
          ))}
        </div>
        <div className={styles.actions}>
          {sp.options.allowCancel ? (
            <ShellButton type="button" variant="secondary" onClick={() => resolve(sp.id, null)}>
              {t('BUTTON_CANCEL')}
            </ShellButton>
          ) : null}
          <ShellButton type="button" onClick={() => resolve(sp.id, idx)}>
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
    </div>
  );
}

function WaitPromptPanel(props: {
  prompt: WaitPrompt;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
}) {
  const { prompt: wp, t, gameMessageText, resolve } = props;

  useEffect(() => {
    if (!wp.duration || wp.duration <= 0) {
      return;
    }
    const tmr = window.setTimeout(() => resolve(wp.id, null), wp.duration);
    return () => clearTimeout(tmr);
  }, [wp.id, wp.duration, resolve]);

  const msg = wp.message ? gameMessageText(t, wp.message) : t('REACT_PLEASE_WAIT', { defaultValue: 'Please wait…' });

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={styles.panel} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{t('REACT_WAIT', { defaultValue: 'Wait' })}</h2>
        <p className={styles.message}>{msg}</p>
        {!wp.duration ? (
          <div className={styles.actions}>
            <ShellButton type="button" onClick={() => resolve(wp.id, null)}>
              {t('BUTTON_OK')}
            </ShellButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ShowCardsPanel(props: {
  prompt: ShowCardsPrompt | ConfirmCardsPrompt;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
  confirmResult: true | null;
  allowCancel?: boolean;
}) {
  const { prompt, catalog, getScanUrl, t, gameMessageText, resolve, confirmResult, allowCancel } = props;
  const [detail, setDetail] = useState<Card | null>(null);

  useEffect(() => {
    if (confirmResult !== null) {
      return;
    }
    const tmr = window.setTimeout(() => resolve(prompt.id, null), 5000);
    return () => clearTimeout(tmr);
  }, [prompt.id, confirmResult, resolve]);

  const title =
    confirmResult === true
      ? t('PROMPT_CONFIRM_CARDS_TITLE', { defaultValue: 'Confirm cards' })
      : t('CARDS_LIST_OF_CARDS', { defaultValue: 'Cards' });

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={`${styles.panel} ${styles.panelWide}`} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>
        <div className={styles.cardRow}>
          {prompt.cards.map((card: Card, cardIndex) => (
            <button
              key={`${cardIndex}-${card.id}-${card.fullName}`}
              type="button"
              style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
              onClick={() => setDetail(card)}
            >
              <CardFace card={card} src={getScanUrl(card)} name={card.name} style={{ width: 100, height: 140 }} />
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          {confirmResult === true && allowCancel ? (
            <ShellButton type="button" variant="secondary" onClick={() => resolve(prompt.id, null)}>
              {t('BUTTON_CANCEL')}
            </ShellButton>
          ) : null}
          <ShellButton
            type="button"
            onClick={() => resolve(prompt.id, confirmResult === true ? true : null)}
          >
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
      {detail ? (
        <CardInfoPopup
          card={detail}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
        />
      ) : null}
    </div>
  );
}

function ShowMulliganPanel(props: {
  prompt: ShowMulliganPrompt;
  catalog: Card[];
  getScanUrl: (card: Card) => string;
  t: TFunction;
  gameMessageText: (t: TFunction, message: string | number) => string;
  resolve: (id: number, result: unknown) => void;
}) {
  const { prompt, catalog, getScanUrl, t, gameMessageText, resolve } = props;
  const [detail, setDetail] = useState<Card | null>(null);

  return (
    <div className={styles.backdrop} role="presentation">
      <div className={`${styles.panel} ${styles.panelWide}`} role="dialog" aria-modal="true">
        <h2 className={styles.title}>{t('PROMPT_SHOW_MULLIGAN_TITLE', { defaultValue: 'Mulligan' })}</h2>
        <p className={styles.message}>{gameMessageText(t, prompt.message)}</p>
        {prompt.hands.map((hand, hi) => (
          <div key={hi} className={styles.handBlock}>
            <div className={styles.handLabel}>
              {t('REACT_HAND_N', { defaultValue: 'Hand {{n}}', n: hi + 1 })}
            </div>
            <div className={styles.cardRow}>
              {hand.map((card: Card) => (
                <button
                  key={`${hi}-${card.id}-${card.fullName}`}
                  type="button"
                  style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                  onClick={() => setDetail(card)}
                >
                  <CardFace card={card} src={getScanUrl(card)} name={card.name} style={{ width: 88, height: 123 }} />
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className={styles.actions}>
          <ShellButton type="button" onClick={() => resolve(prompt.id, null)}>
            {t('BUTTON_OK')}
          </ShellButton>
        </div>
      </div>
      {detail ? (
        <CardInfoPopup
          card={detail}
          catalog={catalog}
          getScanUrl={getScanUrl}
          onClose={() => setDetail(null)}
        />
      ) : null}
    </div>
  );
}
