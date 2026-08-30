import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Stufful extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Light Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
{
    name: 'Flop',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '111';
  public name: string = 'Stufful';
  public fullName: string = 'Stufful MEG';
}
