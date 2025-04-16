import { Card } from '../../game/store/card/card';
import { LostRemover } from './lost-remover';
import { MimeJr } from './mime-jr';
import { Pachirisu } from './pachirisu';
import { Relicanth } from './relicanth';

export const setCallOfLegends: Card[] = [
  new LostRemover(),
  new MimeJr(),
  new Pachirisu(),
  new Relicanth(),
];