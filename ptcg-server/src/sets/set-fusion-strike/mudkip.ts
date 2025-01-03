import { CardType, PokemonCard, Stage } from '../../game';

export class Mudkip extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = CardType.WATER;

  public hp = 70;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mud Slap',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: ''
    },
    {
      name: 'Playful Kick',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '62';

  public name: string = 'Mudkip';

  public fullName: string = 'Mudkip FST';
}