"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VenusaurVMAXArt = exports.VenusaurVArt = exports.EscapeRopeArt = exports.ProfessorBurnettArt = exports.ManaphyArt = exports.LucarioVSTARArt = exports.LeafeonVSTARArt = exports.HisuianElectrodeVArt = exports.DeoxysVSTARArt = exports.DeoxysVArt = exports.ChampionsFestivalArt = void 0;
const escape_rope_1 = require("../set-battle-styles/escape-rope");
const champions_festival_1 = require("./champions-festival");
const deoxys_v_1 = require("./deoxys-v");
const deoxys_vstar_1 = require("./deoxys-vstar");
const hisuian_electrode_v_1 = require("./hisuian-electrode-v");
const leafeon_vstar_1 = require("./leafeon-vstar");
const lucario_vstar_1 = require("./lucario-vstar");
const manaphy_1 = require("./manaphy");
const professor_burnett_1 = require("./professor-burnett");
const venusaur_v_1 = require("./venusaur-v");
const venusaur_vmax_1 = require("./venusaur-vmax");
class ChampionsFestivalArt extends champions_festival_1.ChampionsFestival {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_296_R_EN_LG.png';
    }
}
exports.ChampionsFestivalArt = ChampionsFestivalArt;
class DeoxysVArt extends deoxys_v_1.DeoxysV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_266_R_EN.png';
    }
}
exports.DeoxysVArt = DeoxysVArt;
class DeoxysVSTARArt extends deoxys_vstar_1.DeoxysVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_268_R_EN.png';
    }
}
exports.DeoxysVSTARArt = DeoxysVSTARArt;
class HisuianElectrodeVArt extends hisuian_electrode_v_1.HisuianElectrodeV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_296_R_EN_LG.png';
    }
}
exports.HisuianElectrodeVArt = HisuianElectrodeVArt;
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
class EscapeRopeArt extends escape_rope_1.EscapeRope {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://www.serebii.net/card/ggend/51.jpg';
    }
}
exports.EscapeRopeArt = EscapeRopeArt;
class VenusaurVArt extends venusaur_v_1.VenusaurV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_100_R_EN.png';
    }
}
exports.VenusaurVArt = VenusaurVArt;
class VenusaurVMAXArt extends venusaur_vmax_1.VenusaurVMAX {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSP/SSP_102_R_EN.png';
    }
}
exports.VenusaurVMAXArt = VenusaurVMAXArt;
