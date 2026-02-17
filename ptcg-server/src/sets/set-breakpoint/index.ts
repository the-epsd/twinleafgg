import { Card } from '../../game/store/card/card';
import { Aegislash } from './aegislash';
import { Arcanine } from './arcanine';
import { Aromatisse } from './aromatisse';
import { Bayleef } from './bayleef';
import { Blitzle } from './blitzle';
import { Camerupt } from './camerupt';
import { Chikorita } from './chikorita';
import { Clefable } from './clefable';
import { Clefairy } from './clefairy';
import { Cloyster } from './cloyster';
import { Corsola } from './corsola';
import { DarkraiEx } from './darkrai-ex';
import { Doublade } from './doublade';
import { Dragalge } from './dragalge';
import { Drapion } from './drapion';
import { Drowzee } from './drowzee';
import { Ducklett } from './ducklett';
import { Dunsparce } from './dunsparce';
import { Durant } from './durant';
import { Electabuzz } from './electabuzz';
import { Electivire } from './electivire';
import { EmboarEx } from './emboar-ex';
import { EspeonEX } from './espeon-ex';
import { Espurr } from './espurr';
import { Ferroseed } from './ferroseed';
import { Ferrothorn } from './ferrothorn';
import { Froakie } from './froakie';
import { Frogadier } from './frogadier';
import { Furfrou } from './furfrou';
import { Gabite } from './gabite';
import { Garbodor } from './garbodor';
import { Garchomp } from './garchomp';
import { Gible } from './gible';
import { Glameow } from './glameow';
import { Golduck } from './golduck';
import { GolduckBreak } from './golduck-break';
import { Greninja } from './greninja';
import { GreninjaBREAK } from './greninja-break';
import { Growlithe } from './growlithe';
import { GyaradosEx } from './gyarados-ex';
import { Heatmor } from './heatmor';
import { HoOhEx } from './ho-oh-ex';
import { HoOhEx2 } from './ho-oh-ex-2';
import { Honedge } from './honedge';
import { Hypno } from './hypno';
import { Kricketot } from './kricketot';
import { Kricketune } from './kricketune';
import { Lapras } from './lapras';
import { Lilligant } from './lilligant';
import { Luxio } from './luxio';
import { Luxray } from './luxray';
import { LuxrayBreak } from './luxray-break';
import { MGyaradosEx } from './m-gyarados-ex';
import { MScizorEx } from './m-scizor-ex';
import { ManaphyEX } from './manaphy-ex';
import { Mawile } from './mawile';
import { Meganium } from './meganium';
import { Meowstic } from './meowstic';
import { Numel } from './numel';
import { Nuzleaf } from './nuzleaf';
import { PalkiaEx } from './palkia-ex';
import { Palpitoad } from './palpitoad';
import { Pancham } from './pancham';
import { Pangoro } from './pangoro';
import { Petilil } from './petilil';
import { Phantump } from './phantump';
import { Psyduck } from './psyduck';
import { Purugly } from './purugly';
import { Raticate } from './raticate';
import { RaticateBreak } from './raticate-break';
import { Rattata } from './rattata';
import { ScizorEx } from './scizor-ex';
import { Seedot } from './seedot';
import { Seismitoad } from './seismitoad';
import { Shellder } from './shellder';
import { Shellder2 } from './shellder-2';
import { Shiftry } from './shiftry';
import { Shinx } from './shinx';
import { Sigilyph } from './sigilyph';
import { Skorupi } from './skorupi';
import { Skrelp } from './skrelp';
import { Slowbro } from './slowbro';
import { Slowking } from './slowking';
import { Slowpoke } from './slowpoke';
import { Spritzee } from './spritzee';
import { Stantler } from './stantler';
import { Staryu } from './staryu';
import { Sudowoodo } from './sudowoodo';
import { Suicune } from './suicune';
import { Swanna } from './swanna';
import { TogekissEx } from './togekiss-ex';
import { Trevenant } from './trevenant';
import { TrevenantBREAK } from './trevenant-break';
import { Trubbish } from './trubbish';
import { Tympole } from './tympole';
import { Zebstrika } from './zebstrika';
import { AllNightParty } from './all-night-party';
import { BurstingBalloon } from './bursting-balloon';
import { Delinquent } from './delinquent';
import { FightingFuryBelt } from './fighting-fury-belt';
import { GyaradosSpiritLink } from './gyarados-spirit-link';
import { MaxElixir } from './max-elixir';
import { PsychicsThirdEye } from './psychics-third-eye';
import { PuzzleOfTime } from './puzzle-of-time';
import { ReverseValley } from './reverse-valley';
import { ScizorSpiritLink } from './scizor-spirit-link';
import { SplashEnergy } from './splash-energy';

import {
  GreatBallBKP,
  MaxPotionBKP,
  PokemonCatcherBKP,
  PotionBKP,
  ProfessorSycamoreXYBKP,
  ManaphyEX2BKP,
  SkylaBKP,
  Delinquent2BKP,
  Delinquent3BKP,
  ProfessorSycamoreXY2BKP,
  MistysDeterminationBKP,
  TiernoBKP,
  GyaradosEx2,
  MGyaradosEx2,
  EspeonEx2,
  DarkraiEx2,
  ScizorEx2,
  MScizorEx2,
  GyaradosEx3,
} from './other-prints';

export const setBreakpoint: Card[] = [
  // Pokemon
  new Aegislash(),
  new Arcanine(),
  new Aromatisse(),
  new Bayleef(),
  new Blitzle(),
  new Camerupt(),
  new Chikorita(),
  new Clefable(),
  new Clefairy(),
  new Cloyster(),
  new Corsola(),
  new DarkraiEx(),
  new Doublade(),
  new Dragalge(),
  new Drapion(),
  new Drowzee(),
  new Ducklett(),
  new Dunsparce(),
  new Durant(),
  new Electabuzz(),
  new Electivire(),
  new EmboarEx(),
  new EspeonEX(),
  new Espurr(),
  new Ferroseed(),
  new Ferrothorn(),
  new Froakie(),
  new Frogadier(),
  new Furfrou(),
  new Gabite(),
  new Garbodor(),
  new Garchomp(),
  new Gible(),
  new Glameow(),
  new Golduck(),
  new GolduckBreak(),
  new Greninja(),
  new GreninjaBREAK(),
  new Growlithe(),
  new GyaradosEx(),
  new Heatmor(),
  new HoOhEx(),
  new HoOhEx2(),
  new Honedge(),
  new Hypno(),
  new Kricketot(),
  new Kricketune(),
  new Lapras(),
  new Lilligant(),
  new Luxio(),
  new Luxray(),
  new LuxrayBreak(),
  new MGyaradosEx(),
  new MScizorEx(),
  new ManaphyEX(),
  new Mawile(),
  new Meganium(),
  new Meowstic(),
  new Numel(),
  new Nuzleaf(),
  new PalkiaEx(),
  new Palpitoad(),
  new Pancham(),
  new Pangoro(),
  new Petilil(),
  new Phantump(),
  new Psyduck(),
  new Purugly(),
  new Raticate(),
  new RaticateBreak(),
  new Rattata(),
  new ScizorEx(),
  new Seedot(),
  new Seismitoad(),
  new Shellder(),
  new Shellder2(),
  new Shiftry(),
  new Shinx(),
  new Sigilyph(),
  new Skorupi(),
  new Skrelp(),
  new Slowbro(),
  new Slowking(),
  new Slowpoke(),
  new Spritzee(),
  new Stantler(),
  new Staryu(),
  new Sudowoodo(),
  new Suicune(),
  new Swanna(),
  new TogekissEx(),
  new Trevenant(),
  new TrevenantBREAK(),
  new Trubbish(),
  new Tympole(),
  new Zebstrika(),

  // Trainers
  new AllNightParty(),
  new BurstingBalloon(),
  new Delinquent(),
  new FightingFuryBelt(),
  new GyaradosSpiritLink(),
  new MaxElixir(),
  new PsychicsThirdEye(),
  new PuzzleOfTime(),
  new ReverseValley(),
  new ScizorSpiritLink(),

  // Energy
  new SplashEnergy(),

  // Other Prints (Reprints & Alt Arts)
  new GreatBallBKP(),
  new MaxPotionBKP(),
  new PokemonCatcherBKP(),
  new PotionBKP(),
  new ProfessorSycamoreXYBKP(),
  new ManaphyEX2BKP(),
  new SkylaBKP(),
  new Delinquent2BKP(),
  new Delinquent3BKP(),
  new ProfessorSycamoreXY2BKP(),
  new MistysDeterminationBKP(),
  new TiernoBKP(),
  new GyaradosEx2(),
  new MGyaradosEx2(),
  new EspeonEx2(),
  new DarkraiEx2(),
  new ScizorEx2(),
  new MScizorEx2(),
  new GyaradosEx3(),
];
