import { Card } from '../../game/store/card/card';
import { Lunatone } from './lunatone';
import { Pokestop } from './pokestop';
import { Solrock } from './solrock';

export const setPokemonGO: Card[] = [
  new Lunatone(),
  new Solrock(),
  new Pokestop(),
];