import { Card } from '../../game/store/card/card';
import { Abomasnow } from './abomasnow';
import { Aegislash } from './aegislash';
import { AlolanExeggutor } from './alolan-exeggutor';
import { AlolanMarowak } from './alolan-marowak';
import { Amaura } from './amaura';
import { Araquanid } from './araquanid';
import { Arceus } from './arceus';
import { Aurorus } from './aurorus';
import { Avalugg } from './avalugg';
import { Azelf } from './azelf';
import { Barbaracle } from './barbaracle';
import { Bergmite } from './bergmite';
import { Binacle } from './binacle';
import { Braixen } from './braixen';
import { Bunnelby } from './bunnelby';
import { Buzzwole } from './buzzwole';
import { Clauncher } from './clauncher';
import { Clawitzer } from './clawitzer';
import { Cubone } from './cubone';
import { Dedenne } from './dedenne';
import { Delphox } from './delphox';
import { Dewpider } from './dewpider';
import { DialgaGX } from './dialga-gx';
import { Diancie } from './diancie';
import { DianciePrismStar } from './diancie-prism-star';
import { Diggersby } from './diggersby';
import { Honedge2 } from './honedge-2';
import { Doublade } from './doublade';
import { Dragalge } from './dragalge';
import { Espurr } from './espurr';
import { Exeggcute } from './exeggcute';
import { Fennekin } from './fennekin';
import { Fennekin2 } from './fennekin-2';
import { Flabebe } from './flabebe';
import { Flabebe2 } from './flabebe-2';
import { Floette } from './floette';
import { Florges } from './florges';
import { Froakie } from './froakie';
import { FroakieFrubbles } from './froakie-2';
import { Frogadier } from './frogadier';
import { Furfrou } from './furfrou';
import { Gabite } from './gabite';
import { Gogoat } from './gogoat';
import { Goodra } from './goodra';
import { Goomy } from './goomy';
import { Goomy2 } from './goomy-2';
import { GreninjaGX } from './greninja-gx';
import { Guzzlord } from './guzzlord';
import { Hawlucha } from './hawlucha';
import { Heliolisk } from './heliolisk';
import { Helioptile } from './helioptile';
import { Honedge } from './honedge';
import { Hoopa } from './hoopa';
import { Infernape } from './infernape';
import { Inkay } from './inkay';
import { Klefki } from './klefki';
import { Litleo } from './litleo';
import { Lycanroc } from './lycanroc';
import { Magnemite } from './magnemite';
import { Magnezone } from './magnezone';
import { Malamar } from './malamar';
import { Meowstic } from './meowstic';
import { Mesprit } from './mesprit';
import { NaganadelGX } from './naganadel-gx';
import { Noibat } from './noibat';
import { Noivern } from './noivern';
import { Pancham } from './pancham';
import { Pangoro } from './pangoro';
import { Pheromosa } from './pheromosa';
import { Poipole } from './poipole';
import { Pyroar } from './pyroar';
import { Rockruff } from './rockruff';
import { Rotom } from './rotom';
import { Scatterbug } from './scatterbug';
import { Scatterbug2 } from './scatterbug-2';
import { Skiddo } from './skiddo';
import { Skrelp } from './skrelp';
import { Sliggoo } from './sliggoo';
import { Spewpa } from './spewpa';
import { Sylveon } from './sylveon';
import { Tyrantrum } from './tyrantrum';
import { Tyrunt } from './tyrunt';
import { UltraNecrozmaGX } from './ultra-necrozma-gx';
import { Uxie } from './uxie';
import { Vivillon } from './vivillon';
import { Volcanion } from './volcanion';
import { VolcanionPrismStar } from './volcanion-prism-star';
import { XerneasGX } from './xerneas-gx';
import { Xurkitree } from './xurkitree';
import { YveltalGX } from './yveltal-gx';
import { Zygarde } from './zygarde';
import { Zygarde2 } from './zygarde-2';
import { ZygardeGx } from './zygarde-gx';
import { BeastRing } from './beast-ring';
import { Bonnie } from './bonnie';
import { CrasherWake } from './crasher-wake';
import { Diantha } from './diantha';
import { Eneporter } from './eneporter';
import { FossilExcavationMap } from './fossil-excavation-map';
import { Lysandre } from './lysandre';
import { LysandreLabs } from './lysandre-labs';
import { LysandrePrismStar } from './lysandre-prism-star';
import { MetalFryingPan } from './metal-frying-pan';
import { MysteriousTreasure } from './mysterious-treasure';
import { UltraReconSquad } from './ultra-recon-squad';
import { UltraSpace } from './ultra-space';
import { BeastEnergy } from './beast-energy-prism-star';
import { UnitEnergyFDY } from './unit-energy-fdy';

import {
  LadyFLI,
  MysteriousTreasureFLI,
  JudgeULFLI,
  UnidentifiedFossilFLI,
  GreninjaGX2FLI,
  NaganadelGX2FLI,
  LucarioGXFLI,
  YveltalGX2FLI,
  DialgaGX2FLI,
  XerneasGX2FLI,
  UltraNecrozmaGX2FLI,
  Diantha2FLI,
  GreninjaGX3FLI,
  NaganadelGX3FLI,
  LucarioGX2FLI,
  YveltalGX3FLI,
  DialgaGX3FLI,
  XerneasGX3FLI,
  UltraNecrozmaGX3FLI,
  BeastRing3FLI,
  EnergyRecyclerFLI,
  MetalFryingPan3FLI,
  MysteriousTreasure3FLI,
  UnitEnergyFDY2FLI,
  AlolanExeggutor2FLI,
  BeastRing2FLI,
  MetalFryingPan2FLI,
  SnoverFLI,
  HeatranFLI,
  PalkiaGxFLI,
  MagnetonFLI,
  TorterraFLI,
  GibleFLI,
  GarchompFLI,
  CroagunkFLI,
  ToxicroakFLI,
  EmpoleonFLI,
  PalkiaGx2,
  ZygardeGx2,
  Bonnie2,
  CrasherWake2,
  UltraReconSquad2,
  PalkiaGx3,
  ZygardeGx3,
  Eneporter2,
} from './other-prints';

export const setForbiddenLight: Card[] = [
  // Pokemon
  new Abomasnow(),
  new Aegislash(),
  new AlolanExeggutor(),
  new AlolanMarowak(),
  new Amaura(),
  new Araquanid(),
  new Arceus(),
  new Aurorus(),
  new Avalugg(),
  new Azelf(),
  new Barbaracle(),
  new Bergmite(),
  new Binacle(),
  new Braixen(),
  new Bunnelby(),
  new Buzzwole(),
  new Clauncher(),
  new Clawitzer(),
  new Cubone(),
  new Dedenne(),
  new Delphox(),
  new Dewpider(),
  new DialgaGX(),
  new Diancie(),
  new DianciePrismStar(),
  new Diggersby(),
  new Doublade(),
  new Dragalge(),
  new Espurr(),
  new Exeggcute(),
  new Fennekin(),
  new Fennekin2(),
  new Flabebe(),
  new Flabebe2(),
  new Floette(),
  new Florges(),
  new Froakie(),
  new FroakieFrubbles(),
  new Frogadier(),
  new Furfrou(),
  new Gabite(),
  new Gogoat(),
  new Goodra(),
  new Goomy(),
  new Goomy2(),
  new GreninjaGX(),
  new Guzzlord(),
  new Hawlucha(),
  new Heliolisk(),
  new Helioptile(),
  new Honedge(),
  new Honedge2(),
  new Hoopa(),
  new Infernape(),
  new Inkay(),
  new Klefki(),
  new Litleo(),
  new Lycanroc(),
  new Magnemite(),
  new Magnezone(),
  new Malamar(),
  new Meowstic(),
  new Mesprit(),
  new NaganadelGX(),
  new Noibat(),
  new Noivern(),
  new Pancham(),
  new Pangoro(),
  new Pheromosa(),
  new Poipole(),
  new Pyroar(),
  new Rockruff(),
  new Rotom(),
  new Scatterbug(),
  new Scatterbug2(),
  new Skiddo(),
  new Skrelp(),
  new Sliggoo(),
  new Spewpa(),
  new Sylveon(),
  new Tyrantrum(),
  new Tyrunt(),
  new UltraNecrozmaGX(),
  new Uxie(),
  new Vivillon(),
  new Volcanion(),
  new VolcanionPrismStar(),
  new XerneasGX(),
  new Xurkitree(),
  new YveltalGX(),
  new Zygarde(),
  new Zygarde2(),
  new ZygardeGx(),

  // Trainers
  new BeastRing(),
  new Bonnie(),
  new CrasherWake(),
  new Diantha(),
  new Eneporter(),
  new FossilExcavationMap(),
  new Lysandre(),
  new LysandreLabs(),
  new LysandrePrismStar(),
  new MetalFryingPan(),
  new MysteriousTreasure(),
  new UltraReconSquad(),
  new UltraSpace(),

  // Energy
  new BeastEnergy(),
  new UnitEnergyFDY(),

  // Other Prints (Reprints & Alt Arts)
  new LadyFLI(),
  new MysteriousTreasureFLI(),
  new JudgeULFLI(),
  new UnidentifiedFossilFLI(),
  new GreninjaGX2FLI(),
  new NaganadelGX2FLI(),
  new LucarioGXFLI(),
  new YveltalGX2FLI(),
  new DialgaGX2FLI(),
  new XerneasGX2FLI(),
  new UltraNecrozmaGX2FLI(),
  new Diantha2FLI(),
  new GreninjaGX3FLI(),
  new NaganadelGX3FLI(),
  new LucarioGX2FLI(),
  new YveltalGX3FLI(),
  new DialgaGX3FLI(),
  new XerneasGX3FLI(),
  new UltraNecrozmaGX3FLI(),
  new BeastRing3FLI(),
  new EnergyRecyclerFLI(),
  new MetalFryingPan3FLI(),
  new MysteriousTreasure3FLI(),
  new UnitEnergyFDY2FLI(),
  new AlolanExeggutor2FLI(),
  new BeastRing2FLI(),
  new MetalFryingPan2FLI(),
  new SnoverFLI(),
  new HeatranFLI(),
  new PalkiaGxFLI(),
  new MagnetonFLI(),
  new TorterraFLI(),
  new GibleFLI(),
  new GarchompFLI(),
  new CroagunkFLI(),
  new ToxicroakFLI(),
  new EmpoleonFLI(),
  new PalkiaGx2(),
  new ZygardeGx2(),
  new Bonnie2(),
  new CrasherWake2(),
  new UltraReconSquad2(),
  new PalkiaGx3(),
  new ZygardeGx3(),
  new Eneporter2(),
];
