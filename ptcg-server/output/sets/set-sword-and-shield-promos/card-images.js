"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorBurnettArt = exports.ManaphyArt = exports.LucarioVSTARArt = exports.LeafeonVSTARArt = exports.ChampionsFestivalArt = void 0;
const champions_festival_1 = require("./champions-festival");
const leafeon_vstar_1 = require("./leafeon-vstar");
const lucario_vstar_1 = require("./lucario-vstar");
const manaphy_1 = require("./manaphy");
const professor_burnett_1 = require("./professor-burnett");
class ChampionsFestivalArt extends champions_festival_1.ChampionsFestival {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_296_R_EN_LG.png';
    }
}
exports.ChampionsFestivalArt = ChampionsFestivalArt;
class LeafeonVSTARArt extends leafeon_vstar_1.LeafeonVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_195_R_EN_LG.png';
    }
}
exports.LeafeonVSTARArt = LeafeonVSTARArt;
class LucarioVSTARArt extends lucario_vstar_1.LucarioVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_214_R_EN_LG.png';
    }
}
exports.LucarioVSTARArt = LucarioVSTARArt;
// export class LucarioVSTARArt2 extends LucarioVSTAR {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_291_R_EN_LG.png';
// }
class ManaphyArt extends manaphy_1.Manaphy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_275_R_EN_LG.png';
    }
}
exports.ManaphyArt = ManaphyArt;
class ProfessorBurnettArt extends professor_burnett_1.ProfessorBurnet {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_167_R_EN_LG.png';
    }
}
exports.ProfessorBurnettArt = ProfessorBurnettArt;
