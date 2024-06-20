"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugmaArt = exports.ProfessorOaksSetupArt = exports.MallowAndLanaArt = exports.GuzzlordArt = exports.GolettArt = exports.CynthiaAndCaitlinArt = exports.BlacephalonArt = void 0;
const blacephalon_1 = require("./blacephalon");
const cynthia_and_caitlin_1 = require("./cynthia-and-caitlin");
const golett_1 = require("./golett");
const guzzlord_1 = require("./guzzlord");
const mallow_and_lana_1 = require("./mallow-and-lana");
const professor_oaks_setup_1 = require("./professor-oaks-setup");
const slugma_1 = require("./slugma");
class BlacephalonArt extends blacephalon_1.Blacephalon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_104_R_EN_LG.png';
    }
}
exports.BlacephalonArt = BlacephalonArt;
class CynthiaAndCaitlinArt extends cynthia_and_caitlin_1.CynthiaAndCaitlin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_189_R_EN_LG.png';
    }
}
exports.CynthiaAndCaitlinArt = CynthiaAndCaitlinArt;
class GolettArt extends golett_1.Golett {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_089_R_EN_LG.png';
    }
}
exports.GolettArt = GolettArt;
class GuzzlordArt extends guzzlord_1.Guzzlord {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_136_R_EN_LG.png';
    }
}
exports.GuzzlordArt = GuzzlordArt;
class MallowAndLanaArt extends mallow_and_lana_1.MallowAndLana {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_198_R_EN_LG.png';
    }
}
exports.MallowAndLanaArt = MallowAndLanaArt;
class ProfessorOaksSetupArt extends professor_oaks_setup_1.ProfessorOaksSetup {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_201_R_EN.png';
    }
}
exports.ProfessorOaksSetupArt = ProfessorOaksSetupArt;
class SlugmaArt extends slugma_1.Slugma {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_026_R_EN_LG.png';
    }
}
exports.SlugmaArt = SlugmaArt;
