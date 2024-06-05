"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugmaArt = exports.ProfessorOaksSetupArt = exports.GolettArt = exports.BlacephalonArt = void 0;
const blacephalon_1 = require("./blacephalon");
const golett_1 = require("./golett");
const professor_oaks_setup_1 = require("./professor-oaks-setup");
const slugma_1 = require("./slugma");
class BlacephalonArt extends blacephalon_1.Blacephalon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_104_R_EN_LG.png';
    }
}
exports.BlacephalonArt = BlacephalonArt;
class GolettArt extends golett_1.Golett {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_089_R_EN_LG.png';
    }
}
exports.GolettArt = GolettArt;
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
