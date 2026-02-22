import { PokemonCard, Stage, CardType, PowerType, EnergyType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY } from '../../game/store/prefabs/prefabs';

export class Vileplume extends PokemonCard {

  public stage = Stage.STAGE_2;

  public evolvesFrom = 'Gloom';

  public cardType = CardType.GRASS;

  public hp = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Fully Blooming Energy',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may look at the top 8 cards of your deck and attach any number of Basic Energy cards you find there to your Pokémon in any way you like. Shuffle the other cards back into your deck.'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: ''
  }];

  public set: string = 'MEW';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public name: string = 'Vileplume';

  public fullName: string = 'Vileplume MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {

      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Legacy implementation:
      // - Pulled top 8 cards into a temporary CardList.
      // - Attached any Basic Energy among them to your Pokémon.
      // - Shuffled the remaining cards back into the deck.
      //
      // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY).
      return LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(
        store,
        state,
        player,
        8,
        8,
        {
          energyFilter: { energyType: EnergyType.BASIC },
          remainderDestination: 'shuffle'
        }
      );
    }
    return state;
  }
}
