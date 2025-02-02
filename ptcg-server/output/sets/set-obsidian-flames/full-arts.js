"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaroomIR = exports.FireEnergyHR = exports.ArtazonHR = exports.CharizardexHR = exports.PoppySIR = exports.PidgeotexSIR = exports.CharizardexSIR = exports.PoppyFA = exports.PidgeotexFA = exports.CharizardexFA = exports.ScizorIR = exports.PidgeottoIR = exports.PidgeyIR = exports.CleffaIR = exports.BelliboltIR = void 0;
const artazon_1 = require("../set-paldea-evolved/artazon");
const fire_energy_1 = require("../set-scarlet-and-violet-energy/fire-energy");
const bellibolt_1 = require("./bellibolt");
const charizard_ex_1 = require("./charizard-ex");
const cleffa_1 = require("./cleffa");
const pidgeot_ex_1 = require("./pidgeot-ex");
const pidgeotto_1 = require("./pidgeotto");
const pidgey_1 = require("./pidgey");
const poppy_1 = require("./poppy");
const scizor_1 = require("./scizor");
const varoom_1 = require("./varoom");
class BelliboltIR extends bellibolt_1.Bellibolt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_201_R_EN_LG.png';
        this.setNumber = '201';
        this.fullName = 'Bellibolt OBF';
    }
}
exports.BelliboltIR = BelliboltIR;
class CleffaIR extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_202_R_EN_LG.png';
        this.setNumber = '202';
        this.fullName = 'Cleffa OBF';
    }
}
exports.CleffaIR = CleffaIR;
class PidgeyIR extends pidgey_1.Pidgey {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_207_R_EN_LG.png';
        this.setNumber = '207';
        this.fullName = 'Pidgey OBF';
    }
}
exports.PidgeyIR = PidgeyIR;
class PidgeottoIR extends pidgeotto_1.Pidgeotto {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_208_R_EN_LG.png';
        this.setNumber = '208';
        this.fullName = 'Pidgeotto OBF';
    }
}
exports.PidgeottoIR = PidgeottoIR;
class ScizorIR extends scizor_1.Scizor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_205_R_EN.png';
        this.setNumber = '205';
        this.fullName = 'Scizor OBF';
    }
}
exports.ScizorIR = ScizorIR;
class CharizardexFA extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_215_R_EN_LG.png';
        this.setNumber = '215';
        this.fullName = 'Charizard ex OBF';
    }
}
exports.CharizardexFA = CharizardexFA;
class PidgeotexFA extends pidgeot_ex_1.Pidgeotex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_217_R_EN_LG.png';
        this.setNumber = '217';
        this.fullName = 'Pidgeot ex OBF';
    }
}
exports.PidgeotexFA = PidgeotexFA;
class PoppyFA extends poppy_1.Poppy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_220_R_EN_LG.png';
        this.setNumber = '220';
        this.fullName = 'Poppy OBF';
    }
}
exports.PoppyFA = PoppyFA;
class CharizardexSIR extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_223_R_EN_LG.png';
        this.setNumber = '223';
        this.fullName = 'Charizard ex OBF';
    }
}
exports.CharizardexSIR = CharizardexSIR;
class PidgeotexSIR extends pidgeot_ex_1.Pidgeotex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_225_R_EN_LG.png';
        this.setNumber = '225';
        this.fullName = 'Pidgeot ex OBF';
    }
}
exports.PidgeotexSIR = PidgeotexSIR;
class PoppySIR extends poppy_1.Poppy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_227_R_EN_LG.png';
        this.setNumber = '227';
        this.fullName = 'Poppy OBF';
    }
}
exports.PoppySIR = PoppySIR;
class CharizardexHR extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_228_R_EN_LG.png';
        this.setNumber = '228';
        this.fullName = 'Charizard ex OBF';
    }
}
exports.CharizardexHR = CharizardexHR;
class ArtazonHR extends artazon_1.Artazon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_229_R_EN_LG.png';
        this.setNumber = '229';
        this.fullName = 'Artazon OBF';
    }
}
exports.ArtazonHR = ArtazonHR;
class FireEnergyHR extends fire_energy_1.FireEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_230_R_EN_LG.png';
        this.setNumber = '230';
        this.fullName = 'Fire Energy OBF';
    }
}
exports.FireEnergyHR = FireEnergyHR;
class VaroomIR extends varoom_1.Varoom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/OBF/OBF_206_R_EN_LG.png';
        this.setNumber = '206';
        this.fullName = 'Varoom OBF';
    }
}
exports.VaroomIR = VaroomIR;
