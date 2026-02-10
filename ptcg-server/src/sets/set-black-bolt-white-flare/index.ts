import { Card } from '../../game/store/card/card';
import { Alomomola } from './alomomola';
import { Amoongus } from './amoongus';
import { AntiquePlumeFossil } from './antique-plume-fossil';
import { Archen } from './archen';
import { Archeops } from './archeops';
import { Axew } from './axew';
import { Karrablast } from './karrablast';
import { BraveBangle } from './brave-bangle';
import { Carracosta } from './carracosta';
import { Cobalion } from './cobalion';
import { Cottonee } from './cottonee';
import { Dewott } from './dewott';
import { Drillbur } from './drillbur';
import { Ducklett } from './ducklett';
import { Duosion } from './duosion';
import { Durant } from './durant';
import { Eelektrik } from './eelektrik';
import { Emboar } from './emboar';
import { Emolga } from './emolga';
import { EnergyCoin } from './energy-coin';
import { Excadrillex } from './excadrill-ex';
import { Fennel } from './fennel';
import { Foongus } from './foongus';
import { Fraxure } from './fraxure';
import { Frillish } from './frillish';
import { Genesectex } from './genesect-ex';
import { Gothita } from './gothita';
import { Gothorita } from './gothorita';
import { Gothitelle } from './gothitelle';
import { Harlequin } from './harlequin';
import { Haxorus } from './haxorus';
import { Hilda } from './hilda';
import { IgnitionEnergy } from './ignition-energy';
import { Jellicentex } from './jellicent-ex';
import { Keldeoex } from './keldeo-ex';
import { Kyuremex } from './kyurem-ex';
import { Larvesta } from './larvesta';
import { Meloettaex } from './meloetta-ex';
import { NsPlan } from './ns-plan';
import { Oshawott } from './oshawott';
import { AirBalloonSV11, CarracostaAR, AlomomolaAR, CherenSV11, EnergyRetrievalSV11, LarvestaAR, PrismEnergySV11, ProfessorsResearchSV11, SeismitoadAR, TirtougaAR, ServineAR, SnivyAR, TympoleAR, VictiniAR, VolcaronaAR, HaxorusAR, FraxureAR, AxewAR, CobalionAR, DrillburAR, EelektrikAR, CottoneeAR, EmolgaAR, PalpitoadAR, TynamoAR, ExcadrillexFA, FennelFA, GenesectexFA, KyuremexFA, MeloettaexFA, SerperiorexFA, ZekromexFA, ExcadrillexSIR, GenesectexSIR, KyuremexSIR, MeloettaexSIR, SerperiorexSIR, ZekromexSIR, ZekromexBR, JoltikAR, GalvantulaAR, DewottAR, EmboarAR, FrillishAR, OshawottAR, PigniteAR, SamurottAR, TepigAR, VirizionAR, ArchenAR, ArcheopsAR, DeinoAR, TerrakionAR, ZoroarkAR, ZoruaAR, ZweilousAR, ReshiramexFA, KeldeoexFA, WhimsicottexFA, HydreigonexFA, JellicentexFA, BouffalantexFA, HildaFA, HildaSIR, BouffalantexSIR, HydreigonexSIR, JellicentexSIR, KeldeoexSIR, ReshiramexSIR, WhimsicottexSIR, ReshiramexWR, ToolScrapperSV11, NsPlanFA, NsPlanSIR, VictiniRRB, VictiniRRW } from './other-prints';
import { Palpitoad } from './palpitoad';
import { Pignite } from './pignite';
import { Purrloin } from './purrloin';
import { Reshiramex } from './reshiram-ex';
import { Reuniclus } from './reuniclus';
import { Samurott } from './samurott';
import { Seismitoad } from './seismitoad';
import { Serperiorex } from './serperior-ex';
import { Servine } from './servine';
import { Shelmet } from './shelmet';
import { Snivy } from './snivy';
import { Solosis } from './solosis';
import { Swadloon } from './swadloon';
import { Tepig } from './tepig';
import { Terrakion } from './terrakion';
import { Tirtouga } from './tirtouga';
import { Tympole } from './tympole';
import { Tynamo } from './tynamo';
import { Victini } from './victini';
import { Virizion } from './virizion';
import { Volcarona } from './volcarona';
import { Whimsicottex } from './whimsicott-ex';
import { Zekromex } from './zekrom-ex';
import { Zoroark } from './zoroark';
import { Zorua } from './zorua';

export const setSV11: Card[] = [
  new Harlequin(),
  new Purrloin(),
  new Gothita(),
  new Gothorita(),
  new Gothitelle(),
  new Victini(),
  new Snivy(),
  new Servine(),
  new Serperiorex(),
  new Tepig(),
  new Pignite(),
  new Emboar(),
  new Oshawott(),
  new Dewott(),
  new Samurott(),
  new Tynamo(),
  new Eelektrik(),
  new Kyuremex(),
  new Zekromex(),
  new Reshiramex(),
  new Hilda(),
  new Foongus(),
  new Amoongus(),
  new Zorua(),
  new Zoroark(),
  new Solosis(),
  new Swadloon(),
  new Duosion(),
  new Reuniclus(),
  new Shelmet(),
  new Karrablast(),
  new AntiquePlumeFossil(),
  new Archen(),
  new Archeops(),
  new Carracosta(),
  new Cobalion(),
  new Durant(),
  new Genesectex(),
  new Keldeoex(),
  new Terrakion(),
  new Tirtouga(),
  new Virizion(),
  new Alomomola(),
  new Drillbur(),
  new Emolga(),
  new EnergyCoin(),
  new Excadrillex(),
  new Fennel(),
  new Larvesta(),
  new Meloettaex(),
  new Palpitoad(),
  new Seismitoad(),
  new Tympole(),
  new Volcarona(),
  new Ducklett(),

  new CherenSV11(),
  new ProfessorsResearchSV11(),

  new EnergyRetrievalSV11(),
  new ToolScrapperSV11(),
  new AirBalloonSV11(),

  new IgnitionEnergy(),
  new PrismEnergySV11(),

  new Axew(),
  new Fraxure(),
  new Haxorus(),
  new Cottonee(),
  new Whimsicottex(),
  new NsPlan(),
  new BraveBangle(),

  new Frillish(),
  new Jellicentex(),

  //SV11B ARs
  new SnivyAR(),
  new ServineAR(),
  new VictiniAR(),
  new LarvestaAR(),
  new VolcaronaAR(),
  new TympoleAR(),
  new PalpitoadAR(),
  new SeismitoadAR(),
  new TirtougaAR(),
  new CarracostaAR(),
  new AlomomolaAR(),
  new EmolgaAR(),
  new TynamoAR(),
  new EelektrikAR(),
  new DrillburAR(),
  new CobalionAR(),
  new AxewAR(),
  new FraxureAR(),
  new HaxorusAR(),

  //SV11B FA
  new SerperiorexFA(),
  new KyuremexFA(),
  new ZekromexFA(),
  new MeloettaexFA(),
  new ExcadrillexFA(),
  new GenesectexFA(),
  new NsPlanFA(),
  new FennelFA(),

  //SV11B SIR
  new SerperiorexSIR(),
  new KyuremexSIR(),
  new ZekromexSIR(),
  new MeloettaexSIR(),
  new ExcadrillexSIR(),
  new GenesectexSIR(),
  new NsPlanSIR(),

  //SV11B RRB
  new VictiniRRB(),

  //SV11B BR
  new ZekromexBR(),

  //SV11W ARs
  new CottoneeAR(),
  new VirizionAR(),
  new TepigAR(),
  new PigniteAR(),
  new EmboarAR(),
  new OshawottAR(),
  new DewottAR(),
  new SamurottAR(),
  new JoltikAR(),
  new GalvantulaAR(),
  new FrillishAR(),
  new ArchenAR(),
  new ArcheopsAR(),
  new TerrakionAR(),
  new ZoruaAR(),
  new ZoroarkAR(),
  new DeinoAR(),
  new ZweilousAR(),

  //SV11W FA
  new WhimsicottexFA(),
  new ReshiramexFA(),
  new KeldeoexFA(),
  new JellicentexFA(),
  new HydreigonexFA(),
  new BouffalantexFA(),
  new HildaFA(),

  //SV11W SIR
  new WhimsicottexSIR(),
  new ReshiramexSIR(),
  new KeldeoexSIR(),
  new JellicentexSIR(),
  new HydreigonexSIR(),
  new BouffalantexSIR(),
  new HildaSIR(),

  //SV11W RRW
  new VictiniRRW(),

  //SV11W WR
  new ReshiramexWR(),
];
