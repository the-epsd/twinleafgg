import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class CynthiasRoselia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spike Sting',
      cost: [C],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Roselia';
  public fullName: string = 'Cynthia\'s Roselia DRI';
}
