"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThwackeySVP = exports.IronThornsSVP = exports.FlutterManeSVP = exports.MiraidonSVP = exports.KoraidonSVP = exports.MetangSVP = exports.FeraligatrSVP = exports.QuaquavalexFASVP = exports.SkeledirgeexFASVP = exports.CrocalorSVP = exports.MeowscaradaexFASVP = exports.FloragatoSVP = exports.MimikyuSVP = exports.Charizardex2SVP = exports.GreatTuskexSVP = exports.IronValiantexSVP = exports.RoaringMoonexSVP = exports.IronBundleIRSVP = exports.ScreamTailSVP = exports.ArctibaxSVP = exports.PinecoSVP = exports.AegislashSVP = exports.XatuSVP = exports.IronBundleSVP = exports.ChiYuSVP = exports.CharizardexSVP = exports.KangaskhanexSVP = exports.MewexSVP = exports.SnorlaxSVP = exports.AlakazamexSVP = exports.ZapdosexSVP = exports.CharmanderIRSVP = exports.TogekissSVP = exports.CleffaSVP = exports.PalafinSVP = exports.QuaquavalexSVP = exports.SkeledirgeexSVP = exports.MeowscaradaexSVP = exports.ChienPaoexSVP = exports.KoraidonexSVP = exports.MiraidonexSVP = exports.GrowlitheSVP = exports.SmolivSVP = exports.PelipperSVP = exports.MurkrowSVP = exports.TinkatonSVP = exports.BaxcaliburSVP = exports.RevavroomSVP = exports.HawluchaSVP = exports.PawmotSVP = void 0;
exports.BloodmoonUrsalunaexSVP = exports.EeveeSVP = exports.JolteonSVP = exports.TealMaskOgerponexSVP = exports.TerapagosexSVP = exports.LaprasexSVP = exports.CinderaceexSVP = exports.Charizardex3SVP = exports.SquawkabillyexSVP = exports.MagnetonIRSVP = exports.MagnetonSVP = exports.ChienPaoSVP = exports.GougingFireSVP = exports.IronCrownexSVP = exports.RagingBoltexSVP = exports.GougingFireexSVP = exports.Miraidonex2SVP = exports.VictiniexSVP = exports.NoctowlSVP = exports.Porygon2SVP = exports.BouffalantSVP = exports.DrifblimSVP = exports.CrabominableSVP = exports.KingdraexSVP = exports.PecharuntIRSVP = exports.IronLeavesexSVP = exports.WalkingWakeexSVP = exports.PalafinexSVP = exports.ArmarougeexSVP = exports.IonoSVP = exports.PupitarSVP = exports.TatsugiriSVP = exports.FroslassSVP = exports.InfernapeSVP = void 0;
const charizard_ex_1 = require("../set-obsidian-flames/charizard-ex");
const charmander_1 = require("../set-obsidian-flames/charmander");
const cleffa_1 = require("../set-obsidian-flames/cleffa");
const palafin_1 = require("../set-obsidian-flames/palafin");
const pupitar_1 = require("../set-obsidian-flames/pupitar");
const togekiss_1 = require("../set-obsidian-flames/togekiss");
const victini_ex_1 = require("../set-obsidian-flames/victini-ex");
const arctibax_1 = require("../set-paldea-evolved/arctibax");
const baxcalibur_1 = require("../set-paldea-evolved/baxcalibur");
const chien_pao_ex_1 = require("../set-paldea-evolved/chien-pao-ex");
const crocalor_1 = require("../set-paldea-evolved/crocalor");
const floragato_1 = require("../set-paldea-evolved/floragato");
const iono_1 = require("../set-paldea-evolved/iono");
const meowscarada_ex_1 = require("../set-paldea-evolved/meowscarada-ex");
const mimikyu_1 = require("../set-paldea-evolved/mimikyu");
const murkrow_1 = require("../set-paldea-evolved/murkrow");
const pelipper_1 = require("../set-paldea-evolved/pelipper");
const pineco_1 = require("../set-paldea-evolved/pineco");
const quaquaval_ex_1 = require("../set-paldea-evolved/quaquaval-ex");
const skeledirge_ex_1 = require("../set-paldea-evolved/skeledirge-ex");
const tinkaton_1 = require("../set-paldea-evolved/tinkaton");
const great_tusk_ex_1 = require("../set-paldea-fates/great-tusk-ex");
const aegislash_1 = require("../set-paradox-rift/aegislash");
const armarouge_ex_1 = require("../set-paradox-rift/armarouge-ex");
const chi_yu_1 = require("../set-paradox-rift/chi-yu");
const iron_bundle_1 = require("../set-paradox-rift/iron-bundle");
const iron_valiant_ex_1 = require("../set-paradox-rift/iron-valiant-ex");
const porygon2_1 = require("../set-paradox-rift/porygon2");
const roaring_moon_ex_1 = require("../set-paradox-rift/roaring-moon-ex");
const scream_tail_1 = require("../set-paradox-rift/scream-tail");
const xatu_1 = require("../set-paradox-rift/xatu");
const alakazam_ex_1 = require("../set-pokemon-151/alakazam-ex");
const kangaskhan_ex_1 = require("../set-pokemon-151/kangaskhan-ex");
const mew_ex_1 = require("../set-pokemon-151/mew-ex");
const snorlax_1 = require("../set-pokemon-151/snorlax");
const zapdos_ex_1 = require("../set-pokemon-151/zapdos-ex");
const growlithe_1 = require("../set-scarlet-and-violet/growlithe");
const hawlucha_1 = require("../set-scarlet-and-violet/hawlucha");
const koraidon_ex_1 = require("../set-scarlet-and-violet/koraidon-ex");
const miraidon_ex_1 = require("../set-scarlet-and-violet/miraidon-ex");
const pawmot_1 = require("../set-scarlet-and-violet/pawmot");
const revavroom_1 = require("../set-scarlet-and-violet/revavroom");
const smoliv_1 = require("../set-scarlet-and-violet/smoliv");
const kingdra_ex_1 = require("../set-shrouded-fable/kingdra-ex");
const bouffalant_1 = require("../set-stellar-crown/bouffalant");
const crabominable_1 = require("../set-stellar-crown/crabominable");
const drifblim_1 = require("../set-stellar-crown/drifblim");
const noctowl_1 = require("../set-stellar-crown/noctowl");
const feraligatr_1 = require("../set-temporal-forces/feraligatr");
const flutter_mane_1 = require("../set-temporal-forces/flutter-mane");
const iron_leaves_ex_1 = require("../set-temporal-forces/iron-leaves-ex");
const iron_thorns_1 = require("../set-temporal-forces/iron-thorns");
const koraidon_1 = require("../set-temporal-forces/koraidon");
const metang_1 = require("../set-temporal-forces/metang");
const miraidon_1 = require("../set-temporal-forces/miraidon");
const walking_wake_ex_1 = require("../set-temporal-forces/walking-wake-ex");
const froslass_1 = require("../set-twilight-masquerade/froslass");
const infernape_1 = require("../set-twilight-masquerade/infernape");
const palafin_ex_1 = require("../set-twilight-masquerade/palafin-ex");
const tatsugiri_1 = require("../set-twilight-masquerade/tatsugiri");
const thwackey_1 = require("../set-twilight-masquerade/thwackey");
const pecharunt_1 = require("./pecharunt");
const miraidon_ex_2 = require("../set-obsidian-flames/miraidon-ex");
const gouging_fire_ex_1 = require("../set-temporal-forces/gouging-fire-ex");
const raging_bolt_ex_1 = require("../set-temporal-forces/raging-bolt-ex");
const iron_crown_ex_1 = require("../set-temporal-forces/iron-crown-ex");
const gouging_fire_1 = require("../set-surging-sparks/gouging-fire");
const chien_pao_1 = require("../set-surging-sparks/chien-pao");
const magneton_1 = require("../set-surging-sparks/magneton");
const squawkabilly_ex_1 = require("../set-paldea-evolved/squawkabilly-ex");
const charizard_ex_2 = require("../set-pokemon-151/charizard-ex");
const cinderace_ex_1 = require("../set-stellar-crown/cinderace-ex");
const lapras_ex_1 = require("../set-stellar-crown/lapras-ex");
const teal_mask_ogerpon_ex_1 = require("../set-twilight-masquerade/teal-mask-ogerpon-ex");
const terapagos_ex_1 = require("../set-stellar-crown/terapagos-ex");
const jolteon_1 = require("../set-pokemon-151/jolteon");
const eevee_1 = require("../set-surging-sparks/eevee");
const bloodmoon_ursaluna_ex_1 = require("../set-twilight-masquerade/bloodmoon-ursaluna-ex");
// export class QuaquavalSVP extends Quaquaval {
//   public setNumber = '5';
//   public fullName: string = 'Quaquaval SVP';
//   public set = 'SVP';
// }
class PawmotSVP extends pawmot_1.Pawmot {
    constructor() {
        super(...arguments);
        this.setNumber = '6';
        this.fullName = 'Pawmot SVP';
        this.set = 'SVP';
    }
}
exports.PawmotSVP = PawmotSVP;
class HawluchaSVP extends hawlucha_1.Hawlucha {
    constructor() {
        super(...arguments);
        this.setNumber = '7';
        this.fullName = 'Hawlucha SVP';
        this.set = 'SVP';
    }
}
exports.HawluchaSVP = HawluchaSVP;
class RevavroomSVP extends revavroom_1.Revavroom {
    constructor() {
        super(...arguments);
        this.setNumber = '8';
        this.fullName = 'Revavroom SVP';
        this.set = 'SVP';
    }
}
exports.RevavroomSVP = RevavroomSVP;
// export class MiraidonSVP extends Miraidon {
//   public setNumber = '13';
//   public fullName: string = 'Miraidon SVP';
//   public set = 'SVP';
// }
// export class KoraidonSVP extends Koraidon {
//   public setNumber = '14';
//   public fullName: string = 'Koraidon SVP';
//   public set = 'SVP';
// }
class BaxcaliburSVP extends baxcalibur_1.Baxcalibur {
    constructor() {
        super(...arguments);
        this.setNumber = '19';
        this.fullName = 'Baxcalibur SVP';
        this.set = 'SVP';
    }
}
exports.BaxcaliburSVP = BaxcaliburSVP;
class TinkatonSVP extends tinkaton_1.Tinkaton {
    constructor() {
        super(...arguments);
        this.setNumber = '20';
        this.fullName = 'Tinkaton SVP';
        this.set = 'SVP';
    }
}
exports.TinkatonSVP = TinkatonSVP;
class MurkrowSVP extends murkrow_1.Murkrow {
    constructor() {
        super(...arguments);
        this.setNumber = '21';
        this.fullName = 'Murkrow SVP';
        this.set = 'SVP';
    }
}
exports.MurkrowSVP = MurkrowSVP;
class PelipperSVP extends pelipper_1.Pelipper {
    constructor() {
        super(...arguments);
        this.setNumber = '22';
        this.fullName = 'Pelipper SVP';
        this.set = 'SVP';
    }
}
exports.PelipperSVP = PelipperSVP;
class SmolivSVP extends smoliv_1.Smoliv {
    constructor() {
        super(...arguments);
        this.setNumber = '23';
        this.fullName = 'Smoliv SVP';
        this.set = 'SVP';
    }
}
exports.SmolivSVP = SmolivSVP;
class GrowlitheSVP extends growlithe_1.Growlithe {
    constructor() {
        super(...arguments);
        this.setNumber = '24';
        this.fullName = 'Growlithe SVP';
        this.set = 'SVP';
    }
}
exports.GrowlitheSVP = GrowlitheSVP;
// export class VaroomSVP extends Varoom {
//   public setNumber = '26';
//   public fullName: string = 'Varoom SVP';
//   public set = 'SVP';
// }
class MiraidonexSVP extends miraidon_ex_1.Miraidonex {
    constructor() {
        super(...arguments);
        this.setNumber = '28';
        this.fullName = 'Miraidon ex SVP';
        this.set = 'SVP';
    }
}
exports.MiraidonexSVP = MiraidonexSVP;
class KoraidonexSVP extends koraidon_ex_1.Koraidonex {
    constructor() {
        super(...arguments);
        this.setNumber = '29';
        this.fullName = 'Koraidon ex SVP';
        this.set = 'SVP';
    }
}
exports.KoraidonexSVP = KoraidonexSVP;
class ChienPaoexSVP extends chien_pao_ex_1.ChienPaoex {
    constructor() {
        super(...arguments);
        this.setNumber = '30';
        this.fullName = 'Chien-Pao ex SVP';
        this.set = 'SVP';
    }
}
exports.ChienPaoexSVP = ChienPaoexSVP;
class MeowscaradaexSVP extends meowscarada_ex_1.Meowscaradaex {
    constructor() {
        super(...arguments);
        this.setNumber = '33';
        this.fullName = 'Meowscarada ex SVP';
        this.set = 'SVP';
    }
}
exports.MeowscaradaexSVP = MeowscaradaexSVP;
class SkeledirgeexSVP extends skeledirge_ex_1.Skeledirgeex {
    constructor() {
        super(...arguments);
        this.setNumber = '34';
        this.fullName = 'Skeledirge ex SVP';
        this.set = 'SVP';
    }
}
exports.SkeledirgeexSVP = SkeledirgeexSVP;
class QuaquavalexSVP extends quaquaval_ex_1.Quaquavalex {
    constructor() {
        super(...arguments);
        this.setNumber = '35';
        this.fullName = 'Quaquaval ex SVP';
        this.set = 'SVP';
    }
}
exports.QuaquavalexSVP = QuaquavalexSVP;
class PalafinSVP extends palafin_1.Palafin {
    constructor() {
        super(...arguments);
        this.setNumber = '36';
        this.fullName = 'Palafin SVP';
        this.set = 'SVP';
    }
}
exports.PalafinSVP = PalafinSVP;
class CleffaSVP extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.setNumber = '37';
        this.fullName = 'Cleffa SVP';
        this.set = 'SVP';
    }
}
exports.CleffaSVP = CleffaSVP;
class TogekissSVP extends togekiss_1.Togekiss {
    constructor() {
        super(...arguments);
        this.setNumber = '38';
        this.fullName = 'Togekiss SVP';
        this.set = 'SVP';
    }
}
exports.TogekissSVP = TogekissSVP;
// export class MawileSVP extends Mawile {
//   public setNumber = '39';
//   public fullName: string = 'Mawile SVP';
//   public set = 'SVP';
// }
class CharmanderIRSVP extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.setNumber = '44';
        this.fullName = 'CharmanderIR SVP';
        this.set = 'SVP';
    }
}
exports.CharmanderIRSVP = CharmanderIRSVP;
class ZapdosexSVP extends zapdos_ex_1.Zapdosex {
    constructor() {
        super(...arguments);
        this.setNumber = '49';
        this.fullName = 'Zapdos ex SVP';
        this.set = 'SVP';
    }
}
exports.ZapdosexSVP = ZapdosexSVP;
class AlakazamexSVP extends alakazam_ex_1.Alakazamex {
    constructor() {
        super(...arguments);
        this.setNumber = '50';
        this.fullName = 'Alakazam ex SVP';
        this.set = 'SVP';
    }
}
exports.AlakazamexSVP = AlakazamexSVP;
class SnorlaxSVP extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.setNumber = '51';
        this.fullName = 'Snorlax SVP';
        this.set = 'SVP';
    }
}
exports.SnorlaxSVP = SnorlaxSVP;
// export class MewtwoSVP extends Mewtwo {
//   public setNumber = '52';
//   public fullName: string = 'Mewtwo SVP';
//   public set = 'SVP';
// }
class MewexSVP extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.setNumber = '53';
        this.fullName = 'Mew ex SVP';
        this.set = 'SVP';
    }
}
exports.MewexSVP = MewexSVP;
class KangaskhanexSVP extends kangaskhan_ex_1.Kangaskhanex {
    constructor() {
        super(...arguments);
        this.setNumber = '55';
        this.fullName = 'Kangaskhan ex SVP';
        this.set = 'SVP';
    }
}
exports.KangaskhanexSVP = KangaskhanexSVP;
class CharizardexSVP extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.setNumber = '56';
        this.fullName = 'Charizard ex SVP';
        this.set = 'SVP';
    }
}
exports.CharizardexSVP = CharizardexSVP;
class ChiYuSVP extends chi_yu_1.ChiYu {
    constructor() {
        super(...arguments);
        this.setNumber = '57';
        this.fullName = 'Chi-Yu SVP';
        this.set = 'SVP';
    }
}
exports.ChiYuSVP = ChiYuSVP;
class IronBundleSVP extends iron_bundle_1.IronBundle {
    constructor() {
        super(...arguments);
        this.setNumber = '58';
        this.fullName = 'Iron Bundle SVP';
        this.set = 'SVP';
    }
}
exports.IronBundleSVP = IronBundleSVP;
class XatuSVP extends xatu_1.Xatu {
    constructor() {
        super(...arguments);
        this.setNumber = '59';
        this.fullName = 'Xatu SVP';
        this.set = 'SVP';
    }
}
exports.XatuSVP = XatuSVP;
class AegislashSVP extends aegislash_1.Aegislash {
    constructor() {
        super(...arguments);
        this.setNumber = '60';
        this.fullName = 'Aegislash SVP';
        this.set = 'SVP';
    }
}
exports.AegislashSVP = AegislashSVP;
class PinecoSVP extends pineco_1.Pineco {
    constructor() {
        super(...arguments);
        this.setNumber = '61';
        this.fullName = 'Pineco SVP';
        this.set = 'SVP';
    }
}
exports.PinecoSVP = PinecoSVP;
// export class SinisteaSVP extends Pineco {
//   public setNumber = '62';
//   public fullName: string = 'Pineco SVP';
//   public set = 'SVP';
// }
class ArctibaxSVP extends arctibax_1.Arctibax {
    constructor() {
        super(...arguments);
        this.setNumber = '64';
        this.fullName = 'Arctibax SVP';
        this.set = 'SVP';
    }
}
exports.ArctibaxSVP = ArctibaxSVP;
class ScreamTailSVP extends scream_tail_1.ScreamTail {
    constructor() {
        super(...arguments);
        this.setNumber = '65';
        this.fullName = 'Scream Tail SVP';
        this.set = 'SVP';
    }
}
exports.ScreamTailSVP = ScreamTailSVP;
class IronBundleIRSVP extends iron_bundle_1.IronBundle {
    constructor() {
        super(...arguments);
        this.setNumber = '66';
        this.fullName = 'Iron BundleIR SVP';
        this.set = 'SVP';
    }
}
exports.IronBundleIRSVP = IronBundleIRSVP;
class RoaringMoonexSVP extends roaring_moon_ex_1.RoaringMoonex {
    constructor() {
        super(...arguments);
        this.setNumber = '67';
        this.fullName = 'Roaring Moon ex SVP';
        this.set = 'SVP';
    }
}
exports.RoaringMoonexSVP = RoaringMoonexSVP;
class IronValiantexSVP extends iron_valiant_ex_1.IronValiantex {
    constructor() {
        super(...arguments);
        this.setNumber = '68';
        this.fullName = 'Iron Valiant ex SVP';
        this.set = 'SVP';
    }
}
exports.IronValiantexSVP = IronValiantexSVP;
// export class FidoughSVP extends Fidough {
//   public setNumber = '69';
//   public fullName: string = 'Fidough SVP';
//   public set = 'SVP';
// }
// export class GreavardSVP extends Greavard {
//   public setNumber = '70';
//   public fullName: string = 'Greavard SVP';
//   public set = 'SVP';
// }
// export class MaschiffSVP extends Maschiff {
//   public setNumber = '71';
//   public fullName: string = 'Maschiff SVP';
//   public set = 'SVP';
// }
class GreatTuskexSVP extends great_tusk_ex_1.GreatTuskex {
    constructor() {
        super(...arguments);
        this.setNumber = '72';
        this.fullName = 'Great Tusk ex SVP';
        this.set = 'SVP';
    }
}
exports.GreatTuskexSVP = GreatTuskexSVP;
// export class IronTreadsexSVP extends IronTreadsex {
//   public setNumber = '73';
//   public fullName: string = 'Iron Treads ex SVP';
//   public set = 'SVP';
// }
class Charizardex2SVP extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.setNumber = '74';
        this.fullName = 'Charizard ex2 SVP';
        this.set = 'SVP';
    }
}
exports.Charizardex2SVP = Charizardex2SVP;
class MimikyuSVP extends mimikyu_1.Mimikyu {
    constructor() {
        super(...arguments);
        this.setNumber = '75';
        this.fullName = 'Mimikyu SVP';
        this.set = 'SVP';
    }
}
exports.MimikyuSVP = MimikyuSVP;
// export class SprigatitoSVP extends Sprigatito {
//   public setNumber = '76';
//   public fullName: string = 'Sprigatito SVP';
//   public set = 'SVP';
// }
class FloragatoSVP extends floragato_1.Floragato {
    constructor() {
        super(...arguments);
        this.setNumber = '77';
        this.fullName = 'Floragato SVP';
        this.set = 'SVP';
    }
}
exports.FloragatoSVP = FloragatoSVP;
class MeowscaradaexFASVP extends meowscarada_ex_1.Meowscaradaex {
    constructor() {
        super(...arguments);
        this.setNumber = '78';
        this.fullName = 'Meowscarada exFA SVP';
        this.set = 'SVP';
    }
}
exports.MeowscaradaexFASVP = MeowscaradaexFASVP;
// export class FuecocoSVP extends Fuecoco {
//   public setNumber = '79';
//   public fullName: string = 'Fuecoco SVP';
//   public set = 'SVP';
// }
class CrocalorSVP extends crocalor_1.Crocalor {
    constructor() {
        super(...arguments);
        this.setNumber = '80';
        this.fullName = 'Crocalor SVP';
        this.set = 'SVP';
    }
}
exports.CrocalorSVP = CrocalorSVP;
class SkeledirgeexFASVP extends skeledirge_ex_1.Skeledirgeex {
    constructor() {
        super(...arguments);
        this.setNumber = '81';
        this.fullName = 'Skeledirge exFA SVP';
        this.set = 'SVP';
    }
}
exports.SkeledirgeexFASVP = SkeledirgeexFASVP;
// export class QuaxlySVP extends Quaxly {
//   public setNumber = '82';
//   public fullName: string = 'Quaxly SVP';
//   public set = 'SVP';
// }
// export class QuaxwellSVP extends Quaxwell {
//   public setNumber = '83';
//   public fullName: string = 'Quaxwell SVP';
//   public set = 'SVP';
// }
class QuaquavalexFASVP extends quaquaval_ex_1.Quaquavalex {
    constructor() {
        super(...arguments);
        this.setNumber = '84';
        this.fullName = 'Quaquaval exFA SVP';
        this.set = 'SVP';
    }
}
exports.QuaquavalexFASVP = QuaquavalexFASVP;
// export class PikachuSVP extends Pikachu {
//   public setNumber = '88';
//   public fullName: string = 'Pikachu SVP';
//   public set = 'SVP';
// }
class FeraligatrSVP extends feraligatr_1.Feraligatr {
    constructor() {
        super(...arguments);
        this.setNumber = '89';
        this.fullName = 'Feraligatr SVP';
        this.set = 'SVP';
    }
}
exports.FeraligatrSVP = FeraligatrSVP;
class MetangSVP extends metang_1.Metang {
    constructor() {
        super(...arguments);
        this.setNumber = '90';
        this.fullName = 'Metang SVP';
        this.set = 'SVP';
    }
}
exports.MetangSVP = MetangSVP;
class KoraidonSVP extends koraidon_1.Koraidon {
    constructor() {
        super(...arguments);
        this.setNumber = '91';
        this.fullName = 'Koraidon SVP';
        this.set = 'SVP';
    }
}
exports.KoraidonSVP = KoraidonSVP;
class MiraidonSVP extends miraidon_1.Miraidon {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.fullName = 'Miraidon SVP';
        this.set = 'SVP';
    }
}
exports.MiraidonSVP = MiraidonSVP;
// export class CarvanhaSVP extends Carvanha {
//   public setNumber = '93';
//   public fullName: string = 'Carvanha SVP';
//   public set = 'SVP';
// }
class FlutterManeSVP extends flutter_mane_1.FlutterMane {
    constructor() {
        super(...arguments);
        this.setNumber = '97';
        this.fullName = 'Flutter Mane SVP';
        this.set = 'SVP';
    }
}
exports.FlutterManeSVP = FlutterManeSVP;
class IronThornsSVP extends iron_thorns_1.IronThorns {
    constructor() {
        super(...arguments);
        this.setNumber = '98';
        this.fullName = 'Iron Thorns SVP';
        this.set = 'SVP';
    }
}
exports.IronThornsSVP = IronThornsSVP;
// export class HoundoomexSVP extends Houndoomex {
//   public setNumber = '103';
//   public fullName: string = 'Houndoom ex SVP';
//   public set = 'SVP';
// }
// export class MelmetalexSVP extends Melmetalex {
//   public setNumber = '104';
//   public fullName: string = 'Melmetal ex SVP';
//   public set = 'SVP';
// }
class ThwackeySVP extends thwackey_1.Thwackey {
    constructor() {
        super(...arguments);
        this.setNumber = '115';
        this.fullName = 'Thwackey SVP';
        this.set = 'SVP';
    }
}
exports.ThwackeySVP = ThwackeySVP;
class InfernapeSVP extends infernape_1.Infernape {
    constructor() {
        super(...arguments);
        this.setNumber = '116';
        this.fullName = 'Infernape SVP';
        this.set = 'SVP';
    }
}
exports.InfernapeSVP = InfernapeSVP;
class FroslassSVP extends froslass_1.Froslass {
    constructor() {
        super(...arguments);
        this.setNumber = '117';
        this.fullName = 'Froslass SVP';
        this.set = 'SVP';
    }
}
exports.FroslassSVP = FroslassSVP;
class TatsugiriSVP extends tatsugiri_1.Tatsugiri {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.fullName = 'Tatsugiri SVP';
        this.set = 'SVP';
    }
}
exports.TatsugiriSVP = TatsugiriSVP;
// export class ToxelSVP extends Toxel {
//   public setNumber = '119';
//   public fullName: string = 'Toxel SVP';
//   public set = 'SVP';
// }
class PupitarSVP extends pupitar_1.Pupitar {
    constructor() {
        super(...arguments);
        this.setNumber = '120';
        this.fullName = 'Pupitar SVP';
        this.set = 'SVP';
    }
}
exports.PupitarSVP = PupitarSVP;
// export class TealMaskOgerponSVP extends TealMaskOgerpon {
//   public setNumber = '123';
//   public fullName: string = 'Teal Mask Ogerpon SVP';
//   public set = 'SVP';
// }
class IonoSVP extends iono_1.Iono {
    constructor() {
        super(...arguments);
        this.setNumber = '124';
        this.fullName = 'Iono SVP';
        this.set = 'SVP';
    }
}
exports.IonoSVP = IonoSVP;
class ArmarougeexSVP extends armarouge_ex_1.Armarougeex {
    constructor() {
        super(...arguments);
        this.setNumber = '125';
        this.fullName = 'Armarouge ex SVP';
        this.set = 'SVP';
    }
}
exports.ArmarougeexSVP = ArmarougeexSVP;
class PalafinexSVP extends palafin_ex_1.Palafinex {
    constructor() {
        super(...arguments);
        this.setNumber = '126';
        this.fullName = 'Palafin ex SVP';
        this.set = 'SVP';
    }
}
exports.PalafinexSVP = PalafinexSVP;
class WalkingWakeexSVP extends walking_wake_ex_1.WalkingWakeex {
    constructor() {
        super(...arguments);
        this.setNumber = '127';
        this.fullName = 'Walking Wake ex SVP';
        this.set = 'SVP';
    }
}
exports.WalkingWakeexSVP = WalkingWakeexSVP;
class IronLeavesexSVP extends iron_leaves_ex_1.IronLeavesex {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.fullName = 'Iron Leaves ex SVP';
        this.set = 'SVP';
    }
}
exports.IronLeavesexSVP = IronLeavesexSVP;
class PecharuntIRSVP extends pecharunt_1.Pecharunt {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.fullName = 'PecharuntIR SVP';
        this.set = 'SVP';
    }
}
exports.PecharuntIRSVP = PecharuntIRSVP;
// export class KingambitSVP extends Kingambit {
//   public setNumber = '130';
//   public fullName: string = 'Kingambit SVP';
//   public set = 'SVP';
// }
class KingdraexSVP extends kingdra_ex_1.Kingdraex {
    constructor() {
        super(...arguments);
        this.setNumber = '131';
        this.fullName = 'Kingdra ex SVP';
        this.set = 'SVP';
    }
}
exports.KingdraexSVP = KingdraexSVP;
// export class GreninjaexSIRSVP extends Greninjaex {
//   public setNumber = '132';
//   public fullName: string = 'Greninja exSIR SVP';
//   public set = 'SVP';
// }
// export class LedianSVP extends Ledian {
//   public setNumber = '133';
//   public fullName: string = 'Ledian SVP';
//   public set = 'SVP';
// }
class CrabominableSVP extends crabominable_1.Crabominable {
    constructor() {
        super(...arguments);
        this.setNumber = '134';
        this.fullName = 'Crabominable SVP';
        this.set = 'SVP';
    }
}
exports.CrabominableSVP = CrabominableSVP;
class DrifblimSVP extends drifblim_1.Drifblim {
    constructor() {
        super(...arguments);
        this.setNumber = '135';
        this.fullName = 'Drifblim SVP';
        this.set = 'SVP';
    }
}
exports.DrifblimSVP = DrifblimSVP;
class BouffalantSVP extends bouffalant_1.Bouffalant {
    constructor() {
        super(...arguments);
        this.setNumber = '136';
        this.fullName = 'Bouffalant SVP';
        this.set = 'SVP';
    }
}
exports.BouffalantSVP = BouffalantSVP;
// export class HorseaSVP extends Horsea {
//   public setNumber = '137';
//   public fullName: string = 'Horsea SVP';
//   public set = 'SVP';
// }
class Porygon2SVP extends porygon2_1.Porygon2 {
    constructor() {
        super(...arguments);
        this.setNumber = '138';
        this.fullName = 'Porygon2 SVP';
        this.set = 'SVP';
    }
}
exports.Porygon2SVP = Porygon2SVP;
class NoctowlSVP extends noctowl_1.Noctowl {
    constructor() {
        super(...arguments);
        this.setNumber = '141';
        this.fullName = 'Noctowl SVP';
        this.set = 'SVP';
    }
}
exports.NoctowlSVP = NoctowlSVP;
class VictiniexSVP extends victini_ex_1.Victiniex {
    constructor() {
        super(...arguments);
        this.setNumber = '142';
        this.fullName = 'Victini ex SVP';
        this.set = 'SVP';
    }
}
exports.VictiniexSVP = VictiniexSVP;
class Miraidonex2SVP extends miraidon_ex_2.Miraidonex {
    constructor() {
        super(...arguments);
        this.setNumber = '142';
        this.fullName = 'Miraidon ex2 SVP';
        this.set = 'SVP';
    }
}
exports.Miraidonex2SVP = Miraidonex2SVP;
class GougingFireexSVP extends gouging_fire_ex_1.GougingFireex {
    constructor() {
        super(...arguments);
        this.setNumber = '144';
        this.fullName = 'Gouging Fire ex SVP';
        this.set = 'SVP';
    }
}
exports.GougingFireexSVP = GougingFireexSVP;
class RagingBoltexSVP extends raging_bolt_ex_1.RagingBoltex {
    constructor() {
        super(...arguments);
        this.setNumber = '145';
        this.fullName = 'Raging Bolt ex SVP';
        this.set = 'SVP';
    }
}
exports.RagingBoltexSVP = RagingBoltexSVP;
class IronCrownexSVP extends iron_crown_ex_1.IronCrownex {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.fullName = 'Iron Crown ex SVP';
        this.set = 'SVP';
    }
}
exports.IronCrownexSVP = IronCrownexSVP;
// export class IronBoulderexSVP extends IronBoulderex {
//   public setNumber = '147';
//   public fullName: string = 'Iron Boulder ex SVP';
//   public set = 'SVP';
// }
class GougingFireSVP extends gouging_fire_1.GougingFire {
    constructor() {
        super(...arguments);
        this.setNumber = '151';
        this.fullName = 'Gouging Fire SVP';
        this.set = 'SVP';
    }
}
exports.GougingFireSVP = GougingFireSVP;
class ChienPaoSVP extends chien_pao_1.ChienPao {
    constructor() {
        super(...arguments);
        this.setNumber = '152';
        this.fullName = 'Chien-Pao SVP';
        this.set = 'SVP';
    }
}
exports.ChienPaoSVP = ChienPaoSVP;
class MagnetonSVP extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.setNumber = '153';
        this.fullName = 'Magneton SVP';
        this.set = 'SVP';
    }
}
exports.MagnetonSVP = MagnetonSVP;
// export class IndeedeeSVP extends Indeedee {
//   public setNumber = '154';
//   public fullName: string = 'Indeedee SVP';
//   public set = 'SVP';
// }
class MagnetonIRSVP extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.fullName = 'MagnetonIR SVP';
        this.set = 'SVP';
    }
}
exports.MagnetonIRSVP = MagnetonIRSVP;
class SquawkabillyexSVP extends squawkabilly_ex_1.Squawkabillyex {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.fullName = 'Squawkabilly ex SVP';
        this.set = 'SVP';
    }
}
exports.SquawkabillyexSVP = SquawkabillyexSVP;
class Charizardex3SVP extends charizard_ex_2.Charizardex {
    constructor() {
        super(...arguments);
        this.setNumber = '161';
        this.fullName = 'Charizard ex3 SVP';
        this.set = 'SVP';
    }
}
exports.Charizardex3SVP = Charizardex3SVP;
class CinderaceexSVP extends cinderace_ex_1.Cinderaceex {
    constructor() {
        super(...arguments);
        this.setNumber = '163';
        this.fullName = 'Cinderace ex SVP';
        this.set = 'SVP';
    }
}
exports.CinderaceexSVP = CinderaceexSVP;
class LaprasexSVP extends lapras_ex_1.Laprasex {
    constructor() {
        super(...arguments);
        this.setNumber = '164';
        this.fullName = 'Lapras ex SVP';
        this.set = 'SVP';
    }
}
exports.LaprasexSVP = LaprasexSVP;
class TerapagosexSVP extends terapagos_ex_1.Terapagosex {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.fullName = 'Terapagos ex SVP';
        this.set = 'SVP';
    }
}
exports.TerapagosexSVP = TerapagosexSVP;
class TealMaskOgerponexSVP extends teal_mask_ogerpon_ex_1.TealMaskOgerponex {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.fullName = 'Teal Mask Ogerpon ex SVP';
        this.set = 'SVP';
    }
}
exports.TealMaskOgerponexSVP = TealMaskOgerponexSVP;
// export class FlareonSVP extends Flareon {
//   public setNumber = '167';
//   public fullName: string = 'Flareon SVP';
//   public set = 'SVP';
// }
// export class VaporeonSVP extends Vaporeon {
//   public setNumber = '168';
//   public fullName: string = 'Vaporeon SVP';
//   public set = 'SVP';
// }
class JolteonSVP extends jolteon_1.Jolteon {
    constructor() {
        super(...arguments);
        this.setNumber = '169';
        this.fullName = 'Jolteon SVP';
        this.set = 'SVP';
    }
}
exports.JolteonSVP = JolteonSVP;
// export class LeafeonSVP extends Leafeon {
//   public setNumber = '170';
//   public fullName: string = 'Leafeon SVP';
//   public set = 'SVP';
// }
// export class GlaceonSVP extends Glaceon {
//   public setNumber = '171';
//   public fullName: string = 'Glaceon SVP';
//   public set = 'SVP';
// }
// export class SylveonSVP extends Sylveon {
//   public setNumber = '172';
//   public fullName: string = 'Sylveon SVP';
//   public set = 'SVP';
// }
class EeveeSVP extends eevee_1.Eevee {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.fullName = 'Eevee SVP';
        this.set = 'SVP';
    }
}
exports.EeveeSVP = EeveeSVP;
class BloodmoonUrsalunaexSVP extends bloodmoon_ursaluna_ex_1.BloodmoonUrsalunaex {
    constructor() {
        super(...arguments);
        this.setNumber = '177';
        this.fullName = 'Bloodmoon Ursaluna ex SVP';
        this.set = 'SVP';
    }
}
exports.BloodmoonUrsalunaexSVP = BloodmoonUrsalunaexSVP;
