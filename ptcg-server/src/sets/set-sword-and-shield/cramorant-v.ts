import { CardTag, Stage, State, StoreLike } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CramorantV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public stage: Stage = Stage.BASIC;
  public retreat = [C];
  public hp: number = 200;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];

  public attacks = [
    {
      name: 'Beak Catch',
      cost: [C],
      damage: 0,
      text: 'Search your deck for up to 2 cards and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Spit Shot',
      cost: [C, C, C],
      damage: 0,
      text: 'Discard all Energy from this Pokémon. This attack does 160 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '155';
  public name: string = 'Cramorant V';
  public fullName: string = 'Cramorant V SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Beak Catch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, {}, { min: 0, max: 2 });
    }

    // Spit Shot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(160, effect, store, state);
    }

    return state;
  }
}
