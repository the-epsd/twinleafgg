import { BehaviorSubject, Subject } from 'rxjs';
import {
  ChooseCardsPrompt,
  ChoosePokemonPrompt,
  GameMessage,
  MoveDamagePrompt,
  PlayerType,
  PutDamagePrompt,
  RemoveDamagePrompt,
  SlotType,
  type CardTarget,
  type CardType,
  type StateLog,
} from 'ptcg-server';
import { cardTargetKey } from './prompts/removeDamagePromptModel';
import {
  chooseCardsHandIndicesToCards,
  chooseCardsHandIndexToPromptIndex,
  chooseCardsHandTargetsToPromptIndices,
  countEligibleUnselectedSetupHandBasics,
  getChooseHandCardSelectionHandIndices,
  isChooseCardsHandIndexEligible,
  isChooseCardsFromPlayerHand,
  isChooseStartingPokemonsHandPrompt,
  isSetupActivePhaseSkipped,
} from './prompts/chooseCardsHandSelection';

import {
  TRAINER_PLAY_EFFECT_PROMPT_DELAY_MS as SHARED_TRAINER_PLAY_EFFECT_PROMPT_DELAY_MS,
} from './animationTiming';

/** Pause before trainer effect prompts so the hand → board play animation can finish. */
export const TRAINER_PLAY_EFFECT_PROMPT_DELAY_MS = SHARED_TRAINER_PLAY_EFFECT_PROMPT_DELAY_MS;

type SelectionOverlayKind =
  | 'choose-pokemon'
  | 'choose-hand-cards'
  | 'remove-damage'
  | 'move-damage'
  | 'put-damage'
  | 'hand-play-target'
  | null;

export interface BasicEntranceAnimationEvent {
  playerId: number;
  cardId: number | string;
  slot: string;
  index?: number;
}

export interface AbilityAnimationEvent extends BasicEntranceAnimationEvent {
  abilityName: string;
}

export interface AbilityFocusPoint {
  x: number;
  y: number;
}

export interface AbilityFocusAnchor {
  /** Card front face in viewport pixels (perspective quad matching the 3D mesh). */
  polygon: readonly AbilityFocusPoint[];
}

export interface AbilityFocusState {
  abilityName: string;
  anchor: AbilityFocusAnchor | null;
}

export interface CoinFlipAnimationEvent {
  playerId: number;
  result: boolean;
}

export interface AttackEffectEvent {
  playerId: number;
  cardId: number | string;
  slot: string;
  index?: number;
  cardType: CardType;
  opponentId: number;
  opponentPlayerType?: PlayerType; // Optional: opponent's PlayerType for easier identification
}

export class BoardInteractionService {
  // Tracks whether the board is in selection mode
  private selectionModeSubject = new BehaviorSubject<boolean>(false);
  public selectionMode$ = this.selectionModeSubject.asObservable();

  // Current prompt that requires board selection
  private promptSubject = new BehaviorSubject<ChoosePokemonPrompt | null>(null);
  public prompt$ = this.promptSubject.asObservable();

  // Currently selected targets
  private selectedTargetsSubject = new BehaviorSubject<CardTarget[]>([]);
  public selectedTargets$ = this.selectedTargetsSubject.asObservable();

  // Blocked targets that can't be selected
  private blockedTargetsSubject = new BehaviorSubject<CardTarget[]>([]);
  public blockedTargets$ = this.blockedTargetsSubject.asObservable();

  // Eligible player type and slots for selection
  private eligiblePlayerTypeSubject = new BehaviorSubject<PlayerType | null>(null);
  public eligiblePlayerType$ = this.eligiblePlayerTypeSubject.asObservable();

  private eligibleSlotsSubject = new BehaviorSubject<SlotType[]>([]);
  public eligibleSlots$ = this.eligibleSlotsSubject.asObservable();

  // Selection constraints
  private minSelectionsSubject = new BehaviorSubject<number>(1);
  public minSelections$ = this.minSelectionsSubject.asObservable();

  private maxSelectionsSubject = new BehaviorSubject<number>(1);
  public maxSelections$ = this.maxSelectionsSubject.asObservable();

  // Game logs for tracking events
  private gameLogsSubject = new BehaviorSubject<StateLog[]>([]);
  public gameLogs$ = this.gameLogsSubject.asObservable();

  private selectionCallback: ((targets: CardTarget[] | null) => void) | null = null;

  private chooseCardsPrompt: ChooseCardsPrompt | null = null;
  private chooseCardsCallback: ((indices: number[] | null) => void) | null = null;

  private overlayKind: SelectionOverlayKind = null;

  /** Explicit eligible targets when playing attach/evolution cards from hand. */
  private handPlayEligibleTargets: CardTarget[] = [];

  /** Client pixel position for Remove damage floating +/- HUD (updated by Board3dController each frame). */
  private removeDamageHudAnchor: { x: number; y: number } | null = null;

  /**
   * Per {@link CardTarget} HP damage assigned in the active Put damage prompt (preview before OK).
   * Keys from {@link cardTargetKey}; values are delta HP vs prompt-open snapshot.
   */
  private putDamagePlacementPreview = new Map<string, number>();
  /** Notifies 3D board to refresh red “placing damage” chips. */
  public readonly putDamagePlacementPreview$ = new Subject<void>();

  // Track if we're in replay mode
  private isReplayModeActive = false;

  private evolutionAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public evolutionAnimation$ = this.evolutionAnimationSubject.asObservable();

  private basicAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public basicAnimation$ = this.basicAnimationSubject.asObservable();

  private attackAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public attackAnimation$ = this.attackAnimationSubject.asObservable();

  private abilityAnimationSubject = new Subject<AbilityAnimationEvent>();
  public abilityAnimation$ = this.abilityAnimationSubject.asObservable();

  private abilityFocusSubject = new BehaviorSubject<AbilityFocusState | null>(null);
  public abilityFocus$ = this.abilityFocusSubject.asObservable();

  private coinFlipAnimationSubject = new Subject<CoinFlipAnimationEvent>();
  public coinFlipAnimation$ = this.coinFlipAnimationSubject.asObservable();

  private coinFlipCancelSubject = new Subject<void>();
  public coinFlipCancel$ = this.coinFlipCancelSubject.asObservable();

  private attackEffectSubject = new Subject<AttackEffectEvent>();
  public attackEffect$ = this.attackEffectSubject.asObservable();

  constructor() { }

  /**
   * Update game logs
   */
  public updateGameLogs(logs: StateLog[]): void {
    this.gameLogsSubject.next(logs);
  }

  /**
   * Start board selection mode for choosing a bench Pokémon to retreat into.
   * Uses the same UI as ChoosePokemonPrompt; on completion calls onComplete with the selected bench index.
   */
  public startRetreatSelection(_gameId: number, onComplete: (benchIndex: number) => void): void {
    const syntheticPrompt = new ChoosePokemonPrompt(
      0,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      { min: 1, max: 1, allowCancel: true, blocked: [] }
    );

    this.startBoardSelection(syntheticPrompt, (targets: CardTarget[] | null) => {
      if (targets === null) {
        return;
      }
      const benchTarget = targets.find(t => t.slot === SlotType.BENCH);
      if (benchTarget !== undefined && benchTarget.index !== undefined) {
        onComplete(benchTarget.index);
      }
    });
  }

  /**
   * Glow valid Pokémon and wait for a click when attaching energy/tools or evolving
   * with multiple legal targets.
   */
  public startHandPlayTargetSelection(
    eligibleTargets: CardTarget[],
    onComplete: (target: CardTarget | null) => void,
  ): void {
    if (this.isReplayModeActive) {
      return;
    }

    this.endBoardSelection();

    this.overlayKind = 'hand-play-target';
    this.handPlayEligibleTargets = [...eligibleTargets];
    this.promptSubject.next(null);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next([]);
    this.eligiblePlayerTypeSubject.next(PlayerType.ANY);
    this.eligibleSlotsSubject.next([SlotType.ACTIVE, SlotType.BENCH]);
    this.minSelectionsSubject.next(1);
    this.maxSelectionsSubject.next(1);
    this.selectionCallback = (targets) => {
      onComplete(targets?.[0] ?? null);
    };
  }

  public isHandPlayTargetSelectionActive(): boolean {
    return this.overlayKind === 'hand-play-target';
  }

  public isChooseHandCardsSelectionActive(): boolean {
    return this.overlayKind === 'choose-hand-cards';
  }

  public isChooseStartingPokemonsSelectionActive(): boolean {
    return (
      this.overlayKind === 'choose-hand-cards' &&
      this.chooseCardsPrompt != null &&
      isChooseStartingPokemonsHandPrompt(this.chooseCardsPrompt)
    );
  }

  public getChooseCardsPrompt(): ChooseCardsPrompt | null {
    return this.chooseCardsPrompt;
  }

  public getChooseHandCardSelectionHandIndices(): number[] {
    return getChooseHandCardSelectionHandIndices(this.selectedTargetsSubject.value);
  }

  public removeChooseHandCardByHandIndex(handIndex: number): void {
    if (this.isChooseStartingPokemonsSelectionActive()) {
      return;
    }
    const currentTargets = this.selectedTargetsSubject.value;
    const newTargets = currentTargets.filter(
      t => !(t.slot === SlotType.HAND && t.index === handIndex),
    );
    if (newTargets.length !== currentTargets.length) {
      this.selectedTargetsSubject.next(newTargets);
    }
  }

  /** Initial setup: Active is chosen and cannot be changed. */
  public isSetupActivePhaseSkipped(): boolean {
    const prompt = this.chooseCardsPrompt;
    if (!prompt || !this.isChooseStartingPokemonsSelectionActive()) {
      return false;
    }
    return isSetupActivePhaseSkipped(prompt);
  }

  public isSetupActiveLocked(): boolean {
    if (!this.isChooseStartingPokemonsSelectionActive()) {
      return false;
    }
    if (this.isSetupActivePhaseSkipped()) {
      return true;
    }
    return this.getChooseHandCardSelectionHandIndices().length >= 1;
  }

  public isSetupActiveSelection(handIndex: number): boolean {
    if (this.isSetupActivePhaseSkipped()) {
      return false;
    }
    const indices = this.getChooseHandCardSelectionHandIndices();
    return indices.length > 0 && indices[0] === handIndex;
  }

  /** Initial setup: any placed Basic (Active or Bench) cannot be returned to hand. */
  public isSetupSelectionLocked(handIndex: number): boolean {
    if (!this.isChooseStartingPokemonsSelectionActive()) {
      return false;
    }
    return this.getChooseHandCardSelectionHandIndices().includes(handIndex);
  }

  public hasMoreSetupBenchBasicsAvailable(): boolean {
    const prompt = this.chooseCardsPrompt;
    if (!prompt || !this.isChooseStartingPokemonsSelectionActive()) {
      return false;
    }
    const selected = this.getChooseHandCardSelectionHandIndices();
    if (selected.length >= this.maxSelectionsSubject.value) {
      return false;
    }
    return countEligibleUnselectedSetupHandBasics(prompt, selected) > 0;
  }

  /** Pick a Basic during setup (click or drop). Active is chosen first and locked. */
  public addChooseHandCardForSetup(handIndex: number): boolean {
    if (!this.isChooseStartingPokemonsSelectionActive() || !this.chooseCardsPrompt) {
      return false;
    }
    const target: CardTarget = {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.HAND,
      index: handIndex,
    };
    if (!this.isTargetEligible(target)) {
      return false;
    }

    const currentTargets = this.selectedTargetsSubject.value;
    if (currentTargets.some(t => t.slot === SlotType.HAND && t.index === handIndex)) {
      return false;
    }

    const maxSelections = this.maxSelectionsSubject.value;

    if (!this.isSetupActiveLocked()) {
      this.selectedTargetsSubject.next([target]);
      return true;
    }

    if (currentTargets.length >= maxSelections) {
      return false;
    }

    this.selectedTargetsSubject.next([...currentTargets, target]);
    return true;
  }

  public cancelHandPlayTargetSelection(): void {
    if (this.overlayKind !== 'hand-play-target') {
      return;
    }
    if (this.selectionCallback) {
      this.selectionCallback(null);
    }
    this.endBoardSelection();
  }

  /** End hand-play-target glow without invoking the play callback. */
  public clearHandPlayTargetSelectionSilently(): void {
    if (this.overlayKind !== 'hand-play-target') {
      return;
    }
    this.endBoardSelection();
  }

  /**
   * Start board selection mode for a Pokémon selection prompt
   */
  public startBoardSelection(
    prompt: ChoosePokemonPrompt,
    onComplete: (targets: CardTarget[] | null) => void,
  ): void {
    // Don't start board selection if we're in replay mode
    if (this.isReplayModeActive) {
      return;
    }

    this.overlayKind = 'choose-pokemon';
    this.promptSubject.next(prompt);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next(prompt.options.blocked || []);
    this.eligiblePlayerTypeSubject.next(prompt.playerType);
    this.eligibleSlotsSubject.next(prompt.slots);
    this.minSelectionsSubject.next(prompt.options.min);
    this.maxSelectionsSubject.next(prompt.options.max);
    this.selectionCallback = onComplete;
  }

  /**
   * Select cards from the 3D hand for a Choose cards prompt (own hand only).
   */
  public startChooseHandCardsSelection(
    prompt: ChooseCardsPrompt,
    onComplete: (indices: number[] | null) => void,
  ): void {
    if (this.isReplayModeActive) {
      return;
    }

    if (!isChooseCardsFromPlayerHand(prompt)) {
      return;
    }

    const cards = prompt.cards.cards;
    const blocked = prompt.options.blocked ?? [];
    const blockedTargets: CardTarget[] = [];
    const handCards = prompt.player.hand.cards;
    for (let handIndex = 0; handIndex < handCards.length; handIndex++) {
      const promptIndex = chooseCardsHandIndexToPromptIndex(prompt, handIndex);
      if (
        promptIndex === -1 ||
        !isChooseCardsHandIndexEligible(cards, prompt.filter, blocked, promptIndex)
      ) {
        blockedTargets.push({
          player: PlayerType.BOTTOM_PLAYER,
          slot: SlotType.HAND,
          index: handIndex,
        });
      }
    }

    this.overlayKind = 'choose-hand-cards';
    this.chooseCardsPrompt = prompt;
    this.chooseCardsCallback = onComplete;
    this.promptSubject.next(null);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next(blockedTargets);
    this.eligiblePlayerTypeSubject.next(PlayerType.BOTTOM_PLAYER);
    this.eligibleSlotsSubject.next([SlotType.HAND]);
    this.minSelectionsSubject.next(prompt.options.min);
    this.maxSelectionsSubject.next(prompt.options.max);
    this.selectionCallback = null;
  }

  /**
   * Board overlay for Remove damage: click Pokémon on the table, adjust HP with the bottom bar.
   */
  public startRemoveDamageSelection(prompt: RemoveDamagePrompt, extraBlocked: CardTarget[]): void {
    if (this.isReplayModeActive) {
      return;
    }

    this.removeDamageHudAnchor = null;
    this.overlayKind = 'remove-damage';
    this.promptSubject.next(null);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    // Do not pass prompt.options.blockedFrom: those restrict transfer *sources* on the server
    // (e.g. Munkidori: opponents can't be `from`), not board clicks. Opponents must stay
    // selectable as `to` targets for moving damage onto them.
    this.blockedTargetsSubject.next([...extraBlocked]);
    this.eligiblePlayerTypeSubject.next(prompt.playerType);
    this.eligibleSlotsSubject.next(prompt.slots);
    this.minSelectionsSubject.next(0);
    this.maxSelectionsSubject.next(1);
    this.selectionCallback = null;
  }

  /**
   * Board overlay for Move damage: click Pokémon on the table, adjust HP with the bottom bar.
   */
  public startMoveDamageSelection(prompt: MoveDamagePrompt): void {
    if (this.isReplayModeActive) {
      return;
    }

    this.removeDamageHudAnchor = null;
    this.overlayKind = 'move-damage';
    this.promptSubject.next(null);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    // Do not block 0-damage Pokémon — they are valid move-damage destinations.
    this.blockedTargetsSubject.next([]);
    this.eligiblePlayerTypeSubject.next(prompt.playerType);
    this.eligibleSlotsSubject.next(prompt.slots);
    this.minSelectionsSubject.next(0);
    this.maxSelectionsSubject.next(1);
    this.selectionCallback = null;
  }

  /**
   * Board overlay for Put damage: distribute counters on eligible Pokémon (+/− HUD).
   */
  public startPutDamageSelection(prompt: PutDamagePrompt, extraBlocked: CardTarget[]): void {
    if (this.isReplayModeActive) {
      return;
    }

    this.removeDamageHudAnchor = null;
    this.overlayKind = 'put-damage';
    this.clearPutDamagePlacementPreview();
    this.promptSubject.next(null);
    this.selectionModeSubject.next(true);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next([...prompt.options.blocked, ...extraBlocked]);
    this.eligiblePlayerTypeSubject.next(prompt.playerType);
    this.eligibleSlotsSubject.next(prompt.slots);
    this.minSelectionsSubject.next(0);
    this.maxSelectionsSubject.next(1);
    this.selectionCallback = null;
  }

  public isRemoveDamageOverlayActive(): boolean {
    return this.overlayKind === 'remove-damage';
  }

  public isMoveDamageOverlayActive(): boolean {
    return this.overlayKind === 'move-damage';
  }

  public isDamageTransferOverlayActive(): boolean {
    return this.overlayKind === 'remove-damage' || this.overlayKind === 'move-damage';
  }

  /** Floating +/− HUD for remove/move/put damage prompts (3D anchor). */
  public isFloatingDamageHudOverlayActive(): boolean {
    return (
      this.overlayKind === 'remove-damage'
      || this.overlayKind === 'move-damage'
      || this.overlayKind === 'put-damage'
    );
  }

  public setRemoveDamageHudAnchor(pos: { x: number; y: number } | null): void {
    this.removeDamageHudAnchor = pos;
  }

  public getRemoveDamageHudAnchor(): { x: number; y: number } | null {
    return this.removeDamageHudAnchor;
  }

  public isPutDamageOverlayActive(): boolean {
    return this.overlayKind === 'put-damage';
  }

  /** Updates preview amounts for Put damage distribution; refreshes 3D red chips. */
  public setPutDamagePlacementPreview(placementByTarget: ReadonlyMap<string, number>): void {
    this.putDamagePlacementPreview.clear();
    for (const [k, v] of placementByTarget) {
      if (v > 0) {
        this.putDamagePlacementPreview.set(k, v);
      }
    }
    this.putDamagePlacementPreview$.next();
  }

  public getPutDamagePlacementDelta(target: CardTarget): number {
    return this.putDamagePlacementPreview.get(cardTargetKey(target)) ?? 0;
  }

  private clearPutDamagePlacementPreview(): void {
    this.putDamagePlacementPreview.clear();
    this.putDamagePlacementPreview$.next();
  }

  /** Update blocked targets while editing (e.g. your Pokémon reaches 0 damage). */
  public setBlockedTargets(blocked: CardTarget[]): void {
    this.blockedTargetsSubject.next(blocked);
    const sel = this.selectedTargetsSubject.value;
    const filtered = sel.filter(
      (t) =>
        !blocked.some((b) => b.player === t.player && b.slot === t.slot && b.index === t.index),
    );
    if (filtered.length !== sel.length) {
      this.selectedTargetsSubject.next(filtered);
    }
  }

  public getSelectedTargets(): CardTarget[] {
    return [...this.selectedTargetsSubject.value];
  }

  /**
   * End board selection mode
   */
  public endBoardSelection(): void {
    this.removeDamageHudAnchor = null;
    this.overlayKind = null;
    this.handPlayEligibleTargets = [];
    this.clearPutDamagePlacementPreview();
    this.selectionModeSubject.next(false);
    this.promptSubject.next(null);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next([]);
    this.eligiblePlayerTypeSubject.next(null);
    this.eligibleSlotsSubject.next([]);
    this.selectionCallback = null;
    this.chooseCardsPrompt = null;
    this.chooseCardsCallback = null;
  }

  /**
   * Set replay mode status
   */
  public setReplayMode(isReplayMode: boolean): void {
    this.isReplayModeActive = isReplayMode;
    if (isReplayMode) {
      // If entering replay mode, end any active board selection
      this.endBoardSelection();
    }
  }

  /**
   * Toggle selection of a card target
   */
  public toggleTarget(target: CardTarget): void {
    if (this.overlayKind === 'hand-play-target') {
      if (!this.isTargetEligible(target) || !this.selectionCallback) {
        return;
      }
      this.selectionCallback([target]);
      this.endBoardSelection();
      return;
    }

    if (this.isChooseStartingPokemonsSelectionActive() && target.slot === SlotType.HAND) {
      const currentTargets = this.selectedTargetsSubject.value;
      const targetIndex = currentTargets.findIndex(t =>
        t.player === target.player &&
        t.slot === target.slot &&
        t.index === target.index
      );
      if (targetIndex !== -1) {
        return;
      }
      this.addChooseHandCardForSetup(target.index);
      return;
    }

    const currentTargets = this.selectedTargetsSubject.value;
    const maxSelections = this.maxSelectionsSubject.value;

    // Check if target is already selected
    const targetIndex = currentTargets.findIndex(t =>
      t.player === target.player &&
      t.slot === target.slot &&
      t.index === target.index
    );

    if (targetIndex !== -1) {
      // Target already selected, remove it
      const newTargets = [...currentTargets];
      newTargets.splice(targetIndex, 1);
      this.selectedTargetsSubject.next(newTargets);
    } else {
      // Target not selected, add it if we haven't reached max
      if (maxSelections === 1) {
        // If only one selection allowed, replace current selection
        this.selectedTargetsSubject.next([target]);
      } else if (currentTargets.length < maxSelections) {
        // Otherwise add to existing selections if under max
        this.selectedTargetsSubject.next([...currentTargets, target]);
      }
    }
  }

  /**
   * Check if a target is eligible for selection
   */
  public isTargetEligible(target: CardTarget): boolean {
    if (this.overlayKind === 'hand-play-target') {
      return this.handPlayEligibleTargets.some(
        (t) => t.player === target.player && t.slot === target.slot && t.index === target.index,
      );
    }

    const eligiblePlayerType = this.eligiblePlayerTypeSubject.value;
    const eligibleSlots = this.eligibleSlotsSubject.value;
    const blockedTargets = this.blockedTargetsSubject.value;

    // Check if target's player type is eligible
    if (eligiblePlayerType === null) {
      return false;
    }
    if (eligiblePlayerType !== PlayerType.ANY && target.player !== eligiblePlayerType) {
      return false;
    }

    // Check if target's slot type is eligible
    if (!eligibleSlots.includes(target.slot)) {
      return false;
    }

    // Check if target is blocked
    const isBlocked = blockedTargets.some(t =>
      t.player === target.player &&
      t.slot === target.slot &&
      t.index === target.index
    );

    return !isBlocked;
  }

  /**
   * Check if a target is currently selected
   */
  public isTargetSelected(target: CardTarget): boolean {
    const currentTargets = this.selectedTargetsSubject.value;
    return currentTargets.some(t =>
      t.player === target.player &&
      t.slot === target.slot &&
      t.index === target.index
    );
  }

  /**
   * Confirm the current selection
   */
  public confirmSelection(): void {
    if (this.overlayKind === 'choose-hand-cards') {
      if (!this.chooseCardsPrompt || !this.chooseCardsCallback) {
        return;
      }
      const prompt = this.chooseCardsPrompt;
      const handIndices = this.selectedTargetsSubject.value
        .filter(t => t.slot === SlotType.HAND)
        .map(t => t.index);
      const indices = chooseCardsHandTargetsToPromptIndices(prompt, handIndices);
      const selectedCards = chooseCardsHandIndicesToCards(prompt, indices);
      if (!prompt.validate(selectedCards)) {
        return;
      }
      this.chooseCardsCallback(indices);
      this.endBoardSelection();
      return;
    }

    if (this.overlayKind !== 'choose-pokemon') {
      return;
    }
    if (this.selectionCallback) {
      const currentTargets = this.selectedTargetsSubject.value;
      this.selectionCallback(currentTargets);
      this.endBoardSelection();
    }
  }

  /**
   * Cancel the current selection
   */
  public cancelSelection(): void {
    if (this.overlayKind === 'choose-hand-cards') {
      if (this.chooseCardsCallback) {
        this.chooseCardsCallback(null);
      }
      this.endBoardSelection();
      return;
    }

    if (this.overlayKind !== 'choose-pokemon') {
      return;
    }
    if (this.selectionCallback) {
      this.selectionCallback(null);
      this.endBoardSelection();
    }
  }

  /**
   * Check if selection mode is currently active
   */
  public isSelectionActive(): boolean {
    return this.selectionModeSubject.value;
  }

  /**
   * Check if the current selection meets requirements
   */
  public isSelectionValid(): boolean {
    if (this.overlayKind === 'choose-hand-cards' && this.chooseCardsPrompt) {
      const prompt = this.chooseCardsPrompt;
      const handIndices = this.selectedTargetsSubject.value
        .filter(t => t.slot === SlotType.HAND)
        .map(t => t.index);
      const indices = chooseCardsHandTargetsToPromptIndices(prompt, handIndices);
      return prompt.validate(chooseCardsHandIndicesToCards(prompt, indices));
    }

    if (
      this.overlayKind === 'remove-damage'
      || this.overlayKind === 'move-damage'
      || this.overlayKind === 'put-damage'
    ) {
      return true;
    }
    const currentTargets = this.selectedTargetsSubject.value.length;
    const minSelections = this.minSelectionsSubject.value;
    const maxSelections = this.maxSelectionsSubject.value;

    return currentTargets >= minSelections && currentTargets <= maxSelections;
  }

  public triggerEvolutionAnimation(event: BasicEntranceAnimationEvent) {
    this.evolutionAnimationSubject.next(event);
  }

  public triggerBasicAnimation(event: BasicEntranceAnimationEvent) {
    this.basicAnimationSubject.next(event);
  }

  public triggerAttackAnimation(event: BasicEntranceAnimationEvent) {
    this.attackAnimationSubject.next(event);
  }

  /**
   * Latest 3D ability activation promise (set when the motion starts).
   * {@link abilityAnimationStartedAt} must be checked so settled promises from prior abilities are ignored.
   */
  private pendingAbilityAnimationPromise: Promise<void> | null = null;
  private abilityAnimationStartedAt = 0;
  private lastAbilityAnimationEvent: AbilityAnimationEvent | null = null;

  public setPendingAbilityAnimationPromise(p: Promise<void> | null): void {
    this.pendingAbilityAnimationPromise = p;
    if (p) {
      this.abilityAnimationStartedAt = Date.now();
    }
  }

  public getPendingAbilityAnimationPromise(): Promise<void> | null {
    return this.pendingAbilityAnimationPromise;
  }

  public getAbilityAnimationStartedAt(): number {
    return this.abilityAnimationStartedAt;
  }

  public clearPendingAbilityAnimation(): void {
    this.pendingAbilityAnimationPromise = null;
    this.abilityAnimationStartedAt = 0;
  }

  public triggerAbilityAnimation(event: AbilityAnimationEvent) {
    this.lastAbilityAnimationEvent = event;
    this.clearPendingAbilityAnimation();
    this.abilityAnimationSubject.next(event);
  }

  /** Re-fire the last socket ability event when the server WaitPrompt arrives before the animation starts. */
  public requestAbilityAnimationPlayback(): void {
    if (this.lastAbilityAnimationEvent && !this.pendingAbilityAnimationPromise) {
      this.abilityAnimationSubject.next(this.lastAbilityAnimationEvent);
    }
  }

  public setAbilityFocus(state: AbilityFocusState | null): void {
    this.abilityFocusSubject.next(state);
  }

  public clearAbilityFocus(): void {
    this.abilityFocusSubject.next(null);
  }

  /**
   * Latest 3D attack {@link Board3dAnimationService.playAttackAnimation} promise (set when the motion starts).
   * Not cleared when done so late subscribers can still await a settled promise. Overwritten on each new attack.
   */
  private pendingAttackAnimationPromise: Promise<void> | null = null;

  public setPendingAttackAnimationPromise(p: Promise<void> | null): void {
    this.pendingAttackAnimationPromise = p;
  }

  public getPendingAttackAnimationPromise(): Promise<void> | null {
    return this.pendingAttackAnimationPromise;
  }

  public triggerCoinFlipAnimation(result: boolean, playerId: number) {
    this.coinFlipAnimationSubject.next({ result, playerId });
  }

  public cancelCoinFlipAnimation() {
    this.coinFlipCancelSubject.next();
  }

  public triggerAttackEffect(event: AttackEffectEvent) {
    this.attackEffectSubject.next(event);
  }

  /** After this time, {@link shouldHideTrainerEffectPrompts} becomes false and {@link trainerEffectPromptDelayEnd$} emits. */
  private trainerEffectPromptHideUntil = 0;
  private trainerEffectPromptDelayTimer: ReturnType<typeof setTimeout> | null = null;
  private trainerEffectPromptDelayEndSubject = new Subject<void>();
  public readonly trainerEffectPromptDelayEnd$ = this.trainerEffectPromptDelayEndSubject.asObservable();

  /**
   * Hide table prompts briefly after playing a trainer from the 3D board so the play animation is not overlapped.
   */
  public beginTrainerPlayEffectPromptDelay(ms: number = TRAINER_PLAY_EFFECT_PROMPT_DELAY_MS): void {
    if (this.trainerEffectPromptDelayTimer != null) {
      clearTimeout(this.trainerEffectPromptDelayTimer);
      this.trainerEffectPromptDelayTimer = null;
    }
    this.trainerEffectPromptHideUntil = Date.now() + ms;
    this.trainerEffectPromptDelayTimer = setTimeout(() => {
      this.trainerEffectPromptDelayTimer = null;
      this.trainerEffectPromptHideUntil = 0;
      this.trainerEffectPromptDelayEndSubject.next();
    }, ms);
  }

  public shouldHideTrainerEffectPrompts(): boolean {
    return Date.now() < this.trainerEffectPromptHideUntil;
  }
} 