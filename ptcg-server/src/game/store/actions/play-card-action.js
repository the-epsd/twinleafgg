"use strict";
exports.__esModule = true;
exports.PlayCardAction = exports.SlotType = exports.PlayerType = void 0;
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["ANY"] = 0] = "ANY";
    PlayerType[PlayerType["TOP_PLAYER"] = 1] = "TOP_PLAYER";
    PlayerType[PlayerType["BOTTOM_PLAYER"] = 2] = "BOTTOM_PLAYER";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var SlotType;
(function (SlotType) {
    SlotType[SlotType["BOARD"] = 0] = "BOARD";
    SlotType[SlotType["ACTIVE"] = 1] = "ACTIVE";
    SlotType[SlotType["BENCH"] = 2] = "BENCH";
    SlotType[SlotType["HAND"] = 3] = "HAND";
    SlotType[SlotType["DISCARD"] = 4] = "DISCARD";
    SlotType[SlotType["LOSTZONE"] = 5] = "LOSTZONE";
    SlotType[SlotType["DECK"] = 6] = "DECK";
})(SlotType = exports.SlotType || (exports.SlotType = {}));
var PlayCardAction = /** @class */ (function () {
    function PlayCardAction(id, handIndex, target) {
        this.id = id;
        this.handIndex = handIndex;
        this.target = target;
        this.type = 'PLAY_CARD_ACTION';
    }
    return PlayCardAction;
}());
exports.PlayCardAction = PlayCardAction;
