"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZamazentaVArt = exports.ZamazentaArt = exports.ZacianVSTARArt = exports.RotomVArt = exports.RegigigasVSTARArt = exports.RegigigasVArt = exports.RadiantEternatusArt = exports.RadiantCharizardArt = exports.LostVacuumArt = exports.LuxrayArt = exports.KyogreArt = exports.BidoofArt = void 0;
const lost_vacuum_1 = require("../set-lost-origin/lost-vacuum");
const rotom_v_1 = require("../set-lost-origin/rotom-v");
const bidoof_1 = require("./bidoof");
const kyogre_1 = require("./kyogre");
const luxray_1 = require("./luxray");
const radiant_charizard_1 = require("./radiant-charizard");
const radiant_eternatus_1 = require("./radiant-eternatus");
const regigigas_v_1 = require("./regigigas-v");
const regigigas_vstar_1 = require("./regigigas-vstar");
const zacian_vstar_1 = require("./zacian-vstar");
const zamazenta_1 = require("./zamazenta");
const zamazenta_v_1 = require("./zamazenta-v");
class BidoofArt extends bidoof_1.Bidoof {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_111_R_EN_LG.png';
    }
}
exports.BidoofArt = BidoofArt;
class KyogreArt extends kyogre_1.Kyogre {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_036_R_EN_LG.png';
    }
}
exports.KyogreArt = KyogreArt;
class LuxrayArt extends luxray_1.Luxray {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_044_R_EN_LG.png';
    }
}
exports.LuxrayArt = LuxrayArt;
class LostVacuumArt extends lost_vacuum_1.LostVacuum {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_135_R_EN.png';
        this.fullName = 'Lost Vacuum CRZ';
        this.set = 'CRZ';
        this.setNumber = '135';
    }
}
exports.LostVacuumArt = LostVacuumArt;
class RadiantCharizardArt extends radiant_charizard_1.RadiantCharizard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_020_R_EN_LG.png';
    }
}
exports.RadiantCharizardArt = RadiantCharizardArt;
class RadiantEternatusArt extends radiant_eternatus_1.RadiantEternatus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_105_R_EN_LG.png';
    }
}
exports.RadiantEternatusArt = RadiantEternatusArt;
class RegigigasVArt extends regigigas_v_1.RegigigasV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_113_R_EN_LG.png';
    }
}
exports.RegigigasVArt = RegigigasVArt;
class RegigigasVSTARArt extends regigigas_vstar_1.RegigigasVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_114_R_EN_LG.png';
    }
}
exports.RegigigasVSTARArt = RegigigasVSTARArt;
class RotomVArt extends rotom_v_1.RotomV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_045_R_EN.png';
        this.fullName = 'Rotom V CRZ';
        this.set = 'CRZ';
        this.setNumber = '45';
    }
}
exports.RotomVArt = RotomVArt;
class ZacianVSTARArt extends zacian_vstar_1.ZacianVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_096_R_EN_LG.png';
    }
}
exports.ZacianVSTARArt = ZacianVSTARArt;
class ZamazentaArt extends zamazenta_1.Zamazenta {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_097_R_EN_LG.png';
    }
}
exports.ZamazentaArt = ZamazentaArt;
class ZamazentaVArt extends zamazenta_v_1.ZamazentaV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CRZ/CRZ_098_R_EN_LG.png';
    }
}
exports.ZamazentaVArt = ZamazentaVArt;
