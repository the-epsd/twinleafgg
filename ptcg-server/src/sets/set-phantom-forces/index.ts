import { Card } from '../../game/store/card/card';
import { AegislashEX } from './aegislash-ex';
import { Alomomola } from './alomomola';
import { Blissey } from './blissey';
import { Boldore } from './boldore';
import { Bronzong } from './bronzong';
import { Bronzor } from './bronzor';
import { Bunnelby } from './bunnelby';
import { Chandelure } from './chandelure';
import { Chansey } from './chansey';
import { Crobat } from './crobat';
import { Croconaw } from './croconaw';
import { Dedenne } from './dedenne';
import { Deino } from './deino';
import { DialgaEx } from './dialga-ex';
import { Diancie } from './diancie';
import { Diggersby } from './diggersby';
import { Escavalier } from './escavalier';
import { Exploud } from './exploud';
import { Fearow } from './fearow';
import { Feraligatr } from './feraligatr';
import { Finneon } from './finneon';
import { Fletchinder } from './fletchinder';
import { Fletchling } from './fletchling';
import { FlorgesEx } from './florges-ex';
import { Frillish } from './frillish';
import { Galvantula } from './galvantula';
import { GengarEx } from './gengar-ex';
import { Gigalith } from './gigalith';
import { Girafarig } from './girafarig';
import { Gligar } from './gligar';
import { Gliscor } from './gliscor';
import { Golbat } from './golbat';
import { Goodra } from './goodra';
import { Gourgeist } from './gourgeist';
import { Gulpin } from './gulpin';
import { Heatran } from './heatran';
import { Heliolisk } from './heliolisk';
import { Helioptile } from './helioptile';
import { Helioptile2 } from './helioptile-2';
import { Honchkrow } from './honchkrow';
import { Hydreigon } from './hydreigon';
import { Jellicent } from './jellicent';
import { Joltik } from './joltik';
import { Karrablast } from './karrablast';
import { Kingler } from './kingler';
import { Klefki } from './klefki';
import { Krabby } from './krabby';
import { Lampent } from './lampent';
import { Leavanny } from './leavanny';
import { Liepard } from './liepard';
import { Litleo } from './litleo';
import { Litwick } from './litwick';
import { Loudred } from './loudred';
import { Lumineon } from './lumineon';
import { MGengarEx } from './m-gengar-ex';
import { MManectricEx } from './m-manectric-ex';
import { MalamarEx } from './malamar-ex';
import { ManectricEx } from './manectric-ex';
import { Mightyena } from './mightyena';
import { Munna } from './munna';
import { Murkrow } from './murkrow';
import { Musharna } from './musharna';
import { Pachirisu } from './pachirisu';
import { Poochyena } from './poochyena';
import { Pumpkaboo } from './pumpkaboo';
import { Purrloin } from './purrloin';
import { Pyroar } from './pyroar';
import { Regigigas } from './regigigas';
import { Roggenrola } from './roggenrola';
import { Sewaddle } from './sewaddle';
import { Skarmory } from './skarmory';
import { Slurpuff } from './slurpuff';
import { Spearow } from './spearow';
import { Spiritomb } from './spiritomb';
import { Swadloon } from './swadloon';
import { Swalot } from './swalot';
import { Swirlix } from './swirlix';
import { Talonflame } from './talonflame';
import { Totodile } from './totodile';
import { Venomoth } from './venomoth';
import { Venonat } from './venonat';
import { Whismur } from './whismur';
import { Wobbuffet } from './wobbuffet';
import { Yanma } from './yanma';
import { Yanmega } from './yanmega';
import { Zubat } from './zubat';
import { Zweilous } from './zweilous';
import { AZ } from './az';
import { BattleCompressor } from './battle-compressor';
import { BattleCompressorTeamFlareGear } from './battle-compressor-team-flare-gear';
import { DimensionValley } from './dimension-valley';
import { GengarSpiritLink } from './gengar-spirit-link';
import { HandScope } from './hand-scope';
import { HeadRingerTeamFlareHyperGear } from './head-ringer-team-flare-hyper-gear';
import { JammingNetTeamFlareHyperGear } from './jamming-net-team-flare-hyper-gear';
import { LysandresTrumpCard } from './lysandres-trump-card';
import { ManectricSpiritLink } from './manectric-spirit-link';
import { RoboSubstituteTeamFlareGear } from './robo-substitute-team-flare-gear';
import { RoboSubstitute } from './robo-substitutue';
import { SteelShelter } from './steel-shelter';
import { TargetWhistle } from './target-whistle';
import { TargetWhistleTeamFlareGear } from './target-whistle-team-flare-gear';
import { Tierno } from './tierno';
import { TrickCoin } from './trick-coin';
import { VsSeeker } from './vs-seeker';
import { Xerosic } from './xerosic';
import { MysteryEnergy } from './mystery-energy';

import {
  AegislashEXPHF,
  EnhancedHammerPHF,
  ProfessorSycamoreXYPHF,
  RollerSkatesPHF,
  ShaunaPHF,
  DoubleColorlessEnergyPHF,
  GengarEx2PHF,
  AZ2PHF,
  LysandresTrumpCard2PHF,
  Xerosic2PHF,
  MGengarEx2PHF,
  AegislashEX2PHF,
  MManectricEx2,
  GoomyPHF,
  SliggooPHF,
  FurfrouPHF,
  ManectricEx2,
  MalamarEx2,
  FlorgesEx2,
  MManectricEx3,
  DialgaEx2,
} from './other-prints';

export const setPhantomForces: Card[] = [
  // Pokemon
  new AegislashEX(),
  new Alomomola(),
  new Blissey(),
  new Boldore(),
  new Bronzong(),
  new Bronzor(),
  new Bunnelby(),
  new Chandelure(),
  new Chansey(),
  new Crobat(),
  new Croconaw(),
  new Dedenne(),
  new Deino(),
  new DialgaEx(),
  new Diancie(),
  new Diggersby(),
  new Escavalier(),
  new Exploud(),
  new Fearow(),
  new Feraligatr(),
  new Finneon(),
  new Fletchinder(),
  new Fletchling(),
  new FlorgesEx(),
  new Frillish(),
  new Galvantula(),
  new GengarEx(),
  new Gigalith(),
  new Girafarig(),
  new Gligar(),
  new Gliscor(),
  new Golbat(),
  new Goodra(),
  new Gourgeist(),
  new Gulpin(),
  new Heatran(),
  new Heliolisk(),
  new Helioptile(),
  new Helioptile2(),
  new Honchkrow(),
  new Hydreigon(),
  new Jellicent(),
  new Joltik(),
  new Karrablast(),
  new Kingler(),
  new Klefki(),
  new Krabby(),
  new Lampent(),
  new Leavanny(),
  new Liepard(),
  new Litleo(),
  new Litwick(),
  new Loudred(),
  new Lumineon(),
  new MGengarEx(),
  new MManectricEx(),
  new MalamarEx(),
  new ManectricEx(),
  new Mightyena(),
  new Munna(),
  new Murkrow(),
  new Musharna(),
  new Pachirisu(),
  new Poochyena(),
  new Pumpkaboo(),
  new Purrloin(),
  new Pyroar(),
  new Regigigas(),
  new Roggenrola(),
  new Sewaddle(),
  new Skarmory(),
  new Slurpuff(),
  new Spearow(),
  new Spiritomb(),
  new Swadloon(),
  new Swalot(),
  new Swirlix(),
  new Talonflame(),
  new Totodile(),
  new Venomoth(),
  new Venonat(),
  new Whismur(),
  new Wobbuffet(),
  new Yanma(),
  new Yanmega(),
  new Zubat(),
  new Zweilous(),

  // Trainers
  new AZ(),
  new BattleCompressor(),
  new BattleCompressorTeamFlareGear(),
  new DimensionValley(),
  new GengarSpiritLink(),
  new HandScope(),
  new HeadRingerTeamFlareHyperGear(),
  new JammingNetTeamFlareHyperGear(),
  new LysandresTrumpCard(),
  new ManectricSpiritLink(),
  new RoboSubstituteTeamFlareGear(),
  new RoboSubstitute(),
  new SteelShelter(),
  new TargetWhistle(),
  new TargetWhistleTeamFlareGear(),
  new Tierno(),
  new TrickCoin(),
  new VsSeeker(),
  new Xerosic(),

  // Energy
  new MysteryEnergy(),

  // Other Prints (Reprints & Alt Arts)
  new AegislashEXPHF(),
  new EnhancedHammerPHF(),
  new ProfessorSycamoreXYPHF(),
  new RollerSkatesPHF(),
  new ShaunaPHF(),
  new DoubleColorlessEnergyPHF(),
  new GengarEx2PHF(),
  new AZ2PHF(),
  new LysandresTrumpCard2PHF(),
  new Xerosic2PHF(),
  new MGengarEx2PHF(),
  new AegislashEX2PHF(),
  new MManectricEx2(),
  new GoomyPHF(),
  new SliggooPHF(),
  new FurfrouPHF(),
  new ManectricEx2(),
  new MalamarEx2(),
  new FlorgesEx2(),
  new MManectricEx3(),
  new DialgaEx2(),
];
