import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, BoardEffect } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { SWITCH_OUT_OPPONENT_ACTIVE_POKEMON, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Shinx extends PokemonCard {
  public stage = Stage.BASIC;
  public cardType = L;
  public hp = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Big Roar',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '68';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx PAL';

  public readonly BIG_ROAR_MARKER = 'BIG_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.BIG_ROAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      effect.player.marker.addMarker(this.BIG_ROAR_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      // Legacy implementation:
      // - Used a custom ChoosePokemonPrompt where the opponent chose their replacement Active.
      // - Switched opponent Active to the selected Benched Pokémon.
      //
      // Converted to prefab version (SWITCH_OUT_OPPONENT_ACTIVE_POKEMON).
      return SWITCH_OUT_OPPONENT_ACTIVE_POKEMON(store, state, player, { allowCancel: false });
    }
    return state;
  }
}
