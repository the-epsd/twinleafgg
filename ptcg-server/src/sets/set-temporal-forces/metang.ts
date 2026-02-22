import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Metang extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Beldum';

  public cardType: CardType = CardType.METAL;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Metal Maker',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may look at the top 4 cards of your deck and attach any number of [M] Energy you find there to your Pokémon in any way you like. Shuffle the other cards and put them at the bottom of your deck.'
  }];

  public attacks = [{
    name: 'Beam',
    cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'H';

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public name: string = 'Metang';

  public fullName: string = 'Metang TEF';

  public readonly METAL_MAKER_MARKER = 'METAL_MAKER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.METAL_MAKER_MARKER, this)) {
      effect.player.marker.removeMarker(this.METAL_MAKER_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {

      const player = effect.player;

      if (player.marker.hasMarker(this.METAL_MAKER_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Legacy implementation:
      // - Took top 4 into a temporary CardList.
      // - Allowed attaching found Metal Energy to your Pokémon.
      // - Put the remaining cards on the bottom of deck.
      // - Set once-per-turn marker and board effect in both attach/non-attach paths.
      //
      // Converted to prefab version (LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY).
      player.marker.addMarker(this.METAL_MAKER_MARKER, this);
      ABILITY_USED(player, this);

      return LOOK_AT_TOP_X_CARDS_AND_ATTACH_UP_TO_Y_ENERGY(
        store,
        state,
        player,
        4,
        4,
        {
          validCardTypes: [CardType.METAL],
          remainderDestination: 'bottom'
        }
      );
    }
    return state;
  }
}
