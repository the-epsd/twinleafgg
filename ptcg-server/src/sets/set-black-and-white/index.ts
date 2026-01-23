import { EnergySearchBLW, EnergySwitchPKBLW, FullHealBLW, PokeBallBLW, PokemonCommunicationHSBLW, PotionBLW, SuperScoopUpBLW, Reshiram2BLW, Zekrom2BLW } from './other-prints';
import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy } from './basic-energies';
import { Cinccino } from './cinccino';
import { Duosion } from './duosion';
import { Emboar } from './emboar';
import { Herdier } from './herdier';
import { Lillipup } from './lillipup';
import { Minccino } from './minccino';
import { Pignite } from './pignite';
import { Pignite2 } from './pignite2';
import { PlusPower } from './plus-power';
import { Pokedex } from './pokedex';
import { ProfessorJuniper } from './professor-juniper';
import { Reshiram } from './reshiram';
import { Reuniclus } from './reuniclus';
import { Revive } from './revive';
import { Solosis } from './solosis';
import { Tepig } from './tepig';
import { Zekrom } from './zekrom';
import { Zoroark } from './zoroark';
import { Zorua } from './zorua';
import { Alomomola } from './alomomola';
import { Blitzle } from './blitzle';
import { Ducklett } from './ducklett';
import { Oshawott } from './oshawott';
import { Panpour } from './panpour';
import { Pansage } from './pansage';
import { Pansear } from './pansear';
import { Patrat } from './patrat';
import { Purrloin } from './purrloin';
import { Scraggy } from './scraggy';
import { Timburr } from './timburr';
import { Tranquill } from './tranquill';
import { Woobat } from './woobat';
import { Audino } from './audino';
import { Blitzle2 } from './blitzle2';
import { Bouffalant } from './bouffalant';
import { Bouffalant2 } from './bouffalant2';
import { Darumaka } from './darumaka';
import { Dewott } from './dewott';
import { Dewott2 } from './dewott2';
import { Joltik } from './joltik';
import { Klang } from './klang';
import { Klinklang } from './klinklang';
import { Klink } from './klink';
import { Oshawott2 } from './oshawott2';
import { Patrat2 } from './patrat2';
import { Pidove } from './pidove';
import { Simipour } from './simipour';
import { Simisage } from './simisage';
import { Snivy } from './snivy';
import { Snivy2 } from './snivy2';
import { Vullaby } from './vullaby';
import { Darmanitan } from './darmanitan';
import { Darumaka2 } from './darumaka2';
import { Munna } from './munna';
import { Musharna } from './musharna';
import { Scolipede } from './scolipede';
import { Servine } from './servine';
import { Serperior } from './serperior';
import { Serperior2 } from './serperior2';
import { Samurott2 } from './samurott2';
import { Simisear } from './simisear';
import { Tepig2 } from './tepig2';
import { Emboar2 } from './emboar2';
import { Maractus } from './maractus';
import { Maractus2 } from './maractus2';
import { Deerling } from './deerling';
import { Sawsbuck } from './sawsbuck';
import { Joltik2 } from './joltik2';
import { Galvantula } from './galvantula';
import { Pikachu } from './pikachu';
import { Venipede } from './venipede';
import { Watchog } from './watchog';
import { Whirlipede } from './whirlipede';
import { Zebstrika } from './zebstrika';
import { Servine2 } from './servine2';
import { Petilil } from './petilil';
import { Lilligant } from './lilligant';
import { Samurott } from './samurott';
import { Swanna } from './swanna';
import { Alomomola2 } from './alomomola2';
import { Swoobat } from './swoobat';
import { Gurdurr } from './gurdurr';
import { Gurdurr2 } from './gurdurr2';
import { Conkeldurr } from './conkeldurr';
import { Throh } from './throh';
import { Sawk } from './sawk';
import { Sandile } from './sandile';
import { Krokorok } from './krokorok';
import { Krookodile } from './krookodile';
import { Liepard } from './liepard';
import { Scraggy2 } from './scraggy2';
import { Mandibuzz } from './mandibuzz';
import { Lillipup2 } from './lillipup2';
import { Stoutland } from './stoutland';

// Other Prints
import {
  EnergyRetrievalBLW,
  SwitchBLW,
} from './other-prints';

export const setBlackAndWhite: Card[] = [
  new Cinccino(),
  new Duosion(),
  new Emboar(),
  new Herdier(),
  new Lillipup(),
  new Minccino(),
  new Pignite(),
  new Pignite2(),
  new PlusPower(),
  new Pokedex(),
  new ProfessorJuniper(),
  new Reshiram(),
  new Reuniclus(),
  new Revive(),
  new Solosis(),
  new Tepig(),
  new Zekrom(),
  new Zoroark(),
  new Zorua(),
  new Alomomola(),
  new Blitzle(),
  new Ducklett(),
  new Oshawott(),
  new Panpour(),
  new Pansage(),
  new Pansear(),
  new Patrat(),
  new Purrloin(),
  new Scraggy(),
  new Timburr(),
  new Tranquill(),
  new Woobat(),
  new Audino(),
  new Blitzle2(),
  new Bouffalant(),
  new Bouffalant2(),
  new Darumaka(),
  new Dewott(),
  new Dewott2(),
  new Joltik(),
  new Klang(),
  new Klinklang(),
  new Klink(),
  new Oshawott2(),
  new Patrat2(),
  new Pidove(),
  new Simipour(),
  new Simisage(),
  new Snivy(),
  new Snivy2(),
  new Vullaby(),
  new Darmanitan(),
  new Darumaka2(),
  new Munna(),
  new Musharna(),
  new Scolipede(),
  new Servine(),
  new Serperior(),
  new Serperior2(),
  new Samurott2(),
  new Simisear(),
  new Tepig2(),
  new Emboar2(),
  new Maractus(),
  new Maractus2(),
  new Deerling(),
  new Sawsbuck(),
  new Joltik2(),
  new Galvantula(),
  new Pikachu(),
  new Venipede(),
  new Watchog(),
  new Whirlipede(),
  new Zebstrika(),
  new Servine2(),
  new Petilil(),
  new Lilligant(),
  new Samurott(),
  new Swanna(),
  new Alomomola2(),
  new Swoobat(),
  new Gurdurr(),
  new Gurdurr2(),
  new Conkeldurr(),
  new Throh(),
  new Sawk(),
  new Sandile(),
  new Krokorok(),
  new Krookodile(),
  new Liepard(),
  new Scraggy2(),
  new Mandibuzz(),
  new Lillipup2(),
  new Stoutland(),

  // Other Prints
  new EnergyRetrievalBLW(),
  new SwitchBLW(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new EnergySearchBLW(),
  new EnergySwitchPKBLW(),
  new FullHealBLW(),
  new PokeBallBLW(),
  new PokemonCommunicationHSBLW(),
  new PotionBLW(),
  new SuperScoopUpBLW(),
  new Reshiram2BLW(),
  new Zekrom2BLW(),
];
