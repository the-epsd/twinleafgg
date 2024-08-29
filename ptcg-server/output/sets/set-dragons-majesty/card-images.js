"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchRaftArt = exports.FieryFlintArt = exports.FeraligatrArt = exports.FeebasArt = exports.CroconawArt = exports.BlazikenArt = void 0;
const croconaw_1 = require("./croconaw");
const DRM_24_Feraligatr_1 = require("./DRM_24_Feraligatr");
const DRM_6_Blaziken_1 = require("./DRM_6_Blaziken");
const feebas_1 = require("./feebas");
const fiery_flint_1 = require("./fiery-flint");
const switch_raft_1 = require("./switch-raft");
class BlazikenArt extends DRM_6_Blaziken_1.Blaziken {
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
class FeraligatrArt extends DRM_24_Feraligatr_1.Feraligatr {
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
class SwitchRaftArt extends switch_raft_1.SwitchRaft {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/DRM/DRM_062_R_EN_LG.png';
    }
}
exports.SwitchRaftArt = SwitchRaftArt;
