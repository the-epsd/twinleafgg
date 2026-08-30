import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Empower',
    cost: [P],
    damage: 0,
    text: 'Attach up to 2 Basic Energy cards from your discard pile to 1 of your Pokémon.'
  },
  {
    name: 'Psydrive',
    cost: [P, P, C],
    damage: 120,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Mewtwo';
  public fullName: string = 'Mewtwo 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Empower
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(
        store, state, effect.player, 2, undefined,
        { energyFilter: { energyType: EnergyType.BASIC }, min: 0, allowCancel: true }
      );
    }

    // Psydrive
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
