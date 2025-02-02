import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [];
  public resistance = [{ type: CardType.FIGHTING, value: 30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    {
      name: 'Wildfire',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'You may discard any number of {R} Energy cards attached to Moltres when you use this attack. If you do, discard that many cards from the top of your opponent\'s deck.'
    },
    {
      name: 'Dive Bomb',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: 80,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Implement Wildfire logic
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Implement Dive Bomb logic
    }
    return state;
  }
}
