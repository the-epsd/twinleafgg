import { Card } from '../../game/store/card/card';
import { Abomasnow } from './abomasnow';
import { Accelgor } from './accelgor';
import { Aggron } from './aggron';
import { Archen } from './archen';
import { Archeops } from './archeops';
import { Aron } from './aron';
import { Axew } from './axew';
import { Azelf } from './azelf';
import { Bagon } from './bagon';
import { Carracosta } from './carracosta';
import { Chatot } from './chatot';
import { Cradily } from './cradily';
import { DialgaEx } from './dialga-ex';
import { Drifblim } from './drifblim';
import { Drifloon } from './drifloon';
import { Druddigon } from './druddigon';
import { Ducklett } from './ducklett';
import { Duosion } from './duosion';
import { Eelektrik } from './eelektrik';
import { Eelektross } from './eelektross';
import { Escavalier } from './escavalier';
import { Fraxure } from './fraxure';
import { Froslass } from './froslass';
import { Genesect } from './genesect';
import { GenesectEX } from './genesect-ex';
import { Glalie } from './glalie';
import { Golett } from './golett';
import { Golurk } from './golurk';
import { Haxorus } from './haxorus';
import { Houndoom } from './houndoom';
import { Houndour } from './houndour';
import { JirachiEX } from './jirachi-ex';
import { Kangaskhan } from './kangaskhan';
import { Karrablast } from './karrablast';
import { KyuremEx } from './kyurem-ex';
import { Lairon } from './lairon';
import { Lapras } from './lapras';
import { Larvesta } from './larvesta';
import { Lileep } from './lileep';
import { Machamp } from './machamp';
import { Machamp2 } from './machamp-2';
import { Machoke } from './machoke';
import { Machop } from './machop';
import { Masquerain } from './masquerain';
import { Mesprit } from './mesprit';
import { Munna } from './munna';
import { Musharna } from './musharna';
import { Octillery } from './octillery';
import { PalkiaEX } from './palkia-ex';
import { Porygon } from './porygon';
import { PorygonZ } from './porygon-z';
import { Porygon2 } from './porygon2';
import { Relicanth } from './relicanth';
import { Remoraid } from './remoraid';
import { Reuniclus } from './reuniclus';
import { Salamence } from './salamence';
import { Sawk } from './sawk';
import { Shelgon } from './shelgon';
import { Shelmet } from './shelmet';
import { Sigilyph } from './sigilyph';
import { Snorunt } from './snorunt';
import { Snover } from './snover';
import { Solosis } from './solosis';
import { Squirtle } from './squirtle';
import { Suicune } from './suicune';
import { Surskit } from './surskit';
import { Teddiursa } from './teddiursa';
import { Throh } from './throh';
import { Tirtouga } from './tirtouga';
import { Tropius } from './tropius';
import { Tynamo } from './tynamo';
import { Ursaring } from './ursaring';
import { Uxie } from './uxie';
import { VirizionEX } from './virizion-ex';
import { Volcarona } from './volcarona';
import { Wartortle } from './wartortle';
import { GBooster } from './g-booster';
import { GScope } from './g-scope';
import { Iris } from './iris';
import { ReversalTrigger } from './reversal-trigger';
import { RootFossilLileep } from './root-fossil-lileep';
import { SilverBangle } from './silver-bangle';
import { SilverMirror } from './silver-mirror';

import {
  ScoopUpCyclonePLB,
  UltraBallPLB,
  MasterBallPLB,
  ProfessorJuniperPLB,
  BlastoisePLB,
  CaitlinPLB,
  EnergyRetrievalPLB,
  PlumeFossilPLB,
  PokemonCatcherPLB,
  RareCandyPLB,
  PlasmaEnergyPLB,
  VirizionEX2PLB,
  GenesectEX2PLB,
  JirachiEX2PLB,
  PalkiaEX2PLB,
  ExeggcutePLB,
  DusknoirPLB,
  RareCandy2PLB,
  CoverFossilPLB,
  DialgaEx2,
  Iris2,
  VirizionPLB,
} from './other-prints';

export const setPlasmaBlast: Card[] = [
  // Pokemon
  new Abomasnow(),
  new Accelgor(),
  new Aggron(),
  new Archen(),
  new Archeops(),
  new Aron(),
  new Axew(),
  new Azelf(),
  new Bagon(),
  new Carracosta(),
  new Chatot(),
  new Cradily(),
  new DialgaEx(),
  new Drifblim(),
  new Drifloon(),
  new Druddigon(),
  new Ducklett(),
  new Duosion(),
  new Eelektrik(),
  new Eelektross(),
  new Escavalier(),
  new Fraxure(),
  new Froslass(),
  new Genesect(),
  new GenesectEX(),
  new Glalie(),
  new Golett(),
  new Golurk(),
  new Haxorus(),
  new Houndoom(),
  new Houndour(),
  new JirachiEX(),
  new Kangaskhan(),
  new Karrablast(),
  new KyuremEx(),
  new Lairon(),
  new Lapras(),
  new Larvesta(),
  new Lileep(),
  new Machamp(),
  new Machamp2(),
  new Machoke(),
  new Machop(),
  new Masquerain(),
  new Mesprit(),
  new Munna(),
  new Musharna(),
  new Octillery(),
  new PalkiaEX(),
  new Porygon(),
  new PorygonZ(),
  new Porygon2(),
  new Relicanth(),
  new Remoraid(),
  new Reuniclus(),
  new Salamence(),
  new Sawk(),
  new Shelgon(),
  new Shelmet(),
  new Sigilyph(),
  new Snorunt(),
  new Snover(),
  new Solosis(),
  new Squirtle(),
  new Suicune(),
  new Surskit(),
  new Teddiursa(),
  new Throh(),
  new Tirtouga(),
  new Tropius(),
  new Tynamo(),
  new Ursaring(),
  new Uxie(),
  new VirizionEX(),
  new Volcarona(),
  new Wartortle(),

  // Trainers
  new GBooster(),
  new GScope(),
  new Iris(),
  new ReversalTrigger(),
  new RootFossilLileep(),
  new SilverBangle(),
  new SilverMirror(),

  // Other Prints (Reprints & Alt Arts)
  new ScoopUpCyclonePLB(),
  new UltraBallPLB(),
  new MasterBallPLB(),
  new ProfessorJuniperPLB(),
  new BlastoisePLB(),
  new CaitlinPLB(),
  new EnergyRetrievalPLB(),
  new PlumeFossilPLB(),
  new PokemonCatcherPLB(),
  new RareCandyPLB(),
  new PlasmaEnergyPLB(),
  new VirizionEX2PLB(),
  new GenesectEX2PLB(),
  new JirachiEX2PLB(),
  new PalkiaEX2PLB(),
  new ExeggcutePLB(),
  new DusknoirPLB(),
  new RareCandy2PLB(),
  new CoverFossilPLB(),
  new DialgaEx2(),
  new Iris2(),
  new VirizionPLB(),
];
