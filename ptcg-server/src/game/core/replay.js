"use strict";
exports.__esModule = true;
exports.Replay = void 0;
var pako_esm_1 = require("@progress/pako-esm");
var state_1 = require("../store/state/state");
var game_error_1 = require("../game-error");
var game_message_1 = require("../game-message");
var state_serializer_1 = require("../serializer/state-serializer");
var Replay = /** @class */ (function () {
    function Replay(options) {
        if (options === void 0) { options = {}; }
        this.indexJumpSize = 16;
        this.turnMap = [];
        this.diffs = [];
        this.indexes = [];
        this.serializer = new state_serializer_1.StateSerializer();
        this.player1 = { name: '', userId: 0, ranking: 0 };
        this.player2 = { name: '', userId: 0, ranking: 0 };
        this.winner = state_1.GameWinner.NONE;
        this.created = 0;
        this.options = Object.assign({
            indexEnabled: true,
            appendEnabled: false
        }, options);
    }
    Replay.prototype.getStateCount = function () {
        return this.diffs.length;
    };
    Replay.prototype.getState = function (position) {
        if (position < 0 || position >= this.diffs.length) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_INVALID_STATE);
        }
        var stateData = this.diffs[0];
        var jumps = this.indexJumps(position);
        var i = 0;
        while (i !== position) {
            if (this.options.indexEnabled && jumps.length > 0) {
                var jump = jumps.shift() || 0;
                var index = this.indexes[(jump / this.indexJumpSize) - 1];
                stateData = this.serializer.applyDiff(stateData, index);
                i = jump;
            }
            else {
                i++;
                stateData = this.serializer.applyDiff(stateData, this.diffs[i]);
            }
        }
        return this.serializer.deserialize(stateData);
    };
    Replay.prototype.getTurnCount = function () {
        return this.turnMap.length;
    };
    Replay.prototype.getTurnPosition = function (turn) {
        if (turn < 0 || turn >= this.turnMap.length) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_INVALID_STATE);
        }
        return this.turnMap[turn];
    };
    Replay.prototype.setCreated = function (created) {
        this.created = created;
    };
    Replay.prototype.appendState = function (state) {
        var full = this.serializer.serialize(state);
        var diff = this.serializer.serializeDiff(this.prevState, state);
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
    };
    Replay.prototype.serialize = function () {
        var json = {
            player1: this.player1,
            player2: this.player2,
            winner: this.winner,
            created: this.created,
            turnMap: this.turnMap,
            states: this.swapQuotes(this.diffs)
        };
        return this.compress(JSON.stringify(json));
    };
    Replay.prototype.deserialize = function (replayData) {
        try {
            var data = JSON.parse(this.decompress(replayData));
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
                var lastState = this.getState(this.diffs.length - 1);
                this.prevState = this.serializer.serialize(lastState);
            }
        }
        catch (error) {
            throw new game_error_1.GameError(game_message_1.GameCoreError.ERROR_INVALID_STATE);
        }
    };
    Replay.prototype.swapQuotes = function (diffs) {
        return diffs.map(function (diff) { return diff.replace(/["']/g, function (c) { return c === '"' ? '\'' : '"'; }); });
    };
    Replay.prototype.compress = function (data) {
        var compressed = pako_esm_1.gzip(data, { to: 'string' });
        return compressed;
    };
    Replay.prototype.decompress = function (data) {
        var text = pako_esm_1.ungzip(data, { to: 'string' });
        return text;
    };
    Replay.prototype.rebuildIndex = function (diffs) {
        if (diffs.length === 0) {
            this.indexes = [];
            return;
        }
        this.indexes = [];
        var i = this.indexJumpSize;
        while (i < diffs.length) {
            var jumps = this.indexJumps(i);
            var stateData = diffs[0];
            var pos = 0;
            for (var j = 0; j < jumps.length - 1; j++) {
                pos = jumps[j];
                var index = this.indexes[(pos / this.indexJumpSize) - 1];
                stateData = this.serializer.applyDiff(stateData, index);
            }
            var indexData = stateData;
            while (pos < i) {
                pos++;
                indexData = this.serializer.applyDiff(indexData, diffs[pos]);
            }
            var indexState = this.serializer.deserialize(indexData);
            var indexDiff = this.serializer.serializeDiff(stateData, indexState);
            this.indexes.push(indexDiff);
            i += this.indexJumpSize;
        }
    };
    Replay.prototype.indexJumps = function (position) {
        if (position < this.indexJumpSize) {
            return [];
        }
        var jumps = [this.indexJumpSize];
        if (position < this.indexJumpSize * 2) {
            return jumps;
        }
        var n = Math.floor(Math.log2(position));
        var jumpSize = Math.pow(2, n);
        var pos = 0;
        while (jumpSize >= this.indexJumpSize) {
            if (pos + jumpSize <= position) {
                jumps.push(pos + jumpSize);
                pos += jumpSize;
            }
            jumpSize = jumpSize / 2;
        }
        return jumps;
    };
    return Replay;
}());
exports.Replay = Replay;
