import { Card } from '../../game/store/card/card';
import { Accelgor } from './accelgor';
import { Aerodactyl } from './aerodactyl';
import { Bisharp } from './bisharp';
import { Bisharp2 } from './bisharp-2';
import { Blaziken } from './blaziken';
import { Blissey } from './blissey';
import { Bulbasaur } from './bulbasaur';
import { Carnivine } from './carnivine';
import { Chansey } from './chansey';
import { Chansey2 } from './chansey-2';
import { Chatot } from './chatot';
import { Cofagrigus } from './cofagrigus';
import { Combusken } from './combusken';
import { Crustle } from './crustle';
import { DarkClaw } from './dark-claw';
import { DarkraiEx } from './darkrai-ex';
import { Drilbur } from './drilbur';
import { Ducklett } from './ducklett';
import { Dwebble } from './dwebble';
import { Eelektrik } from './eelektrik';
import { Eelektross } from './eelektross';
import { Eevee } from './eevee';
import { Eevee2 } from './eevee-2';
import { Empoleon } from './empoleon';
import { EnteiEx } from './entei-ex';
import { Escavalier } from './escavalier';
import { Espeon } from './espeon';
import { Excadrill } from './excadrill';
import { Excadrill2 } from './excadrill-2';
import { Flareon } from './flareon';
import { Galvantula } from './galvantula';
import { Gardevoir } from './gardevoir';
import { Glaceon } from './glaceon';
import { GroudonEx } from './groudon-ex';
import { Gurdurr } from './gurdurr';
import { Haxorus } from './haxorus';
import { Heatmor } from './heatmor';
import { Herdier } from './herdier';
import { HooligansJimAndCas } from './hooligans-jim-and-cas';
import { Ivysaur } from './ivysaur';
import { Jolteon } from './jolteon';
import { Joltik } from './joltik';
import { Joltik2 } from './joltik-2';
import { Karrablast } from './karrablast';
import { Klang } from './klang';
import { Klink } from './klink';
import { Klinklang } from './klinklang';
import { Krokorok } from './krokorok';
import { Krookodile } from './krookodile';
import { KyogreEx } from './kyogre-ex';
import { Larvesta } from './larvesta';
import { Larvesta2 } from './larvesta-2';
import { Leafeon } from './leafeon';
import { Lillipup } from './lillipup';
import { Minun } from './minun';
import { Palpitoad } from './palpitoad';
import { Pawniard } from './pawniard';
import { Piplup } from './piplup';
import { Plusle } from './plusle';
import { Prinplup } from './prinplup';
import { RaikouEx } from './raikou-ex';
import { RandomReceiver } from './random-receiver';
import { Sableye } from './sableye';
import { Sandile } from './sandile';
import { Scrafty } from './scrafty';
import { Scraggy } from './scraggy';
import { Scyther } from './scyther';
import { Shelmet } from './shelmet';
import { Slowbro } from './slowbro';
import { Slowking } from './slowking';
import { Slowpoke } from './slowpoke';
import { Stoutland } from './stoutland';
import { Swanna } from './swanna';
import { Timburr } from './timburr';
import { Torchic } from './torchic';
import { Torchic2 } from './torchic-2';
import { Torkoal } from './torkoal';
import { TornadusEx } from './tornadus-ex';
import { TwistMountain } from './twist-mountain';
import { Tympole } from './tympole';
import { Tynamo } from './tynamo';
import { Tynamo2 } from './tynamo-2';
import { Umbreon } from './umbreon';
import { Umbreon2 } from './umbreon-2';
import { Vanillish } from './vanillish';
import { Vanillite } from './vanillite';
import { Vaporeon } from './vaporeon';
import { Venusaur } from './venusaur';
import { Volcarona } from './volcarona';
import { Vullaby } from './vullaby';
import { Woobat } from './woobat';
import { Yamask } from './yamask';
import { Zoroark } from './zoroark';
import { Zorua } from './zorua';
import { Zorua2 } from './zorua-2';

import {
  ArcheopsDEX,
  CherenDEX,
  DarkPatchDEX,
  DarkraiExDEX,
  EnhancedHammerDEX,
  EnteiEx2,
  GardevoirDEX,
  GroudonEx2,
  KyogreEx2,
  NDEX,
  PokemonCatcherDEX,
  ProfessorJuniperDEX,
  RaikouEx2DEX,
  RareCandyDEX,
  TornadusEx2DEX,
  UltraBallDEX,
} from './other-prints';

export const setDarkExplorers: Card[] = [
  // Pokemon
  new Accelgor(),
  new Aerodactyl(),
  new Bisharp(),
  new Bisharp2(),
  new Blaziken(),
  new Blissey(),
  new Bulbasaur(),
  new Carnivine(),
  new Chansey(),
  new Chansey2(),
  new Chatot(),
  new Cofagrigus(),
  new Combusken(),
  new Crustle(),
  new DarkraiEx(),
  new Drilbur(),
  new Ducklett(),
  new Dwebble(),
  new Eelektrik(),
  new Eelektross(),
  new Eevee(),
  new Eevee2(),
  new Empoleon(),
  new EnteiEx(),
  new Escavalier(),
  new Espeon(),
  new Excadrill(),
  new Excadrill2(),
  new Flareon(),
  new Galvantula(),
  new Gardevoir(),
  new Glaceon(),
  new GroudonEx(),
  new Gurdurr(),
  new Haxorus(),
  new Heatmor(),
  new Herdier(),
  new Ivysaur(),
  new Jolteon(),
  new Joltik(),
  new Joltik2(),
  new Karrablast(),
  new Klang(),
  new Klink(),
  new Klinklang(),
  new Krokorok(),
  new Krookodile(),
  new KyogreEx(),
  new Larvesta(),
  new Larvesta2(),
  new Leafeon(),
  new Lillipup(),
  new Minun(),
  new Palpitoad(),
  new Pawniard(),
  new Piplup(),
  new Plusle(),
  new Prinplup(),
  new RaikouEx(),
  new Sableye(),
  new Sandile(),
  new Scrafty(),
  new Scraggy(),
  new Scyther(),
  new Shelmet(),
  new Slowbro(),
  new Slowking(),
  new Slowpoke(),
  new Stoutland(),
  new Swanna(),
  new Timburr(),
  new Torchic(),
  new Torchic2(),
  new Torkoal(),
  new TornadusEx(),
  new Tympole(),
  new Tynamo(),
  new Tynamo2(),
  new Umbreon(),
  new Umbreon2(),
  new Vanillish(),
  new Vanillite(),
  new Vaporeon(),
  new Venusaur(),
  new Volcarona(),
  new Vullaby(),
  new Woobat(),
  new Yamask(),
  new Zoroark(),
  new Zorua(),
  new Zorua2(),

  // Trainers
  new DarkClaw(),
  new HooligansJimAndCas(),
  new RandomReceiver(),
  new TwistMountain(),

  // Other Prints (Reprints & Alt Arts)
  new ArcheopsDEX(),
  new CherenDEX(),
  new DarkPatchDEX(),
  new DarkraiExDEX(),
  new EnhancedHammerDEX(),
  new EnteiEx2(),
  new GardevoirDEX(),
  new GroudonEx2(),
  new KyogreEx2(),
  new NDEX(),
  new PokemonCatcherDEX(),
  new ProfessorJuniperDEX(),
  new RaikouEx2DEX(),
  new RareCandyDEX(),
  new TornadusEx2DEX(),
  new UltraBallDEX(),
];
