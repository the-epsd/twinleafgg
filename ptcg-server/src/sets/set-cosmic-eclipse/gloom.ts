import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Gloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Oddish';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Sleep Powder',
      cost: [G],
      damage: 20,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Gloom';
  public fullName: string = 'Gloom CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sleep Powder
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }
}
