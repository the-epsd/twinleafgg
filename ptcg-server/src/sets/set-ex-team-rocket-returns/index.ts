import { Card } from '../../game';
import { PokemonRetriever } from './pokemon-retriever';
import { PowHandExtension } from './pow-hand-extension';
import { RocketsAdmin } from './rockets-admin';

export const setEXTeamRocketReturns: Card[] = [
  new PokemonRetriever(),
  new PowHandExtension(),
  new RocketsAdmin()
];