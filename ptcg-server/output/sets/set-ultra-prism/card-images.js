"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolknerArt = exports.UnitEnergyLPMArt = exports.UnitEnergyGRWArt = exports.TurtwigArt = exports.PokemonFanClubArt = exports.MtCoronetArt = exports.MagnezoneArt = exports.MagnemiteArt = exports.GibleArt = exports.GardeniaArt = exports.EscapeBoardArt = exports.CynthiaArt = void 0;
const cynthia_1 = require("./cynthia");
const escape_board_1 = require("./escape-board");
const gardenia_1 = require("./gardenia");
const gible_1 = require("./gible");
const magnemite_1 = require("./magnemite");
const magnezone_1 = require("./magnezone");
const mt_coronet_1 = require("./mt-coronet");
const pokemon_fan_club_1 = require("./pokemon-fan-club");
const turtwig_1 = require("./turtwig");
const unit_energy_grw_1 = require("./unit-energy-grw");
const unit_energy_lpm_1 = require("./unit-energy-lpm");
const volkner_1 = require("./volkner");
class CynthiaArt extends cynthia_1.Cynthia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_119_R_EN_LG.png';
    }
}
exports.CynthiaArt = CynthiaArt;
class EscapeBoardArt extends escape_board_1.EscapeBoard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_122_R_EN_LG.png';
    }
}
exports.EscapeBoardArt = EscapeBoardArt;
class GardeniaArt extends gardenia_1.Gardenia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_124_R_EN_LG.png';
    }
}
exports.GardeniaArt = GardeniaArt;
class GibleArt extends gible_1.Gible {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_096_R_EN.png';
    }
}
exports.GibleArt = GibleArt;
class MagnemiteArt extends magnemite_1.Magnemite {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_081_R_EN.png';
    }
}
exports.MagnemiteArt = MagnemiteArt;
class MagnezoneArt extends magnezone_1.Magnezone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_083_R_EN_LG.png';
    }
}
exports.MagnezoneArt = MagnezoneArt;
class MtCoronetArt extends mt_coronet_1.MtCoronet {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_130_R_EN_LG.png';
    }
}
exports.MtCoronetArt = MtCoronetArt;
class PokemonFanClubArt extends pokemon_fan_club_1.PokemonFanClub {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_133_R_EN.png';
    }
}
exports.PokemonFanClubArt = PokemonFanClubArt;
class TurtwigArt extends turtwig_1.Turtwig {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_006_R_EN_LG.png';
    }
}
exports.TurtwigArt = TurtwigArt;
class UnitEnergyGRWArt extends unit_energy_grw_1.UnitEnergyGRW {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_137_R_EN.png';
    }
}
exports.UnitEnergyGRWArt = UnitEnergyGRWArt;
class UnitEnergyLPMArt extends unit_energy_lpm_1.UnitEnergyLPM {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_138_R_EN.png';
    }
}
exports.UnitEnergyLPMArt = UnitEnergyLPMArt;
class VolknerArt extends volkner_1.Volkner {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_135_R_EN_LG.png';
    }
}
exports.VolknerArt = VolknerArt;
