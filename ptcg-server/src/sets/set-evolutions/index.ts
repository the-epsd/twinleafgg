import { Card } from '../../game/store/card/card';
import { DarknessEnergyEVO, PokedexEVO } from './card-images';
import { DevolutionSpray } from './devolution-spray';
import { DragoniteEX } from './dragonite-ex';
import { Electabuzz } from './electabuzz';
import { Poliwhirl } from './poliwhirl';
import { Starmie } from './starmie';

export const setEvolutions: Card[] = [
  new DevolutionSpray(),
  new DragoniteEX(),
  new Electabuzz(),
  new PokedexEVO(),
  new Poliwhirl(),
  new Starmie(),

  //Energy
  new DarknessEnergyEVO(),
];
