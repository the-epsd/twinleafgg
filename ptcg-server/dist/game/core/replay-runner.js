import { GameSettings } from './game-settings';
import { buildActionFromReplayRecord } from './replay-actions';
import { Rules } from '../store/state/rules';
import { Store } from '../store/store';
import { StateSerializer } from '../serializer/state-serializer';
export class ReplayActionReplayer {
    constructor(options = {}) {
        this.serializer = new StateSerializer();
        this.store = new Store(this);
        if (options.initialState !== undefined) {
            this.store.state = this.cloneState(options.initialState);
        }
        else {
            this.applyGameSettings(options.gameSettings);
        }
    }
    get state() {
        return this.store.state;
    }
    onStateChange(state) { }
    dispatchRecord(record) {
        const action = buildActionFromReplayRecord(record, this.store.state);
        const clientRoleId = record.type.indexOf('SANDBOX_') === 0 ? 4 : undefined;
        return this.store.dispatch(action, clientRoleId);
    }
    dispatchRecords(records) {
        records.forEach(record => this.dispatchRecord(record));
        return this.store.state;
    }
    applyGameSettings(gameSettings) {
        if (gameSettings === undefined) {
            return;
        }
        const settings = Object.assign(new GameSettings(), gameSettings);
        settings.rules = new Rules(gameSettings.rules || {});
        this.store.state.gameSettings = settings;
        this.store.state.rules = settings.rules;
    }
    cloneState(state) {
        return this.serializer.deserialize(this.serializer.serialize(state));
    }
}
export function validateReplayActions(replay, options = {}) {
    var _a;
    const actions = replay.getActions();
    const replayer = new ReplayActionReplayer(Object.assign({ gameSettings: replay.getGameSettings() }, options));
    const checkpointSequences = getCheckpointSequences(actions);
    const mismatches = [];
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
    }
    catch (error) {
        return {
            ok: false,
            actionCount: actions.length,
            checkedStateCount,
            mismatches,
            error: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : String(error)
        };
    }
    return {
        ok: mismatches.length === 0,
        actionCount: actions.length,
        checkedStateCount,
        mismatches
    };
}
function getCheckpointSequences(actions) {
    const sequences = new Set();
    for (let i = 0; i < actions.length; i++) {
        const current = actions[i];
        const next = actions[i + 1];
        if (current.stateIndex >= 0 && (next === undefined || next.stateIndex !== current.stateIndex)) {
            sequences.add(current.sequence);
        }
    }
    return sequences;
}
function serializeComparableState(state) {
    const serializer = new StateSerializer();
    const clone = serializer.deserialize(serializer.serialize(state));
    clone.logs.forEach(log => {
        if (log.params !== undefined) {
            delete log.params.timestamp;
        }
    });
    deleteVolatileKeys(clone);
    return serializer.serialize(clone)
        .replace(/\d{13}_[a-z0-9]+/g, '[unique]');
}
function deleteVolatileKeys(value) {
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
