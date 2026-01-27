import { CaterpieEVO, MetapodEVO, WeedleEVO, EnergyRetrievalEVO, FullHealEVO, MaintenanceEVO, PotionEVO, ReviveEVO, SuperPotionEVO, SwitchEVO, DoubleColorlessEnergyEVO, GrassEnergyEVO, FireEnergyEVO, WaterEnergyEVO, LightningEnergyEVO, PsychicEnergyEVO, FightingEnergyEVO, MetalEnergyEVO, FairyEnergyEVO, DragoniteEX2EVO, BrocksGrit2EVO, HereComesTeamRocketEVO, MVenusaurEXEVO, MVenusaurEXEVOSR } from './other-prints';
import { Card } from '../../game/store/card/card';
import { BrocksGrit } from './brocks-grit';
import { DarknessEnergyEVO, PokedexEVO } from './other-prints';
import { DevolutionSpray } from './devolution-spray';
import { DragoniteEX } from './dragonite-ex';
import { Electabuzz } from './electabuzz';
import { Poliwhirl } from './poliwhirl';
import { Starmie } from './starmie';

export const setEvolutions: Card[] = [
  new BrocksGrit(),
  new DevolutionSpray(),
  new DragoniteEX(),
  new Electabuzz(),
  new PokedexEVO(),
  new Poliwhirl(),
  new Starmie(),

  //Energy
  new DarknessEnergyEVO(),
  new CaterpieEVO(),
  new MetapodEVO(),
  new WeedleEVO(),
  new EnergyRetrievalEVO(),
  new FullHealEVO(),
  new MaintenanceEVO(),
  new PotionEVO(),
  new ReviveEVO(),
  new SuperPotionEVO(),
  new SwitchEVO(),
  new DoubleColorlessEnergyEVO(),
  new GrassEnergyEVO(),
  new FireEnergyEVO(),
  new WaterEnergyEVO(),
  new LightningEnergyEVO(),
  new PsychicEnergyEVO(),
  new FightingEnergyEVO(),
  new MetalEnergyEVO(),
  new FairyEnergyEVO(),
  new DragoniteEX2EVO(),
  new BrocksGrit2EVO(),

  // Other Prints
  new HereComesTeamRocketEVO(),
  new MVenusaurEXEVO(),
  new MVenusaurEXEVOSR(),
];
