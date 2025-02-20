"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VsSeekerFL = void 0;
const vs_seeker_1 = require("../set-phantom-forces/vs-seeker");
class VsSeekerFL extends vs_seeker_1.VsSeeker {
    constructor() {
        super(...arguments);
        this.fullName = 'VS Seeker FL';
        this.set = 'FL';
        this.setNumber = '100';
        this.text = 'Search your discard pile for a Supporter card, show it to your opponent, and put it into your hand.';
    }
}
exports.VsSeekerFL = VsSeekerFL;
