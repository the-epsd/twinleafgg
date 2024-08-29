"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuriffieldStadiumArt = exports.SoniaArt = exports.RotomPhoneArt = exports.PiersArt = exports.GalarianObstagoonArt = exports.EldegossVArt = void 0;
const eldegoss_v_1 = require("./eldegoss-v");
const galarian_obstagoon_1 = require("./galarian-obstagoon");
const piers_1 = require("./piers");
const rotom_phone_1 = require("./rotom-phone");
const sonia_1 = require("./sonia");
const turffield_stadium_1 = require("./turffield-stadium");
class EldegossVArt extends eldegoss_v_1.EldegossV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_005_R_EN.png';
    }
}
exports.EldegossVArt = EldegossVArt;
class GalarianObstagoonArt extends galarian_obstagoon_1.GalarianObstagoon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_037_R_EN.png';
    }
}
exports.GalarianObstagoonArt = GalarianObstagoonArt;
class PiersArt extends piers_1.Piers {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_058_R_EN_LG.png';
    }
}
exports.PiersArt = PiersArt;
class RotomPhoneArt extends rotom_phone_1.RotomPhone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_064_R_EN_LG.png';
    }
}
exports.RotomPhoneArt = RotomPhoneArt;
class SoniaArt extends sonia_1.Sonia {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_065_R_EN_LG.png';
    }
}
exports.SoniaArt = SoniaArt;
class TuriffieldStadiumArt extends turffield_stadium_1.TurffieldStadium {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CPA/CPA_068_R_EN_LG.png';
    }
}
exports.TuriffieldStadiumArt = TuriffieldStadiumArt;
