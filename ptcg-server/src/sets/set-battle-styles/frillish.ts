import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Frillish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Recover',
    cost: [C],
    damage: 0,
    text: 'Discard an Energy from this Pokémon and heal all damage from it.'
  },
  {
    name: 'Rain Splash',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'BST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Frillish';
  public fullName: string = 'Frillish BST';
  public regulationMark = 'E';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 999);
    }

    return state;
  }
}