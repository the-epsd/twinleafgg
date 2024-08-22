"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagnemiteArt = exports.MagmarArt = exports.MagikarpArt = exports.MachopArt = exports.MachokeArt = exports.MachampArt = exports.LassArt = exports.KoffingArt = exports.KakunaArt = exports.KadabraArt = exports.JynxArt = exports.IvysaurArt = exports.ItemFinderArt = exports.ImpostorProfessorOakArt = exports.HitmonchanArt = exports.HaunterArt = exports.GyaradosArt = exports.GustOfWindArt = exports.GrowlitheArt = exports.FullHealArt = exports.FarfetchdArt = exports.EnergyRetrievalArt = exports.EnergyRemovalArt = exports.ElectrodeArt = exports.ElectabuzzArt = exports.DugtrioArt = exports.DrowzeeArt = exports.DratiniArt = exports.DragonairArt = exports.DoubleColorlessEnergyArt = exports.DoduoArt = exports.DiglettArt = exports.DewgongArt = exports.DevolutionSprayArt = exports.DefenderArt = exports.ComputerSearchArt = exports.ClefairyDollArt = exports.ClefairyArt = exports.CharmeleonArt = exports.CharmanderArt = exports.CharizardArt = exports.ChanseyArt = exports.CaterpieArt = exports.BulbasaurArt = exports.BlastoiseArt = exports.BillArt = exports.BeedrillArt = exports.ArcanineArt = exports.AlakazamArt = exports.AbraArt = void 0;
exports.ZapdosArt = exports.WeedleArt = exports.WartortleArt = exports.VulpixArt = exports.VoltorbArt = exports.VenusaurArt = exports.TangelaArt = exports.SwitchArt = exports.SuperPotionArt = exports.SuperEnergyRemovalArt = exports.SquirtleArt = exports.StaryuArt = exports.StarmieArt = exports.SeelArt = exports.ScoopUpArt = exports.SandshrewArt = exports.ReviveArt = exports.RattataArt = exports.RaticateArt = exports.RaichuArt = exports.ProfessorOakArt = exports.PotionArt = exports.PorygonArt = exports.PonytaArt = exports.PoliwrathArt = exports.PoliwhirlArt = exports.PoliwagArt = exports.PokemonTraderArt = exports.PokemonFluteArt = exports.PokemonCenterArt = exports.PokemonBreederArt = exports.PokedexArt = exports.PlusPowerArt = exports.PikachuArt = exports.PidgeyArt = exports.PidgeottoArt = exports.OnixArt = exports.NinetalesArt = exports.NidorinoArt = exports.NidoranMaleArt = exports.NidokingArt = exports.MewtwoArt = exports.MetapodArt = exports.MaintenanceArt = exports.MagnetonArt = void 0;
const magnemite_1 = require("./magnemite");
const abra_1 = require("./abra");
const alakazam_1 = require("./alakazam");
const arcanine_1 = require("./arcanine");
const beedrill_1 = require("./beedrill");
const bill_1 = require("./bill");
const blastoise_1 = require("./blastoise");
const bulbasaur_1 = require("./bulbasaur");
const caterpie_1 = require("./caterpie");
const chansey_1 = require("./chansey");
const charizard_1 = require("./charizard");
const charmander_1 = require("./charmander");
const charmeleon_1 = require("./charmeleon");
const clefairy_1 = require("./clefairy");
const computer_search_1 = require("./computer-search");
const dewgong_1 = require("./dewgong");
const diglett_1 = require("./diglett");
const doduo_1 = require("./doduo");
const dragonair_1 = require("./dragonair");
const dratini_1 = require("./dratini");
const drowzee_1 = require("./drowzee");
const dugtrio_1 = require("./dugtrio");
const electabuzz_1 = require("./electabuzz");
const electrode_1 = require("./electrode");
const energy_removal_1 = require("./energy-removal");
const energy_retrieval_1 = require("./energy-retrieval");
const farfetchd_1 = require("./farfetchd");
const growlithe_1 = require("./growlithe");
const gust_of_wind_1 = require("./gust-of-wind");
const gyarados_1 = require("./gyarados");
const haunter_1 = require("./haunter");
const hitmonchan_1 = require("./hitmonchan");
const item_finder_1 = require("./item-finder");
const ivysaur_1 = require("./ivysaur");
const jynx_1 = require("./jynx");
const kadabra_1 = require("./kadabra");
const kakuna_1 = require("./kakuna");
const koffing_1 = require("./koffing");
const lass_1 = require("./lass");
const machamp_1 = require("./machamp");
const machoke_1 = require("./machoke");
const machop_1 = require("./machop");
const magikarp_1 = require("./magikarp");
const magmar_1 = require("./magmar");
const magneton_1 = require("./magneton");
const maintenance_1 = require("./maintenance");
const mewtwo_1 = require("./mewtwo");
const nidoking_1 = require("./nidoking");
const nidorino_1 = require("./nidorino");
const ninetales_1 = require("./ninetales");
const pidgeotto_1 = require("./pidgeotto");
const pluspower_1 = require("./pluspower");
const pokemon_breeder_1 = require("./pokemon-breeder");
const pokemon_center_1 = require("./pokemon-center");
const pokemon_trader_1 = require("./pokemon-trader");
const poliwag_1 = require("./poliwag");
const poliwhirl_1 = require("./poliwhirl");
const poliwrath_1 = require("./poliwrath");
const professor_oak_1 = require("./professor-oak");
const raichu_1 = require("./raichu");
const raticate_1 = require("./raticate");
const rattata_1 = require("./rattata");
const scoop_up_1 = require("./scoop-up");
const seel_1 = require("./seel");
const squirtle_1 = require("./squirtle");
const super_energy_removal_1 = require("./super-energy-removal");
const super_potion_1 = require("./super-potion");
const switch_1 = require("./switch");
const venusaur_1 = require("./venusaur");
const wartortle_1 = require("./wartortle");
const zapdos_1 = require("./zapdos");
const metapod_1 = require("./metapod");
const nidoran_male_1 = require("./nidoran-male");
const onix_1 = require("./onix");
const pidgey_1 = require("./pidgey");
const pikachu_1 = require("./pikachu");
const ponyta_1 = require("./ponyta");
const staryu_1 = require("./staryu");
const sandshrew_1 = require("./sandshrew");
const tangela_1 = require("./tangela");
const starmie_1 = require("./starmie");
const voltorb_1 = require("./voltorb");
const vuplix_1 = require("./vuplix");
const weedle_1 = require("./weedle");
const clefairy_doll_1 = require("./clefairy-doll");
const devolution_spray_1 = require("./devolution-spray");
const impostor_professor_oak_1 = require("./impostor-professor-oak");
const defender_1 = require("./defender");
const full_heal_1 = require("./full-heal");
const pokedex_1 = require("./pokedex");
const pokemon_flute_1 = require("./pokemon-flute");
const potion_1 = require("./potion");
const revive_1 = require("./revive");
const porygon_1 = require("./porygon");
const double_colorless_energy_1 = require("../set-x-and-y/double-colorless-energy");
class AbraArt extends abra_1.Abra {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/abra-base-set-bs-43.jpg?fit=600%2C825&ssl=1';
    }
}
exports.AbraArt = AbraArt;
class AlakazamArt extends alakazam_1.Alakazam {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/alakazam-base-set-bs-1.jpg?fit=600%2C825&ssl=1';
    }
}
exports.AlakazamArt = AlakazamArt;
class ArcanineArt extends arcanine_1.Arcanine {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/arcanine-base-set-bs-23.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ArcanineArt = ArcanineArt;
class BeedrillArt extends beedrill_1.Beedrill {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/beedrill-base-set-bs-17.jpg?fit=600%2C825&ssl=1';
    }
}
exports.BeedrillArt = BeedrillArt;
class BillArt extends bill_1.Bill {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/bill-base-set-bs-91.jpg?fit=600%2C825&ssl=1';
    }
}
exports.BillArt = BillArt;
class BlastoiseArt extends blastoise_1.Blastoise {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/blastoise-base-set-bs-2.jpg?fit=600%2C825&ssl=1';
    }
}
exports.BlastoiseArt = BlastoiseArt;
class BulbasaurArt extends bulbasaur_1.Bulbasaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/bulbasaur-base-set-bs-44.jpg?fit=600%2C825&ssl=1';
    }
}
exports.BulbasaurArt = BulbasaurArt;
class CaterpieArt extends caterpie_1.Caterpie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/caterpie-base-set-bs-45.jpg?fit=600%2C825&ssl=1';
    }
}
exports.CaterpieArt = CaterpieArt;
class ChanseyArt extends chansey_1.Chansey {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/chansey-base-set-bs-3.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ChanseyArt = ChanseyArt;
class CharizardArt extends charizard_1.Charizard {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/charizard-base-set-bs-4.jpg?fit=600%2C825&ssl=1';
    }
}
exports.CharizardArt = CharizardArt;
class CharmanderArt extends charmander_1.Charmander {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/charmander-base-set-bs-46.jpg?fit=600%2C825&ssl=1';
    }
}
exports.CharmanderArt = CharmanderArt;
class CharmeleonArt extends charmeleon_1.Charmeleon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/charmeleon-base-set-bs-24.jpg?fit=600%2C825&ssl=1';
    }
}
exports.CharmeleonArt = CharmeleonArt;
class ClefairyArt extends clefairy_1.Clefairy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/clefairy-base-set-bs-5.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ClefairyArt = ClefairyArt;
class ClefairyDollArt extends clefairy_doll_1.ClefairyDoll {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/clefairy-doll-base-set-bs-70.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ClefairyDollArt = ClefairyDollArt;
class ComputerSearchArt extends computer_search_1.ComputerSearch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/computer-search-base-set-bs-71.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ComputerSearchArt = ComputerSearchArt;
class DefenderArt extends defender_1.Defender {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/defender-base-set-bs-80.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DefenderArt = DefenderArt;
class DevolutionSprayArt extends devolution_spray_1.DevolutionSpray {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/devolution-spray-base-set-bs-72.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DevolutionSprayArt = DevolutionSprayArt;
class DewgongArt extends dewgong_1.Dewgong {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/dewgong-base-set-bs-25.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DewgongArt = DewgongArt;
class DiglettArt extends diglett_1.Diglett {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/diglett-base-set-bs-47.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DiglettArt = DiglettArt;
class DoduoArt extends doduo_1.Doduo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/doduo-base-set-bs-48.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DoduoArt = DoduoArt;
class DoubleColorlessEnergyArt extends double_colorless_energy_1.DoubleColorlessEnergy {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/double-colorless-energy-base-set-bs-96.jpg?fit=600%2C825&ssl=1';
        this.set = 'BS';
        this.setNumber = '48';
        this.fullName = 'Double Colorless Energy BS';
    }
}
exports.DoubleColorlessEnergyArt = DoubleColorlessEnergyArt;
class DragonairArt extends dragonair_1.Dragonair {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/dragonair-base-set-bs-18.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DragonairArt = DragonairArt;
class DratiniArt extends dratini_1.Dratini {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/dratini-base-set-bs-26.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DratiniArt = DratiniArt;
class DrowzeeArt extends drowzee_1.Drowzee {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/drowzee-base-set-bs-49.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DrowzeeArt = DrowzeeArt;
class DugtrioArt extends dugtrio_1.Dugtrio {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/dugtrio-base-set-bs-19.jpg?fit=600%2C825&ssl=1';
    }
}
exports.DugtrioArt = DugtrioArt;
class ElectabuzzArt extends electabuzz_1.Electabuzz {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/electabuzz-base-set-bs-20.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ElectabuzzArt = ElectabuzzArt;
class ElectrodeArt extends electrode_1.Electrode {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/electrode-base-set-bs-21.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ElectrodeArt = ElectrodeArt;
class EnergyRemovalArt extends energy_removal_1.EnergyRemoval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/energy-removal-base-set-bs-92.jpg?fit=600%2C825&ssl=1';
    }
}
exports.EnergyRemovalArt = EnergyRemovalArt;
class EnergyRetrievalArt extends energy_retrieval_1.EnergyRetrieval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/energy-retrieval-base-set-bs-81.jpg?fit=600%2C825&ssl=1';
    }
}
exports.EnergyRetrievalArt = EnergyRetrievalArt;
class FarfetchdArt extends farfetchd_1.Farfetchd {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/farfetchd-base-set-bs-27.jpg?fit=600%2C825&ssl=01';
    }
}
exports.FarfetchdArt = FarfetchdArt;
class FullHealArt extends full_heal_1.FullHeal {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/full-heal-base-set-bs-82.jpg?fit=600%2C825&ssl=01';
    }
}
exports.FullHealArt = FullHealArt;
class GrowlitheArt extends growlithe_1.Growlithe {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/growlithe-base-set-bs-28.jpg?fit=600%2C825&ssl=01';
    }
}
exports.GrowlitheArt = GrowlitheArt;
class GustOfWindArt extends gust_of_wind_1.GustOfWind {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/gust-of-wind-base-set-bs-93.jpg?fit=600%2C825&ssl=01';
    }
}
exports.GustOfWindArt = GustOfWindArt;
class GyaradosArt extends gyarados_1.Gyarados {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/gyarados-base-set-bs-6.jpg?fit=600%2C825&ssl=1';
    }
}
exports.GyaradosArt = GyaradosArt;
class HaunterArt extends haunter_1.Haunter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/haunter-base-set-bs-29.jpg?fit=600%2C825&ssl=1';
    }
}
exports.HaunterArt = HaunterArt;
class HitmonchanArt extends hitmonchan_1.Hitmonchan {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/hitmonchan-base-set-bs-7.jpg?fit=600%2C825&ssl=1';
    }
}
exports.HitmonchanArt = HitmonchanArt;
class ImpostorProfessorOakArt extends impostor_professor_oak_1.ImpostorProfessorOak {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/impostor-professor-oak-base-set-bs-73.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ImpostorProfessorOakArt = ImpostorProfessorOakArt;
class ItemFinderArt extends item_finder_1.ItemFinder {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/item-finder-base-set-bs-74.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ItemFinderArt = ItemFinderArt;
class IvysaurArt extends ivysaur_1.Ivysaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/ivysaur-base-set-bs-30.jpg?fit=600%2C825&ssl=1';
    }
}
exports.IvysaurArt = IvysaurArt;
class JynxArt extends jynx_1.Jynx {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/jynx-base-set-bs-31.jpg?fit=600%2C825&ssl=1';
    }
}
exports.JynxArt = JynxArt;
class KadabraArt extends kadabra_1.Kadabra {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/kadabra-base-set-bs-32.jpg?fit=600%2C825&ssl=1';
    }
}
exports.KadabraArt = KadabraArt;
class KakunaArt extends kakuna_1.Kakuna {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/kakuna-base-set-bs-33.jpg?fit=600%2C825&ssl=1';
    }
}
exports.KakunaArt = KakunaArt;
class KoffingArt extends koffing_1.Koffing {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/koffing-base-set-bs-51.jpg?fit=600%2C825&ssl=1';
    }
}
exports.KoffingArt = KoffingArt;
class LassArt extends lass_1.Lass {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/lass-base-set-bs-75.jpg?fit=600%2C825&ssl=1';
    }
}
exports.LassArt = LassArt;
class MachampArt extends machamp_1.Machamp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/machamp-base-set-bs-8.jpg';
    }
}
exports.MachampArt = MachampArt;
class MachokeArt extends machoke_1.Machoke {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/machoke-base-set-bs-34.jpg';
    }
}
exports.MachokeArt = MachokeArt;
class MachopArt extends machop_1.Machop {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/machop-base-set-bs-52.jpg';
    }
}
exports.MachopArt = MachopArt;
class MagikarpArt extends magikarp_1.Magikarp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/magikarp-base-set-bs-35.jpg';
    }
}
exports.MagikarpArt = MagikarpArt;
class MagmarArt extends magmar_1.Magmar {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/magmar-base-set-bs-36.jpg';
    }
}
exports.MagmarArt = MagmarArt;
class MagnemiteArt extends magnemite_1.Magnemite {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/magnemite-base-set-bs-53.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MagnemiteArt = MagnemiteArt;
class MagnetonArt extends magneton_1.Magneton {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/magneton-base-set-bs-9.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MagnetonArt = MagnetonArt;
class MaintenanceArt extends maintenance_1.Maintenance {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/maintenance-base-set-bs-83.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MaintenanceArt = MaintenanceArt;
class MetapodArt extends metapod_1.Metapod {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/metapod-base-set-bs-54.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MetapodArt = MetapodArt;
class MewtwoArt extends mewtwo_1.Mewtwo {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/mewtwo-base-set-bs-10.jpg?fit=600%2C825&ssl=1';
    }
}
exports.MewtwoArt = MewtwoArt;
class NidokingArt extends nidoking_1.Nidoking {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/nidoking-base-set-bs-11.jpg';
    }
}
exports.NidokingArt = NidokingArt;
class NidoranMaleArt extends nidoran_male_1.NidoranMale {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/nidoran-male-base-set-bs-55.jpg';
    }
}
exports.NidoranMaleArt = NidoranMaleArt;
class NidorinoArt extends nidorino_1.Nidorino {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/nidorino-base-set-bs-37.jpg';
    }
}
exports.NidorinoArt = NidorinoArt;
class NinetalesArt extends ninetales_1.Ninetales {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/ninetales-base-set-bs-12.jpg?fit=600%2C825&ssl=1';
    }
}
exports.NinetalesArt = NinetalesArt;
class OnixArt extends onix_1.Onix {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/onix-base-set-bs-56.jpg?fit=600%2C825&ssl=1';
    }
}
exports.OnixArt = OnixArt;
class PidgeottoArt extends pidgeotto_1.Pidgeotto {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pidgeotto-base-set-bs-22.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PidgeottoArt = PidgeottoArt;
class PidgeyArt extends pidgey_1.Pidgey {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pidgey-base-set-bs-57.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PidgeyArt = PidgeyArt;
class PikachuArt extends pikachu_1.Pikachu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pikachu-base-set-bs-58.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PikachuArt = PikachuArt;
class PlusPowerArt extends pluspower_1.PlusPower {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pluspower-base-set-bs-84.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PlusPowerArt = PlusPowerArt;
class PokedexArt extends pokedex_1.Pokedex {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pokedex-base-set-bs-87.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokedexArt = PokedexArt;
class PokemonBreederArt extends pokemon_breeder_1.PokemonBreeder {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pokemon-breeder-base-set-bs-76.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokemonBreederArt = PokemonBreederArt;
class PokemonCenterArt extends pokemon_center_1.PokemonCenter {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pokemon-center-base-set-bs-85.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokemonCenterArt = PokemonCenterArt;
class PokemonFluteArt extends pokemon_flute_1.PokemonFlute {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pokemon-flute-base-set-bs-86.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokemonFluteArt = PokemonFluteArt;
class PokemonTraderArt extends pokemon_trader_1.PokemonTrader {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/pokemon-trader-base-set-bs-77.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PokemonTraderArt = PokemonTraderArt;
class PoliwagArt extends poliwag_1.Poliwag {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/poliwag-base-set-bs-59.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PoliwagArt = PoliwagArt;
class PoliwhirlArt extends poliwhirl_1.Poliwhirl {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/poliwhirl-base-set-bs-38.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PoliwhirlArt = PoliwhirlArt;
class PoliwrathArt extends poliwrath_1.Poliwrath {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/poliwrath-base-set-bs-13.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PoliwrathArt = PoliwrathArt;
class PonytaArt extends ponyta_1.Ponyta {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/ponyta-base-set-bs-60.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PonytaArt = PonytaArt;
class PorygonArt extends porygon_1.Porygon {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/porygon-base-set-bs-39.jpg';
    }
}
exports.PorygonArt = PorygonArt;
class PotionArt extends potion_1.Potion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/potion-base-set-bs-94.jpg?fit=600%2C825&ssl=1';
    }
}
exports.PotionArt = PotionArt;
class ProfessorOakArt extends professor_oak_1.ProfessorOak {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/professor-oak-base-set-bs-88.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ProfessorOakArt = ProfessorOakArt;
class RaichuArt extends raichu_1.Raichu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/raichu-base-set-bs-14.jpg';
    }
}
exports.RaichuArt = RaichuArt;
class RaticateArt extends raticate_1.Raticate {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/raticate-base-set-bs-40.jpg?fit=600%2C825&ssl=1';
    }
}
exports.RaticateArt = RaticateArt;
class RattataArt extends rattata_1.Rattata {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/rattata-base-set-bs-61.jpg?fit=600%2C825&ssl=1';
    }
}
exports.RattataArt = RattataArt;
class ReviveArt extends revive_1.Revive {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/revive-base-set-bs-89.jpg';
    }
}
exports.ReviveArt = ReviveArt;
class SandshrewArt extends sandshrew_1.Sandshrew {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/sandshrew-base-set-bs-62.jpg?fit=600%2C825&ssl=1';
    }
}
exports.SandshrewArt = SandshrewArt;
class ScoopUpArt extends scoop_up_1.ScoopUp {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/scoop-up-base-set-bs-78.jpg?fit=600%2C825&ssl=1';
    }
}
exports.ScoopUpArt = ScoopUpArt;
class SeelArt extends seel_1.Seel {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/seel-base-set-bs-41.jpg?fit=600%2C825&ssl=1';
    }
}
exports.SeelArt = SeelArt;
class StarmieArt extends starmie_1.Starmie {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/starmie-base-set-bs-64.jpg?fit=600%2C825&ssl=1';
    }
}
exports.StarmieArt = StarmieArt;
class StaryuArt extends staryu_1.Staryu {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/staryu-base-set-bs-65.jpg?fit=600%2C825&ssl=1';
    }
}
exports.StaryuArt = StaryuArt;
class SquirtleArt extends squirtle_1.Squirtle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/squirtle-base-set-bs-63.jpg?fit=600%2C825&ssl=1';
    }
}
exports.SquirtleArt = SquirtleArt;
class SuperEnergyRemovalArt extends super_energy_removal_1.SuperEnergyRemoval {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/super-energy-removal-base-set-bs-79.jpg?fit=600%2C825&ssl=1';
    }
}
exports.SuperEnergyRemovalArt = SuperEnergyRemovalArt;
class SuperPotionArt extends super_potion_1.SuperPotion {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pokemontcgarchive.files.wordpress.com/2018/10/super-potion-base-set-bs-90.jpg?w=4000&h=';
    }
}
exports.SuperPotionArt = SuperPotionArt;
class SwitchArt extends switch_1.Switch {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/switch-base-set-bs-95.jpg?fit=600%2C825&ssl=1';
    }
}
exports.SwitchArt = SwitchArt;
class TangelaArt extends tangela_1.Tangela {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/tangela-base-set-bs-66.jpg?fit=600%2C825&ssl=1';
    }
}
exports.TangelaArt = TangelaArt;
class VenusaurArt extends venusaur_1.Venusaur {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/venusaur-base-set-bs-15.jpg?fit=600%2C825&ssl=1';
    }
}
exports.VenusaurArt = VenusaurArt;
class VoltorbArt extends voltorb_1.Voltorb {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/voltorb-base-set-bs-67.jpg?fit=600%2C825&ssl=1';
    }
}
exports.VoltorbArt = VoltorbArt;
class VulpixArt extends vuplix_1.Vulpix {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/vulpix-base-set-bs-68.jpg?fit=600%2C825&ssl=1';
    }
}
exports.VulpixArt = VulpixArt;
class WartortleArt extends wartortle_1.Wartortle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/wartortle-base-set-bs-42.jpg?fit=600%2C825&ssl=1';
    }
}
exports.WartortleArt = WartortleArt;
class WeedleArt extends weedle_1.Weedle {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://i0.wp.com/pkmncards.com/wp-content/uploads/weedle-base-set-bs-69.jpg?fit=600%2C825&ssl=1';
    }
}
exports.WeedleArt = WeedleArt;
class ZapdosArt extends zapdos_1.Zapdos {
    constructor() {
        super(...arguments);
        this.cardImage = 'https://pkmncards.com/wp-content/uploads/zapdos-base-set-bs-16.jpg';
    }
}
exports.ZapdosArt = ZapdosArt;
