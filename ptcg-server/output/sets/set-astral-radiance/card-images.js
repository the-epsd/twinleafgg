"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegirockArt = exports.RegigigasArt = exports.RegielekiArt = exports.RegidragoArt = exports.RegiceArt = exports.RaltsArt = exports.RadiantHawluchaArt = exports.RadiantGreninjaArt = exports.OriginFormePalkiaVSTARArt = exports.OriginFormePalkiaVArt = exports.OriginFormeDialgaVSTARArt = exports.OriginFormeDialgaVArt = exports.MiltankArt = exports.MightyenaArt = exports.MantineArt = exports.MagnetonArt = exports.LuxrayVArt = exports.LucarioVArt = exports.KricketuneArt = exports.KricketotArt = exports.KleavorArt = exports.KeldeoArt = exports.JubilifeVillageArt = exports.IridaArt = exports.HisuianSamurottVSTARArt = exports.HisuianSamurottVArt = exports.HisuianQwilfishArt2 = exports.HisuianQwilfishArt = exports.HisuianOverqwilArt = exports.HisuianHeavyBallArt = exports.HisuianGrowlitheArt = exports.HisuianBasculinArt = exports.HisuianBasculegionArt = exports.HisuianArcanineArt = exports.GutsyPickaxeArt = exports.GrantArt = exports.GardeniasVigorArt = exports.GapejawBogArt = exports.GarchompVArt = exports.GalladeArt = exports.FeatherBallArt = exports.EnergyLotoArt = exports.DiancieArt = exports.DarkraiVSTARArt = exports.DarkraiVArt = exports.DarkPatchArt = exports.CylleneArt = exports.CancelingCologneArt = exports.BronzorArt = exports.AdamanArt = void 0;
exports.YanmaArt = exports.WyrdeerVArt = exports.UrsalunaArt = exports.TrekkingShoesArt = exports.TempleofSinnohArt = exports.SwitchCartArt = exports.SupereffectiveGlassesArt = exports.StarmieVArt = exports.SpicySeasonedCurryArt = exports.ShieldonArt = exports.RoxanneArt = exports.RegisteelArt = void 0;
const adaman_1 = require("./adaman");
const shieldon_1 = require("./shieldon");
const bronzor_1 = require("./bronzor");
const yanma_1 = require("./yanma");
const hisuian_growllithe_1 = require("./hisuian-growllithe");
const hisuian_overqwil_1 = require("./hisuian-overqwil");
const canceling_cologne_1 = require("./canceling-cologne");
const cyllene_1 = require("./cyllene");
const dark_patch_1 = require("./dark-patch");
const darkrai_v_1 = require("./darkrai-v");
const darkrai_vstar_1 = require("./darkrai-vstar");
const diancie_1 = require("./diancie");
const energy_loto_1 = require("./energy-loto");
const feather_ball_1 = require("./feather-ball");
const gallade_1 = require("./gallade");
const gapejaw_bog_1 = require("./gapejaw-bog");
const garchomp_v_1 = require("./garchomp-v");
const gardenias_vigor_1 = require("./gardenias-vigor");
const grant_1 = require("./grant");
const gutsy_pickaxe_1 = require("./gutsy-pickaxe");
const hisuian_arcanine_1 = require("./hisuian-arcanine");
const hisuian_basculin_1 = require("./hisuian-basculin");
const hisuian_heavy_ball_1 = require("./hisuian-heavy-ball");
const hisuian_samurott_v_1 = require("./hisuian-samurott-v");
const hisuian_samurott_vstar_1 = require("./hisuian-samurott-vstar");
const hisuian_basculegion_1 = require("./hisuian-basculegion");
const irida_1 = require("./irida");
const jubilife_village_1 = require("./jubilife-village");
const keldeo_1 = require("./keldeo");
const kleavor_1 = require("./kleavor");
const kricketot_1 = require("./kricketot");
const kricketune_1 = require("./kricketune");
const lucario_v_1 = require("./lucario-v");
const luxray_v_1 = require("./luxray-v");
const magneton_1 = require("./magneton");
const mantine_1 = require("./mantine");
const mightyena_1 = require("./mightyena");
const miltank_1 = require("./miltank");
const origin_forme_dialga_v_1 = require("./origin-forme-dialga-v");
const origin_forme_dialga_vstar_1 = require("./origin-forme-dialga-vstar");
const origin_forme_palkia_v_1 = require("./origin-forme-palkia-v");
const origin_forme_palkia_vstar_1 = require("./origin-forme-palkia-vstar");
const radiant_greninja_1 = require("./radiant-greninja");
const radiant_hawlucha_1 = require("./radiant-hawlucha");
const ralts_1 = require("./ralts");
const regice_1 = require("./regice");
const regidrago_1 = require("./regidrago");
const regieleki_1 = require("./regieleki");
const regigigas_1 = require("./regigigas");
const regirock_1 = require("./regirock");
const registeel_1 = require("./registeel");
const roxanne_1 = require("./roxanne");
const spicy_seasoned_curry_1 = require("./spicy-seasoned-curry");
const starmie_v_1 = require("./starmie-v");
const supereffective_glasses_1 = require("./supereffective-glasses");
const switch_cart_1 = require("./switch-cart");
const temple_of_sinnoh_1 = require("./temple-of-sinnoh");
const trekking_shoes_1 = require("./trekking-shoes");
const ursaluna_1 = require("./ursaluna");
const wyrdeer_v_1 = require("./wyrdeer-v");
const hisuian_qwilfish_1 = require("./hisuian-qwilfish");
const hisuian_qwilfish2_1 = require("./hisuian-qwilfish2");
class AdamanArt extends adaman_1.Adaman {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_135_R_EN_LG.png';
    }
}
exports.AdamanArt = AdamanArt;
class BronzorArt extends bronzor_1.Bronzor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_111_R_EN_LG.png';
    }
}
exports.BronzorArt = BronzorArt;
class CancelingCologneArt extends canceling_cologne_1.CancelingCologne {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_136_R_EN_LG.png';
    }
}
exports.CancelingCologneArt = CancelingCologneArt;
class CylleneArt extends cyllene_1.Cyllene {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_138_R_EN_LG.png';
    }
}
exports.CylleneArt = CylleneArt;
class DarkPatchArt extends dark_patch_1.DarkPatch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_139_R_EN_LG.png';
    }
}
exports.DarkPatchArt = DarkPatchArt;
class DarkraiVArt extends darkrai_v_1.DarkraiV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_098_R_EN_LG.png';
    }
}
exports.DarkraiVArt = DarkraiVArt;
class DarkraiVSTARArt extends darkrai_vstar_1.DarkraiVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_099_R_EN_LG.png';
    }
}
exports.DarkraiVSTARArt = DarkraiVSTARArt;
class DiancieArt extends diancie_1.Diancie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_068_R_EN_LG.png';
    }
}
exports.DiancieArt = DiancieArt;
class EnergyLotoArt extends energy_loto_1.EnergyLoto {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_140_R_EN.png';
    }
}
exports.EnergyLotoArt = EnergyLotoArt;
class FeatherBallArt extends feather_ball_1.FeatherBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_141_R_EN_LG.png';
    }
}
exports.FeatherBallArt = FeatherBallArt;
class GalladeArt extends gallade_1.Gallade {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_062_R_EN_LG.png';
    }
}
exports.GalladeArt = GalladeArt;
class GarchompVArt extends garchomp_v_1.GarchompV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_117_R_EN.png';
    }
}
exports.GarchompVArt = GarchompVArt;
class GapejawBogArt extends gapejaw_bog_1.GapejawBog {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_142_R_EN_LG.png';
    }
}
exports.GapejawBogArt = GapejawBogArt;
class GardeniasVigorArt extends gardenias_vigor_1.GardeniasVigor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_143_R_EN_LG.png';
    }
}
exports.GardeniasVigorArt = GardeniasVigorArt;
class GrantArt extends grant_1.Grant {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_144_R_EN_LG.png';
    }
}
exports.GrantArt = GrantArt;
class GutsyPickaxeArt extends gutsy_pickaxe_1.GutsyPickaxe {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_145_R_EN_LG.png';
    }
}
exports.GutsyPickaxeArt = GutsyPickaxeArt;
class HisuianArcanineArt extends hisuian_arcanine_1.HisuianArcanine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_071_R_EN_LG.png';
    }
}
exports.HisuianArcanineArt = HisuianArcanineArt;
class HisuianBasculegionArt extends hisuian_basculegion_1.HisuianBasculegion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_044_R_EN_LG.png';
    }
}
exports.HisuianBasculegionArt = HisuianBasculegionArt;
class HisuianBasculinArt extends hisuian_basculin_1.HisuianBasculin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_043_R_EN_LG.png';
    }
}
exports.HisuianBasculinArt = HisuianBasculinArt;
class HisuianGrowlitheArt extends hisuian_growllithe_1.HisuianGrowlithe {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_070_R_EN_LG.png';
    }
}
exports.HisuianGrowlitheArt = HisuianGrowlitheArt;
class HisuianHeavyBallArt extends hisuian_heavy_ball_1.HisuianHeavyBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_146_R_EN_LG.png';
    }
}
exports.HisuianHeavyBallArt = HisuianHeavyBallArt;
class HisuianOverqwilArt extends hisuian_overqwil_1.HisuianOverqwil {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_090_R_EN_LG.png';
    }
}
exports.HisuianOverqwilArt = HisuianOverqwilArt;
class HisuianQwilfishArt extends hisuian_qwilfish_1.HisuianQwilfish {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_088_R_EN_LG.png';
    }
}
exports.HisuianQwilfishArt = HisuianQwilfishArt;
class HisuianQwilfishArt2 extends hisuian_qwilfish2_1.HisuianQwilfish2 {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_089_R_EN_LG.png';
    }
}
exports.HisuianQwilfishArt2 = HisuianQwilfishArt2;
class HisuianSamurottVArt extends hisuian_samurott_v_1.HisuianSamurottV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_101_R_EN_LG.png';
    }
}
exports.HisuianSamurottVArt = HisuianSamurottVArt;
class HisuianSamurottVSTARArt extends hisuian_samurott_vstar_1.HisuianSamurottVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_102_R_EN_LG.png';
    }
}
exports.HisuianSamurottVSTARArt = HisuianSamurottVSTARArt;
class IridaArt extends irida_1.Irida {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_147_R_EN_LG.png';
    }
}
exports.IridaArt = IridaArt;
class JubilifeVillageArt extends jubilife_village_1.JubilifeVillage {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_148_R_EN_LG.png';
    }
}
exports.JubilifeVillageArt = JubilifeVillageArt;
class KeldeoArt extends keldeo_1.Keldeo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_045_R_EN_LG.png';
    }
}
exports.KeldeoArt = KeldeoArt;
class KleavorArt extends kleavor_1.Kleavor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_085_R_EN_LG.png';
    }
}
exports.KleavorArt = KleavorArt;
class KricketotArt extends kricketot_1.Kricketot {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_009_R_EN.png';
    }
}
exports.KricketotArt = KricketotArt;
class KricketuneArt extends kricketune_1.Kricketune {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_010_R_EN_LG.png';
    }
}
exports.KricketuneArt = KricketuneArt;
class LucarioVArt extends lucario_v_1.LucarioV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_078_R_EN_LG.png';
    }
}
exports.LucarioVArt = LucarioVArt;
class LuxrayVArt extends luxray_v_1.LuxrayV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_050_R_EN_LG.png';
    }
}
exports.LuxrayVArt = LuxrayVArt;
class MagnetonArt extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_106_R_EN_LG.png';
    }
}
exports.MagnetonArt = MagnetonArt;
class MantineArt extends mantine_1.Mantine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_034_R_EN_LG.png';
    }
}
exports.MantineArt = MantineArt;
class MightyenaArt extends mightyena_1.Mightyena {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_096_R_EN_LG.png';
    }
}
exports.MightyenaArt = MightyenaArt;
class MiltankArt extends miltank_1.Miltank {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_126_R_EN_LG.png';
    }
}
exports.MiltankArt = MiltankArt;
class OriginFormeDialgaVArt extends origin_forme_dialga_v_1.OriginFormeDialgaV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_113_R_EN_LG.png';
    }
}
exports.OriginFormeDialgaVArt = OriginFormeDialgaVArt;
class OriginFormeDialgaVSTARArt extends origin_forme_dialga_vstar_1.OriginFormeDialgaVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_114_R_EN_LG.png';
    }
}
exports.OriginFormeDialgaVSTARArt = OriginFormeDialgaVSTARArt;
class OriginFormePalkiaVArt extends origin_forme_palkia_v_1.OriginFormePalkiaV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_039_R_EN_LG.png';
    }
}
exports.OriginFormePalkiaVArt = OriginFormePalkiaVArt;
class OriginFormePalkiaVSTARArt extends origin_forme_palkia_vstar_1.OriginFormePalkiaVSTAR {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_040_R_EN_LG.png';
    }
}
exports.OriginFormePalkiaVSTARArt = OriginFormePalkiaVSTARArt;
class RadiantGreninjaArt extends radiant_greninja_1.RadiantGreninja {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_046_R_EN_LG.png';
    }
}
exports.RadiantGreninjaArt = RadiantGreninjaArt;
class RadiantHawluchaArt extends radiant_hawlucha_1.RadiantHawlucha {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_081_R_EN_LG.png';
    }
}
exports.RadiantHawluchaArt = RadiantHawluchaArt;
class RaltsArt extends ralts_1.Ralts {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_060_R_EN_LG.png';
    }
}
exports.RaltsArt = RaltsArt;
class RegiceArt extends regice_1.Regice {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_037_R_EN_LG.png';
    }
}
exports.RegiceArt = RegiceArt;
class RegidragoArt extends regidrago_1.Regidrago {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_118_R_EN_LG.png';
    }
}
exports.RegidragoArt = RegidragoArt;
class RegielekiArt extends regieleki_1.Regieleki {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_051_R_EN_LG.png';
    }
}
exports.RegielekiArt = RegielekiArt;
class RegigigasArt extends regigigas_1.Regigigas {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_130_R_EN_LG.png';
    }
}
exports.RegigigasArt = RegigigasArt;
class RegirockArt extends regirock_1.Regirock {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_075_R_EN_LG.png';
    }
}
exports.RegirockArt = RegirockArt;
class RegisteelArt extends registeel_1.Registeel {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_108_R_EN_LG.png';
    }
}
exports.RegisteelArt = RegisteelArt;
class RoxanneArt extends roxanne_1.Roxanne {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_150_R_EN_LG.png';
    }
}
exports.RoxanneArt = RoxanneArt;
class ShieldonArt extends shieldon_1.Shieldon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_109_R_EN_LG.png';
    }
}
exports.ShieldonArt = ShieldonArt;
class SpicySeasonedCurryArt extends spicy_seasoned_curry_1.SpicySeasonedCurry {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_151_R_EN_LG.png';
    }
}
exports.SpicySeasonedCurryArt = SpicySeasonedCurryArt;
class StarmieVArt extends starmie_v_1.StarmieV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_030_R_EN_LG.png';
    }
}
exports.StarmieVArt = StarmieVArt;
class SupereffectiveGlassesArt extends supereffective_glasses_1.SupereffectiveGlasses {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_152_R_EN_LG.png';
    }
}
exports.SupereffectiveGlassesArt = SupereffectiveGlassesArt;
class SwitchCartArt extends switch_cart_1.SwitchCart {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_154_R_EN_LG.png';
    }
}
exports.SwitchCartArt = SwitchCartArt;
class TempleofSinnohArt extends temple_of_sinnoh_1.TempleofSinnoh {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_155_R_EN_LG.png';
    }
}
exports.TempleofSinnohArt = TempleofSinnohArt;
class TrekkingShoesArt extends trekking_shoes_1.TrekkingShoes {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_156_R_EN_LG.png';
    }
}
exports.TrekkingShoesArt = TrekkingShoesArt;
class UrsalunaArt extends ursaluna_1.Ursaluna {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_124_R_EN_LG.png';
    }
}
exports.UrsalunaArt = UrsalunaArt;
class WyrdeerVArt extends wyrdeer_v_1.WyrdeerV {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_134_R_EN_LG.png';
    }
}
exports.WyrdeerVArt = WyrdeerVArt;
class YanmaArt extends yanma_1.Yanma {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/ASR/ASR_006_R_EN_LG.png';
    }
}
exports.YanmaArt = YanmaArt;
