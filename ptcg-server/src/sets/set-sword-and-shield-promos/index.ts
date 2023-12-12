import { Card } from '../../game/store/card/card';
import { ChampionsFestival } from './champions-festival';
import { LeafeonVSTAR } from './leafeon-vstar';
import { Manaphy } from './manaphy';
import { ProfessorBurnet } from './professor-burnett';

export const setSwordAndShieldPromos: Card[] = [
  
  new ChampionsFestival(),
  new LeafeonVSTAR(),
  new ProfessorBurnet(),
  new Manaphy(),
];
