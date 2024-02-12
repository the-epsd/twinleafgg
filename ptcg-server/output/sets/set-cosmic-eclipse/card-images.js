"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessorOaksSetupArt = void 0;
const professor_oaks_setup_1 = require("./professor-oaks-setup");
class ProfessorOaksSetupArt extends professor_oaks_setup_1.ProfessorOaksSetup {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/CEC/CEC_201_R_EN.png';
    }
}
exports.ProfessorOaksSetupArt = ProfessorOaksSetupArt;
