"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MisdreavusArt = void 0;
const misdreavus_1 = require("./misdreavus");
class MisdreavusArt extends misdreavus_1.Misdreavus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CIN/CIN_039_R_EN_LG.png';
    }
}
exports.MisdreavusArt = MisdreavusArt;
