import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class NsDarumaka extends PokemonCard {

  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rolling Tackle',
      cost: [C, C],
      damage: 20,
      text: ''
    },
    {
      name: 'Flare',
      cost: [R, R, C],
      damage: 50,
      text: ''
    },
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'N\'s Darumaka';
  public fullName: string = 'N\'s Darumaka JTG';
}