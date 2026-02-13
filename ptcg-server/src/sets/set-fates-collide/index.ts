import { Card } from '../../game/store/card/card';
import { Aerodactyl } from './aerodactyl';
import { AlakazamEx } from './alakazam-ex';
import { AltariaEx } from './altaria-ex';
import { AudinoEx } from './audino-ex';
import { Barbaracle } from './barbaracle';
import { Binacle } from './binacle';
import { Braixen } from './braixen';
import { Bronzong } from './bronzong';
import { BronzongBREAK } from './bronzong-break';
import { Bronzor } from './bronzor';
import { Burmy } from './burmy';
import { Carbink } from './carbink';
import { Carbink2 } from './carbink-2';
import { CarbinkBreak } from './carbink-break';
import { Cinccino } from './cinccino';
import { Cinccino2 } from './cinccino-2';
import { Cottonee } from './cottonee';
import { Deerling } from './deerling';
import { Delphox } from './delphox';
import { DelphoxBreak } from './delphox-break';
import { Dewgong } from './dewgong';
import { DiancieEx } from './diancie-ex';
import { Diglett } from './diglett';
import { Duosion } from './duosion';
import { Exploud } from './exploud';
import { Fennekin } from './fennekin';
import { Fennekin2 } from './fennekin-2';
import { GenesectEx } from './genesect-ex';
import { GenesectEx2 } from './genesect-ex-2';
import { GlaceonEx } from './glaceon-ex';
import { Gothita } from './gothita';
import { Grumpig } from './grumpig';
import { Hawlucha } from './hawlucha';
import { Jigglypuff } from './jigglypuff';
import { Kabuto } from './kabuto';
import { Kabutops } from './kabutops';
import { Kangaskhan } from './kangaskhan';
import { KingdraEx } from './kingdra-ex';
import { Koffing } from './koffing';
import { Larvitar } from './larvitar';
import { Larvitar2 } from './larvitar-2';
import { Loudred } from './loudred';
import { Lucario } from './lucario';
import { Lucario2 } from './lucario-2';
import { Lugia } from './lugia';
import { LugiaBreak } from './lugia-break';
import { MAlakazamEx } from './mega-alakazam-ex';
import { MAltariaEx } from './m-altaria-ex';
import { MAudinoEx } from './mega-audino-ex';
import { Mandibuzz } from './mandibuzz';
import { Marowak } from './marowak';
import { Meowth } from './meowth';
import { Mew } from './mew';
import { Minccino } from './minccino';
import { Minccino2 } from './minccino-2';
import { Moltres } from './moltres';
import { Mothim } from './mothim';
import { MrMime } from './mr-mime';
import { Omanyte } from './omanyte';
import { Omastar } from './omastar';
import { OmastarBreak } from './omastar-break';
import { Pupitar } from './pupitar';
import { RegirockEx } from './regirock-ex';
import { Reuniclus } from './reuniclus';
import { Riolu } from './riolu';
import { Riolu2 } from './riolu-2';
import { Rotom } from './rotom';
import { Seel } from './seel';
import { Serperior } from './serperior';
import { Servine } from './servine';
import { Shuckle } from './shuckle';
import { Snivy } from './snivy';
import { Snorlax } from './snorlax';
import { Snubbull } from './snubbull';
import { Solosis } from './solosis';
import { Spoink } from './spoink';
import { Tyranitar } from './tyranitar';
import { UmbreonEx } from './umbreon-ex';
import { Vullaby } from './vullaby';
import { Weezing } from './weezing';
import { Whimsicott } from './whimsicott';
import { Whismur } from './whismur';
import { WhiteKyurem } from './white-kyurem';
import { Wigglytuff } from './wigglytuff';
import { Wormadam } from './wormadam';
import { Wormadam2 } from './wormadam-2';
import { Wormadam3 } from './wormadam-3';
import { Zygarde } from './zygarde';
import { Zygarde2 } from './zygarde-2';
import { ZygardeEx } from './zygarde-ex';
import { AlakazamSpiritLink } from './alakazam-spirit-link';
import { AltariaSpiritLink } from './altaria-spirit-link';
import { AudinoSpiritLink } from './audino-spirit-link';
import { BentSpoon } from './bent-spoon';
import { ChaosTower } from './chaos-tower';
import { DomeFossilKabuto } from './dome-fossil-kabuto';
import { EnergyPouch } from './energy-pouch';
import { EnergyReset } from './energy-reset';
import { FairyDrop } from './fairy-drop';
import { FossilExcavationKit } from './fossil-excavation-kit';
import { HelixFossilOmanyte } from './helix-fossil-omanyte';
import { LasssSpecial } from './lasss-special';
import { MegaCatcher } from './mega-catcher';
import { N } from './n';
import { OldAmberAerodactyl } from './old-amber-aerodactyl';
import { PowerMemory } from './power-memory';
import { TeamRocketsHandiwork } from './team-rockets-handiwork';

import {
  RegirockEx2,
  ZygardeEx2,
  DevolutionSprayFCO,
  FairyGardenFCO,
  N2,
  PokemonFanClubFCO,
  RandomReceiverFCO,
  ScorchedEarthFCO,
  ShaunaFCO,
  Shauna2,
  UltraBallFCO,
  DoubleColorlessEnergyFCO,
  StrongEnergyFCO,
  GlaceonEx2,
  AlakazamEx2,
  MAlakazamEx2,
  UmbreonEx2,
  MAltariaEx2,
  KingdraEx2,
  AltariaEx2,
  TeamRocketsHandiwork2,
  AlakazamEx3,
} from './other-prints';

export const setFatesCollide: Card[] = [
  // Pokemon
  new Aerodactyl(),
  new AlakazamEx(),
  new AltariaEx(),
  new AudinoEx(),
  new Barbaracle(),
  new Binacle(),
  new Braixen(),
  new Bronzong(),
  new BronzongBREAK(),
  new Bronzor(),
  new Burmy(),
  new Carbink(),
  new Carbink2(),
  new CarbinkBreak(),
  new Cinccino(),
  new Cinccino2(),
  new Cottonee(),
  new Deerling(),
  new Delphox(),
  new DelphoxBreak(),
  new Dewgong(),
  new DiancieEx(),
  new Diglett(),
  new Duosion(),
  new Exploud(),
  new Fennekin(),
  new Fennekin2(),
  new GenesectEx(),
  new GenesectEx2(),
  new GlaceonEx(),
  new Gothita(),
  new Grumpig(),
  new Hawlucha(),
  new Jigglypuff(),
  new Kabuto(),
  new Kabutops(),
  new Kangaskhan(),
  new KingdraEx(),
  new Koffing(),
  new Larvitar(),
  new Larvitar2(),
  new Loudred(),
  new Lucario(),
  new Lucario2(),
  new Lugia(),
  new LugiaBreak(),
  new MAlakazamEx(),
  new MAltariaEx(),
  new MAudinoEx(),
  new Mandibuzz(),
  new Marowak(),
  new Meowth(),
  new Mew(),
  new Minccino(),
  new Minccino2(),
  new Moltres(),
  new Mothim(),
  new MrMime(),
  new Omanyte(),
  new Omastar(),
  new OmastarBreak(),
  new Pupitar(),
  new RegirockEx(),
  new Reuniclus(),
  new Riolu(),
  new Riolu2(),
  new Rotom(),
  new Seel(),
  new Serperior(),
  new Servine(),
  new Shuckle(),
  new Snivy(),
  new Snorlax(),
  new Snubbull(),
  new Solosis(),
  new Spoink(),
  new Tyranitar(),
  new UmbreonEx(),
  new Vullaby(),
  new Weezing(),
  new Whimsicott(),
  new Whismur(),
  new WhiteKyurem(),
  new Wigglytuff(),
  new Wormadam(),
  new Wormadam2(),
  new Wormadam3(),
  new Zygarde(),
  new Zygarde2(),
  new ZygardeEx(),

  // Trainers
  new AlakazamSpiritLink(),
  new AltariaSpiritLink(),
  new AudinoSpiritLink(),
  new BentSpoon(),
  new ChaosTower(),
  new DomeFossilKabuto(),
  new EnergyPouch(),
  new EnergyReset(),
  new FairyDrop(),
  new FossilExcavationKit(),
  new HelixFossilOmanyte(),
  new LasssSpecial(),
  new MegaCatcher(),
  new N(),
  new OldAmberAerodactyl(),
  new PowerMemory(),
  new TeamRocketsHandiwork(),

  // Other Prints (Reprints & Alt Arts)
  new RegirockEx2(),
  new ZygardeEx2(),
  new DevolutionSprayFCO(),
  new FairyGardenFCO(),
  new N2(),
  new PokemonFanClubFCO(),
  new RandomReceiverFCO(),
  new ScorchedEarthFCO(),
  new ShaunaFCO(),
  new Shauna2(),
  new UltraBallFCO(),
  new DoubleColorlessEnergyFCO(),
  new StrongEnergyFCO(),
  new GlaceonEx2(),
  new AlakazamEx2(),
  new MAlakazamEx2(),
  new UmbreonEx2(),
  new MAltariaEx2(),
  new KingdraEx2(),
  new AltariaEx2(),
  new TeamRocketsHandiwork2(),
  new AlakazamEx3(),
];
