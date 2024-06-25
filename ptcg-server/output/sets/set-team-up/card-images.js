"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapdosArt = exports.ViridianForestArt = exports.PokemonCommunicationArt = exports.LaprasArt = exports.JirachiArt = exports.HitmonleeArt = exports.HitmonchanArt = exports.DragoniteArt = void 0;
const dragonite_1 = require("./dragonite");
const hitmonchan_1 = require("./hitmonchan");
const jirachi_1 = require("./jirachi");
const lapras_1 = require("./lapras");
const pokemon_communication_1 = require("./pokemon-communication");
const viridian_forest_1 = require("./viridian-forest");
const zapdos_1 = require("./zapdos");
class DragoniteArt extends dragonite_1.Dragonite {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_119_R_EN_LG.png';
    }
}
exports.DragoniteArt = DragoniteArt;
class HitmonchanArt extends hitmonchan_1.Hitmonchan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_074_R_EN.png';
    }
}
exports.HitmonchanArt = HitmonchanArt;
class HitmonleeArt extends hitmonchan_1.Hitmonchan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_073_R_EN.png';
    }
}
exports.HitmonleeArt = HitmonleeArt;
class JirachiArt extends jirachi_1.Jirachi {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_099_R_EN_LG.png';
    }
}
exports.JirachiArt = JirachiArt;
class LaprasArt extends lapras_1.Lapras {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_031_R_EN.png';
    }
}
exports.LaprasArt = LaprasArt;
class PokemonCommunicationArt extends pokemon_communication_1.PokemonCommunication {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_152_R_EN.png';
    }
}
exports.PokemonCommunicationArt = PokemonCommunicationArt;
class ViridianForestArt extends viridian_forest_1.ViridianForest {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_156_R_EN.png';
    }
}
exports.ViridianForestArt = ViridianForestArt;
class ZapdosArt extends zapdos_1.Zapdos {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEU/TEU_040_R_EN.png';
    }
}
exports.ZapdosArt = ZapdosArt;
