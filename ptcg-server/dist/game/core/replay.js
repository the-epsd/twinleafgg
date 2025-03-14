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
        this.serializer = new StateSerializer();
        this.player1 = { name: '', userId: 0, ranking: 0 };
        this.player2 = { name: '', userId: 0, ranking: 0 };
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
    serialize() {
        const json = {
            player1: this.player1,
            player2: this.player2,
            winner: this.winner,
            created: this.created,
            turnMap: this.turnMap,
            states: this.swapQuotes(this.diffs)
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
            this.diffs = this.swapQuotes(data.states);
            this.turnMap = data.turnMap;
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
