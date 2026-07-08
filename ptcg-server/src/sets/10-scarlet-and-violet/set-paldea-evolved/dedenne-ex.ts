import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../../game/store/prefabs/costs';
import { MOVE_DAMAGE_FROM_YOUR_BENCH_TO_OPPONENTS_ACTIVE, TERA_RULE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dedenneex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Swap',
    cost: [P, P],
    damage: 0,
    text: 'Move all damage counters from 1 of your Benched Pokémon to your opponent\'s Active Pokémon.'
  },
  {
    name: 'Wondrous Shot',
    cost: [P, P, P],
    damage: 170,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dedenne ex';
  public fullName: string = 'Dedenne ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Tail Swap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return MOVE_DAMAGE_FROM_YOUR_BENCH_TO_OPPONENTS_ACTIVE(store, state, effect);
    }

    // Attack 2: Wondrous Shot
    // Ref: set-shrouded-fable/slither-wing.ts (Smashing Wings)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    TERA_RULE(effect, state, this);

    return state;
  }
}
