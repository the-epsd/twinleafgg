import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED, COIN_FLIP_PROMPT, ADD_MARKER, HAS_MARKER, REMOVE_MARKER } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cinccino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Smooth Coat',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokemon by attacks, flip a coin. If heads, prevent that damage.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [C, C, C],
    damage: 50,
    text: 'During your next turn, this Pokemon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'NXD';
  public setNumber: string = '85';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cinccino';
  public fullName: string = 'Cinccino NXD';

  public readonly ECHOED_VOICE_MARKER = 'ECHOED_VOICE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smooth Coat - flip coin to prevent damage
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.damage <= 0) {
        return state;
      }

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage = 0;
        }
      });
    }

    // Echoed Voice - add bonus damage if marker present and set marker for next turn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if marker is present for bonus damage
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this && HAS_MARKER(this.ECHOED_VOICE_MARKER, cardList, this)) {
          effect.damage += 50;
        }
      });

      // Add marker for next turn
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          ADD_MARKER(this.ECHOED_VOICE_MARKER, cardList, this);
        }
      });
    }

    // Remove marker at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // When opponent's turn ends, remove marker from player's Cinccino
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          REMOVE_MARKER(this.ECHOED_VOICE_MARKER, cardList, this);
        }
      });
    }

    return state;
  }
}
