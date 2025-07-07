import { Card } from '../../game/store/card/card';
import { Abra } from './abra';
import { Aggron } from './aggron';
import { Aipom } from './aipom';
import { Alakazam } from './alakazam';
import { Applin } from './applin';
import { Applin2 } from './applin-2';
import { Aron } from './aron';
import { Blisseyex } from './blissey-ex';
import { BloodmoonUrsalunaex } from './bloodmoon-ursaluna-ex';
import { BoomerangEnergy } from './boomerang-energy';
import { BruteBonnet } from './brute-bonnet';
import { BugCatchingSet } from './bug-catching-set';
import { Caretaker } from './caretaker';
import { Carmine } from './carmine';
import { Chansey } from './chansey';
import { Chimchar } from './chimchar';
import { Clefable } from './clefable';
import { Clefairy } from './clefairy';
import { CommunityCenter } from './community-center';
import { Conkeldurr } from './conkeldurr';
import { CornerstoneMaskOgerponex } from './cornerstone-mask-ogerpon-ex';
import { Dipplin } from './dipplin';
import { Dragapultex } from './dragapult-ex';
import { Drakloak } from './drakloak';
import { Dreepy } from './dreepy';
import { Emolga } from './emolga';
import { EnhancedHammer } from './enhanced-hammer';
import { Farfetchd } from './farfetchd';
import { Farigiraf } from './farigiraf';
import { Feebas } from './feebas';
import { FestivalGrounds } from './festival-plaza';
import { Fezandipiti } from './fezandipiti';
import { Finizen } from './finizen';
import { Froakie } from './froakie';
import { Frogadier } from './frogadier';
import { Froslass } from './froslass';
import { Girafarig } from './girafarig';
import { Goldeen } from './goldeen';
import { Greninjaex } from './greninja-ex';
import { Grookey } from './grookey';
import { Gurdurr } from './gurdurr';
import { HandyFan } from './handy-fan';
import { Hassel } from './hassel';
import { HearthflameMaskOgerponex } from './hearthflame-mask-ogerpon-ex';
import { Heatran } from './heatran';
import { HisuianArcanine } from './hisuian-arcanine';
import { HisuianGrowlithe } from './hisuian-growlithe';
import { HyperAroma } from './hyper-aroma';
import { Illumise } from './illumise';
import { Infernape } from './infernape';
import { IronLeaves } from './iron-leaves';
import { IronThornsex } from './iron-thorns-ex';
import { JammingTower } from './jamming-tower';
import { Kadabra } from './kadabra';
import { Kieran } from './kieran';
import { Lairon } from './lairon';
import { LanasAssistance } from './lanas-assistance';
import { LegacyEnergy } from './legacy-energy';
import { LoveBall } from './love-ball';
import { LuckyHelmet } from './lucky-helmet';
import { Luxio } from './luxio';
import { Luxrayex } from './luxray-ex';
import { Magcargoex } from './magcargo-ex';
import { Mightyena } from './mightyena';
import { Monferno } from './monferno';
import { Morpeko } from './morpeko';
import { Munkidori } from './munkidori';
import { Okidogi } from './okidogi';
import { DipplinIR, PoltchageistIR, InfernapeIR, FroslassIR, PhioneIR, HisuianGrowlitheIR, TimburrIR, LaironIR, ApplinIR, TatsugiriIR, ChanseyIR, SinistchaexFA, TealMaskOgerponexFA, MagcargoexFA, HearthflameMaskOgerponexFA, PalafinexFA, WellspringMaskOgerponexFA, LuxrayexFA, IronThornsexFA, ScreamTailexFA, GreninjaexFA, CornerstoneMaskOgerponexFA, DragapultexFA, BlisseyexFA, BloodmoonUrsalunaexFA, CaretakerFA, CarmineFA, HasselFA, KieranFA, LanasAidFA, PerrinFA, SinistchaexSIR, TealMaskOgerponexSIR, HearthflameMaskOgerponexSIR, WellspringMaskOgerponexSIR, GreninjaexSIR, CornerstoneMaskOgerponexSIR, BloodmoonUrsalunaexSIR, CarmineSIR, KieranSIR, LanasAidSIR, PerrinSIR, TealMaskOgerponexHR, BloodmoonUrsalunaexHR, BuddyBuddyPoffinHR, EnhancedHammerHR, RescueBoardHR, LuminousEnergyHR, CookTWM } from './other-prints';
import { Palafin } from './palafin';
import { Palafinex } from './palafin-ex';
import { PerformanceFlute } from './performance-flute';
import { Perrin } from './perrin';
import { Phione } from './phione';
import { Poliwag } from './poliwag';
import { Poliwhirl } from './poliwhirl';
import { Poliwrath } from './poliwrath';
import { Poltchageist } from './poltchageist';
import { Poochyena } from './poochyena';
import { Rillaboom } from './rillaboom';
import { ScoopUpCyclone } from './scoop-up-cyclone';
import { ScreamTailex } from './scream-tail-ex';
import { SecretBox } from './secret-box';
import { Sinistcha } from './sinistcha';
import { Sinistchaex } from './sinistcha-ex';
import { Slugma } from './slugma';
import { Snorunt } from './snorunt';
import { Sunkern } from './sunkern';
import { SurvivalCast } from './survival-cast';
import { Tatsugiri } from './tatsugiri';
import { TealMaskOgerponex } from './teal-mask-ogerpon-ex';
import { Thwackey } from './thwackey';
import { Timburr } from './timburr';
import { TingLu } from './ting-lu';
import { UnfairStamp } from './unfair-stamp';
import { WalkingWake } from './walking-wake';
import { WellspringMaskOgerponex } from './wellspring-mask-ogerpon-ex';
import { Zapdos } from './zapdos';

export const setTwilightMasquerade: Card[] = [

  new Aggron(),
  new Aron(),
  new Blisseyex(),
  new BruteBonnet(),
  new Carmine(),
  new Chimchar(),
  new Clefable(),
  new Conkeldurr(),
  new CookTWM(),
  new CornerstoneMaskOgerponex(),
  new Dreepy(),
  new Drakloak(),
  new Dragapultex(),
  new Emolga(),
  new Farfetchd(),
  new Fezandipiti(),
  new Finizen(),
  new Froslass(),
  new Goldeen(),
  new Gurdurr(),
  new HandyFan(),
  new Hassel(),
  new HearthflameMaskOgerponex(),
  new Heatran(),
  new HisuianArcanine(),
  new HisuianGrowlithe(),
  new Lairon(),
  new LanasAssistance(),
  new LegacyEnergy(),
  new Luxio(),
  new Luxrayex(),
  new Mightyena(),
  new Munkidori(),
  new Morpeko(),
  new PerformanceFlute(),
  new Poochyena(),
  new ScoopUpCyclone(),
  new Tatsugiri(),
  new Timburr(),
  new WellspringMaskOgerponex(),
  new Kieran(),
  new BloodmoonUrsalunaex(),
  new Caretaker(),
  new CommunityCenter(),
  new EnhancedHammer(),
  new HyperAroma(),
  new IronLeaves(),
  new IronThornsex(),
  new LoveBall(),
  new LuckyHelmet(),
  new Okidogi(),
  new Perrin(),
  new Phione(),
  new ScreamTailex(),
  new SurvivalCast(),
  new Sunkern(),
  new UnfairStamp(),
  new TealMaskOgerponex(),
  new Froakie(),
  new Frogadier(),
  new Greninjaex(),
  new Chansey(),
  new BugCatchingSet(),
  new Dipplin(),
  new Grookey(),
  new Thwackey(),
  new FestivalGrounds(),
  new Applin(),
  new Applin2(),
  new JammingTower(),
  new Infernape(),
  new WalkingWake(),
  new SecretBox(),
  new TingLu(),
  new Monferno(),
  new Rillaboom(),
  new Zapdos(),
  new Clefairy(),
  new Palafin(),
  new Palafinex(),
  new Poltchageist(),
  new Sinistcha(),
  new Sinistchaex(),
  new Slugma(),
  new Snorunt(),
  new Magcargoex(),
  new Abra(),
  new Kadabra(),
  new Alakazam(),
  new Aipom(),
  new Poliwag(),
  new Poliwhirl(),
  new Poliwrath(),
  new Illumise(),
  new BoomerangEnergy(),
  new Feebas(),
  new Girafarig(),
  new Farigiraf(),

  // TWM Full Arts
  new DipplinIR(),
  new PoltchageistIR(),
  new InfernapeIR(),
  new FroslassIR(),
  new PhioneIR(),
  new HisuianGrowlitheIR(),
  new TimburrIR(),
  new LaironIR(),
  new ApplinIR(),
  new TatsugiriIR(),
  new ChanseyIR(),
  new SinistchaexFA(),
  new TealMaskOgerponexFA(),
  new MagcargoexFA(),
  new HearthflameMaskOgerponexFA(),
  new PalafinexFA(),
  new WellspringMaskOgerponexFA(),
  new LuxrayexFA(),
  new IronThornsexFA(),
  new ScreamTailexFA(),
  new GreninjaexFA(),
  new CornerstoneMaskOgerponexFA(),
  new DragapultexFA(),
  new BlisseyexFA(),
  new BloodmoonUrsalunaexFA(),
  new CaretakerFA(),
  new CarmineFA(),
  new HasselFA(),
  new KieranFA(),
  new LanasAidFA(),
  new PerrinFA(),
  new SinistchaexSIR(),
  new TealMaskOgerponexSIR(),
  new HearthflameMaskOgerponexSIR(),
  new WellspringMaskOgerponexSIR(),
  new GreninjaexSIR(),
  new CornerstoneMaskOgerponexSIR(),
  new BloodmoonUrsalunaexSIR(),
  new CarmineSIR(),
  new KieranSIR(),
  new LanasAidSIR(),
  new PerrinSIR(),
  new TealMaskOgerponexHR(),
  new BloodmoonUrsalunaexHR(),
  new BuddyBuddyPoffinHR(),
  new EnhancedHammerHR(),
  new RescueBoardHR(),
  new LuminousEnergyHR(),
];
