import { Card } from '../../game/store/card/card';
import { LostRemover } from './lost-remover';
import { Pachirisu } from './pachirisu';
import { Relicanth } from './relicanth';

export const setCallOfLegends: Card[] = [
  new LostRemover(),
  new Pachirisu(),
  new Relicanth(),
];