import { Card } from '../../game/store/card/card';
import { Ampharos } from './ampharos';
import { Avalugg } from './avalugg';
import { AzsTranquility } from './azs-tranquility';
import { Baltoy } from './baltoy';
import { Beedrillex } from './beedrill-ex';
import { Beldum } from './beldum';
import { Bergmite } from './bergmite';
import { BigCatchNet } from './big-catch-net';
import { Braixen } from './braixen';
import { BubbleWaterEnergy } from './bubble-water-energy';
import { Carnivine } from './carnivine';
import { Chespin } from './chespin';
import { Chesnaught } from './chesnaught';
import { Claydol } from './claydol';
import { Cobalionex } from './cobalion-ex';
import { Crobat } from './crobat';
import { Deoxys } from './deoxys';
import { Deoxys2 } from './deoxys-2';
import { Deoxys3 } from './deoxys-3';
import { Deoxys4 } from './deoxys-4';
import { Delibird } from './delibird';
import { Delphox } from './delphox';
import { Donphan } from './donphan';
import { Emolga } from './emolga';
import { Espurr } from './espurr';
import { Fennekin } from './fennekin';
import { Ferroseed } from './ferroseed';
import { Ferrothorn } from './ferrothorn';
import { BookOfTransformation } from './book-of-transformation';
import { Cinccinoex } from './cinccino-ex';
import { Emma } from './emma';
import { Flaaffy } from './flaaffy';
import { Froakie } from './froakie';
import { Frogadier } from './frogadier';
import { Garbodor } from './garbodor';
import { Goodra } from './goodra';
import { Golbat } from './golbat';
import { Golisopod } from './golisopod';
import { Goomy } from './goomy';
import { Gourgeistex } from './gourgeist-ex';
import { HoOh } from './ho-oh';
import { HyperrogueAngeFloette } from './hyperrogue-ange-floette';
import { Kakuna } from './kakuna';
import { Keldeo } from './keldeo';
import { Litleo } from './litleo';
import { MagnetMetalEnergy } from './magnet-metal-energy';
import { Mareep } from './mareep';
import { MegaGalladeex } from './mega-gallade-ex';
import { MegaFloetteex } from './mega-floette-ex';
import { MegaGreninjaex } from './mega-greninja-ex';
import { MegaPyroarex } from './mega-pyroar-ex';
import { MegaDragalgeex } from './mega-dragalge-ex';
import { Metagross } from './metagross';
import { Metang } from './metang';
import { Meowstic } from './meowstic';
import { Minccino } from './minccino';
import { NitroFireEnergy } from './nitro-fire-energy';
import { Ninetales } from './ninetales';
import { Octillery } from './octillery';
import { Phanpy } from './phanpy';
import { Phantump } from './phantump';
import { Patrat } from './patrat';
import { Philippe } from './philippe';
import { RoxiesPerformance } from './roxies-performance';
import { PrismTower } from './prism-tower';
import { Pumpkaboo } from './pumpkaboo';
import { Quilladin } from './quilladin';
import { Qwilfish } from './qwilfish';
import { Remoraid } from './remoraid';
import { Sliggoo } from './sliggoo';
import { Skrelp } from './skrelp';
import { SpecialRedCard, SpecialRedCardFA } from './special-red-card';
import { SurfingBeach } from './surfing-beach';
import { Skuntank } from './skuntank';
import { Stunky } from './stunky';
import { Sudowoodo } from './sudowoodo';
import { Tauros } from './tauros';
import { Trevenant } from './trevenant';
import { Trubbish } from './trubbish';
import { Vulpix } from './vulpix';
import { Watchog } from './watchog';
import { Weedle } from './weedle';
import { Wimpod } from './wimpod';
import { Xerneas } from './xerneas';
import { Zubat } from './zubat';

export const setChaosRising: Card[] = [
  new Weedle(),      // 1
  new Kakuna(),      // 2
  new Beedrillex(),  // 3
  new Carnivine(),   // 4
  new Chespin(),     // 5
  new Quilladin(),   // 6
  new Chesnaught(),  // 7
  new Vulpix(),      // 8
  new Ninetales(),   // 9
  new HoOh(),        // 10
  new Fennekin(),    // 11
  new Braixen(),     // 12
  new Delphox(),     // 13
  new Litleo(),      // 14
  new MegaPyroarex(),// 15
  new Remoraid(),    // 16
  new Octillery(),   // 17
  new Delibird(),    // 18
  new Keldeo(),      // 19
  new Froakie(),     // 20
  new Frogadier(),   // 21
  new MegaGreninjaex(),// 22
  new Bergmite(),    // 23
  new Avalugg(),     // 24
  new Wimpod(),      // 25
  new Golisopod(),   // 26
  new Mareep(),      // 27
  new Flaaffy(),     // 28
  new Ampharos(),    // 29
  new Emolga(),      // 30
  new Deoxys(),      // 31
  new Deoxys2(),     // 32
  new Deoxys3(),     // 33
  new Deoxys4(),     // 34
  new MegaFloetteex(),// 35
  new Espurr(),      // 36
  new Meowstic(),    // 37
  new Phantump(),    // 38
  new Trevenant(),   // 39
  new Pumpkaboo(),   // 40
  new Gourgeistex(), // 41
  new Xerneas(),     // 42
  new Sudowoodo(),   // 43
  new Phanpy(),      // 44
  new Donphan(),     // 45
  new Baltoy(),      // 46
  new Claydol(),     // 47
  new MegaGalladeex(),// 48
  new Zubat(),       // 49
  new Golbat(),      // 50
  new Crobat(),      // 51
  new Qwilfish(),    // 52
  new Stunky(),      // 53
  new Skuntank(),    // 54
  // 55 Krookodile ex not implemented
  new Trubbish(),    // 56
  new Garbodor(),    // 57
  new Skrelp(),      // 58
  new Beldum(),      // 59
  new Metang(),      // 60
  new Metagross(),   // 61
  new Ferroseed(),   // 62
  new Ferrothorn(),  // 63
  new Cobalionex(),  // 64
  new MegaDragalgeex(),// 65
  new Goomy(),       // 66
  new Sliggoo(),     // 67
  new Goodra(),      // 68
  new Tauros(),      // 69
  new Patrat(),      // 70
  new Watchog(),     // 71
  new Minccino(),    // 72
  new Cinccinoex(),  // 73
  // 74 Adversity Policy not implemented
  new HyperrogueAngeFloette(),// 75
  new AzsTranquility(),// 76
  new Emma(),        // 77
  new BigCatchNet(), // 78
  new Philippe(),    // 79
  new PrismTower(),  // 80
  new RoxiesPerformance(),// 81
  new SpecialRedCard(),// 82
  new BookOfTransformation(),// 83
  new BubbleWaterEnergy(),// 84
  new MagnetMetalEnergy(),// 85
  new NitroFireEnergy(),// 86
  new SpecialRedCardFA(),// 113
  new SurfingBeach(), // 114
];
