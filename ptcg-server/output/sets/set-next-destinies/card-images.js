"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZekromExArt = exports.SkyarrowBridgeArt = exports.ReshiramExArt = exports.PrismEnergyArt = exports.PokemonCenterArt = exports.MusharnaArt = exports.MewtwoExArt = exports.LevelBallArt = exports.HeavyBallArt = void 0;
const heavy_ball_1 = require("./heavy-ball");
const level_ball_1 = require("./level-ball");
const mewtwo_ex_1 = require("./mewtwo-ex");
const musharna_1 = require("./musharna");
const pokemon_center_1 = require("./pokemon-center");
const prism_energy_1 = require("./prism-energy");
const reshiram_ex_1 = require("./reshiram-ex");
const skyarrow_bridge_1 = require("./skyarrow-bridge");
const zekrom_ex_1 = require("./zekrom-ex");
class HeavyBallArt extends heavy_ball_1.HeavyBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_088_R_EN.png';
    }
}
exports.HeavyBallArt = HeavyBallArt;
class LevelBallArt extends level_ball_1.LevelBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_089_R_EN.png';
    }
}
exports.LevelBallArt = LevelBallArt;
class MewtwoExArt extends mewtwo_ex_1.MewtwoEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_054_R_EN.png';
    }
}
exports.MewtwoExArt = MewtwoExArt;
class MusharnaArt extends musharna_1.Musharna {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_059_R_EN.png';
    }
}
exports.MusharnaArt = MusharnaArt;
class PokemonCenterArt extends pokemon_center_1.PokemonCenter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_090_R_EN.png';
    }
}
exports.PokemonCenterArt = PokemonCenterArt;
class PrismEnergyArt extends prism_energy_1.PrismEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_093_R_EN.png';
    }
}
exports.PrismEnergyArt = PrismEnergyArt;
class ReshiramExArt extends reshiram_ex_1.ReshiramEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_022_R_EN.png';
    }
}
exports.ReshiramExArt = ReshiramExArt;
class SkyarrowBridgeArt extends skyarrow_bridge_1.SkyarrowBridge {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_091_R_EN.png';
    }
}
exports.SkyarrowBridgeArt = SkyarrowBridgeArt;
class ZekromExArt extends zekrom_ex_1.ZekromEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/NXD/NXD_051_R_EN.png';
    }
}
exports.ZekromExArt = ZekromExArt;
