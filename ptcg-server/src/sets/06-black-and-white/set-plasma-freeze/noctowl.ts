import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StateUtils, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_COIN_FOR_FLY } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Noctowl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoothoot';
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Powerful Vision',
      cost: [C, C],
      damage: 10,
      damageCalculation: 'x',
      text: 'Does 10 damage times the number of cards in your opponent\'s hand.'
    },
    {
      name: 'Fly',
      cost: [C, C, C],
      damage: 50,
      text: 'Flip a coin. If tails, this attack does nothing. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Noctowl';
  public fullName: string = 'Noctowl PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      effect.damage = 10 * opponent.hand.cards.length;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_COIN_FOR_FLY(store, state, effect, this);
    }

    return state;
  }
}
