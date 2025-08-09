import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Ivysaur extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Bulbasaur';
  public cardType = CardType.GRASS;
  public hp = 60;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    },
    {
      name: 'Poisonpowder',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: 20,
      text: 'The Defending Pokémon is now Poisoned.'
    }
  ];

  public set = 'BS';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Ivysaur';
  public fullName = 'Ivysaur BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 1, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }

}
