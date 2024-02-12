"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CopycatArt = void 0;
const copycat_1 = require("./copycat");
class CopycatArt extends copycat_1.Copycat {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_127_R_EN_LG.png';
    }
}
exports.CopycatArt = CopycatArt;
