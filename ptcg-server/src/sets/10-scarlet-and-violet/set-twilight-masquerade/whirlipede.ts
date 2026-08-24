import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Whirlipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venipede';
  public hp: number = 100;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Poison Ring',
    cost: [D],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Spinning Attack',
    cost: [D, C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '116';
  public name: string = 'Whirlipede';
  public fullName: string = 'Whirlipede TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Ring
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
