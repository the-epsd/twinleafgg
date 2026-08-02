import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_DOES_LESS_DAMAGE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Clefairy2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Moonblast',
    cost: [Y],
    damage: 10,
    text: 'During your opponent\'s next turn, any damage done by attacks from the Defending Pokémon is reduced by 10 (before applying Weakness and Resistance).'
  }];

  public set: string = 'FFI';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy FFI 70';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Moonblast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 10);
    }

    return state;
  }
}
