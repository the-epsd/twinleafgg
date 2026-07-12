import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike } from '../../../game';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { MOVE_AN_ENERGY_FROM_OPPONENTS_POKEMON_TO_ANOTHER } from '../../../game/store/prefabs/attack-effects';

export class Elgyem extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Slight Shift',
    cost: [P],
    damage: 0,
    text: 'Move an Energy from 1 of your opponent\'s Pokémon to another of their Pokémon.'
  }, {
    name: 'Beam',
    cost: [C, C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Elgyem';
  public fullName: string = 'Elgyem SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Slight Shift
    // Ref: set-unbroken-bonds/tentacruel.ts (Wicked Tentacles)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MOVE_AN_ENERGY_FROM_OPPONENTS_POKEMON_TO_ANOTHER(store, state, effect);
    }

    return state;
  }
}
