"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WooperArt = exports.SwitchRaftArt = exports.QuagsireArt = exports.FieryFlintArt = exports.FeraligatrArt = exports.FeebasArt = exports.CroconawArt = exports.BlazikenArt = void 0;
const croconaw_1 = require("./croconaw");
const feraligatr_1 = require("./feraligatr");
const blaziken_1 = require("./blaziken");
const feebas_1 = require("./feebas");
const fiery_flint_1 = require("./fiery-flint");
const quagsire_1 = require("./quagsire");
const switch_raft_1 = require("./switch-raft");
const wooper_1 = require("./wooper");
class BlazikenArt extends blaziken_1.Blaziken {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_006_R_EN_LG.png';
    }
}
exports.BlazikenArt = BlazikenArt;
class CroconawArt extends croconaw_1.Croconaw {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_023_R_EN_LG.png';
    }
}
exports.CroconawArt = CroconawArt;
class FeebasArt extends feebas_1.Feebas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_028_R_EN_LG.png';
    }
}
exports.FeebasArt = FeebasArt;
class FeraligatrArt extends feraligatr_1.Feraligatr {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_024_R_EN_LG.png';
    }
}
exports.FeraligatrArt = FeraligatrArt;
class FieryFlintArt extends fiery_flint_1.FieryFlint {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_060_R_EN.png';
    }
}
exports.FieryFlintArt = FieryFlintArt;
class QuagsireArt extends quagsire_1.Quagsire {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_026_R_EN_LG.png';
    }
}
exports.QuagsireArt = QuagsireArt;
class SwitchRaftArt extends switch_raft_1.SwitchRaft {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_062_R_EN_LG.png';
    }
}
exports.SwitchRaftArt = SwitchRaftArt;
class WooperArt extends wooper_1.Wooper {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_025_R_EN_LG.png';
    }
}
exports.WooperArt = WooperArt;
