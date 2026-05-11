import { BehaviorSubject, firstValueFrom, Subject, take } from 'rxjs';
import {
  ChoosePokemonPrompt,
  GameMessage,
  PlayerType,
  PutDamagePrompt,
  RemoveDamagePrompt,
  SlotType,
  type CardTarget,
  type CardType,
  type StateLog,
} from 'ptcg-server';

type SelectionOverlayKind = 'choose-pokemon' | 'remove-damage' | 'put-damage' | null;

export interface BasicEntranceAnimationEvent {
  playerId: number;
  cardId: number | string;
  slot: string;
  index?: number;
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

  private overlayKind: SelectionOverlayKind = null;

  /** Client pixel position for Remove damage floating +/- HUD (updated by Board3dController each frame). */
  private removeDamageHudAnchor: { x: number; y: number } | null = null;

  // Track if we're in replay mode
  private isReplayModeActive = false;

  private evolutionAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public evolutionAnimation$ = this.evolutionAnimationSubject.asObservable();

  private basicAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public basicAnimation$ = this.basicAnimationSubject.asObservable();

  private attackAnimationSubject = new Subject<BasicEntranceAnimationEvent>();
  public attackAnimation$ = this.attackAnimationSubject.asObservable();

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
   * Board overlay for Put damage: distribute counters on eligible Pokémon (+/− HUD).
   */
  public startPutDamageSelection(prompt: PutDamagePrompt, extraBlocked: CardTarget[]): void {
    if (this.isReplayModeActive) {
      return;
    }

    this.removeDamageHudAnchor = null;
    this.overlayKind = 'put-damage';
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

  /** Floating +/− HUD for both remove-damage and put-damage prompts (3D anchor). */
  public isFloatingDamageHudOverlayActive(): boolean {
    return this.overlayKind === 'remove-damage' || this.overlayKind === 'put-damage';
  }

  public setRemoveDamageHudAnchor(pos: { x: number; y: number } | null): void {
    this.removeDamageHudAnchor = pos;
  }

  public getRemoveDamageHudAnchor(): { x: number; y: number } | null {
    return this.removeDamageHudAnchor;
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
    this.selectionModeSubject.next(false);
    this.promptSubject.next(null);
    this.selectedTargetsSubject.next([]);
    this.blockedTargetsSubject.next([]);
    this.eligiblePlayerTypeSubject.next(null);
    this.eligibleSlotsSubject.next([]);
    this.selectionCallback = null;
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
    if (this.overlayKind === 'remove-damage' || this.overlayKind === 'put-damage') {
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
  public beginTrainerPlayEffectPromptDelay(ms: number = 2000): void {
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

  /**
   * Resolves after the post–trainer-play prompt window ends, or immediately if not active.
   * Used so 3D hand draw flights do not overlap the trainer play moment.
   */
  async awaitTrainerEffectPromptReveal(): Promise<void> {
    if (!this.shouldHideTrainerEffectPrompts()) {
      return;
    }
    await firstValueFrom(this.trainerEffectPromptDelayEnd$.pipe(take(1)));
  }
} 