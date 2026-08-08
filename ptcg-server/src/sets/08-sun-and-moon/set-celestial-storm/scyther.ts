import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Twin Play',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 Scyther and put them onto your Bench. Then, shuffle your deck.'
  }, {
    name: 'Agility',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'CES';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Twin Play
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, effect.player, { name: 'Scyther' }, { max: 2 }
      );
    }

    // Agility
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
