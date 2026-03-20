import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call for Family',
    cost: [C],
    damage: 0,
    text: 'Search your deck for as many Eevee as you like and put them onto your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Lunge',
    cost: [C],
    damage: 20,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'MD';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eevee';
  public fullName: string = 'Eevee MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Call for Pals
    // Ref: AGENTS-patterns.md (search deck for Pokemon onto bench)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const emptySlots = player.bench.filter(b => b.cards.length === 0).length;
      if (emptySlots > 0 && player.deck.cards.length > 0) {
        SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, player,
          { stage: Stage.BASIC, name: 'Eevee' },
          { min: 0, max: emptySlots }
        );
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
