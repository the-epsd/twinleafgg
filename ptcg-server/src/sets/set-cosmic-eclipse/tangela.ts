import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Tangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Toxic',
    cost: [G],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. Put 2 damage counters instead of 1 on that Pokémon between turns.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Tangela';
  public fullName: string = 'Tangela CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this, 20);
    }

    return state;
  }
}