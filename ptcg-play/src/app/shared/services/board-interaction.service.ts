import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CardTarget, ChoosePokemonPrompt, PlayerType, SlotType, StateLog } from 'ptcg-server';

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

@Injectable({
  providedIn: 'root'
})
export class BoardInteractionService {
  // Tracks whether the board is in selection mode
  private selectionModeSubject = new BehaviorSubject<boolean>(false);
  public selectionMode$ = this.selectionModeSubject.asObservable();

  // Current prompt that requires board selection
  private promptSubject = new BehaviorSubject<ChoosePokemonPrompt>(null);
  public prompt$ = this.promptSubject.asObservable();

  // Currently selected targets
  private selectedTargetsSubject = new BehaviorSubject<CardTarget[]>([]);
  public selectedTargets$ = this.selectedTargetsSubject.asObservable();

  // Blocked targets that can't be selected
  private blockedTargetsSubject = new BehaviorSubject<CardTarget[]>([]);
  public blockedTargets$ = this.blockedTargetsSubject.asObservable();

  // Eligible player type and slots for selection
  private eligiblePlayerTypeSubject = new BehaviorSubject<PlayerType>(null);
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

  // Callback when selection is confirmed
  private selectionCallback: (targets: CardTarget[]) => void;

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

  constructor() { }

  /**
   * Update game logs
   */
  public updateGameLogs(logs: StateLog[]): void {
    this.gameLogsSubject.next(logs);
  }

  /**
   * Start board selection mode for a Pokémon selection prompt
   */
  public startBoardSelection(prompt: ChoosePokemonPrompt, onComplete: (targets: CardTarget[]) => void): void {
    // Don't start board selection if we're in replay mode
    if (this.isReplayModeActive) {
      return;
    }

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
   * End board selection mode
   */
  public endBoardSelection(): void {
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
} 