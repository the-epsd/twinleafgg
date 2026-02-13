import { Card } from '../../game/store/card/card';
import { Altaria } from './altaria';
import { Audino } from './audino';
import { Carnivine } from './carnivine';
import { ChandelureEx } from './chandelure-ex';
import { Cherubi } from './cherubi';
import { Cobalion } from './cobalion';
import { Crustle } from './crustle';
// Dewott LTR is a reprint of Dewott2 BLW, imported from other-prints
// Druddigon LTR is a reprint of Druddigon NVI, imported from other-prints
// Duosion LTR is a reprint of Duosion NVI, imported from other-prints
import { Dwebble } from './dwebble';
// Emboar LTR is a reprint of Emboar BLW, imported from other-prints
import { Empoleon } from './empoleon';
import { ExcadrillEx } from './excadrill-ex';
import { Gabite } from './gabite';
import { Gallade } from './gallade';
import { Gardevoir } from './gardevoir';
import { Genesect } from './genesect';
import { Gible } from './gible';
import { Gothita } from './gothita';
import { Gothita2 } from './gothita-2';
import { Gothitelle } from './gothitelle';
import { Gothorita } from './gothorita';
import { Growlithe } from './growlithe';
import { Gyarados } from './gyarados';
import { Kirlia } from './kirlia';
import { Kirlia2 } from './kirlia-2';
// Leavanny LTR is a reprint of Leavanny NVI, imported from other-prints
// Lucario LTR is a reprint of Lucario NXD, imported from other-prints
import { Magikarp } from './magikarp';
import { Meloetta2 } from './meloetta-2';
import { MeloettaEX } from './meloetta-ex';
import { MewEx } from './mew-ex';
import { Mewtwo } from './mewtwo';
import { Misdreavus } from './misdreavus';
import { Mismagius } from './mismagius';
import { Natu } from './natu';
import { Ninetales } from './ninetales';
import { Phione } from './phione';
import { Piplup } from './piplup';
import { Piplup2 } from './piplup-2';
// Plusle LTR is a reprint of Plusle DEX, imported from other-prints
import { Prinplup } from './prinplup';
import { Ralts } from './ralts';
import { Ralts2 } from './ralts-2';
import { Riolu } from './riolu';
import { Sableye } from './sableye';
// Samurott LTR is a reprint of Samurott2 BLW, imported from other-prints
import { Serperior } from './serperior';
// Serperior-2 LTR is a reprint of Serperior2 BLW, imported from other-prints
import { Servine } from './servine';
// Sewaddle LTR is a reprint of Sewaddle NVI, imported from other-prints
import { Sewaddle2 } from './sewaddle-2';
import { Shuckle } from './shuckle';
import { Snivy } from './snivy';
// Solosis LTR is a reprint of Solosis NVI, imported from other-prints
import { Solosis2 } from './solosis-2';
import { Spiritomb } from './spiritomb';
import { Stunfisk } from './stunfisk';
import { Stunfisk2 } from './stunfisk-2';
import { Swablu } from './swablu';
import { Swoobat } from './swoobat';
import { Tangela } from './tangela';
import { Tangrowth } from './tangrowth';
import { Teddiursa } from './teddiursa';
// Thundurus LTR is a reprint of Thundurus EPO, imported from other-prints
// Torchic LTR is a reprint of Torchic2 DEX, imported from other-prints
import { Trubbish } from './trubbish';
import { Ursaring } from './ursaring';
import { Vulpix } from './vulpix';
import { Woobat } from './woobat';
import { Xatu } from './xatu';
import { Zapdos } from './zapdos';
import { CedricJuniper } from './cedric-juniper';
import { Elesa } from './elesa';

import {
  EnergySwitchLTR,
  VictiniEXLTR,
  Pignite2LTR,
  ReshiramLTR,
  ReshiramExLTR,
  TympoleLTR,
  PetililLTR,
  SeismitoadLTR,
  KyuremLTR,
  KeldeoExBWPLTR,
  MinunLTR,
  EmolgaLTR,
  ZekromLTR,
  ZekromExLTR,
  MewtwoExLTR,
  SigilyphLTR,
  GarbodorLTR,
  TerrakionLTR,
  DarkraiExLTR,
  ZoruaLTR,
  RayquazaLTR,
  DeinoLTR,
  ZweilousLTR,
  HydreigonLTR,
  LugiaExLTR,
  TornadusLTR,
  BiancaLTR,
  CrushingHammerLTR,
  DoubleColorlessEnergyLTR,
  Reshiram2LTR,
  Zekrom2LTR,
  Minccino2LTR,
  ShayminEXLTR,
  Reshiram3LTR,
  Emolga2LTR,
  MeloettaEX2LTR,
  PikachuLTR,
  PurrloinLTR,
  EeveeLTR,
  SnivyLTR,
  ServineLTR,
  SwadloonLTR,
  VirizionLTR,
  CharmanderLTR,
  CharmeleonLTR,
  CharizardLTR,
  MoltresLTR,
  TepigLTR,
  ArticunoLTR,
  OshawottLTR,
  KyuremExLTR,
  CroagunkLTR,
  ToxicroakLTR,
  ReuniclusLTR,
  MeloettaLTR,
  LandorusLTR,
  ZoroarkLTR,
  GarchompLTR,
  BlackKyuremExLTR,
  WhiteKyuremExLTR,
  MinccinoLTR,
  Cinccino2,
  BouffalantLTR,
  SewaddleLTR,
  ThundurusLTR,
  PlusleLTR,
  CinccinoLTR,
  Serperior2LTR,
  LeavannyLTR,
  DruddigonLTR,
  LucarioLTR,
  EmboarLTR,
  DewottLTR,
  SamurottLTR,
  DuosionLTR,
  SolosisLTR,
  TorchicLTR,
  VictiniLTR,
} from './other-prints';

export const setLegendaryTreasures: Card[] = [
  // Pokemon
  new Altaria(),
  new Audino(),
  new Carnivine(),
  new ChandelureEx(),
  new Cherubi(),
  new CinccinoLTR(),
  new Cobalion(),
  new Crustle(),
  new DewottLTR(),
  new DruddigonLTR(),
  new DuosionLTR(),
  new Dwebble(),
  new EmboarLTR(),
  new Empoleon(),
  new ExcadrillEx(),
  new Gabite(),
  new Gallade(),
  new Gardevoir(),
  new Genesect(),
  new Gible(),
  new Gothita(),
  new Gothita2(),
  new Gothitelle(),
  new Gothorita(),
  new Growlithe(),
  new Gyarados(),
  new Kirlia(),
  new Kirlia2(),
  new LeavannyLTR(),
  new LucarioLTR(),
  new Magikarp(),
  new Meloetta2(),
  new MeloettaEX(),
  new MewEx(),
  new Mewtwo(),
  new Misdreavus(),
  new Mismagius(),
  new Natu(),
  new Ninetales(),
  new Phione(),
  new Piplup(),
  new Piplup2(),
  new PlusleLTR(),
  new Prinplup(),
  new Ralts(),
  new Ralts2(),
  new Riolu(),
  new Sableye(),
  new SamurottLTR(),
  new Serperior(),
  new Serperior2LTR(),
  new Servine(),
  new SewaddleLTR(),
  new Sewaddle2(),
  new Shuckle(),
  new Snivy(),
  new SolosisLTR(),
  new Solosis2(),
  new Spiritomb(),
  new Stunfisk(),
  new Stunfisk2(),
  new Swablu(),
  new Swoobat(),
  new Tangela(),
  new Tangrowth(),
  new Teddiursa(),
  new ThundurusLTR(),
  new TorchicLTR(),
  new Trubbish(),
  new Ursaring(),
  new VictiniLTR(),
  new Vulpix(),
  new Woobat(),
  new Xatu(),
  new Zapdos(),

  // Trainers
  new CedricJuniper(),
  new Elesa(),

  // Other Prints (Reprints & Alt Arts)
  new EnergySwitchLTR(),
  new VictiniEXLTR(),
  new Pignite2LTR(),
  new ReshiramLTR(),
  new ReshiramExLTR(),
  new TympoleLTR(),
  new PetililLTR(),
  new SeismitoadLTR(),
  new KyuremLTR(),
  new KeldeoExBWPLTR(),
  new MinunLTR(),
  new EmolgaLTR(),
  new ZekromLTR(),
  new ZekromExLTR(),
  new MewtwoExLTR(),
  new SigilyphLTR(),
  new GarbodorLTR(),
  new TerrakionLTR(),
  new DarkraiExLTR(),
  new ZoruaLTR(),
  new RayquazaLTR(),
  new DeinoLTR(),
  new ZweilousLTR(),
  new HydreigonLTR(),
  new LugiaExLTR(),
  new TornadusLTR(),
  new BiancaLTR(),
  new CrushingHammerLTR(),
  new DoubleColorlessEnergyLTR(),
  new Reshiram2LTR(),
  new Zekrom2LTR(),
  new Minccino2LTR(),
  new ShayminEXLTR(),
  new Reshiram3LTR(),
  new Emolga2LTR(),
  new MeloettaEX2LTR(),
  new PikachuLTR(),
  new PurrloinLTR(),
  new EeveeLTR(),
  new SnivyLTR(),
  new ServineLTR(),
  new SwadloonLTR(),
  new VirizionLTR(),
  new CharmanderLTR(),
  new CharmeleonLTR(),
  new CharizardLTR(),
  new MoltresLTR(),
  new TepigLTR(),
  new ArticunoLTR(),
  new OshawottLTR(),
  new KyuremExLTR(),
  new CroagunkLTR(),
  new ToxicroakLTR(),
  new ReuniclusLTR(),
  new MeloettaLTR(),
  new LandorusLTR(),
  new ZoroarkLTR(),
  new GarchompLTR(),
  new BlackKyuremExLTR(),
  new WhiteKyuremExLTR(),
  new MinccinoLTR(),
  new Cinccino2(),
  new BouffalantLTR(),
];
