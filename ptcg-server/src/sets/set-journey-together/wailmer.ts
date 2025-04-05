import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public attacks = [
    { name: 'Surf', cost: [C, C, C], damage: 60, text: '' }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Wailmer';
  public fullName: string = 'Wailmer JTG';
}