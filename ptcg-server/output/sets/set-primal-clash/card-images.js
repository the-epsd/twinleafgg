"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WailordExArt = exports.SilentLabArt = exports.ScorchedEarthArt = exports.RoughSeasArt = exports.MaxiesHiddenBallTrickArt = exports.ArchiesAceInTheHoleArt = exports.AcroBikeArt = void 0;
const acro_bike_1 = require("./acro-bike");
const archies_ace_in_the_hole_1 = require("./archies-ace-in-the hole");
const maxies_hidden_ball_trick_1 = require("./maxies-hidden-ball-trick");
const rough_seas_1 = require("./rough-seas");
const scorched_earth_1 = require("./scorched-earth");
const silent_lab_1 = require("./silent-lab");
const wailord_ex_1 = require("./wailord-ex");
class AcroBikeArt extends acro_bike_1.AcroBike {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_122_R_EN.png';
    }
}
exports.AcroBikeArt = AcroBikeArt;
class ArchiesAceInTheHoleArt extends archies_ace_in_the_hole_1.ArchiesAceInTheHole {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_124_R_EN.png';
    }
}
exports.ArchiesAceInTheHoleArt = ArchiesAceInTheHoleArt;
class MaxiesHiddenBallTrickArt extends maxies_hidden_ball_trick_1.MaxiesHiddenBallTrick {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_133_R_EN.png';
    }
}
exports.MaxiesHiddenBallTrickArt = MaxiesHiddenBallTrickArt;
class RoughSeasArt extends rough_seas_1.RoughSeas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_137_R_EN.png';
    }
}
exports.RoughSeasArt = RoughSeasArt;
class ScorchedEarthArt extends scorched_earth_1.ScorchedEarth {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_138_R_EN.png';
    }
}
exports.ScorchedEarthArt = ScorchedEarthArt;
class SilentLabArt extends silent_lab_1.SilentLab {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_140_R_EN.png';
    }
}
exports.SilentLabArt = SilentLabArt;
class WailordExArt extends wailord_ex_1.WailordEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PRC/PRC_038_R_EN.png';
    }
}
exports.WailordExArt = WailordExArt;
