import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class RoaringMoon extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.DARK;

  public hp: number = 140;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Vengeance Fletching',
      cost: [CardType.DARK, CardType.DARK],
      damage: 70,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each Ancient card in your discard pile.'
    },
    {
      name: 'Speed Wing',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '109';

  public name: string = 'Roaring Moon';

  public fullName: string = 'Roaring Moon TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const cards = effect.player.discard.cards.filter(c => c.tags.includes(CardTag.ANCIENT)).length;
      effect.damage += 10 * cards;
      return state;
    }
    return state;
  }
}