"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperiorEnergyRetrievalArt = exports.RockGuardArt = exports.MrMimeArt = exports.FrozenCityArt = exports.FloatStoneArt = exports.ExeggutorArt = exports.ExeggcuteArt = exports.ElectrodeArt = void 0;
const superior_energy_retrieval_1 = require("../set-paldea-evolved/superior-energy-retrieval");
const exeggcute_1 = require("./exeggcute");
const float_stone_1 = require("./float-stone");
const frozen_city_1 = require("./frozen-city");
const mr_mime_1 = require("./mr-mime");
const electrode_1 = require("./electrode");
const exeggutor_1 = require("./exeggutor");
const rock_guard_1 = require("./rock-guard");
class ElectrodeArt extends electrode_1.Electrode {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_033_R_EN_LG.png';
    }
}
exports.ElectrodeArt = ElectrodeArt;
class ExeggcuteArt extends exeggcute_1.Exeggcute {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_004_R_EN.png';
    }
}
exports.ExeggcuteArt = ExeggcuteArt;
class ExeggutorArt extends exeggutor_1.Exeggutor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_005_R_EN.png';
    }
}
exports.ExeggutorArt = ExeggutorArt;
class FloatStoneArt extends float_stone_1.FloatStone {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_099_R_EN.png';
    }
}
exports.FloatStoneArt = FloatStoneArt;
class FrozenCityArt extends frozen_city_1.FrozenCity {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_100_R_EN.png';
    }
}
exports.FrozenCityArt = FrozenCityArt;
class MrMimeArt extends mr_mime_1.MrMime {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_047_R_EN.png';
    }
}
exports.MrMimeArt = MrMimeArt;
class RockGuardArt extends rock_guard_1.RockGuard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_108_R_EN.png';
    }
}
exports.RockGuardArt = RockGuardArt;
class SuperiorEnergyRetrievalArt extends superior_energy_retrieval_1.SuperiorEnergyRetrieval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PLF/PLF_103_R_EN.png';
        this.setNumber = '103';
        this.fullName = 'Superior Energy Retrieval PLF';
    }
}
exports.SuperiorEnergyRetrievalArt = SuperiorEnergyRetrievalArt;
