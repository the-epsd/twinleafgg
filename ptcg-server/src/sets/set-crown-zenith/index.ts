import { Card } from '../../game/store/card/card';
import { Absol } from './absol';
import { Aggron } from './aggron';
import { Aron } from './aron';
import { Bellossom } from './bellossom';
import { Bidoof } from './bidoof';
import { Bisharp } from './bisharp';
import { Calyrex } from './calyrex';
import { Carnivine } from './carnivine';
import { Chatot } from './chatot';
import { Dragalge } from './dragalge';
import { Dubwool } from './dubwool';
import { Eelektrik } from './eelektrik';
import { EeveeV } from './eevee-v';
import { Enamorus } from './enamorus';
import { Entei } from './entei';
import { Exeggcute } from './exeggcute';
import { Exeggutor } from './exeggutor';
import { GalarianMeowth } from './galarian-meowth';
import { GalarianPerrserker } from './galarian-perrserker';
import { Girafarig } from './girafarig';
import { GlaceonV } from './glaceon-v';
import { Gloom } from './gloom';
import { Gumshoos } from './gumshoos';
import { HattereneV } from './hatterene-v';
import { HattereneVmax } from './hatterene-vmax';
import { Heliolisk } from './heliolisk';
import { Helioptile } from './helioptile';
import { Hoopa } from './hoopa';
import { Kyogre } from './kyogre';
import { KyogreV } from './kyogre-v';
import { Lairon } from './lairon';
import { Larvesta } from './larvesta';
import { LeafeonV } from './leafeon-v';
import { LeafeonVstar } from './leafeon-vstar';
import { Liepard } from './liepard';
import { Luvdisc } from './luvdisc';
import { Luxio2 } from './luxio-2';
import { Luxray } from './luxray';
import { Luxray2 } from './luxray-2';
import { Lycanroc } from './lycanroc';
import { Mewtwo } from './mewtwo';
import { Oddish } from './oddish';
import { Oranguru } from './oranguru';
import { Pancham } from './pancham';
import { Pangoro } from './pangoro';
import { Pawniard2 } from './pawniard-2';
import { Pikachu } from './pikachu';
import { Pincurchin } from './pincurchin';
import { Purrloin } from './purrloin';
import { RadiantCharizard } from './radiant-charizard';
import { RadiantCharjabug } from './radiant-charjabug';
import { RadiantEternatus } from './radiant-eternatus';
import { RegigigasV } from './regigigas-v';
import { RegigigasVSTAR } from './regigigas-vstar';
import { Rockruff } from './rockruff';
import { RotomVstar } from './rotom-vstar';
import { Salandit } from './salandit';
import { Salazzle } from './salazzle';
import { Scizor } from './scizor';
import { Scyther } from './scyther';
import { Shaymin } from './shaymin';
import { Shinx2 } from './shinx-2';
import { SimisearVstar } from './simisear-vstar';
import { Skrelp } from './skrelp';
import { Tangela } from './tangela';
import { Tangrowth } from './tangrowth';
import { TapuLele } from './tapu-lele';
import { Tauros } from './tauros';
import { Volcanion } from './volcanion';
import { Volcarona } from './volcarona';
import { Wailmer } from './wailmer';
import { Wailord } from './wailord';
import { Wooloo } from './wooloo';
import { Yanma } from './yanma';
import { Yanmega } from './yanmega';
import { Yungoos } from './yungoos';
import { Zacian } from './zacian';
import { ZacianV } from './zacian-v';
import { ZacianVSTAR } from './zacian-vstar';
import { Zamazenta } from './zamazenta';
import { ZamazentaV } from './zamazenta-v';
import { ZamazentaVstar } from './zamazenta-vstar';
import { Zarude } from './zarude';
import { ZeraoraV } from './zeraora-v';
import { ZeraoraVMAX } from './zeraora-vmax';
import { ZeraoraVSTAR } from './zeraora-vstar';
import { DiggingDuo } from './digging-duo';
import { FriendsInHisui } from './friends-in-hisui';
import { FriendsInSinnoh } from './friends-in-sinnoh';
import { SkySealStone } from './sky-seal-stone';

import {
  LostVacuumCRZ,
  RescueCarrierCRZ,
  KricketotCRZ,
  CherubiCRZ,
  SnoruntCRZ,
  RotomVCRZ,
  MewVCRZ,
  LunatoneCRZ,
  SolrockCRZ,
  RioluCRZ,
  RayquazaVCRZ,
  RayquazaVMAXCRZ,
  RayquazaVMAX2CRZ,
  DuraludonVCRZ,
  DuraludonVMAXCRZ,
  DittoCRZ,
  StoutlandVCRZ,
  GreedentVCRZ,
  BedeCRZ,
  CrushingHammerCRZ,
  EnergyRetrievalCRZ,
  EnergySearchCRZ,
  EnergySwitchPKCRZ,
  GreatBallCRZ,
  HopCRZ,
  LeonCRZ,
  NessaCRZ,
  PokeBallCRZ,
  PokemonCatcherCRZ,
  PotionCRZ,
  RaihanCRZ,
  RareCandyCRZ,
  SwitchCRZ,
  TrekkingShoesCRZ,
  UltraBallCRZ,
  ElesasSparkleCRZ,
  ProfessorsResearchCRZ,
  VoloCRZ,
  GrassEnergyCRZ,
  FireEnergyCRZ,
  WaterEnergyCRZ,
  LightningEnergyCRZ,
  PsychicEnergyCRZ,
  FightingEnergyCRZ,
  DarknessEnergyCRZ,
  MetalEnergyCRZ,
  KricketuneCRZ,
  MagmortarCRZ,
  OricorioCRZ,
  LaprasCRZ,
  ManaphyCRZ,
  KeldeoCRZ,
  ElectivireCRZ,
  MewCRZ,
  Lunatone2CRZ,
  DeoxysCRZ,
  DiancieCRZ,
  ComfeyCRZ,
  Solrock2CRZ,
  Absol2CRZ,
  MagnezoneCRZ,
  AltariaCRZ,
  Ditto2CRZ,
  DunsparceCRZ,
  MiltankCRZ,
  BibarelCRZ,
  Riolu2CRZ,
  SwabluCRZ,
  DuskullCRZ,
  Bidoof2CRZ,
  Pikachu2CRZ,
  MareepCRZ,
  EnteiVCRZ,
  SuicuneVCRZ,
  LumineonVCRZ,
  RaikouVCRZ,
  ZeraoraVMAX2CRZ,
  ZeraoraVSTAR2CRZ,
  ZacianV2CRZ,
  DrapionVCRZ,
  DarkraiVSTARCRZ,
  HisuianSamurottVCRZ,
  HisuianSamurottVSTARCRZ,
  ZamazentaV2CRZ,
  RegigigasVSTAR2CRZ,
  HisuianZoroarkVSTARCRZ,
  AdamanCRZ,
  CherensCareCRZ,
  ColresssExperimentCRZ,
  CynthiasAmbitionCRZ,
  GardeniasVigorCRZ,
  GrantCRZ,
  IridaCRZ,
  MelonyCRZ,
  Raihan2CRZ,
  RoxanneCRZ,
  OriginFormePalkiaVSTARCRZ,
  OriginFormeDialgaVSTARCRZ,
  GiratinaVSTARCRZ,
  ArceusVSTARCRZ,
  SunkernCRZ,
  GrubbinCRZ,
  CharizardVCRZ,
  CharizardVstarCRZ,
  SimisearVCRZ,
  SeelCRZ,
  GalarianMrMimeCRZ,
  CorphishCRZ,
  ShinxCRZ,
  LuxioCRZ,
  EmolgaCRZ,
  ZeraoraCRZ,
  DusclopsCRZ,
  GravelerCRZ,
  BaltoyCRZ,
  KoffingCRZ,
  KrokorokCRZ,
  MetangCRZ,
  PawniardCRZ,
  SnorlaxCRZ,
  StarlyCRZ,
  BeaCRZ,
  FriendsInHisui2,
  FriendsInSinnoh2,
} from './other-prints';

export const setCrownZenith: Card[] = [
  // Pokemon
  new Absol(),
  new Aggron(),
  new Aron(),
  new Bellossom(),
  new Bidoof(),
  new Bisharp(),
  new Calyrex(),
  new Carnivine(),
  new Chatot(),
  new Dragalge(),
  new Dubwool(),
  new Eelektrik(),
  new EeveeV(),
  new Enamorus(),
  new Entei(),
  new Exeggcute(),
  new Exeggutor(),
  new GalarianMeowth(),
  new GalarianPerrserker(),
  new Girafarig(),
  new GlaceonV(),
  new Gloom(),
  new Gumshoos(),
  new HattereneV(),
  new HattereneVmax(),
  new Heliolisk(),
  new Helioptile(),
  new Hoopa(),
  new Kyogre(),
  new KyogreV(),
  new Lairon(),
  new Larvesta(),
  new LeafeonV(),
  new LeafeonVstar(),
  new Liepard(),
  new Luvdisc(),
  new Luxio2(),
  new Luxray(),
  new Luxray2(),
  new Lycanroc(),
  new Mewtwo(),
  new Oddish(),
  new Oranguru(),
  new Pancham(),
  new Pangoro(),
  new Pawniard2(),
  new Pikachu(),
  new Pincurchin(),
  new Purrloin(),
  new RadiantCharizard(),
  new RadiantCharjabug(),
  new RadiantEternatus(),
  new RegigigasV(),
  new RegigigasVSTAR(),
  new Rockruff(),
  new RotomVstar(),
  new Salandit(),
  new Salazzle(),
  new Scizor(),
  new Scyther(),
  new Shaymin(),
  new Shinx2(),
  new SimisearVstar(),
  new Skrelp(),
  new Tangela(),
  new Tangrowth(),
  new TapuLele(),
  new Tauros(),
  new Volcanion(),
  new Volcarona(),
  new Wailmer(),
  new Wailord(),
  new Wooloo(),
  new Yanma(),
  new Yanmega(),
  new Yungoos(),
  new Zacian(),
  new ZacianV(),
  new ZacianVSTAR(),
  new Zamazenta(),
  new ZamazentaV(),
  new ZamazentaVstar(),
  new Zarude(),
  new ZeraoraV(),
  new ZeraoraVMAX(),
  new ZeraoraVSTAR(),

  // Trainers
  new DiggingDuo(),
  new FriendsInHisui(),
  new FriendsInSinnoh(),
  new SkySealStone(),

  // Other Prints (Reprints & Alt Arts)
  new LostVacuumCRZ(),
  new RescueCarrierCRZ(),
  new KricketotCRZ(),
  new CherubiCRZ(),
  new SnoruntCRZ(),
  new RotomVCRZ(),
  new MewVCRZ(),
  new LunatoneCRZ(),
  new SolrockCRZ(),
  new RioluCRZ(),
  new RayquazaVCRZ(),
  new RayquazaVMAXCRZ(),
  new RayquazaVMAX2CRZ(),
  new DuraludonVCRZ(),
  new DuraludonVMAXCRZ(),
  new DittoCRZ(),
  new StoutlandVCRZ(),
  new GreedentVCRZ(),
  new BedeCRZ(),
  new CrushingHammerCRZ(),
  new EnergyRetrievalCRZ(),
  new EnergySearchCRZ(),
  new EnergySwitchPKCRZ(),
  new GreatBallCRZ(),
  new HopCRZ(),
  new LeonCRZ(),
  new NessaCRZ(),
  new PokeBallCRZ(),
  new PokemonCatcherCRZ(),
  new PotionCRZ(),
  new RaihanCRZ(),
  new RareCandyCRZ(),
  new SwitchCRZ(),
  new TrekkingShoesCRZ(),
  new UltraBallCRZ(),
  new ElesasSparkleCRZ(),
  new ProfessorsResearchCRZ(),
  new VoloCRZ(),
  new GrassEnergyCRZ(),
  new FireEnergyCRZ(),
  new WaterEnergyCRZ(),
  new LightningEnergyCRZ(),
  new PsychicEnergyCRZ(),
  new FightingEnergyCRZ(),
  new DarknessEnergyCRZ(),
  new MetalEnergyCRZ(),
  new KricketuneCRZ(),
  new MagmortarCRZ(),
  new OricorioCRZ(),
  new LaprasCRZ(),
  new ManaphyCRZ(),
  new KeldeoCRZ(),
  new ElectivireCRZ(),
  new MewCRZ(),
  new Lunatone2CRZ(),
  new DeoxysCRZ(),
  new DiancieCRZ(),
  new ComfeyCRZ(),
  new Solrock2CRZ(),
  new Absol2CRZ(),
  new MagnezoneCRZ(),
  new AltariaCRZ(),
  new Ditto2CRZ(),
  new DunsparceCRZ(),
  new MiltankCRZ(),
  new BibarelCRZ(),
  new Riolu2CRZ(),
  new SwabluCRZ(),
  new DuskullCRZ(),
  new Bidoof2CRZ(),
  new Pikachu2CRZ(),
  new MareepCRZ(),
  new EnteiVCRZ(),
  new SuicuneVCRZ(),
  new LumineonVCRZ(),
  new RaikouVCRZ(),
  new ZeraoraVMAX2CRZ(),
  new ZeraoraVSTAR2CRZ(),
  new ZacianV2CRZ(),
  new DrapionVCRZ(),
  new DarkraiVSTARCRZ(),
  new HisuianSamurottVCRZ(),
  new HisuianSamurottVSTARCRZ(),
  new ZamazentaV2CRZ(),
  new RegigigasVSTAR2CRZ(),
  new HisuianZoroarkVSTARCRZ(),
  new AdamanCRZ(),
  new CherensCareCRZ(),
  new ColresssExperimentCRZ(),
  new CynthiasAmbitionCRZ(),
  new GardeniasVigorCRZ(),
  new GrantCRZ(),
  new IridaCRZ(),
  new MelonyCRZ(),
  new Raihan2CRZ(),
  new RoxanneCRZ(),
  new OriginFormePalkiaVSTARCRZ(),
  new OriginFormeDialgaVSTARCRZ(),
  new GiratinaVSTARCRZ(),
  new ArceusVSTARCRZ(),
  new SunkernCRZ(),
  new GrubbinCRZ(),
  new CharizardVCRZ(),
  new CharizardVstarCRZ(),
  new SimisearVCRZ(),
  new SeelCRZ(),
  new GalarianMrMimeCRZ(),
  new CorphishCRZ(),
  new ShinxCRZ(),
  new LuxioCRZ(),
  new EmolgaCRZ(),
  new ZeraoraCRZ(),
  new DusclopsCRZ(),
  new GravelerCRZ(),
  new BaltoyCRZ(),
  new KoffingCRZ(),
  new KrokorokCRZ(),
  new MetangCRZ(),
  new PawniardCRZ(),
  new SnorlaxCRZ(),
  new StarlyCRZ(),
  new BeaCRZ(),
  new FriendsInHisui2(),
  new FriendsInSinnoh2(),
];
