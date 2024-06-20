"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrubbishArt = exports.RioluArt = exports.MewExArt = exports.GothoritaArt = exports.GothitelleArt = exports.GothitaArt = exports.EnergySwitchArt = exports.EmboarArt = exports.CobalionArt = void 0;
const energy_switch_1 = require("../set-scarlet-and-violet/energy-switch");
const cobalion_1 = require("./cobalion");
const emboar_1 = require("./emboar");
const gothita_1 = require("./gothita");
const gothitelle_1 = require("./gothitelle");
const gothorita_1 = require("./gothorita");
const mew_ex_1 = require("./mew-ex");
const riolu_1 = require("./riolu");
const trubbish_1 = require("./trubbish");
class CobalionArt extends cobalion_1.Cobalion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_091_R_EN.png';
    }
}
exports.CobalionArt = CobalionArt;
class EmboarArt extends emboar_1.Emboar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_027_R_EN.png';
    }
}
exports.EmboarArt = EmboarArt;
class EnergySwitchArt extends energy_switch_1.EnergySwitch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_112_R_EN.png';
    }
}
exports.EnergySwitchArt = EnergySwitchArt;
class GothitaArt extends gothita_1.Gothita {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_070_R_EN.png';
    }
}
exports.GothitaArt = GothitaArt;
class GothitelleArt extends gothitelle_1.Gothitelle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_072_R_EN.png';
    }
}
exports.GothitelleArt = GothitelleArt;
class GothoritaArt extends gothorita_1.Gothorita {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_071_R_EN.png';
    }
}
exports.GothoritaArt = GothoritaArt;
class MewExArt extends mew_ex_1.MewEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_RC24_R_EN.png';
    }
}
exports.MewExArt = MewExArt;
class RioluArt extends riolu_1.Riolu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_079_R_EN.png';
    }
}
exports.RioluArt = RioluArt;
class TrubbishArt extends trubbish_1.Trubbish {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/LTR/LTR_067_R_EN.png';
    }
}
exports.TrubbishArt = TrubbishArt;
