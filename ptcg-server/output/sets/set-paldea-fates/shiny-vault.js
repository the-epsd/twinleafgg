"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WingullSV = exports.SnorlaxSV = exports.DittoSV = exports.DodrioSV = exports.DoduoSV = exports.PidgeottoSV = exports.PidgeySV = exports.NoibatSV = exports.RevavroomSV = exports.ScizorSV = exports.MurkrowSV = exports.HawluchaSV = exports.LucarioSV = exports.RioluSV = exports.TinkatonSV = exports.TinkatuffSV = exports.TinkatinkSV = exports.MimikyuSV = exports.KlefkiSV = exports.SpiritombSV = exports.MimeJrSV = exports.DrifloonSV = exports.RaltsSV = exports.XatuSV = exports.NatuSV = exports.CleffaSV = exports.KilowattrelSV = exports.WattrelSV = exports.ThundurusSV = exports.LuxraySV = exports.BaxcaliburSV = exports.ArctibaxSV = exports.FrigibaxSV = exports.PalafinSV = exports.FinizenSV = exports.StarmieSV = exports.StaryuSV = exports.ArmarougeSV = exports.CharcadetSV = exports.EnteiSV = exports.CharmeleonSV = exports.CharmanderSV = exports.CapsakidSV = exports.ArbolivaSV = exports.DollivSV = exports.SmolivSV = exports.PinecoSV = exports.VileplumeSV = exports.GloomSV = exports.OddishSV = void 0;
exports.PennySV = exports.IonoSV = exports.ArvenSV = exports.CharizardexSVSIR = exports.GardevoirexSVSIR = exports.MewexSVSIR = exports.PaldeanStudentSV2 = exports.PaldeanStudentSV1 = exports.JudgeSV = exports.SquawkabillyexSV = exports.PidgeotexSV = exports.NoivernexSV = exports.GardevoirexSV = exports.MewexSV = exports.EspathraexSV2 = exports.ToedscruelexSV = exports.ForretressexSV = exports.FlamigoSV = exports.SkwovetSV = exports.PelipperSV = void 0;
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
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_173_R_EN_LG.png';
    }
}
exports.RioluSV = RioluSV;
class LucarioSV extends lucario_1.Lucario {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_174_R_EN_LG.png';
    }
}
exports.LucarioSV = LucarioSV;
class HawluchaSV extends hawlucha_1.Hawlucha {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_175_R_EN_LG.png';
    }
}
exports.HawluchaSV = HawluchaSV;
class MurkrowSV extends murkrow_1.Murkrow {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_181_R_EN_LG.png';
    }
}
exports.MurkrowSV = MurkrowSV;
class ScizorSV extends scizor_1.Scizor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_191_R_EN_LG.png';
    }
}
exports.ScizorSV = ScizorSV;
class RevavroomSV extends revavroom_1.Revavroom {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_193_R_EN_LG.png';
    }
}
exports.RevavroomSV = RevavroomSV;
class NoibatSV extends noibat_1.Noibat {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_194_R_EN_LG.png';
    }
}
exports.NoibatSV = NoibatSV;
class PidgeySV extends pidgey_1.Pidgey {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_196_R_EN_LG.png';
    }
}
exports.PidgeySV = PidgeySV;
class PidgeottoSV extends pidgeotto_1.Pidgeotto {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_197_R_EN_LG.png';
    }
}
exports.PidgeottoSV = PidgeottoSV;
class DoduoSV extends doduo_1.Doduo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_199_R_EN_LG.png';
    }
}
exports.DoduoSV = DoduoSV;
class DodrioSV extends dodrio_1.Dodrio {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_200_R_EN_LG.png';
    }
}
exports.DodrioSV = DodrioSV;
class DittoSV extends ditto_1.Ditto {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_201_R_EN_LG.png';
    }
}
exports.DittoSV = DittoSV;
class SnorlaxSV extends snorlax_1.Snorlax {
    constructor() {
        super(...arguments);
        this.fullName = 'Snorlax PAF';
        this.set = 'PAF';
        this.setNumber = '202';
    }
}
exports.SnorlaxSV = SnorlaxSV;
class WingullSV extends wingull_1.Wingull {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_203_R_EN_LG.png';
    }
}
exports.WingullSV = WingullSV;
class PelipperSV extends pelipper_1.Pelipper {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_204_R_EN_LG.png';
    }
}
exports.PelipperSV = PelipperSV;
class SkwovetSV extends skwovet_1.Skwovet {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_205_R_EN_LG.png';
    }
}
exports.SkwovetSV = SkwovetSV;
class FlamigoSV extends flamigo_1.Flamigo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_211_R_EN_LG.png';
    }
}
exports.FlamigoSV = FlamigoSV;
//Shiny ex
class ForretressexSV extends forretress_ex_1.Forretressex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_212_R_EN_LG.png';
    }
}
exports.ForretressexSV = ForretressexSV;
class ToedscruelexSV extends toedscruel_ex_1.Toedscruelex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_213_R_EN_LG.png';
    }
}
exports.ToedscruelexSV = ToedscruelexSV;
class EspathraexSV2 extends espathra_ex_1.Espathraex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_214_R_EN_LG.png';
    }
}
exports.EspathraexSV2 = EspathraexSV2;
class MewexSV extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_216_R_EN_LG.png';
    }
}
exports.MewexSV = MewexSV;
class GardevoirexSV extends gardevoir_ex_1.Gardevoirex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_217_R_EN_LG.png';
    }
}
exports.GardevoirexSV = GardevoirexSV;
class NoivernexSV extends noivern_ex_1.Noivernex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_220_R_EN_LG.png';
    }
}
exports.NoivernexSV = NoivernexSV;
class PidgeotexSV extends pidgeot_ex_1.Pidgeotex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_221_R_EN_LG.png';
    }
}
exports.PidgeotexSV = PidgeotexSV;
class SquawkabillyexSV extends squawkabilly_ex_1.Squawkabillyex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_223_R_EN_LG.png';
    }
}
exports.SquawkabillyexSV = SquawkabillyexSV;
// FA Trainers
class JudgeSV extends judge_1.Judge {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_228_R_EN_LG.png';
    }
}
exports.JudgeSV = JudgeSV;
class PaldeanStudentSV1 extends students_in_paldea_1.StudentsInPaldea {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_230_R_EN_LG.png';
    }
}
exports.PaldeanStudentSV1 = PaldeanStudentSV1;
class PaldeanStudentSV2 extends students_in_paldea_1.StudentsInPaldea {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_231_R_EN_LG.png';
    }
}
exports.PaldeanStudentSV2 = PaldeanStudentSV2;
// SIR Pokemon
class MewexSVSIR extends mew_ex_1.Mewex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_232_R_EN_LG.png';
    }
}
exports.MewexSVSIR = MewexSVSIR;
class GardevoirexSVSIR extends gardevoir_ex_1.Gardevoirex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_233_R_EN_LG.png';
    }
}
exports.GardevoirexSVSIR = GardevoirexSVSIR;
class CharizardexSVSIR extends charizard_ex_1.Charizardex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/PAF/PAF_234_R_EN_LG.png';
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
class IonoSV extends iono_1.Iono {
    constructor() {
        super(...arguments);
        this.setNumber = '237';
        this.set = 'PAF';
        this.fullName = 'IonoSIR PAF';
    }
}
exports.IonoSV = IonoSV;
class PennySV extends penny_1.Penny {
    constructor() {
        super(...arguments);
        this.setNumber = '239';
        this.set = 'PAF';
        this.fullName = 'PennySIR PAF';
    }
}
exports.PennySV = PennySV;
