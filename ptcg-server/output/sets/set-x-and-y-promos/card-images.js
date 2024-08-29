"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeloettaArt = exports.JirachiArt = exports.AzelfArt = void 0;
const jirachi_1 = require("./jirachi");
const XYP_142_Azelf_1 = require("./XYP_142_Azelf");
const XYP_193_Meloetta_1 = require("./XYP_193_Meloetta");
class AzelfArt extends XYP_142_Azelf_1.Azelf {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_142_R_EN_LG.png';
    }
}
exports.AzelfArt = AzelfArt;
class JirachiArt extends jirachi_1.Jirachi {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_067_R_EN.png';
    }
}
exports.JirachiArt = JirachiArt;
class MeloettaArt extends XYP_193_Meloetta_1.Meloetta {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_193_R_EN.png';
    }
}
exports.MeloettaArt = MeloettaArt;
