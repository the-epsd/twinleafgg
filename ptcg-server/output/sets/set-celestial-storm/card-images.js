"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TateAndLizaArt = exports.MagcargoArt = exports.CopycatArt = void 0;
const copycat_1 = require("./copycat");
const magcargo_1 = require("./magcargo");
const tate_and_liza_1 = require("./tate-and-liza");
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
class TateAndLizaArt extends tate_and_liza_1.TateAndLiza {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_148_R_EN_LG.png';
    }
}
exports.TateAndLizaArt = TateAndLizaArt;
