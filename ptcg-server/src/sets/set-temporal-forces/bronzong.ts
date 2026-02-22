import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, GameError, PokemonCard, StateUtils } from '../../game';

import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public hp: number = 110;
  public cardType: CardType = P;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Evolution Jammer',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, they can\'t play any Pokémon from their hand to evolve their Pokémon.'
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark: string = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong TEF';

  public readonly EVOLUTION_JAMMER_MARKER = 'EVOLUTION_JAMMER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Evolution Jammer attack - prevent opponent from evolving during their next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Set marker and prevent evolution
      opponent.marker.addMarker(this.EVOLUTION_JAMMER_MARKER, this);
      opponent.canEvolve = false;
    }

    // Block evolution attempts when marker is present
    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.EVOLUTION_JAMMER_MARKER, this)) {
        // Check if this is an evolution attempt (not a basic Pokémon being played to empty slot)
        const stage = effect.pokemonCard.stage;
        const isEvolved = stage === Stage.STAGE_1 || stage === Stage.STAGE_2;
        const target = effect.target;
        const hasTargetPokemon = target && target.cards.length > 0;

        // If it's an evolution card and there's a target Pokémon, block it
        if (isEvolved && hasTargetPokemon) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    // Clear the marker and reset canEvolve when opponent's turn ends
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.EVOLUTION_JAMMER_MARKER, this)) {
        player.marker.removeMarker(this.EVOLUTION_JAMMER_MARKER, this);
        // Reset canEvolve to default (false) - it will be set to true elsewhere if needed
        player.canEvolve = false;
      }
    }

    return state;
  }
}
