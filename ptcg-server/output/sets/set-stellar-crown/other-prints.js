"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BraveryCharmHR = exports.AreaZeroUnderdepthsHR = exports.TerapagosexHR = exports.LaceySIR = exports.BriarSIR = exports.TerapagosexSIR = exports.GalvantulaexSIR = exports.HydrappleexSIR = exports.LaceyFA = exports.KofuFA = exports.CrispinFA = exports.BriarFA = exports.OrthwormexFA = exports.MedichamexFA = exports.GalvantulaexFA = exports.LaprasexFA = exports.CinderaceexFA = exports.HydrappleexFA = exports.ArchaludonIR = exports.MedititeIR = exports.MilceryIR = exports.ZeraoraIR = exports.JoltikIR = exports.SquirtleIR = exports.RabootIR = exports.BulbasaurIR = void 0;
const bulbasaur_1 = require("../set-pokemon-151/bulbasaur");
const squirtle_1 = require("../set-pokemon-151/squirtle");
const raboot_1 = require("./raboot");
const joltik_1 = require("./joltik");
const zeraora_1 = require("./zeraora");
const milcery_1 = require("./milcery");
const archaludon_1 = require("./archaludon");
const hydrapple_ex_1 = require("./hydrapple-ex");
const cinderace_ex_1 = require("./cinderace-ex");
const lapras_ex_1 = require("./lapras-ex");
const galvantula_ex_1 = require("./galvantula-ex");
const medicham_ex_1 = require("./medicham-ex");
const orthworm_ex_1 = require("./orthworm-ex");
const meditite_1 = require("./meditite");
const briar_1 = require("./briar");
const crispin_1 = require("./crispin");
const kofu_1 = require("./kofu");
const lacey_1 = require("./lacey");
const terapagos_ex_1 = require("./terapagos-ex");
const area_zero_underdepths_1 = require("./area-zero-underdepths");
const bravery_charm_1 = require("../set-paldea-evolved/bravery-charm");
// Illustration Rares
class BulbasaurIR extends bulbasaur_1.Bulbasaur {
    constructor() {
        super(...arguments);
        this.set = 'SCR';
        this.setNumber = '143';
        this.fullName = 'BulbasaurIR SCR';
        this.regulationMark = 'G';
    }
}
exports.BulbasaurIR = BulbasaurIR;
class RabootIR extends raboot_1.Raboot {
    constructor() {
        super(...arguments);
        this.setNumber = '147';
        this.fullName = 'RabootIR SCR';
    }
}
exports.RabootIR = RabootIR;
class SquirtleIR extends squirtle_1.Squirtle {
    constructor() {
        super(...arguments);
        this.set = 'SCR';
        this.setNumber = '148';
        this.fullName = 'SquirtleIR SCR';
        this.regulationMark = 'G';
    }
}
exports.SquirtleIR = SquirtleIR;
class JoltikIR extends joltik_1.Joltik {
    constructor() {
        super(...arguments);
        this.setNumber = '150';
        this.fullName = 'JoltikIR SCR';
    }
}
exports.JoltikIR = JoltikIR;
class ZeraoraIR extends zeraora_1.Zeraora {
    constructor() {
        super(...arguments);
        this.setNumber = '151';
        this.fullName = 'ZeraoraIR SCR';
    }
}
exports.ZeraoraIR = ZeraoraIR;
class MilceryIR extends milcery_1.Milcery {
    constructor() {
        super(...arguments);
        this.setNumber = '152';
        this.fullName = 'MilceryIR SCR';
    }
}
exports.MilceryIR = MilceryIR;
class MedititeIR extends meditite_1.Meditite {
    constructor() {
        super(...arguments);
        this.setNumber = '153';
        this.fullName = 'Meditite IR SCR';
    }
}
exports.MedititeIR = MedititeIR;
class ArchaludonIR extends archaludon_1.Archaludon {
    constructor() {
        super(...arguments);
        this.setNumber = '155';
        this.fullName = 'ArchaludonIR SCR';
    }
}
exports.ArchaludonIR = ArchaludonIR;
// Full Art Pokemon
class HydrappleexFA extends hydrapple_ex_1.Hydrappleex {
    constructor() {
        super(...arguments);
        this.setNumber = '156';
        this.fullName = 'Hydrapple exFA SCR';
    }
}
exports.HydrappleexFA = HydrappleexFA;
class CinderaceexFA extends cinderace_ex_1.Cinderaceex {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.fullName = 'Cinderace exFA SCR';
    }
}
exports.CinderaceexFA = CinderaceexFA;
class LaprasexFA extends lapras_ex_1.Laprasex {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.fullName = 'Lapras exFA SCR';
    }
}
exports.LaprasexFA = LaprasexFA;
class GalvantulaexFA extends galvantula_ex_1.Galvantulaex {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.fullName = 'Galvantula exFA SCR';
    }
}
exports.GalvantulaexFA = GalvantulaexFA;
// export class DachsbunexFA extends Dachsbunex {
//   public setNumber = '160';
//   public fullName = 'Dachsbun exFA SCR';
// }
class MedichamexFA extends medicham_ex_1.Medichamex {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.fullName = 'Medicham exFA SCR';
    }
}
exports.MedichamexFA = MedichamexFA;
class OrthwormexFA extends orthworm_ex_1.Orthwormex {
    constructor() {
        super(...arguments);
        this.setNumber = '162';
        this.fullName = 'Orthworm exFA SCR';
    }
}
exports.OrthwormexFA = OrthwormexFA;
// Full Art Trainers
class BriarFA extends briar_1.Briar {
    constructor() {
        super(...arguments);
        this.setNumber = '163';
        this.fullName = 'BriarFA SCR';
    }
}
exports.BriarFA = BriarFA;
class CrispinFA extends crispin_1.Crispin {
    constructor() {
        super(...arguments);
        this.setNumber = '164';
        this.fullName = 'CrispinFA SCR';
    }
}
exports.CrispinFA = CrispinFA;
class KofuFA extends kofu_1.Kofu {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.fullName = 'KofuFA SCR';
    }
}
exports.KofuFA = KofuFA;
class LaceyFA extends lacey_1.Lacey {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.fullName = 'LaceyFA SCR';
    }
}
exports.LaceyFA = LaceyFA;
// Special Illustration Rares
class HydrappleexSIR extends hydrapple_ex_1.Hydrappleex {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.fullName = 'Hydrapple exSIR SCR';
    }
}
exports.HydrappleexSIR = HydrappleexSIR;
class GalvantulaexSIR extends galvantula_ex_1.Galvantulaex {
    constructor() {
        super(...arguments);
        this.setNumber = '168';
        this.fullName = 'Galvantula exSIR SCR';
    }
}
exports.GalvantulaexSIR = GalvantulaexSIR;
// export class DachsbunexSIR extends Dachsbunex {
//   public setNumber = '169';
//   public fullName = 'Dachsbun exSIR SCR';
// }
class TerapagosexSIR extends terapagos_ex_1.Terapagosex {
    constructor() {
        super(...arguments);
        this.setNumber = '170';
        this.fullName = 'Terapagos exSIR SCR';
    }
}
exports.TerapagosexSIR = TerapagosexSIR;
class BriarSIR extends briar_1.Briar {
    constructor() {
        super(...arguments);
        this.setNumber = '171';
        this.fullName = 'BriarSIR SCR';
    }
}
exports.BriarSIR = BriarSIR;
class LaceySIR extends lacey_1.Lacey {
    constructor() {
        super(...arguments);
        this.setNumber = '172';
        this.fullName = 'LaceySIR SCR';
    }
}
exports.LaceySIR = LaceySIR;
// Hyper Rares
class TerapagosexHR extends terapagos_ex_1.Terapagosex {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.fullName = 'Terapagos exHR SCR';
    }
}
exports.TerapagosexHR = TerapagosexHR;
class AreaZeroUnderdepthsHR extends area_zero_underdepths_1.AreaZeroUnderdepths {
    constructor() {
        super(...arguments);
        this.setNumber = '174';
        this.fullName = 'Area Zero UnderdepthsHR SCR';
    }
}
exports.AreaZeroUnderdepthsHR = AreaZeroUnderdepthsHR;
class BraveryCharmHR extends bravery_charm_1.BraveyCharm {
    constructor() {
        super(...arguments);
        this.set = 'SCR';
        this.setNumber = '175';
        this.fullName = 'Bravery Charm SCR';
        this.regulationMark = 'G';
    }
}
exports.BraveryCharmHR = BraveryCharmHR;
