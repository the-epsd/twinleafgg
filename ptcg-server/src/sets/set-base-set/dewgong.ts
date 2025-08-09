import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../../game';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Dewgong extends PokemonCard {

  public name = 'Dewgong';

  public set = 'BS';

  public fullName = 'Dewgong BS';

  public cardType: CardType = CardType.WATER;

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Seel';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public hp = 80;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Aurora Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 50,
      text: ''
    },
    {
      name: 'Ice Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }
    return state;
  }

}
