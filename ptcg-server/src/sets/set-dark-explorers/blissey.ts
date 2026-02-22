import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { HealEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Blissey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Chansey';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Softboiled',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, heal 30 damage from your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Double-Edge',
    cost: [C, C, C],
    damage: 90,
    text: 'This Pokémon does 60 damage to itself.'
  }];

  public set: string = 'DEX';
  public setNumber: string = '82';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blissey';
  public fullName: string = 'Blissey DEX';

  public readonly SOFTBOILED_MARKER = 'SOFTBOILED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clear marker when Pokémon enters play
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SOFTBOILED_MARKER, this);
    }

    // Softboiled ability - flip coin, if heads heal 30 from Active
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if already used this turn
      if (player.marker.hasMarker(this.SOFTBOILED_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Mark as used (even if the flip fails)
      player.marker.addMarker(this.SOFTBOILED_MARKER, this);

      // Flip a coin
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          // Heal 30 damage from Active Pokémon
          const healEffect = new HealEffect(player, player.active, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Double-Edge - deal 90 damage and 60 to self
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 60);
    }

    // Clear marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SOFTBOILED_MARKER, this);
    }

    return state;
  }
}
