"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurtwigArt = exports.PokemonFanClubArt = exports.MagnezoneArt = exports.GibleArt = exports.GardeniaArt = exports.EscapeBoardArt = exports.CynthiaArt = void 0;
const cynthia_1 = require("./cynthia");
const escape_board_1 = require("./escape-board");
const gardenia_1 = require("./gardenia");
const gible_1 = require("./gible");
const magnezone_1 = require("./magnezone");
const pokemon_fan_club_1 = require("./pokemon-fan-club");
const turtwig_1 = require("./turtwig");
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
class MagnezoneArt extends magnezone_1.Magnezone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/UPR/UPR_083_R_EN_LG.png';
    }
}
exports.MagnezoneArt = MagnezoneArt;
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
