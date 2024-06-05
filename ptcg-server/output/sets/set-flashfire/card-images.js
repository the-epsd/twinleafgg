"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToxicroakExArt = exports.StartlingMegaphoneArt = exports.SkrelpArt = exports.SacredAshArt = exports.PyroarArt = exports.MiltankArt = exports.LysandreArt = exports.LitleoArt = exports.DragalgeArt = exports.BlacksmithArt = void 0;
const blacksmith_1 = require("./blacksmith");
const dragalge_1 = require("./dragalge");
const litleo_1 = require("./litleo");
const lysandre_1 = require("./lysandre");
const miltank_1 = require("./miltank");
const pyroar_1 = require("./pyroar");
const sacred_ash_1 = require("./sacred-ash");
const skrelp_1 = require("./skrelp");
const startling_megaphone_1 = require("./startling-megaphone");
const toxicroak_ex_1 = require("./toxicroak-ex");
class BlacksmithArt extends blacksmith_1.Blacksmith {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_088_R_EN_LG.png';
    }
}
exports.BlacksmithArt = BlacksmithArt;
class DragalgeArt extends dragalge_1.Dragalge {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_071_R_EN.png';
    }
}
exports.DragalgeArt = DragalgeArt;
class LitleoArt extends litleo_1.Litleo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_018_R_EN.png';
    }
}
exports.LitleoArt = LitleoArt;
class LysandreArt extends lysandre_1.Lysandre {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_090_R_EN.png';
    }
}
exports.LysandreArt = LysandreArt;
class MiltankArt extends miltank_1.Miltank {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_083_R_EN.png';
    }
}
exports.MiltankArt = MiltankArt;
class PyroarArt extends pyroar_1.Pyroar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_020_R_EN.png';
    }
}
exports.PyroarArt = PyroarArt;
class SacredAshArt extends sacred_ash_1.SacredAsh {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_096_R_EN.png';
    }
}
exports.SacredAshArt = SacredAshArt;
class SkrelpArt extends skrelp_1.Skrelp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_044_R_EN.png';
    }
}
exports.SkrelpArt = SkrelpArt;
class StartlingMegaphoneArt extends startling_megaphone_1.StartlingMegaphone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_097_R_EN.png';
    }
}
exports.StartlingMegaphoneArt = StartlingMegaphoneArt;
class ToxicroakExArt extends toxicroak_ex_1.ToxicroakEx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/FLF/FLF_041_R_EN.png';
    }
}
exports.ToxicroakExArt = ToxicroakExArt;
