"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagcargoArt = exports.CopycatArt = void 0;
const copycat_1 = require("./copycat");
const magcargo_1 = require("./magcargo");
class CopycatArt extends copycat_1.Copycat {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_127_R_EN_LG.png';
    }
}
exports.CopycatArt = CopycatArt;
class MagcargoArt extends magcargo_1.Magcargo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_024_R_EN_LG.png';
    }
}
exports.MagcargoArt = MagcargoArt;
