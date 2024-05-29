"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickBallArt = exports.SnomArt = exports.InteleonArt = exports.DrizzileArt = exports.CinccinoArt = exports.AirBalloonArt = void 0;
const air_balloon_1 = require("./air-balloon");
const cinccino_1 = require("./cinccino");
const drizzile_1 = require("./drizzile");
const inteleon_1 = require("./inteleon");
const quick_ball_1 = require("./quick-ball");
const snom_1 = require("./snom");
class AirBalloonArt extends air_balloon_1.AirBalloon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_156_R_EN_LG.png';
    }
}
exports.AirBalloonArt = AirBalloonArt;
class CinccinoArt extends cinccino_1.Cinccino {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_147_R_EN_LG.png';
    }
}
exports.CinccinoArt = CinccinoArt;
class DrizzileArt extends drizzile_1.Drizzile {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_056_R_EN_LG.png';
    }
}
exports.DrizzileArt = DrizzileArt;
class InteleonArt extends inteleon_1.Inteleon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_058_R_EN_LG.png';
    }
}
exports.InteleonArt = InteleonArt;
class SnomArt extends snom_1.Snom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_063_R_EN_LG.png';
    }
}
exports.SnomArt = SnomArt;
class QuickBallArt extends quick_ball_1.QuickBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/SSH/SSH_179_R_EN_LG.png';
    }
}
exports.QuickBallArt = QuickBallArt;
