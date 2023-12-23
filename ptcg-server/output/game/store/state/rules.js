"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rules = void 0;
class Rules {
    constructor(init = {}) {
        this.firstTurnDrawCard = true;
        this.firstTurnAttack = true;
        this.firstTurnUseSupporter = true;
        Object.assign(this, init);
    }
}
exports.Rules = Rules;
