import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, GameMessage, GameError } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Vanilluxe extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vanillish';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Slippery Soles',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may switch your Active Pokémon with 1 of your Benched Pokémon. If you do, your opponent switches his or her Active Pokémon with 1 of his or her Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Crushing Ice',
    cost: [W, C, C],
    damage: 60,
    text: 'Does 10 more damage for each Colorless in the Defending Pokémon\'s Retreat Cost.'
  }];

  public set: string = 'NXD';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vanilluxe';
  public fullName: string = 'Vanilluxe NXD';

  public readonly SLIPPERY_SOLES_MARKER = 'SLIPPERY_SOLES_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slippery Soles - switch both actives
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.SLIPPERY_SOLES_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Check if player has benched Pokémon
      const playerHasBench = player.bench.some(b => b.cards.length > 0);
      if (!playerHasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Check if opponent has benched Pokémon
      const opponentHasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!opponentHasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.marker.addMarker(this.SLIPPERY_SOLES_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      // First, switch player's active
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      // Then, switch opponent's active
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    // Crushing Ice - bonus damage for retreat cost
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();

      if (defending) {
        const retreatCost = defending.retreat.length;
        effect.damage += retreatCost * 10;
      }
    }

    // Clean up marker at end of turn
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SLIPPERY_SOLES_MARKER, this);
    }

    return state;
  }
}
