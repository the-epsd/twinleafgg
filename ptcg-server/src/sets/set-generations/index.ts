import { PonytaGEN, RapidashGEN, PikachuGEN, RaichuGEN, GolbatGEN, SlowpokeGEN, HaunterGEN, GengarGEN, MrMimeGEN, CrushingHammerGEN, EnergySwitchPKGEN, EvosodaGEN, MaintenanceGEN, PokeBallGEN, PokemonFanClubGEN, ShaunaGEN, DoubleColorlessEnergyGEN, JolteonEX2GEN, TeamFlareGrunt2GEN, Raichu2GEN, WobbuffetGEN, YveltalGEN, SwirlixGEN, WallyGEN, Pikachu2GEN, GardevoirExGEN, MGardevoirExGEN } from './other-prints';
import { Card } from '../../game/store/card/card';
import { GrassEnergy, FireEnergy, WaterEnergy, LightningEnergy, PsychicEnergy, FightingEnergy, DarknessEnergy, MetalEnergy, FairyEnergy } from './basic-energies';
import { Charmeleon } from './charmeleon';
import { JolteonEX } from './jolteon-ex';
import { MaxRevive } from './max-revive';
import { MeowsticEX } from './meowstic-ex';
import { RedCard } from './red-card';
import { Revitalizer } from './revitalizer';
import { TeamFlareGrunt } from './team-flare-grunt';

export const setGenerations: Card[] = [
  new JolteonEX(),
  new MaxRevive(),
  new MeowsticEX(),
  new RedCard(),
  new Revitalizer(),
  new TeamFlareGrunt(),

  // FA/Radiant Collection
  new Charmeleon(),

  // Basic energies
  new GrassEnergy(),
  new FireEnergy(),
  new WaterEnergy(),
  new LightningEnergy(),
  new PsychicEnergy(),
  new FightingEnergy(),
  new DarknessEnergy(),
  new MetalEnergy(),
  new FairyEnergy(),
  new PonytaGEN(),
  new RapidashGEN(),
  new PikachuGEN(),
  new RaichuGEN(),
  new GolbatGEN(),
  new SlowpokeGEN(),
  new HaunterGEN(),
  new GengarGEN(),
  new MrMimeGEN(),
  new CrushingHammerGEN(),
  new EnergySwitchPKGEN(),
  new EvosodaGEN(),
  new MaintenanceGEN(),
  new PokeBallGEN(),
  new PokemonFanClubGEN(),
  new ShaunaGEN(),
  new DoubleColorlessEnergyGEN(),
  new JolteonEX2GEN(),
  new TeamFlareGrunt2GEN(),
  new Raichu2GEN(),
  new WobbuffetGEN(),
  new YveltalGEN(),
  new SwirlixGEN(),
  new WallyGEN(),
  new Pikachu2GEN(),
  new GardevoirExGEN(),
  new MGardevoirExGEN(),
];
