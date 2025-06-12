import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Cetoddle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Draining Fin',
    cost: [W, C],
    damage: 20,
    text: 'Heal 20 damage from this Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cetoddle';
  public fullName: string = 'Cetoddle SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Draining Fin
    if (WAS_ATTACK_USED(effect, 0, this)){
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}