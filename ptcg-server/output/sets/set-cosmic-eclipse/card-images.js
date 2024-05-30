"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugmaArt = exports.ProfessorOaksSetupArt = void 0;
const professor_oaks_setup_1 = require("./professor-oaks-setup");
const slugma_1 = require("./slugma");
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
