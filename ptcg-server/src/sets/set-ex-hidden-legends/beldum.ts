import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Shuffle your deck afterward.',
  },
  {
    name: 'Metal Ball',
    cost: [P],
    damage: 0,
    text: 'Put 1 damage counter on the Defending Pokémon.',
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum HL 54';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(1, store, state, effect);
    }

    return state;
  }
}
