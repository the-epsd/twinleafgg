"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscapeRopePLS = void 0;
const escape_rope_1 = require("../set-battle-styles/escape-rope");
class EscapeRopePLS extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.set = 'PLS';
        this.setNumber = '120';
        this.fullName = 'Escape Rope PLS';
    }
}
exports.EscapeRopePLS = EscapeRopePLS;
