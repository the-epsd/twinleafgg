import { GameSettings } from './game-settings';
import { Replay } from './replay';
import { buildActionFromReplayRecord } from './replay-actions';
import { ReplayActionRecord } from './replay.interface';
import { State } from '../store/state/state';
import { Rules } from '../store/state/rules';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
import { StateSerializer } from '../serializer/state-serializer';

export interface ReplayStateMismatch {
  actionSequence: number;
  stateIndex: number;
  expected: string;
  actual: string;
}

export interface ReplayValidationResult {
  ok: boolean;
  actionCount: number;
  checkedStateCount: number;
  mismatches: ReplayStateMismatch[];
  error?: string;
}

export interface ReplayActionReplayerOptions {
  initialState?: State;
  gameSettings?: any;
}

export class ReplayActionReplayer implements StoreHandler {
  public readonly store: Store;
  private readonly serializer = new StateSerializer();

  constructor(options: ReplayActionReplayerOptions = {}) {
    this.store = new Store(this);
    if (options.initialState !== undefined) {
      this.store.state = this.cloneState(options.initialState);
    } else {
      this.applyGameSettings(options.gameSettings);
    }
  }

  public get state(): State {
    return this.store.state;
  }

  public onStateChange(state: State): void {}

  public dispatchRecord(record: ReplayActionRecord): State {
    const action = buildActionFromReplayRecord(record, this.store.state);
    const clientRoleId = record.type.indexOf('SANDBOX_') === 0 ? 4 : undefined;
    return this.store.dispatch(action, clientRoleId);
  }

  public dispatchRecords(records: ReplayActionRecord[]): State {
    records.forEach(record => this.dispatchRecord(record));
    return this.store.state;
  }

  private applyGameSettings(gameSettings: any): void {
    if (gameSettings === undefined) {
      return;
    }
    const settings = Object.assign(new GameSettings(), gameSettings);
    settings.rules = new Rules(gameSettings.rules || {});
    this.store.state.gameSettings = settings;
    this.store.state.rules = settings.rules;
  }

  private cloneState(state: State): State {
    return this.serializer.deserialize(this.serializer.serialize(state));
  }
}

export function validateReplayActions(
  replay: Replay,
  options: ReplayActionReplayerOptions = {}
): ReplayValidationResult {
  const actions = replay.getActions();
  const replayer = new ReplayActionReplayer({
    gameSettings: replay.getGameSettings(),
    ...options
  });
  const checkpointSequences = getCheckpointSequences(actions);
  const mismatches: ReplayStateMismatch[] = [];
  let checkedStateCount = 0;

  try {
    for (const action of actions) {
      replayer.dispatchRecord(action);
      if (checkpointSequences.has(action.sequence) && action.stateIndex >= 0) {
        checkedStateCount += 1;
        const expected = serializeComparableState(replay.getState(action.stateIndex));
        const actual = serializeComparableState(replayer.state);
        if (expected !== actual) {
          mismatches.push({
            actionSequence: action.sequence,
            stateIndex: action.stateIndex,
            expected,
            actual
          });
        }
      }
    }
  } catch (error: any) {
    return {
      ok: false,
      actionCount: actions.length,
      checkedStateCount,
      mismatches,
      error: error?.message ?? String(error)
    };
  }

  return {
    ok: mismatches.length === 0,
    actionCount: actions.length,
    checkedStateCount,
    mismatches
  };
}

function getCheckpointSequences(actions: ReplayActionRecord[]): Set<number> {
  const sequences = new Set<number>();
  for (let i = 0; i < actions.length; i++) {
    const current = actions[i];
    const next = actions[i + 1];
    if (current.stateIndex >= 0 && (next === undefined || next.stateIndex !== current.stateIndex)) {
      sequences.add(current.sequence);
    }
  }
  return sequences;
}

function serializeComparableState(state: State): string {
  const serializer = new StateSerializer();
  const clone = serializer.deserialize(serializer.serialize(state));
  clone.logs.forEach(log => {
    if (log.params !== undefined) {
      delete (log.params as any).timestamp;
    }
  });
  deleteVolatileKeys(clone);
  return serializer.serialize(clone)
    .replace(/\d{13}_[a-z0-9]+/g, '[unique]');
}

function deleteVolatileKeys(value: any): void {
  if (value === null || value === undefined || typeof value !== 'object') {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(item => deleteVolatileKeys(item));
    return;
  }
  delete value.__uniqueId;
  Object.keys(value).forEach(key => deleteVolatileKeys(value[key]));
}
