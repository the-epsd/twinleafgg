"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TateAndLizaArt = exports.SwampertArt = exports.MarshtompArt = exports.MudkipArt = exports.MagcargoArt = exports.CopycatArt = void 0;
const copycat_1 = require("./copycat");
const magcargo_1 = require("./magcargo");
const marshtomp_1 = require("./marshtomp");
const mudkip_1 = require("./mudkip");
const swampert_1 = require("./swampert");
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
class MudkipArt extends mudkip_1.Mudkip {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_032_R_EN_LG.png';
    }
}
exports.MudkipArt = MudkipArt;
class MarshtompArt extends marshtomp_1.Marshtomp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_034_R_EN_LG.png';
    }
}
exports.MarshtompArt = MarshtompArt;
class SwampertArt extends swampert_1.Swampert {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_035_R_EN_LG.png';
    }
}
exports.SwampertArt = SwampertArt;
class TateAndLizaArt extends tate_and_liza_1.TateAndLiza {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CES/CES_148_R_EN_LG.png';
    }
}
exports.TateAndLizaArt = TateAndLizaArt;
