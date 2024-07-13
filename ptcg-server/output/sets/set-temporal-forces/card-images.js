"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PikachuArt = exports.PalafinArt = exports.NeoUpperEnergyArt = exports.MrMimeArt = exports.MortysConvictionArt = exports.MistEnergyArt = exports.MiraidonArt = exports.MiraidonexArt = exports.MinccinoArt = exports.MetagrossArt = exports.MetangArt = exports.MasterBallArt = exports.MaximumBeltArt = exports.KoraidonArt = exports.KoraidonexArt = exports.IronThornsArt = exports.IronLeavesexArt = exports.IronHandsArt = exports.IronCrownexArt = exports.HerosCapeArt = exports.HeavyBatonArt = exports.HaunterArt = exports.HandTrimmerArt = exports.GrotleArt = exports.GougingFireexArt = exports.GengarexArt = exports.GastlyArt = exports.GreatTuskArt = exports.FutureBoosterEnergyCapsuleArt = exports.FullMetalLabArt = exports.FlutterManeArt = exports.FeraligatrArt = exports.ExplorersGuidanceArt = exports.EriArt = exports.EmergencyBoardArt = exports.DuosionArt = exports.DunsparceArt = exports.DudunsparceArt = exports.DrumsOfAwakeningArt = exports.DrilburArt = exports.DeliveryBoxArt = exports.CryptomaniacsDecipheringArt = exports.CroconawArt = exports.CinccinoArt = exports.ChatotArt = exports.CharjabugArt = exports.BuddyBuddyPoffinArt = exports.BiancasDevotionArt = exports.BeldumArt = exports.AncientBoosterEnergyCapsuleArt = void 0;
exports.WalkingWakeexArt = exports.VikavoltArt = exports.VictiniArt = exports.TurtwigArt = exports.TotodileArt = exports.TorterraexArt = exports.SolosisArt = exports.SkittyArt = exports.SandyShocksArt = exports.SalvatoreArt = exports.SableyeArt = exports.RoaringMoonArt = exports.ReuniclusArt = exports.RellorArt = exports.RebootPodArt = exports.RaichuArt = exports.RagingBoltexArt = exports.RabscaArt = exports.PrimeCatcherArt = void 0;
const ancient_booster_energy_capsule_1 = require("../set-paradox-rift/ancient-booster-energy-capsule");
const future_booster_energy_capsule_1 = require("../set-paradox-rift/future-booster-energy-capsule");
const beldum_1 = require("./beldum");
const biancas_devotion_1 = require("./biancas-devotion");
const buddy_buddy_poffin_1 = require("./buddy-buddy-poffin");
const charjabug_1 = require("./charjabug");
const chatot_1 = require("./chatot");
const cincinno_1 = require("./cincinno");
const croconaw_1 = require("./croconaw");
const cryptomaniacs_deciphering_1 = require("./cryptomaniacs-deciphering");
const delivery_box_1 = require("./delivery-box");
const drilbur_1 = require("./drilbur");
const drums_of_awakening_1 = require("./drums-of-awakening");
const dudunsparce_1 = require("./dudunsparce");
const dunsparce_1 = require("./dunsparce");
const duosion_1 = require("./duosion");
const emergency_board_1 = require("./emergency-board");
const eri_1 = require("./eri");
const explorers_guidance_1 = require("./explorers-guidance");
const feraligatr_1 = require("./feraligatr");
const flutter_mane_1 = require("./flutter-mane");
const full_metal_lab_1 = require("./full-metal-lab");
const gastly_1 = require("./gastly");
const gengar_ex_1 = require("./gengar-ex");
const gouging_fire_ex_1 = require("./gouging-fire-ex");
const great_tusk_1 = require("./great-tusk");
const grotle_1 = require("./grotle");
const hand_trimmer_1 = require("./hand-trimmer");
const haunter_1 = require("./haunter");
const heavy_baton_1 = require("./heavy-baton");
const heros_cape_1 = require("./heros-cape");
const iron_crown_ex_1 = require("./iron-crown-ex");
const iron_hands_1 = require("./iron-hands");
const iron_leaves_ex_1 = require("./iron-leaves-ex");
const iron_thorns_1 = require("./iron-thorns");
const koraidon_1 = require("./koraidon");
const koraidon_ex_1 = require("./koraidon-ex");
const master_ball_1 = require("./master-ball");
const maximum_belt_1 = require("./maximum-belt");
const metagross_1 = require("./metagross");
const metang_1 = require("./metang");
const minccino_1 = require("./minccino");
const miraidon_1 = require("./miraidon");
const miraidon_ex_1 = require("./miraidon-ex");
const mist_energy_1 = require("./mist-energy");
const mortys_conviction_1 = require("./mortys-conviction");
const mr_mime_1 = require("./mr-mime");
const neo_upper_energy_1 = require("./neo-upper-energy");
const pikachu_1 = require("./pikachu");
const prime_catcher_1 = require("./prime-catcher");
const rabsca_1 = require("./rabsca");
const raging_bolt_ex_1 = require("./raging-bolt-ex");
const raichu_1 = require("./raichu");
const reboot_pod_1 = require("./reboot-pod");
const rellor_1 = require("./rellor");
const reuniclus_1 = require("./reuniclus");
const roaring_moon_1 = require("./roaring-moon");
const sableye_1 = require("./sableye");
const salvatore_1 = require("./salvatore");
const sandy_shocks_1 = require("./sandy-shocks");
const skitty_1 = require("./skitty");
const solosis_1 = require("./solosis");
const TEF_49_Palafin_1 = require("./TEF_49_Palafin");
const torterra_ex_1 = require("./torterra-ex");
const totodile_1 = require("./totodile");
const turtwig_1 = require("./turtwig");
const victini_1 = require("./victini");
const vikavolt_1 = require("./vikavolt");
const walking_wake_ex_1 = require("./walking-wake-ex");
class AncientBoosterEnergyCapsuleArt extends ancient_booster_energy_capsule_1.AncientBoosterEnergyCapsule {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_140_R_EN.png';
        this.fullName = 'Ancient Booster Energy Capsule TEF';
        this.set = 'TEF';
        this.setNumber = '140';
    }
}
exports.AncientBoosterEnergyCapsuleArt = AncientBoosterEnergyCapsuleArt;
class BeldumArt extends beldum_1.Beldum {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_113_R_EN.png';
    }
}
exports.BeldumArt = BeldumArt;
class BiancasDevotionArt extends biancas_devotion_1.BiancasDevotion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_142_R_EN.png';
    }
}
exports.BiancasDevotionArt = BiancasDevotionArt;
class BuddyBuddyPoffinArt extends buddy_buddy_poffin_1.BuddyBuddyPoffin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_144_R_EN.png';
    }
}
exports.BuddyBuddyPoffinArt = BuddyBuddyPoffinArt;
class CharjabugArt extends charjabug_1.Charjabug {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_055_R_EN.png';
    }
}
exports.CharjabugArt = CharjabugArt;
class ChatotArt extends chatot_1.Chatot {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_132_R_EN.png';
    }
}
exports.ChatotArt = ChatotArt;
class CinccinoArt extends cincinno_1.Cinccino {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_137_R_EN.png';
    }
}
exports.CinccinoArt = CinccinoArt;
class CroconawArt extends croconaw_1.Croconaw {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_040_R_EN.png';
    }
}
exports.CroconawArt = CroconawArt;
class CryptomaniacsDecipheringArt extends cryptomaniacs_deciphering_1.CryptomaniacsDeciphering {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_145_R_EN.png';
    }
}
exports.CryptomaniacsDecipheringArt = CryptomaniacsDecipheringArt;
class DeliveryBoxArt extends delivery_box_1.DeliveryBox {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_143_R_EN.png';
    }
}
exports.DeliveryBoxArt = DeliveryBoxArt;
class DrilburArt extends drilbur_1.Drilbur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_085_R_EN.png';
    }
}
exports.DrilburArt = DrilburArt;
class DrumsOfAwakeningArt extends drums_of_awakening_1.DrumsOfAwakening {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_141_R_EN.png';
    }
}
exports.DrumsOfAwakeningArt = DrumsOfAwakeningArt;
class DudunsparceArt extends dudunsparce_1.Dudunsparce {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_129_R_EN.png';
    }
}
exports.DudunsparceArt = DudunsparceArt;
class DunsparceArt extends dunsparce_1.Dunsparce {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_128_R_EN.png';
    }
}
exports.DunsparceArt = DunsparceArt;
class DuosionArt extends duosion_1.Duosion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_071_R_EN.png';
    }
}
exports.DuosionArt = DuosionArt;
class EmergencyBoardArt extends emergency_board_1.EmergencyBoard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_159_R_EN.png';
    }
}
exports.EmergencyBoardArt = EmergencyBoardArt;
class EriArt extends eri_1.Eri {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_146_R_EN.png';
    }
}
exports.EriArt = EriArt;
class ExplorersGuidanceArt extends explorers_guidance_1.ExplorersGuidance {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_147_R_EN.png';
    }
}
exports.ExplorersGuidanceArt = ExplorersGuidanceArt;
class FeraligatrArt extends feraligatr_1.Feraligatr {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_041_R_EN.png';
    }
}
exports.FeraligatrArt = FeraligatrArt;
class FlutterManeArt extends flutter_mane_1.FlutterMane {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_078_R_EN.png';
    }
}
exports.FlutterManeArt = FlutterManeArt;
class FullMetalLabArt extends full_metal_lab_1.FullMetalLab {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_148_R_EN_LG.png';
    }
}
exports.FullMetalLabArt = FullMetalLabArt;
class FutureBoosterEnergyCapsuleArt extends future_booster_energy_capsule_1.FutureBoosterEnergyCapsule {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_149_R_EN.png';
        this.fullName = 'Future Booster Energy Capsule TEF';
        this.set = 'TEF';
        this.setNumber = '149';
    }
}
exports.FutureBoosterEnergyCapsuleArt = FutureBoosterEnergyCapsuleArt;
class GreatTuskArt extends great_tusk_1.GreatTusk {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_097_R_EN.png';
    }
}
exports.GreatTuskArt = GreatTuskArt;
class GastlyArt extends gastly_1.Gastly {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_102_R_EN.png';
    }
}
exports.GastlyArt = GastlyArt;
class GengarexArt extends gengar_ex_1.Gengarex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_104_R_EN.png';
    }
}
exports.GengarexArt = GengarexArt;
class GougingFireexArt extends gouging_fire_ex_1.GougingFireex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_038_R_EN.png';
    }
}
exports.GougingFireexArt = GougingFireexArt;
class GrotleArt extends grotle_1.Grotle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_011_R_EN.png';
    }
}
exports.GrotleArt = GrotleArt;
class HandTrimmerArt extends hand_trimmer_1.HandTrimmer {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_150_R_EN.png';
    }
}
exports.HandTrimmerArt = HandTrimmerArt;
class HaunterArt extends haunter_1.Haunter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_103_R_EN.png';
    }
}
exports.HaunterArt = HaunterArt;
class HeavyBatonArt extends heavy_baton_1.HeavyBaton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_151_R_EN.png';
    }
}
exports.HeavyBatonArt = HeavyBatonArt;
class HerosCapeArt extends heros_cape_1.HerosCape {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_152_R_EN.png';
    }
}
exports.HerosCapeArt = HerosCapeArt;
class IronCrownexArt extends iron_crown_ex_1.IronCrownex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_081_R_EN.png';
    }
}
exports.IronCrownexArt = IronCrownexArt;
class IronHandsArt extends iron_hands_1.IronHands {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_061_R_EN.png';
    }
}
exports.IronHandsArt = IronHandsArt;
class IronLeavesexArt extends iron_leaves_ex_1.IronLeavesex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_025_R_EN.png';
    }
}
exports.IronLeavesexArt = IronLeavesexArt;
class IronThornsArt extends iron_thorns_1.IronThorns {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_062_R_EN.png';
    }
}
exports.IronThornsArt = IronThornsArt;
class KoraidonexArt extends koraidon_ex_1.Koraidonex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_120_R_EN.png';
    }
}
exports.KoraidonexArt = KoraidonexArt;
class KoraidonArt extends koraidon_1.Koraidon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_119_R_EN.png';
    }
}
exports.KoraidonArt = KoraidonArt;
class MaximumBeltArt extends maximum_belt_1.MaximumBelt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_154_R_EN.png';
    }
}
exports.MaximumBeltArt = MaximumBeltArt;
class MasterBallArt extends master_ball_1.MasterBall {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_153_R_EN.png';
    }
}
exports.MasterBallArt = MasterBallArt;
class MetangArt extends metang_1.Metang {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_114_R_EN.png';
    }
}
exports.MetangArt = MetangArt;
class MetagrossArt extends metagross_1.Metagross {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_115_R_EN.png';
    }
}
exports.MetagrossArt = MetagrossArt;
class MinccinoArt extends minccino_1.Minccino {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_136_R_EN.png';
    }
}
exports.MinccinoArt = MinccinoArt;
class MiraidonexArt extends miraidon_ex_1.Miraidonex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_122_R_EN.png';
    }
}
exports.MiraidonexArt = MiraidonexArt;
class MiraidonArt extends miraidon_1.Miraidon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_121_R_EN.png';
    }
}
exports.MiraidonArt = MiraidonArt;
class MistEnergyArt extends mist_energy_1.MistEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_161_R_EN.png';
    }
}
exports.MistEnergyArt = MistEnergyArt;
class MortysConvictionArt extends mortys_conviction_1.MortysConviction {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_155_R_EN.png';
    }
}
exports.MortysConvictionArt = MortysConvictionArt;
class MrMimeArt extends mr_mime_1.MrMime {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_063_R_EN.png';
    }
}
exports.MrMimeArt = MrMimeArt;
class NeoUpperEnergyArt extends neo_upper_energy_1.NeoUpperEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_162_R_EN.png';
    }
}
exports.NeoUpperEnergyArt = NeoUpperEnergyArt;
class PalafinArt extends TEF_49_Palafin_1.Palafin {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_049_R_EN_LG.png';
    }
}
exports.PalafinArt = PalafinArt;
class PikachuArt extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_051_R_EN.png';
    }
}
exports.PikachuArt = PikachuArt;
class PrimeCatcherArt extends prime_catcher_1.PrimeCatcher {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_157_R_EN.png';
    }
}
exports.PrimeCatcherArt = PrimeCatcherArt;
class RabscaArt extends rabsca_1.Rabsca {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_024_R_EN.png';
    }
}
exports.RabscaArt = RabscaArt;
class RagingBoltexArt extends raging_bolt_ex_1.RagingBoltex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_123_R_EN.png';
    }
}
exports.RagingBoltexArt = RagingBoltexArt;
class RaichuArt extends raichu_1.Raichu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_052_R_EN.png';
    }
}
exports.RaichuArt = RaichuArt;
class RebootPodArt extends reboot_pod_1.RebootPod {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_158_R_EN.png';
    }
}
exports.RebootPodArt = RebootPodArt;
class RellorArt extends rellor_1.Rellor {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_023_R_EN.png';
    }
}
exports.RellorArt = RellorArt;
class ReuniclusArt extends reuniclus_1.Reuniclus {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_072_R_EN.png';
    }
}
exports.ReuniclusArt = ReuniclusArt;
class RoaringMoonArt extends roaring_moon_1.RoaringMoon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_109_R_EN.png';
    }
}
exports.RoaringMoonArt = RoaringMoonArt;
class SableyeArt extends sableye_1.Sableye {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_107_R_EN.png';
    }
}
exports.SableyeArt = SableyeArt;
class SalvatoreArt extends salvatore_1.Salvatore {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_160_R_EN.png';
    }
}
exports.SalvatoreArt = SalvatoreArt;
class SandyShocksArt extends sandy_shocks_1.SandyShocks {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_098_R_EN_LG.png';
    }
}
exports.SandyShocksArt = SandyShocksArt;
class SkittyArt extends skitty_1.Skitty {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_130_R_EN.png';
    }
}
exports.SkittyArt = SkittyArt;
class SolosisArt extends solosis_1.Solosis {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_070_R_EN.png';
    }
}
exports.SolosisArt = SolosisArt;
class TorterraexArt extends torterra_ex_1.Torterraex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_012_R_EN.png';
    }
}
exports.TorterraexArt = TorterraexArt;
class TotodileArt extends totodile_1.Totodile {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_039_R_EN.png';
    }
}
exports.TotodileArt = TotodileArt;
class TurtwigArt extends turtwig_1.Turtwig {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_010_R_EN.png';
    }
}
exports.TurtwigArt = TurtwigArt;
class VictiniArt extends victini_1.Victini {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_030_R_EN.png';
    }
}
exports.VictiniArt = VictiniArt;
class VikavoltArt extends vikavolt_1.Vikavolt {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_056_R_EN.png';
    }
}
exports.VikavoltArt = VikavoltArt;
class WalkingWakeexArt extends walking_wake_ex_1.WalkingWakeex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/TEF/TEF_050_R_EN.png';
    }
}
exports.WalkingWakeexArt = WalkingWakeexArt;
