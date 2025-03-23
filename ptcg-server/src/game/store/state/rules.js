"use strict";
exports.__esModule = true;
exports.Rules = void 0;
var Rules = /** @class */ (function () {
    function Rules(init) {
        if (init === void 0) { init = {}; }
        this.firstTurnDrawCard = true;
        this.firstTurnUseSupporter = true;
        this.attackFirstTurn = false;
        this.unlimitedEnergyAttachments = false;
        Object.assign(this, init);
    }
    return Rules;
}());
exports.Rules = Rules;
