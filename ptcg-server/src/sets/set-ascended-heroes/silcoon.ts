import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Silcoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wurmple';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Multiplying Cocoon',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'You may use this Ability when you play this Pokémon from your hand to evolve 1 of your Pokémon. Search your deck for a Silcoon or a Cascoon and put it onto your Bench. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Tackle',
    cost: [G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Silcoon';
  public fullName: string = 'Silcoon M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Multiplying Cocoon ability - triggers when played from hand to evolve
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Build blocked array for cards that are not Silcoon or Cascoon
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard) {
          // Allow only Silcoon or Cascoon
          if (card.name !== 'Silcoon' && card.name !== 'Cascoon') {
            blocked.push(index);
          }
        } else {
          // Block non-Pokémon cards
          blocked.push(index);
        }
      });

      // Search deck for Silcoon or Cascoon and put onto Bench
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
        store, state, player, {}, { min: 0, max: 1, blocked }
      );
    }

    return state;
  }
}