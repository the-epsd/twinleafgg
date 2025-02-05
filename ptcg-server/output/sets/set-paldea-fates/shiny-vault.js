"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoduoSV = exports.PidgeottoSV = exports.PidgeySV = exports.NoibatSV = exports.RevavroomSV = exports.ScizorSV = exports.MurkrowSV = exports.HawluchaSV = exports.LucarioSV = exports.RioluSV = exports.TinkatonSV = exports.TinkatuffSV = exports.TinkatinkSV = exports.MimikyuSV = exports.KlefkiSV = exports.SpiritombSV = exports.MimeJrSV = exports.DrifloonSV = exports.KirliaSV = exports.RaltsSV = exports.XatuSV = exports.NatuSV = exports.CleffaSV = exports.KilowattrelSV = exports.WattrelSV = exports.PawmotSV = exports.PawmoSV = exports.PawmiSV = exports.ThundurusSV = exports.LuxraySV = exports.BaxcaliburSV = exports.ArctibaxSV = exports.FrigibaxSV = exports.PalafinSV = exports.FinizenSV = exports.StarmieSV = exports.StaryuSV = exports.ArmarougeSV = exports.CharcadetSV = exports.EnteiSV = exports.CharmeleonSV = exports.CharmanderSV = exports.CapsakidSV = exports.ArbolivaSV = exports.DollivSV = exports.SmolivSV = exports.PinecoSV = exports.VileplumeSV = exports.GloomSV = exports.OddishSV = void 0;
exports.KoraidonexUR = exports.TingLuexUR = exports.MiraidonexUR = exports.ChienPaoexUR = exports.ChiYuexUR = exports.WoChienexUR = exports.PennySV = exports.NemonaSV2 = exports.IonoSV = exports.CliveSV2 = exports.ArvenSV = exports.CharizardexSVSIR = exports.GardevoirexSVSIR = exports.MewexSVSIR = exports.PaldeanStudentSV2 = exports.PaldeanStudentSV1 = exports.NemonaSV = exports.JudgeSV = exports.CliveSV = exports.PawmiSVFA = exports.PalafinSVFA = exports.WugtrioSVFA = exports.SquawkabillyexSV = exports.PidgeotexSV = exports.NoivernexSV = exports.GardevoirexSV = exports.MewexSV = exports.EspathraexSV = exports.ToedscruelexSV = exports.ForretressexSV = exports.FlamigoSV = exports.SkwovetSV = exports.PelipperSV = exports.WingullSV = exports.SnorlaxSV = exports.DittoSV = exports.DodrioSV = void 0;
const charizard_ex_1 = require("../set-obsidian-flames/charizard-ex");
const cleffa_1 = require("../set-obsidian-flames/cleffa");
const entei_1 = require("../set-obsidian-flames/entei");
const finizen_1 = require("../set-obsidian-flames/finizen");
const toedscruel_ex_1 = require("../set-obsidian-flames/toedscruel-ex");
const palafin_1 = require("../set-obsidian-flames/palafin");
const pidgeot_ex_1 = require("../set-obsidian-flames/pidgeot-ex");
const scizor_1 = require("../set-obsidian-flames/scizor");
const thundurus_1 = require("../set-obsidian-flames/thundurus");
const arctibax_1 = require("../set-paldea-evolved/arctibax");
const baxcalibur_1 = require("../set-paldea-evolved/baxcalibur");
const flamigo_1 = require("../set-paldea-evolved/flamigo");
const forretress_ex_1 = require("../set-paldea-evolved/forretress-ex");
const iono_1 = require("../set-paldea-evolved/iono");
const luxray_1 = require("../set-paldea-evolved/luxray");
const mimikyu_1 = require("../set-paldea-evolved/mimikyu");
const murkrow_1 = require("../set-paldea-evolved/murkrow");
const noibat_1 = require("../set-paldea-evolved/noibat");
const noivern_ex_1 = require("../set-paldea-evolved/noivern-ex");
const pelipper_1 = require("../set-paldea-evolved/pelipper");
const pineco_1 = require("../set-paldea-evolved/pineco");
const spiritomb_1 = require("../set-paldea-evolved/spiritomb");
const squawkabilly_ex_1 = require("../set-paldea-evolved/squawkabilly-ex");
const tinkatink_1 = require("../set-paldea-evolved/tinkatink");
const tinkaton_1 = require("../set-paldea-evolved/tinkaton");
const wattrel_1 = require("../set-paldea-evolved/wattrel");
const wingull_1 = require("../set-paldea-evolved/wingull");
const natu_1 = require("../set-paradox-rift/natu");
const xatu_1 = require("../set-paradox-rift/xatu");
const charmander_1 = require("../set-pokemon-151/charmander");
const ditto_1 = require("../set-pokemon-151/ditto");
const dodrio_1 = require("../set-pokemon-151/dodrio");
const doduo_1 = require("../set-pokemon-151/doduo");
const gloom_1 = require("../set-pokemon-151/gloom");
const mew_ex_1 = require("../set-pokemon-151/mew-ex");
const oddish_1 = require("../set-pokemon-151/oddish");
const pidgeotto_1 = require("../set-pokemon-151/pidgeotto");
const pidgey_1 = require("../set-pokemon-151/pidgey");
const starmie_1 = require("../set-pokemon-151/starmie");
const staryu_1 = require("../set-pokemon-151/staryu");
const vileplume_1 = require("../set-pokemon-151/vileplume");
const arboliva_1 = require("../set-scarlet-and-violet/arboliva");
const armarouge_1 = require("../set-scarlet-and-violet/armarouge");
const arven_1 = require("../set-scarlet-and-violet/arven");
const capsakid_1 = require("../set-scarlet-and-violet/capsakid");
const charcadet_1 = require("../set-scarlet-and-violet/charcadet");
const dolliv_1 = require("../set-scarlet-and-violet/dolliv");
const drifloon_1 = require("../set-scarlet-and-violet/drifloon");
const gardevoir_ex_1 = require("../set-scarlet-and-violet/gardevoir-ex");
const hawlucha_1 = require("../set-scarlet-and-violet/hawlucha");
const judge_1 = require("../set-scarlet-and-violet/judge");
const klefki_1 = require("../set-scarlet-and-violet/klefki");
const lucario_1 = require("../set-scarlet-and-violet/lucario");
const penny_1 = require("../set-scarlet-and-violet/penny");
const ralts_1 = require("../set-scarlet-and-violet/ralts");
const revavroom_1 = require("../set-scarlet-and-violet/revavroom");
const riolu2_1 = require("../set-scarlet-and-violet/riolu2");
const skwovet_1 = require("../set-scarlet-and-violet/skwovet");
const smoliv_1 = require("../set-scarlet-and-violet/smoliv");
const charmeleon_1 = require("./charmeleon");
const espathra_ex_1 = require("./espathra-ex");
const frigibax_1 = require("./frigibax");
const kilowattrel_1 = require("./kilowattrel");
const mime_jr_1 = require("./mime-jr");
const students_in_paldea_1 = require("./students-in-paldea");
const snorlax_1 = require("../set-pokemon-151/snorlax");
const tinkatuff_1 = require("../set-paldea-evolved/tinkatuff");
const kirlia_1 = require("../set-scarlet-and-violet/kirlia");
const pawmi_1 = require("../set-scarlet-and-violet/pawmi");
const wugtrio_1 = require("../set-scarlet-and-violet/wugtrio");
const wo_chien_ex_1 = require("../set-paldea-evolved/wo-chien-ex");
const chi_yu_ex_1 = require("../set-paldea-evolved/chi-yu-ex");
const chien_pao_ex_1 = require("../set-paldea-evolved/chien-pao-ex");
const miraidon_ex_1 = require("../set-scarlet-and-violet/miraidon-ex");
const ting_lu_ex_1 = require("../set-paldea-evolved/ting-lu-ex");
const koraidon_ex_1 = require("../set-scarlet-and-violet/koraidon-ex");
const nemona_1 = require("../set-scarlet-and-violet/nemona");
const clive_1 = require("./clive");
const pawmo_1 = require("../set-scarlet-and-violet/pawmo");
const pawmot_1 = require("../set-scarlet-and-violet/pawmot");
class OddishSV extends oddish_1.Oddish {
    constructor() {
        super(...arguments);
        this.setNumber = '92';
        this.set = 'PAF';
        this.fullName = 'Oddish PAF';
    }
}
exports.OddishSV = OddishSV;
class GloomSV extends gloom_1.Gloom {
    constructor() {
        super(...arguments);
        this.setNumber = '93';
        this.set = 'PAF';
        this.fullName = 'Gloom PAF';
    }
}
exports.GloomSV = GloomSV;
class VileplumeSV extends vileplume_1.Vileplume {
    constructor() {
        super(...arguments);
        this.setNumber = '94';
        this.set = 'PAF';
        this.fullName = 'Vileplume PAF';
    }
}
exports.VileplumeSV = VileplumeSV;
class PinecoSV extends pineco_1.Pineco {
    constructor() {
        super(...arguments);
        this.setNumber = '99';
        this.set = 'PAF';
        this.fullName = 'Pineco PAF';
    }
}
exports.PinecoSV = PinecoSV;
class SmolivSV extends smoliv_1.Smoliv {
    constructor() {
        super(...arguments);
        this.setNumber = '102';
        this.set = 'PAF';
        this.fullName = 'Smoliv PAF';
    }
}
exports.SmolivSV = SmolivSV;
class DollivSV extends dolliv_1.Dolliv {
    constructor() {
        super(...arguments);
        this.setNumber = '103';
        this.set = 'PAF';
        this.fullName = 'Dolliv PAF';
    }
}
exports.DollivSV = DollivSV;
class ArbolivaSV extends arboliva_1.Arboliva {
    constructor() {
        super(...arguments);
        this.setNumber = '104';
        this.set = 'PAF';
        this.fullName = 'Arboliva PAF';
    }
}
exports.ArbolivaSV = ArbolivaSV;
class CapsakidSV extends capsakid_1.Capsakid {
    constructor() {
        super(...arguments);
        this.setNumber = '106';
        this.set = 'PAF';
        this.fullName = 'Capsakid PAF';
    }
}
exports.CapsakidSV = CapsakidSV;
class CharmanderSV extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.setNumber = '109';
        this.set = 'PAF';
        this.fullName = 'CharmanderSV PAF';
    }
}
exports.CharmanderSV = CharmanderSV;
class CharmeleonSV extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.setNumber = '110';
        this.set = 'PAF';
        this.fullName = 'CharmeleonSV PAF';
    }
}
exports.CharmeleonSV = CharmeleonSV;
class EnteiSV extends entei_1.Entei {
    constructor() {
        super(...arguments);
        this.setNumber = '112';
        this.set = 'PAF';
        this.fullName = 'Entei PAF';
    }
}
exports.EnteiSV = EnteiSV;
class CharcadetSV extends charcadet_1.Charcadet {
    constructor() {
        super(...arguments);
        this.setNumber = '114';
        this.set = 'PAF';
        this.fullName = 'Charcadet PAF';
    }
}
exports.CharcadetSV = CharcadetSV;
class ArmarougeSV extends armarouge_1.Armarouge {
    constructor() {
        super(...arguments);
        this.setNumber = '115';
        this.set = 'PAF';
        this.fullName = 'Armarouge PAF';
    }
}
exports.ArmarougeSV = ArmarougeSV;
class StaryuSV extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.setNumber = '118';
        this.set = 'PAF';
        this.fullName = 'Staryu PAF';
    }
}
exports.StaryuSV = StaryuSV;
class StarmieSV extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.setNumber = '119';
        this.set = 'PAF';
        this.fullName = 'Starmie PAF';
    }
}
exports.StarmieSV = StarmieSV;
class FinizenSV extends finizen_1.Finizen {
    constructor() {
        super(...arguments);
        this.setNumber = '123';
        this.set = 'PAF';
        this.fullName = 'Finizen PAF';
    }
}
exports.FinizenSV = FinizenSV;
class PalafinSV extends palafin_1.Palafin {
    constructor() {
        super(...arguments);
        this.setNumber = '124';
        this.set = 'PAF';
        this.fullName = 'Palafin PAF';
    }
}
exports.PalafinSV = PalafinSV;
class FrigibaxSV extends frigibax_1.Frigibax {
    constructor() {
        super(...arguments);
        this.setNumber = '128';
        this.set = 'PAF';
        this.fullName = 'FrigibaxSV PAF';
    }
}
exports.FrigibaxSV = FrigibaxSV;
class ArctibaxSV extends arctibax_1.Arctibax {
    constructor() {
        super(...arguments);
        this.setNumber = '129';
        this.set = 'PAF';
        this.fullName = 'Arctibax PAF';
    }
}
exports.ArctibaxSV = ArctibaxSV;
class BaxcaliburSV extends baxcalibur_1.Baxcalibur {
    constructor() {
        super(...arguments);
        this.setNumber = '130';
        this.set = 'PAF';
        this.fullName = 'Baxcalibur PAF';
    }
}
exports.BaxcaliburSV = BaxcaliburSV;
class LuxraySV extends luxray_1.Luxray {
    constructor() {
        super(...arguments);
        this.setNumber = '137';
        this.set = 'PAF';
        this.fullName = 'Luxray PAF';
    }
}
exports.LuxraySV = LuxraySV;
class ThundurusSV extends thundurus_1.Thundurus {
    constructor() {
        super(...arguments);
        this.setNumber = '139';
        this.set = 'PAF';
        this.fullName = 'Thundurus PAF';
    }
}
exports.ThundurusSV = ThundurusSV;
class PawmiSV extends pawmi_1.Pawmi {
    constructor() {
        super(...arguments);
        this.setNumber = '142';
        this.set = 'PAF';
        this.fullName = 'Pawmi PAF';
    }
}
exports.PawmiSV = PawmiSV;
class PawmoSV extends pawmo_1.Pawmo {
    constructor() {
        super(...arguments);
        this.setNumber = '143';
        this.set = 'PAF';
        this.fullName = 'Pawmo PAF';
    }
}
exports.PawmoSV = PawmoSV;
class PawmotSV extends pawmot_1.Pawmot {
    constructor() {
        super(...arguments);
        this.setNumber = '144';
        this.set = 'PAF';
        this.fullName = 'Pawmot PAF';
    }
}
exports.PawmotSV = PawmotSV;
class WattrelSV extends wattrel_1.Wattrel {
    constructor() {
        super(...arguments);
        this.setNumber = '145';
        this.set = 'PAF';
        this.fullName = 'Wattrel PAF';
    }
}
exports.WattrelSV = WattrelSV;
class KilowattrelSV extends kilowattrel_1.Kilowattrel {
    constructor() {
        super(...arguments);
        this.setNumber = '146';
        this.set = 'PAF';
        this.fullName = 'Kilowattrel PAF';
    }
}
exports.KilowattrelSV = KilowattrelSV;
class CleffaSV extends cleffa_1.Cleffa {
    constructor() {
        super(...arguments);
        this.setNumber = '150';
        this.set = 'PAF';
        this.fullName = 'Cleffa PAF';
    }
}
exports.CleffaSV = CleffaSV;
class NatuSV extends natu_1.Natu {
    constructor() {
        super(...arguments);
        this.setNumber = '151';
        this.set = 'PAF';
        this.fullName = 'Natu PAF';
    }
}
exports.NatuSV = NatuSV;
class XatuSV extends xatu_1.Xatu {
    constructor() {
        super(...arguments);
        this.setNumber = '152';
        this.set = 'PAF';
        this.fullName = 'Xatu PAF';
    }
}
exports.XatuSV = XatuSV;
class RaltsSV extends ralts_1.Ralts {
    constructor() {
        super(...arguments);
        this.setNumber = '153';
        this.set = 'PAF';
        this.fullName = 'Ralts PAF';
    }
}
exports.RaltsSV = RaltsSV;
class KirliaSV extends kirlia_1.Kirlia {
    constructor() {
        super(...arguments);
        this.setNumber = '154';
        this.set = 'PAF';
        this.fullName = 'Kirlia PAF';
    }
}
exports.KirliaSV = KirliaSV;
class DrifloonSV extends drifloon_1.Drifloon {
    constructor() {
        super(...arguments);
        this.setNumber = '155';
        this.set = 'PAF';
        this.fullName = 'Drifloon PAF';
    }
}
exports.DrifloonSV = DrifloonSV;
class MimeJrSV extends mime_jr_1.MimeJr {
    constructor() {
        super(...arguments);
        this.setNumber = '157';
        this.set = 'PAF';
        this.fullName = 'MimeJrSV PAF';
    }
}
exports.MimeJrSV = MimeJrSV;
class SpiritombSV extends spiritomb_1.Spiritomb {
    constructor() {
        super(...arguments);
        this.setNumber = '158';
        this.set = 'PAF';
        this.fullName = 'Spiritomb PAF';
    }
}
exports.SpiritombSV = SpiritombSV;
class KlefkiSV extends klefki_1.Klefki {
    constructor() {
        super(...arguments);
        this.setNumber = '159';
        this.set = 'PAF';
        this.fullName = 'Klefki PAF';
    }
}
exports.KlefkiSV = KlefkiSV;
class MimikyuSV extends mimikyu_1.Mimikyu {
    constructor() {
        super(...arguments);
        this.setNumber = '160';
        this.set = 'PAF';
        this.fullName = 'Mimikyu PAF';
    }
}
exports.MimikyuSV = MimikyuSV;
class TinkatinkSV extends tinkatink_1.Tinkatink {
    constructor() {
        super(...arguments);
        this.setNumber = '165';
        this.set = 'PAF';
        this.fullName = 'Tinkatink PAF';
    }
}
exports.TinkatinkSV = TinkatinkSV;
class TinkatuffSV extends tinkatuff_1.Tinkatuff {
    constructor() {
        super(...arguments);
        this.setNumber = '166';
        this.set = 'PAF';
        this.fullName = 'Tinkatuff PAF';
    }
}
exports.TinkatuffSV = TinkatuffSV;
class TinkatonSV extends tinkaton_1.Tinkaton {
    constructor() {
        super(...arguments);
        this.setNumber = '167';
        this.set = 'PAF';
        this.fullName = 'Tinkaton PAF';
    }
}
exports.TinkatonSV = TinkatonSV;
class RioluSV extends riolu2_1.Riolu2 {
    constructor() {
        super(...arguments);
        this.setNumber = '173';
        this.set = 'PAF';
        this.fullName = 'Riolu PAF';
    }
}
exports.RioluSV = RioluSV;
class LucarioSV extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.setNumber = '174';
        this.set = 'PAF';
        this.fullName = 'Lucario PAF';
    }
}
exports.LucarioSV = LucarioSV;
class HawluchaSV extends hawlucha_1.Hawlucha {
    constructor() {
        super(...arguments);
        this.setNumber = '175';
        this.set = 'PAF';
        this.fullName = 'Hawlucha PAF';
    }
}
exports.HawluchaSV = HawluchaSV;
class MurkrowSV extends murkrow_1.Murkrow {
    constructor() {
        super(...arguments);
        this.setNumber = '181';
        this.set = 'PAF';
        this.fullName = 'Murkrow PAF';
    }
}
exports.MurkrowSV = MurkrowSV;
class ScizorSV extends scizor_1.Scizor {
    constructor() {
        super(...arguments);
        this.setNumber = '191';
        this.set = 'PAF';
        this.fullName = 'Scizor PAF';
    }
}
exports.ScizorSV = ScizorSV;
class RevavroomSV extends revavroom_1.Revavroom {
    constructor() {
        super(...arguments);
        this.setNumber = '193';
        this.set = 'PAF';
        this.fullName = 'Revavroom PAF';
    }
}
exports.RevavroomSV = RevavroomSV;
class NoibatSV extends noibat_1.Noibat {
    constructor() {
        super(...arguments);
        this.setNumber = '194';
        this.set = 'PAF';
        this.fullName = 'Noibat PAF';
    }
}
exports.NoibatSV = NoibatSV;
class PidgeySV extends pidgey_1.Pidgey {
    constructor() {
        super(...arguments);
        this.setNumber = '196';
        this.set = 'PAF';
        this.fullName = 'Pidgey PAF';
    }
}
exports.PidgeySV = PidgeySV;
class PidgeottoSV extends pidgeotto_1.Pidgeotto {
    constructor() {
        super(...arguments);
        this.setNumber = '197';
        this.set = 'PAF';
        this.fullName = 'Pidgeotto PAF';
    }
}
exports.PidgeottoSV = PidgeottoSV;
class DoduoSV extends doduo_1.Doduo {
    constructor() {
        super(...arguments);
        this.setNumber = '199';
        this.set = 'PAF';
        this.fullName = 'Doduo PAF';
    }
}
exports.DoduoSV = DoduoSV;
class DodrioSV extends dodrio_1.Dodrio {
    constructor() {
        super(...arguments);
        this.setNumber = '200';
        this.set = 'PAF';
        this.fullName = 'Dodrio PAF';
    }
}
exports.DodrioSV = DodrioSV;
class DittoSV extends ditto_1.Ditto {
    constructor() {
        super(...arguments);
        this.setNumber = '201';
        this.set = 'PAF';
        this.fullName = 'Ditto PAF';
    }
}
exports.DittoSV = DittoSV;
class SnorlaxSV extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.setNumber = '202';
        this.set = 'PAF';
        this.fullName = 'Snorlax PAF';
    }
}
exports.SnorlaxSV = SnorlaxSV;
class WingullSV extends wingull_1.Wingull {
    constructor() {
        super(...arguments);
        this.setNumber = '203';
        this.set = 'PAF';
        this.fullName = 'Wingull PAF';
    }
}
exports.WingullSV = WingullSV;
class PelipperSV extends pelipper_1.Pelipper {
    constructor() {
        super(...arguments);
        this.setNumber = '204';
        this.set = 'PAF';
        this.fullName = 'Pelipper PAF';
    }
}
exports.PelipperSV = PelipperSV;
class SkwovetSV extends skwovet_1.Skwovet {
    constructor() {
        super(...arguments);
        this.setNumber = '205';
        this.set = 'PAF';
        this.fullName = 'Skwovet PAF';
    }
}
exports.SkwovetSV = SkwovetSV;
class FlamigoSV extends flamigo_1.Flamigo {
    constructor() {
        super(...arguments);
        this.setNumber = '211';
        this.set = 'PAF';
        this.fullName = 'Flamigo PAF';
    }
}
exports.FlamigoSV = FlamigoSV;
// Shiny ex
class ForretressexSV extends forretress_ex_1.Forretressex {
    constructor() {
        super(...arguments);
        this.setNumber = '212';
        this.set = 'PAF';
        this.fullName = 'Forretress ex PAF';
    }
}
exports.ForretressexSV = ForretressexSV;
class ToedscruelexSV extends toedscruel_ex_1.Toedscruelex {
    constructor() {
        super(...arguments);
        this.setNumber = '213';
        this.set = 'PAF';
        this.fullName = 'Toedscruel ex PAF';
    }
}
exports.ToedscruelexSV = ToedscruelexSV;
class EspathraexSV extends espathra_ex_1.Espathraex {
    constructor() {
        super(...arguments);
        this.setNumber = '214';
        this.set = 'PAF';
        this.fullName = 'Espathra exSV PAF';
    }
}
exports.EspathraexSV = EspathraexSV;
class MewexSV extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.setNumber = '216';
        this.set = 'PAF';
        this.fullName = 'Mew ex PAF';
    }
}
exports.MewexSV = MewexSV;
class GardevoirexSV extends gardevoir_ex_1.Gardevoirex {
    constructor() {
        super(...arguments);
        this.setNumber = '217';
        this.set = 'PAF';
        this.fullName = 'Gardevoir ex PAF';
    }
}
exports.GardevoirexSV = GardevoirexSV;
class NoivernexSV extends noivern_ex_1.Noivernex {
    constructor() {
        super(...arguments);
        this.setNumber = '220';
        this.set = 'PAF';
        this.fullName = 'Noivern ex PAF';
    }
}
exports.NoivernexSV = NoivernexSV;
class PidgeotexSV extends pidgeot_ex_1.Pidgeotex {
    constructor() {
        super(...arguments);
        this.setNumber = '221';
        this.set = 'PAF';
        this.fullName = 'Pidgeot ex PAF';
    }
}
exports.PidgeotexSV = PidgeotexSV;
class SquawkabillyexSV extends squawkabilly_ex_1.Squawkabillyex {
    constructor() {
        super(...arguments);
        this.setNumber = '223';
        this.set = 'PAF';
        this.fullName = 'Squawkabilly ex PAF';
    }
}
exports.SquawkabillyexSV = SquawkabillyexSV;
// Shiny Full arts
class WugtrioSVFA extends wugtrio_1.Wugtrio {
    constructor() {
        super(...arguments);
        this.setNumber = '224';
        this.set = 'PAF';
        this.fullName = 'WugtrioFA PAF';
    }
}
exports.WugtrioSVFA = WugtrioSVFA;
class PalafinSVFA extends palafin_1.Palafin {
    constructor() {
        super(...arguments);
        this.setNumber = '225';
        this.set = 'PAF';
        this.fullName = 'PalafinFA PAF';
    }
}
exports.PalafinSVFA = PalafinSVFA;
class PawmiSVFA extends pawmi_1.Pawmi {
    constructor() {
        super(...arguments);
        this.setNumber = '226';
        this.set = 'PAF';
        this.fullName = 'PawmiFA PAF';
    }
}
exports.PawmiSVFA = PawmiSVFA;
// FA Trainers
class CliveSV extends clive_1.Clive {
    constructor() {
        super(...arguments);
        this.setNumber = '227';
        this.set = 'PAF';
        this.fullName = 'CliveFA PAF';
    }
}
exports.CliveSV = CliveSV;
class JudgeSV extends judge_1.Judge {
    constructor() {
        super(...arguments);
        this.setNumber = '228';
        this.set = 'PAF';
        this.fullName = 'Judge PAF';
    }
}
exports.JudgeSV = JudgeSV;
class NemonaSV extends nemona_1.Nemona {
    constructor() {
        super(...arguments);
        this.setNumber = '229';
        this.set = 'PAF';
        this.fullName = 'NemonaFA PAF';
    }
}
exports.NemonaSV = NemonaSV;
class PaldeanStudentSV1 extends students_in_paldea_1.StudentsInPaldea {
    constructor() {
        super(...arguments);
        this.setNumber = '230';
        this.set = 'PAF';
        this.fullName = 'Paldean StudentFA PAF';
    }
}
exports.PaldeanStudentSV1 = PaldeanStudentSV1;
class PaldeanStudentSV2 extends students_in_paldea_1.StudentsInPaldea {
    constructor() {
        super(...arguments);
        this.setNumber = '231';
        this.set = 'PAF';
        this.fullName = 'Paldean StudentFA2 PAF';
    }
}
exports.PaldeanStudentSV2 = PaldeanStudentSV2;
// SIR Pokemon
class MewexSVSIR extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.setNumber = '232';
        this.set = 'PAF';
        this.fullName = 'Mew exSIR PAF';
    }
}
exports.MewexSVSIR = MewexSVSIR;
class GardevoirexSVSIR extends gardevoir_ex_1.Gardevoirex {
    constructor() {
        super(...arguments);
        this.setNumber = '233';
        this.set = 'PAF';
        this.fullName = 'Gardevoir exSIR PAF';
    }
}
exports.GardevoirexSVSIR = GardevoirexSVSIR;
class CharizardexSVSIR extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.setNumber = '234';
        this.set = 'PAF';
        this.fullName = 'Charizard exSIR PAF';
    }
}
exports.CharizardexSVSIR = CharizardexSVSIR;
// SIR Trainers
class ArvenSV extends arven_1.Arven {
    constructor() {
        super(...arguments);
        this.setNumber = '235';
        this.set = 'PAF';
        this.fullName = 'ArvenSIR PAF';
    }
}
exports.ArvenSV = ArvenSV;
class CliveSV2 extends clive_1.Clive {
    constructor() {
        super(...arguments);
        this.setNumber = '236';
        this.set = 'PAF';
        this.fullName = 'CliveSIR PAF';
    }
}
exports.CliveSV2 = CliveSV2;
class IonoSV extends iono_1.Iono {
    constructor() {
        super(...arguments);
        this.setNumber = '237';
        this.set = 'PAF';
        this.fullName = 'IonoSIR PAF';
    }
}
exports.IonoSV = IonoSV;
class NemonaSV2 extends nemona_1.Nemona {
    constructor() {
        super(...arguments);
        this.setNumber = '238';
        this.set = 'PAF';
        this.fullName = 'NemonaSIR PAF';
    }
}
exports.NemonaSV2 = NemonaSV2;
class PennySV extends penny_1.Penny {
    constructor() {
        super(...arguments);
        this.setNumber = '239';
        this.set = 'PAF';
        this.fullName = 'PennySIR PAF';
    }
}
exports.PennySV = PennySV;
class WoChienexUR extends wo_chien_ex_1.WoChienex {
    constructor() {
        super(...arguments);
        this.setNumber = '240';
        this.set = 'PAF';
        this.fullName = 'Wo-Chien ex PAF';
    }
}
exports.WoChienexUR = WoChienexUR;
class ChiYuexUR extends chi_yu_ex_1.ChiYuex {
    constructor() {
        super(...arguments);
        this.setNumber = '241';
        this.set = 'PAF';
        this.fullName = 'Chi-Yu ex PAF';
    }
}
exports.ChiYuexUR = ChiYuexUR;
class ChienPaoexUR extends chien_pao_ex_1.ChienPaoex {
    constructor() {
        super(...arguments);
        this.setNumber = '242';
        this.set = 'PAF';
        this.fullName = 'Chien-Pao ex PAF';
    }
}
exports.ChienPaoexUR = ChienPaoexUR;
class MiraidonexUR extends miraidon_ex_1.Miraidonex {
    constructor() {
        super(...arguments);
        this.setNumber = '243';
        this.set = 'PAF';
        this.fullName = 'Miraidon ex PAF';
    }
}
exports.MiraidonexUR = MiraidonexUR;
class TingLuexUR extends ting_lu_ex_1.TingLuex {
    constructor() {
        super(...arguments);
        this.setNumber = '244';
        this.set = 'PAF';
        this.fullName = 'Ting-Lu ex PAF';
    }
}
exports.TingLuexUR = TingLuexUR;
class KoraidonexUR extends koraidon_ex_1.Koraidonex {
    constructor() {
        super(...arguments);
        this.setNumber = '245';
        this.set = 'PAF';
        this.fullName = 'Koraidon ex PAF';
    }
}
exports.KoraidonexUR = KoraidonexUR;
