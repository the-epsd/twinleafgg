import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Finizen extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Drain Fin',
    cost: [W, W],
    damage: 20,
    text: 'Heal 20 damage from this Pokémon.',
  }];

  public set: string = 'M5';
  public setNumber: string = '20';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Finizen';
  public fullName: string = 'Finizen M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }
    return state;
  }
}
