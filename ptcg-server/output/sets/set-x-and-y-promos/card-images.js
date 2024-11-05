"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeloettaArt = exports.JirachiArt = exports.GreninjaArt = exports.AzelfArt = void 0;
const jirachi_1 = require("./jirachi");
const azelf_1 = require("./azelf");
const meloetta_1 = require("./meloetta");
const greninja_1 = require("./greninja");
class AzelfArt extends azelf_1.Azelf {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_142_R_EN_LG.png';
    }
}
exports.AzelfArt = AzelfArt;
class GreninjaArt extends greninja_1.Greninja {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_162_R_EN.png';
    }
}
exports.GreninjaArt = GreninjaArt;
class JirachiArt extends jirachi_1.Jirachi {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_067_R_EN.png';
    }
}
exports.JirachiArt = JirachiArt;
class MeloettaArt extends meloetta_1.Meloetta {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/XYP/XYP_193_R_EN.png';
    }
}
exports.MeloettaArt = MeloettaArt;
