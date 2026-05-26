import { gzip, ungzip } from '@progress/pako-esm';
import { GameWinner } from '../store/state/state';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { StateSerializer } from '../serializer/state-serializer';
export class Replay {
    constructor(options = {}) {
        this.indexJumpSize = 16;
        this.turnMap = [];
        this.diffs = [];
        this.indexes = [];
        this.actions = [];
        this.serializer = new StateSerializer();
        this.player1 = { name: '', userId: 0 };
        this.player2 = { name: '', userId: 0 };
        this.winner = GameWinner.NONE;
        this.created = 0;
        this.options = Object.assign({
            indexEnabled: true,
            appendEnabled: false
        }, options);
    }
    getStateCount() {
        return this.diffs.length;
    }
    getActions() {
        return this.actions.map(action => (Object.assign(Object.assign({}, action), { payload: this.cloneReplayValue(action.payload) })));
    }
    getGameSettings() {
        return this.cloneReplayValue(this.gameSettings);
    }
    getState(position) {
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
            }
            else {
                i++;
                stateData = this.serializer.applyDiff(stateData, this.diffs[i]);
            }
        }
        return this.serializer.deserialize(stateData);
    }
    getTurnCount() {
        return this.turnMap.length;
    }
    getTurnPosition(turn) {
        if (turn < 0 || turn >= this.turnMap.length) {
            throw new GameError(GameCoreError.ERROR_INVALID_STATE);
        }
        return this.turnMap[turn];
    }
    setCreated(created) {
        this.created = created;
    }
    setGameSettings(gameSettings) {
        this.gameSettings = this.sanitizeReplayValue(gameSettings);
    }
    appendState(state) {
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
    appendAction(type, payload, state, stateIndex) {
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
    serialize() {
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
    deserialize(replayData) {
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
        }
        catch (error) {
            throw new GameError(GameCoreError.ERROR_INVALID_STATE);
        }
    }
    swapQuotes(diffs) {
        return diffs.map(diff => diff.replace(/["']/g, c => c === '"' ? '\'' : '"'));
    }
    compress(data) {
        const compressed = gzip(data, { to: 'string' });
        return compressed;
    }
    decompress(data) {
        const text = ungzip(data, { to: 'string' });
        return text;
    }
    sanitizeReplayValue(value, seen = new WeakSet()) {
        var _a;
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
            const list = {
                kind: ((_a = value.constructor) === null || _a === void 0 ? void 0 : _a.name) || 'CardList',
                cards: value.cards.map((card) => this.sanitizeReplayValue(card, seen))
            };
            this.copyIfPresent(list, value, 'damage');
            this.copyIfPresent(list, value, 'hp');
            this.copyIfPresent(list, value, 'specialConditions');
            seen.delete(value);
            return list;
        }
        const result = {};
        Object.keys(value).forEach(key => {
            const child = value[key];
            if (typeof child !== 'function') {
                result[key] = this.sanitizeReplayValue(child, seen);
            }
        });
        seen.delete(value);
        return result;
    }
    cloneReplayValue(value) {
        return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
    }
    isCardLike(value) {
        return typeof value.name === 'string'
            && typeof value.fullName === 'string'
            && value.superType !== undefined;
    }
    copyIfPresent(target, source, key) {
        if (source[key] !== undefined) {
            target[key] = this.sanitizeReplayValue(source[key]);
        }
    }
    rebuildIndex(diffs) {
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
    indexJumps(position) {
        if (position < this.indexJumpSize) {
            return [];
        }
        const jumps = [this.indexJumpSize];
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
