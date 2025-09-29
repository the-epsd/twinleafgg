import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Makuhita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Confront',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Makuhita';
  public fullName: string = 'Makuhita M1L';
  public regulationMark = 'I';
}