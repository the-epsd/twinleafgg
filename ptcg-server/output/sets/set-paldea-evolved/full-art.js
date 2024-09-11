"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperiorEnergyRetrievalHR = exports.SuperRodHR = exports.TingLuexHR = exports.ChienPaoexHR = exports.MeowscaradaexHR = exports.IonoSIR = exports.GrushaSIR = exports.GiacomoSIR = exports.BossOrdersSIR = exports.SquawkabillyexSIR = exports.TingLuexSIR = exports.ChienPaoexSIR = exports.ChiYuexSIR = exports.WoChienexSIR = exports.MeowscaradaexSIR = exports.IonoFA = exports.GrushaFA = exports.GiacomoFA = exports.ClavellFA = exports.BossOrdersFA = exports.SquawkabillyexFA = exports.NoivernexFA = exports.TingLuexFA = exports.ChienPaoexFA = exports.ChiYuexFA = exports.WoChienexFA = exports.MeowscaradaexFA = exports.FlamigoIR = exports.BaxcaliburIR = exports.ArctibaxIR = exports.FrigibaxIR = void 0;
const arctibax_1 = require("./arctibax");
const baxcalibur_1 = require("./baxcalibur");
const boss_orders_1 = require("./boss-orders");
const chi_yu_ex_1 = require("./chi-yu-ex");
const chien_pao_ex_1 = require("./chien-pao-ex");
const clavell_1 = require("./clavell");
const flamigo_1 = require("./flamigo");
const frigibax_1 = require("./frigibax");
const giacomo_1 = require("./giacomo");
const grusha_1 = require("./grusha");
const iono_1 = require("./iono");
const meowscarada_ex_1 = require("./meowscarada-ex");
const noivern_ex_1 = require("./noivern-ex");
const squawkabilly_ex_1 = require("./squawkabilly-ex");
const super_rod_1 = require("./super-rod");
const superior_energy_retrieval_1 = require("./superior-energy-retrieval");
const ting_lu_ex_1 = require("./ting-lu-ex");
const wo_chien_ex_1 = require("./wo-chien-ex");
// export class HeracrossIR extends Heracross {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_194_R_EN_LG.png';
//   public setNumber = '194';
//   public fullName: string = 'HeracrossIR PAL';
// }
// export class TropiusIR extends Tropius {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_195_R_EN_LG.png';
//   public setNumber = '195';
//   public fullName: string = 'TropiusIR PAL';
// }
// export class SprigatitoIR extends Sprigatito {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_196_R_EN_LG.png';
//   public setNumber = '196';
//   public fullName: string = 'SprigatitoIR PAL';
// }
// export class FloragatoIR extends Floragato {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_197_R_EN_LG.png';
//   public setNumber = '197';
//   public fullName: string = 'FloragatoIR PAL';
// }
// export class BramblinIR extends Bramblin {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_198_R_EN_LG.png';
//   public setNumber = '198';
//   public fullName: string = 'BramblinIR PAL';
// }
// export class FletchinderIR extends Fletchinder {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_199_R_EN_LG.png';
//   public setNumber = '199';
//   public fullName: string = 'FletchinderIR PAL';
// }
// export class PyroarIR extends Pyroar {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_200_R_EN_LG.png';
//   public setNumber = '200';
//   public fullName: string = 'PyroarIR PAL';
// }
// export class FuecocoIR extends Fuecoco {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_201_R_EN_LG.png';
//   public setNumber = '201';
//   public fullName: string = 'FuecocoIR PAL';
// }
// export class CrocalorIR extends Crocalor {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_202_R_EN_LG.png';
//   public setNumber = '202';
//   public fullName: string = 'CrocalorIR PAL';
// }
// export class MagikarpIR extends Magikarp {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_203_R_EN_LG.png';
//   public setNumber = '203';
//   public fullName: string = 'MagikarpIR PAL';
// }
// export class MarillIR extends Marill {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_204_R_EN_LG.png';
//   public setNumber = '204';
//   public fullName: string = 'MarillIR PAL';
// }
// export class EiscueIR extends Eiscue {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_205_R_EN_LG.png';
//   public setNumber = '205';
//   public fullName: string = 'EiscueIR PAL';
// }
// export class QuaxlyIR extends Quaxly {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_206_R_EN_LG.png';
//   public setNumber = '206';
//   public fullName: string = 'QuaxlyIR PAL';
// }
// export class QuaxwellIR extends Quaxwell {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_207_R_EN_LG.png';
//   public setNumber = '207';
//   public fullName: string = 'QuaxwellIR PAL';
// }
class FrigibaxIR extends frigibax_1.Frigibax {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_208_R_EN_LG.png';
        this.setNumber = '208';
        this.fullName = 'FrigibaxIR PAL';
    }
}
exports.FrigibaxIR = FrigibaxIR;
class ArctibaxIR extends arctibax_1.Arctibax {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_209_R_EN_LG.png';
        this.setNumber = '209';
        this.fullName = 'ArctibaxIR PAL';
    }
}
exports.ArctibaxIR = ArctibaxIR;
class BaxcaliburIR extends baxcalibur_1.Baxcalibur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_210_R_EN_LG.png';
        this.setNumber = '210';
        this.fullName = 'BaxcaliburIR PAL';
    }
}
exports.BaxcaliburIR = BaxcaliburIR;
// export class RaichuIR extends Raichu {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_211_R_EN_LG.png';
//   public setNumber = '211';
//   public fullName: string = 'RaichuIR PAL';
// }
// export class MismagiusIR extends Mismagius {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_212_R_EN_LG.png';
//   public setNumber = '212';
//   public fullName: string = 'MismagiusIR PAL';
// }
// export class GothoritaIR extends Gothorita {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_213_R_EN_LG.png';
//   public setNumber = '213';
//   public fullName: string = 'GothoritaIR PAL';
// }
// export class SandygastIR extends Sandygast {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_214_R_EN_LG.png';
//   public setNumber = '214';
//   public fullName: string = 'SandygastIR PAL';
// }
// export class RabscaIR extends Rabsca {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_215_R_EN_LG.png';
//   public setNumber = '215';
//   public fullName: string = 'RabscaIR PAL';
// }
// export class TinkatinkIR extends Tinkatink {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_216_R_EN_LG.png';
//   public setNumber = '216';
//   public fullName: string = 'TinkatinkIR PAL';
// }
// export class TinkatuffIR extends Tinkatuff {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_217_R_EN_LG.png';
//   public setNumber = '217';
//   public fullName: string = 'TinkatuffIR PAL';
// }
// export class Paldean TaurosIR extends Paldean Tauros {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_218_R_EN_LG.png';
//   public setNumber = '218';
//   public fullName: string = 'Paldean TaurosIR PAL';
// }
// export class SudowoodoIR extends Sudowoodo {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_219_R_EN_LG.png';
//   public setNumber = '219';
//   public fullName: string = 'SudowoodoIR PAL';
// }
// export class NacliIR extends Nacli {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_220_R_EN_LG.png';
//   public setNumber = '220';
//   public fullName: string = 'NacliIR PAL';
// }
// export class Paldean WooperIR extends Paldean Wooper {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_221_R_EN_LG.png';
//   public setNumber = '221';
//   public fullName: string = 'Paldean WooperIR PAL';
// }
// export class TyranitarIR extends Tyranitar {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_222_R_EN_LG.png';
//   public setNumber = '222';
//   public fullName: string = 'TyranitarIR PAL';
// }
// export class GrafaiaiIR extends Grafaiai {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_223_R_EN_LG.png';
//   public setNumber = '223';
//   public fullName: string = 'GrafaiaiIR PAL';
// }
// export class OrthwormIR extends Orthworm {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_224_R_EN_LG.png';
//   public setNumber = '224';
//   public fullName: string = 'OrthwormIR PAL';
// }
// export class RookideeIR extends Rookidee {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_225_R_EN_LG.png';
//   public setNumber = '225';
//   public fullName: string = 'RookideeIR PAL';
// }
// export class MausholdIR extends Maushold {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_226_R_EN_LG.png';
//   public setNumber = '226';
//   public fullName: string = 'MausholdIR PAL';
// }
class FlamigoIR extends flamigo_1.Flamigo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_227_R_EN_LG.png';
        this.setNumber = '227';
        this.fullName = 'FlamigoIR PAL';
    }
}
exports.FlamigoIR = FlamigoIR;
// export class FarigirafIR extends Farigiraf {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_228_R_EN_LG.png';
//   public setNumber = '228';
//   public fullName: string = 'FarigirafIR PAL';
// }
// export class DudunsparceIR extends Dudunsparce {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_229_R_EN_LG.png';
//   public setNumber = '229';
//   public fullName: string = 'DudunsparceIR PAL';
// }
// export class ForretressexFA extends Forretressex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_230_R_EN_LG.png';
//   public setNumber = '230';
//   public fullName: string = 'Forretress exFA PAL';
// }
class MeowscaradaexFA extends meowscarada_ex_1.Meowscaradaex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_231_R_EN_LG.png';
        this.setNumber = '231';
        this.fullName = 'Meowscarada exFA PAL';
    }
}
exports.MeowscaradaexFA = MeowscaradaexFA;
class WoChienexFA extends wo_chien_ex_1.WoChienex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_232_R_EN_LG.png';
        this.setNumber = '232';
        this.fullName = 'Wo-Chien exFA PAL';
    }
}
exports.WoChienexFA = WoChienexFA;
// export class Skeledirge exFA extends Skeledirge ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_233_R_EN_LG.png';
//   public setNumber = '233';
//   public fullName: string = 'Skeledirge exFA PAL';
// }
class ChiYuexFA extends chi_yu_ex_1.ChiYuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_234_R_EN_LG.png';
        this.setNumber = '234';
        this.fullName = 'Chi-Yu exFA PAL';
    }
}
exports.ChiYuexFA = ChiYuexFA;
// export class Quaquaval exFA extends Quaquaval ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_235_R_EN_LG.png';
//   public setNumber = '235';
//   public fullName: string = 'Quaquaval exFA PAL';
// }
class ChienPaoexFA extends chien_pao_ex_1.ChienPaoex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_236_R_EN_LG.png';
        this.setNumber = '236';
        this.fullName = 'Chien-Pao exFA PAL';
    }
}
exports.ChienPaoexFA = ChienPaoexFA;
// export class Bellibolt exFA extends Bellibolt ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_237_R_EN_LG.png';
//   public setNumber = '237';
//   public fullName: string = 'Bellibolt exFA PAL';
// }
// export class Slowking exFA extends Slowking ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_238_R_EN_LG.png';
//   public setNumber = '238';
//   public fullName: string = 'Slowking exFA PAL';
// }
// export class Dedenne exFA extends Dedenne ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_239_R_EN_LG.png';
//   public setNumber = '239';
//   public fullName: string = 'Dedenne exFA PAL';
// }
// export class Tinkaton exFA extends Tinkaton ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_240_R_EN_LG.png';
//   public setNumber = '240';
//   public fullName: string = 'Tinkaton exFA PAL';
// }
// export class Lycanroc exFA extends Lycanroc ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_241_R_EN_LG.png';
//   public setNumber = '241';
//   public fullName: string = 'Lycanroc exFA PAL';
// }
// export class Annihilape exFA extends Annihilape ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_242_R_EN_LG.png';
//   public setNumber = '242';
//   public fullName: string = 'Annihilape exFA PAL';
// }
class TingLuexFA extends ting_lu_ex_1.TingLuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_243_R_EN_LG.png';
        this.setNumber = '243';
        this.fullName = 'Ting-Lu exFA PAL';
    }
}
exports.TingLuexFA = TingLuexFA;
// export class Paldean Clodsire exFA extends Paldean Clodsire ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_244_R_EN_LG.png';
//   public setNumber = '244';
//   public fullName: string = 'Paldean Clodsire exFA PAL';
// }
// export class Copperajah exFA extends Copperajah ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_245_R_EN_LG.png';
//   public setNumber = '245';
//   public fullName: string = 'Copperajah exFA PAL';
// }
class NoivernexFA extends noivern_ex_1.Noivernex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_246_R_EN_LG.png';
        this.setNumber = '246';
        this.fullName = 'Noivern exFA PAL';
    }
}
exports.NoivernexFA = NoivernexFA;
class SquawkabillyexFA extends squawkabilly_ex_1.Squawkabillyex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_247_R_EN_LG.png';
        this.setNumber = '247';
        this.fullName = 'Squawkabilly exFA PAL';
    }
}
exports.SquawkabillyexFA = SquawkabillyexFA;
class BossOrdersFA extends boss_orders_1.BossOrders {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_248_R_EN_LG.png';
        this.setNumber = '248';
        this.fullName = 'Boss\'s OrdersFA PAL';
    }
}
exports.BossOrdersFA = BossOrdersFA;
class ClavellFA extends clavell_1.Clavell {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_249_R_EN_LG.png';
        this.setNumber = '249';
        this.fullName = 'ClavellFA PAL';
    }
}
exports.ClavellFA = ClavellFA;
// export class DendraFA extends Dendra {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_250_R_EN_LG.png';
//   public setNumber = '250';
//   public fullName: string = 'DendraFA PAL';
// }
// export class FalknerFA extends Falkner {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_251_R_EN_LG.png';
//   public setNumber = '251';
//   public fullName: string = 'FalknerFA PAL';
// }
class GiacomoFA extends giacomo_1.Giacomo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_252_R_EN_LG.png';
        this.setNumber = '252';
        this.fullName = 'GiacomoFA PAL';
    }
}
exports.GiacomoFA = GiacomoFA;
class GrushaFA extends grusha_1.Grusha {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_253_R_EN_LG.png';
        this.setNumber = '253';
        this.fullName = 'GrushaFA PAL';
    }
}
exports.GrushaFA = GrushaFA;
class IonoFA extends iono_1.Iono {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_254_R_EN_LG.png';
        this.setNumber = '254';
        this.fullName = 'IonoFA PAL';
    }
}
exports.IonoFA = IonoFA;
// export class SaguaroFA extends Saguaro {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_255_R_EN_LG.png';
//   public setNumber = '255';
//   public fullName: string = 'SaguaroFA PAL';
// }
class MeowscaradaexSIR extends meowscarada_ex_1.Meowscaradaex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_256_R_EN_LG.png';
        this.setNumber = '256';
        this.fullName = 'Meowscarada exSIR PAL';
    }
}
exports.MeowscaradaexSIR = MeowscaradaexSIR;
class WoChienexSIR extends wo_chien_ex_1.WoChienex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_257_R_EN_LG.png';
        this.setNumber = '257';
        this.fullName = 'Wo-Chien exSIR PAL';
    }
}
exports.WoChienexSIR = WoChienexSIR;
// export class Skeledirge exSIR extends Skeledirge ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_258_R_EN_LG.png';
//   public setNumber = '258';
//   public fullName: string = 'Skeledirge exSIR PAL';
// }
class ChiYuexSIR extends chi_yu_ex_1.ChiYuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_259_R_EN_LG.png';
        this.setNumber = '259';
        this.fullName = 'Chi-Yu exSIR PAL';
    }
}
exports.ChiYuexSIR = ChiYuexSIR;
// export class Quaquaval exSIR extends Quaquaval ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_260_R_EN_LG.png';
//   public setNumber = '260';
//   public fullName: string = 'Quaquaval exSIR PAL';
// }
class ChienPaoexSIR extends chien_pao_ex_1.ChienPaoex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_261_R_EN_LG.png';
        this.setNumber = '261';
        this.fullName = 'Chien-Pao exSIR PAL';
    }
}
exports.ChienPaoexSIR = ChienPaoexSIR;
// export class Tinkaton exSIR extends Tinkaton ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_262_R_EN_LG.png';
//   public setNumber = '262';
//   public fullName: string = 'Tinkaton exSIR PAL';
// }
class TingLuexSIR extends ting_lu_ex_1.TingLuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_263_R_EN_LG.png';
        this.setNumber = '263';
        this.fullName = 'Ting-Lu exSIR PAL';
    }
}
exports.TingLuexSIR = TingLuexSIR;
class SquawkabillyexSIR extends squawkabilly_ex_1.Squawkabillyex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_264_R_EN_LG.png';
        this.setNumber = '264';
        this.fullName = 'Squawkabilly exSIR PAL';
    }
}
exports.SquawkabillyexSIR = SquawkabillyexSIR;
class BossOrdersSIR extends boss_orders_1.BossOrders {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_265_R_EN_LG.png';
        this.setNumber = '265';
        this.fullName = 'Boss\'s OrdersSIR PAL';
    }
}
exports.BossOrdersSIR = BossOrdersSIR;
// export class DendraSIR extends Dendra {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_266_R_EN_LG.png';
//   public setNumber = '266';
//   public fullName: string = 'DendraSIR PAL';
// }
class GiacomoSIR extends giacomo_1.Giacomo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_267_R_EN_LG.png';
        this.setNumber = '267';
        this.fullName = 'GiacomoSIR PAL';
    }
}
exports.GiacomoSIR = GiacomoSIR;
class GrushaSIR extends grusha_1.Grusha {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_268_R_EN_LG.png';
        this.setNumber = '268';
        this.fullName = 'GrushaSIR PAL';
    }
}
exports.GrushaSIR = GrushaSIR;
class IonoSIR extends iono_1.Iono {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_269_R_EN_LG.png';
        this.setNumber = '269';
        this.fullName = 'IonoSIR PAL';
    }
}
exports.IonoSIR = IonoSIR;
// export class SaguaroSIR extends Saguaro {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_270_R_EN_LG.png';
//   public setNumber = '270';
//   public fullName: string = 'SaguaroSIR PAL';
// }
class MeowscaradaexHR extends meowscarada_ex_1.Meowscaradaex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_271_R_EN_LG.png';
        this.setNumber = '271';
        this.fullName = 'Meowscarada exHR PAL';
    }
}
exports.MeowscaradaexHR = MeowscaradaexHR;
// export class Skeledirge exHR extends Skeledirge ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_272_R_EN_LG.png';
//   public setNumber = '272';
//   public fullName: string = 'Skeledirge exHR PAL';
// }
// export class Quaquaval exHR extends Quaquaval ex {
//   public cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_273_R_EN_LG.png';
//   public setNumber = '273';
//   public fullName: string = 'Quaquaval exHR PAL';
// }
class ChienPaoexHR extends chien_pao_ex_1.ChienPaoex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_274_R_EN_LG.png';
        this.setNumber = '274';
        this.fullName = 'Chien-Pao exHR PAL';
    }
}
exports.ChienPaoexHR = ChienPaoexHR;
class TingLuexHR extends ting_lu_ex_1.TingLuex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_275_R_EN_LG.png';
        this.setNumber = '275';
        this.fullName = 'Ting-Lu exHR PAL';
    }
}
exports.TingLuexHR = TingLuexHR;
class SuperRodHR extends super_rod_1.SuperRod {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_276_R_EN_LG.png';
        this.setNumber = '276';
        this.fullName = 'Super RodHR PAL';
    }
}
exports.SuperRodHR = SuperRodHR;
class SuperiorEnergyRetrievalHR extends superior_energy_retrieval_1.SuperiorEnergyRetrieval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAL/PAL_277_R_EN_LG.png';
        this.setNumber = '277';
        this.fullName = 'Superior Energy RetrievalHR PAL';
    }
}
exports.SuperiorEnergyRetrievalHR = SuperiorEnergyRetrievalHR;
