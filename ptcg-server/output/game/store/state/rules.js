"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = void 0;
class Rules {
    constructor(init = {}) {
        this.firstTurnDrawCard = true;
        this.firstTurnUseSupporter = true;
        this.attackFirstTurn = false;
        this.unlimitedEnergyAttachments = false;
        Object.assign(this, init);
    }
}
exports.Rules = Rules;
