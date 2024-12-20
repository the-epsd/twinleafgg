import { Card } from '../../game/store/card/card';
import { Pokedex } from '../set-base-set/pokedex';
import { DarknessEnergy } from '../set-heartgold-and-soulsilver/HS_121_Darkness_Energy';
import { DevolutionSpray } from './devolution-spray';
import { DragoniteEX } from './dragonite-ex';
import { Electabuzz } from './electabuzz';
import { Poliwhirl } from './poliwhirl';
import { Starmie } from './starmie';

export const setEvolutions: Card[] = [
  new DevolutionSpray(),
  new DragoniteEX(),
  new Electabuzz(),
  new Pokedex(),
  new Poliwhirl(),
  new Starmie(),

  //Energy
  new DarknessEnergy(),
];
