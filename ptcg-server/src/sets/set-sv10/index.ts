import { Card } from '../../game/store/card/card';
import { Annihilape } from './annihilape';
import {Arbolivaex} from './arboliva-ex';
import { Blaziken } from './blaziken';
import { Cetitanex } from './cetitan-ex';
import { Cetoddle } from './cetoddle';
import {Clamperl} from './clamperl';
import { Combusken } from './combusken';
import {Dolliv} from './dolliv';
import {Gorebyss} from './gorebyss';
import { GraniteCave } from './granite-cave';
import {Huntail} from './huntail';
import { Mankey } from './mankey';
import { MarniesGrimmsnarlex } from './marnies-grimmsnarl-ex';
import { MarniesImpidimp } from './marnies-impidimp';
import { MarniesLiepard } from './marnies-liepard';
import { MarniesMorgrem } from './marnies-morgrem';
import { MarniesMorpeko } from './marnies-morpeko';
import { MarniesPurrloin } from './marnies-purrloin';
import { MarniesScrafty } from './marnies-scrafty';
import { MarniesScraggy } from './marnies-scraggy';
import { EnergyRecyclerSV10, MarniesMorpekoIR, StevensBeldumIR } from './other-prints';
import { Primeape } from './primeape';
import {Regirockex} from './regirock-ex';
import {Smoliv} from './smoliv';
import { SpikemuthGym } from './spikemuth-gym';
import { StevensBaltoy } from './stevens-baltoy';
import { StevensBeldum } from './stevens-beldum';
import { StevensCarbink } from './stevens-carbink';
import { StevensClaydol } from './stevens-claydol';
import { StevensMetagrossex } from './stevens-metagross-ex';
import { StevensMetang } from './stevens-metang';
import { StevensSkarmory } from './stevens-skarmory';
import { TeamRocketEnergy } from './team-rocket-energy';
import { TeamRocketsAmpharos } from './team-rockets-ampharos';
import {TeamRocketsArbok} from './team-rockets-arbok';
import { TeamRocketsArcher } from './team-rockets-archer';
import { TeamRocketsAriana } from './team-rockets-ariana';
import {TeamRocketsArticuno} from './team-rockets-articuno';
import {TeamRocketsChingling} from './team-rockets-chingling';
import {TeamRocketsCrobatex} from './team-rockets-crobat-ex';
import {TeamRocketsDrowzee} from './team-rockets-drowzee';
import {TeamRocketsEkans} from './team-rockets-ekans';
import {TeamRocketsFactory} from './team-rockets-factory';
import { TeamRocketsFlaaffy } from './team-rockets-flaaffy';
import { TeamRocketsGiovanni } from './team-rockets-giovanni';
import {TeamRocketsGolbat} from './team-rockets-golbat';
import { TeamRocketsGreatBall } from './team-rockets-great-ball';
import {TeamRocketsHypno} from './team-rockets-hypno';
import {TeamRocketsKoffing} from './team-rockets-koffing';
import {TeamRocketsLarvitar} from './team-rockets-larvitar';
import { TeamRocketsMareep } from './team-rockets-mareep';
import { TeamRocketsMeowth } from './team-rockets-meowth';
import { TeamRocketsMewtwoex } from './team-rockets-mewtwo-ex';
import {TeamRocketsMimikyu} from './team-rockets-mimikyu';
import {TeamRocketsMoltresex} from './team-rockets-moltres-ex';
import {TeamRocketsNidokingex} from './team-rockets-nidoking-ex';
import {TeamRocketsNidoqueen} from './team-rockets-nidoqueen';
import {TeamRocketsNidoranFemale} from './team-rockets-nidoran-female';
import {TeamRocketsNidoranMale} from './team-rockets-nidoran-male';
import {TeamRocketsNidorina} from './team-rockets-nidorina';
import {TeamRocketsNidorino} from './team-rockets-nidorino';
import { TeamRocketsPersianex } from './team-rockets-persian-ex';
import {TeamRocketsPetrel} from './team-rockets-petrel';
import { TeamRocketsPorygon } from './team-rockets-porygon';
import { TeamRocketsPorygonZ } from './team-rockets-porygon-z';
import { TeamRocketsPorygon2 } from './team-rockets-porygon2';
import {TeamRocketsProton} from './team-rockets-proton';
import {TeamRocketsPupitar} from './team-rockets-pupitar';
import { TeamRocketsReceiver } from './team-rockets-receiver';
import {TeamRocketsSneasel} from './team-rockets-sneasel';
import { TeamRocketsSpidops } from './team-rockets-spidops';
import { TeamRocketsTarountula } from './team-rockets-tarountula';
import {TeamRocketsTyranitar} from './team-rockets-tyranitar';
import {TeamRocketsVentureBomb} from './team-rockets-venture-bomb';
import {TeamRocketsWatchtower} from './team-rockets-watchtower';
import {TeamRocketsWeezing} from './team-rockets-weezing';
import { TeamRocketsWobbuffet } from './team-rockets-wobbuffet';
import {TeamRocketsZapdos} from './team-rockets-zapdos';
import {TeamRocketsZubat} from './team-rockets-zubat';
import { Torchic } from './torchic';

export const setSV10: Card[] = [
  new Cetoddle(),
  new Cetitanex(),
  new Torchic(),
  new Combusken(),
  new Blaziken(),
  new Mankey(),
  new Primeape(),
  new Annihilape(),
  new EnergyRecyclerSV10(),
  new Regirockex(),
  new Smoliv(),
  new Dolliv(),
  new Arbolivaex(),
  new Clamperl(),
  new Huntail(),
  new Gorebyss(),

  new MarniesMorpekoIR(),
  new MarniesImpidimp(),
  new MarniesMorgrem(),
  new MarniesGrimmsnarlex(),
  new MarniesMorpeko(),
  new MarniesPurrloin(),
  new MarniesLiepard(),
  new MarniesScrafty(),
  new MarniesScraggy(),
  new SpikemuthGym(),

  new StevensBeldumIR(),
  new StevensBeldum(),
  new StevensMetang(),
  new StevensMetagrossex(),
  new StevensCarbink(),
  new StevensBaltoy(),
  new StevensClaydol(),
  new StevensSkarmory(),
  new GraniteCave(),

  new TeamRocketsMewtwoex(),
  new TeamRocketsTarountula(),
  new TeamRocketsSpidops(),
  new TeamRocketsPorygon(),
  new TeamRocketsPorygon2(),
  new TeamRocketsPorygonZ(),
  new TeamRocketsReceiver(),
  new TeamRocketsArcher(),
  new TeamRocketsAriana(),
  new TeamRocketEnergy(),
  new TeamRocketsGiovanni(),
  new TeamRocketsMeowth(),
  new TeamRocketsPersianex(),
  new TeamRocketsMareep(),
  new TeamRocketsFlaaffy(),
  new TeamRocketsAmpharos(),
  new TeamRocketsWobbuffet(),
  new TeamRocketsGreatBall(),
  new TeamRocketsDrowzee(),
  new TeamRocketsHypno(),
  new TeamRocketsLarvitar(),
  new TeamRocketsPupitar(),
  new TeamRocketsTyranitar(),
  new TeamRocketsMoltresex(),
  new TeamRocketsArticuno(),
  new TeamRocketsZapdos(),
  new TeamRocketsZubat(),
  new TeamRocketsGolbat(),
  new TeamRocketsCrobatex(),
  new TeamRocketsVentureBomb(),
  new TeamRocketsPetrel(),
  new TeamRocketsProton(),
  new TeamRocketsSneasel(),
  new TeamRocketsKoffing(),
  new TeamRocketsWeezing(),
  new TeamRocketsMimikyu(),
  new TeamRocketsNidoranMale(),
  new TeamRocketsNidorino(),
  new TeamRocketsNidokingex(),
  new TeamRocketsNidoranFemale(),
  new TeamRocketsNidorina(),
  new TeamRocketsNidoqueen(),
  new TeamRocketsEkans(),
  new TeamRocketsArbok(),
  new TeamRocketsWatchtower(),
  new TeamRocketsFactory(),
  new TeamRocketsChingling(),
];