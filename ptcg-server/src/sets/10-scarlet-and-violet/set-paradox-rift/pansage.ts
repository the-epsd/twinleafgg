import { PokemonCard, Stage, State, StoreLike } from '../../../game';
import { CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../../game/store/prefabs/prefabs';

export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [G];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.',
  },
  {
    name: 'Leech Seed',
    cost: [G, C, C],
    damage: 30,
    text: 'Heal 10 damage from this Pokémon.',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Pansage';
  public fullName: string = 'Pansage PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call for Family
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store,
        state,
        effect.player,
        { stage: Stage.BASIC },
        { min: 1, max: 1 },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 10);
    }

    return state;
  }
}
