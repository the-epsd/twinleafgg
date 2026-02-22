import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PowerType } from '../../game/store/card/pokemon-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, IS_ABILITY_BLOCKED, THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dragonair extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dratini';
  public cardType: CardType = N;
  public hp: number = 100;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Guidance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon has any Energy attached, you may use this Ability. Search your deck for an Evolution Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Tail Snap',
    cost: [W, L],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '151';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair M2a';

  public readonly EVOLUTION_GUIDANCE_MARKER = 'EVOLUTION_GUIDANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reset marker when Pokemon is played
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.EVOLUTION_GUIDANCE_MARKER, this);
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.EVOLUTION_GUIDANCE_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.EVOLUTION_GUIDANCE_MARKER, this);
    }

    // Evolution Guidance ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Find this Pokémon in play
      let dragonairCardList: any = null;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          dragonairCardList = cardList;
        }
      });

      if (!dragonairCardList) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Legacy implementation:
      // - Counted attached Energy cards by filtering `card.superType === SuperType.ENERGY`.
      //
      // Converted to prefab version (THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED).
      if (!THIS_POKEMON_HAS_ANY_ENERGY_ATTACHED(dragonairCardList)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if ability was already used this turn
      if (player.marker.hasMarker(this.EVOLUTION_GUIDANCE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Block non-evolution Pokémon from selection
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard) {
          // Block Basic Pokémon (only allow Stage 1 and Stage 2)
          if (card.stage === Stage.BASIC) {
            blocked.push(index);
          }
        } else {
          // Block non-Pokémon cards
          blocked.push(index);
        }
      });

      // Search deck for Evolution Pokémon
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store, state, player, {}, { min: 0, max: 1, blocked }
      );

      // Mark ability as used
      player.marker.addMarker(this.EVOLUTION_GUIDANCE_MARKER, this);

      // Add visual effect
      if (dragonairCardList) {
        dragonairCardList.addBoardEffect(BoardEffect.ABILITY_USED);
      }
    }
    return state;
  }
}
