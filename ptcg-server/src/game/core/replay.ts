import { gzip, ungzip } from '@progress/pako-esm';

import { State, GameWinner } from '../store/state/state';
import { ReplayPlayer, ReplayOptions, ReplayActionRecord } from './replay.interface';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { SerializedState } from '../serializer/serializer.interface';
import { StateSerializer } from '../serializer/state-serializer';

export class Replay {

  private readonly indexJumpSize: number = 16;

  public player1: ReplayPlayer;
  public player2: ReplayPlayer;
  public winner: GameWinner;
  public created: number;
  private gameSettings: any | undefined;
  private turnMap: number[] = [];
  private diffs: SerializedState[] = [];
  private indexes: SerializedState[] = [];
  private actions: ReplayActionRecord[] = [];
  private prevState: SerializedState | undefined;
  private serializer = new StateSerializer();
  private options: ReplayOptions;

  constructor(options: Partial<ReplayOptions> = {}) {
    this.player1 = { name: '', userId: 0 };
    this.player2 = { name: '', userId: 0 };
    this.winner = GameWinner.NONE;
    this.created = 0;
    this.options = Object.assign({
      indexEnabled: true,
      appendEnabled: false
    }, options);
  }

  public getStateCount(): number {
    return this.diffs.length;
  }

  public getActions(): ReplayActionRecord[] {
    return this.actions.map(action => ({
      ...action,
      payload: this.cloneReplayValue(action.payload)
    }));
  }

  public getGameSettings(): any | undefined {
    return this.cloneReplayValue(this.gameSettings);
  }

  public getState(position: number): State {
    if (position < 0 || position >= this.diffs.length) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }

    let stateData = this.diffs[0];
    const jumps = this.indexJumps(position);
    let i = 0;
    while (i !== position) {
      if (this.options.indexEnabled && jumps.length > 0) {
        const jump = jumps.shift() || 0;
        const index = this.indexes[(jump / this.indexJumpSize) - 1];
        stateData = this.serializer.applyDiff(stateData, index);
        i = jump;
      } else {
        i++;
        stateData = this.serializer.applyDiff(stateData, this.diffs[i]);
      }
    }

    return this.serializer.deserialize(stateData);
  }

  public getTurnCount(): number {
    return this.turnMap.length;
  }

  public getTurnPosition(turn: number): number {
    if (turn < 0 || turn >= this.turnMap.length) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
    return this.turnMap[turn];
  }

  public setCreated(created: number): void {
    this.created = created;
  }

  public setGameSettings(gameSettings: any): void {
    this.gameSettings = this.sanitizeReplayValue(gameSettings);
  }

  public appendState(state: State): void {
    const full = this.serializer.serialize(state);
    const diff = this.serializer.serializeDiff(this.prevState, state);

    // Ignore the actions, which does not modified the state, like
    // shuffling an empty deck, or changing the hand order in the same matter
    if (diff === '[[]]') {
      return;
    }

    this.prevState = full;
    this.diffs.push(diff);
    if (this.options.indexEnabled) {
      this.rebuildIndex(this.diffs);
    }
    while (this.turnMap.length <= state.turn) {
      this.turnMap.push(this.diffs.length - 1);
    }
  }

  public appendAction(
    type: string,
    payload: any,
    state: Pick<State, 'turn' | 'phase' | 'activePlayer'>,
    stateIndex: number
  ): void {
    this.actions.push({
      sequence: this.actions.length,
      type,
      turn: state.turn,
      phase: state.phase,
      activePlayer: state.activePlayer,
      stateIndex,
      payload: this.sanitizeReplayValue(payload)
    });
  }

  public serialize(): string {
    const json = {
      version: 2,
      player1: this.player1,
      player2: this.player2,
      winner: this.winner,
      created: this.created,
      gameSettings: this.gameSettings,
      turnMap: this.turnMap,
      states: this.swapQuotes(this.diffs),
      actions: this.actions
    };
    return this.compress(JSON.stringify(json));
  }

  public deserialize(replayData: string): void {
    try {
      const data = JSON.parse(this.decompress(replayData));
      this.player1 = data.player1;
      this.player2 = data.player2;
      this.winner = data.winner;
      this.created = data.created;
      this.gameSettings = data.gameSettings;
      this.diffs = this.swapQuotes(data.states);
      this.turnMap = data.turnMap;
      this.actions = Array.isArray(data.actions) ? data.actions : [];

      if (this.options.indexEnabled) {
        this.rebuildIndex(this.diffs);
      }

      if (this.options.appendEnabled) {
        const lastState = this.getState(this.diffs.length - 1);
        this.prevState = this.serializer.serialize(lastState);
      }
    } catch (error) {
      throw new GameError(GameCoreError.ERROR_INVALID_STATE);
    }
  }

  private swapQuotes(diffs: SerializedState[]): SerializedState[] {
    return diffs.map(diff => diff.replace(/["']/g, c => c === '"' ? '\'' : '"'));
  }

  private compress(data: string): string {
    const compressed = gzip(data, { to: 'string' });
    return compressed;
  }

  private decompress(data: string): string {
    const text = ungzip(data, { to: 'string' });
    return text;
  }

  private sanitizeReplayValue(value: any, seen = new WeakSet<object>()): any {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value !== 'object') {
      return value;
    }

    if (seen.has(value)) {
      return '[Circular]';
    }
    seen.add(value);

    if (Array.isArray(value)) {
      const arrayValue = value.map(item => this.sanitizeReplayValue(item, seen));
      seen.delete(value);
      return arrayValue;
    }

    if (this.isCardLike(value)) {
      const cardValue = {
        kind: 'Card',
        id: value.id,
        name: value.name,
        fullName: value.fullName,
        superType: value.superType
      };
      seen.delete(value);
      return cardValue;
    }

    if (Array.isArray(value.cards)) {
      const list: any = {
        kind: value.constructor?.name || 'CardList',
        cards: value.cards.map((card: any) => this.sanitizeReplayValue(card, seen))
      };
      this.copyIfPresent(list, value, 'damage');
      this.copyIfPresent(list, value, 'hp');
      this.copyIfPresent(list, value, 'specialConditions');
      seen.delete(value);
      return list;
    }

    const result: any = {};
    Object.keys(value).forEach(key => {
      const child = value[key];
      if (typeof child !== 'function') {
        result[key] = this.sanitizeReplayValue(child, seen);
      }
    });
    seen.delete(value);
    return result;
  }

  private cloneReplayValue(value: any): any {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  private isCardLike(value: any): boolean {
    return typeof value.name === 'string'
      && typeof value.fullName === 'string'
      && value.superType !== undefined;
  }

  private copyIfPresent(target: any, source: any, key: string): void {
    if (source[key] !== undefined) {
      target[key] = this.sanitizeReplayValue(source[key]);
    }
  }

  private rebuildIndex(diffs: SerializedState[]): void {
    if (diffs.length === 0) {
      this.indexes = [];
      return;
    }

    this.indexes = [];
    let i = this.indexJumpSize;
    while (i < diffs.length) {
      const jumps = this.indexJumps(i);
      let stateData = diffs[0];
      let pos = 0;
      for (let j = 0; j < jumps.length - 1; j++) {
        pos = jumps[j];
        const index = this.indexes[(pos / this.indexJumpSize) - 1];
        stateData = this.serializer.applyDiff(stateData, index);
      }
      let indexData = stateData;
      while (pos < i) {
        pos++;
        indexData = this.serializer.applyDiff(indexData, diffs[pos]);
      }
      const indexState = this.serializer.deserialize(indexData);
      const indexDiff = this.serializer.serializeDiff(stateData, indexState);
      this.indexes.push(indexDiff);
      i += this.indexJumpSize;
    }
  }

  private indexJumps(position: number): number[] {
    if (position < this.indexJumpSize) {
      return [];
    }
    const jumps = [ this.indexJumpSize ];

    if (position < this.indexJumpSize * 2) {
      return jumps;
    }

    const n = Math.floor(Math.log2(position));
    let jumpSize = Math.pow(2, n);
    let pos = 0;

    while (jumpSize >= this.indexJumpSize) {
      if (pos + jumpSize <= position) {
        jumps.push(pos + jumpSize);
        pos += jumpSize;
      }
      jumpSize = jumpSize / 2;
    }

    return jumps;
  }

}
