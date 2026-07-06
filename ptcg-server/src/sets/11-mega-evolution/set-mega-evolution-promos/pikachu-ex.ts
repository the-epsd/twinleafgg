import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  DISCARD_ALL_ENERGY_FROM_POKEMON,
  GET_PLAYER_BENCH_SLOTS,
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH,
  SHUFFLE_DECK,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Pikachuex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public hp: number = 190;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Pika Pika Parade',
    cost: [C],
    damage: 0,
    text: 'Search your deck for as many Basic Pokémon as you like and put them onto your Bench. Then, shuffle your deck.'
  },
  {
    name: 'Thunderbolt',
    cost: [L, L, C],
    damage: 200,
    text: 'Discard all Energy attached to this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = 'MEP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Pikachu ex';
  public fullName: string = 'Pikachu ex MEP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-mega-evolution/xerneas.ts (Geogate — search Basics onto Bench)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.deck.cards.length === 0) {
        return state;
      }
      const slots = GET_PLAYER_BENCH_SLOTS(player);
      if (slots.length === 0) {
        return SHUFFLE_DECK(store, state, player);
      }
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player, { stage: Stage.BASIC }, { min: 0, max: slots.length });
    }
    // Ref: set-evolving-skies/raichu.ts (Thunderbolt — discard all Energy)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }
    return state;
  }
}
