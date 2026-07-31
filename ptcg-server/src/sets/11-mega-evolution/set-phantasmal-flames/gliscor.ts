import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_RETREAT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';

export class Gliscor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Gligar';
  public hp: number = 120;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Poison Ring',
    cost: [F],
    damage: 50,
    text: 'Your opponent\'s Active Pokémon is now Poisoned. During your opponent\'s next turn, that Pokémon can\'t retreat.'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Gliscor';
  public fullName: string = 'Gliscor PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Ring
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
            return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
