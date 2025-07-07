import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Darkrai extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 80;
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Darkness Shade',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Darkrai from your hand onto your Bench, you may choose 1 of the Defending Pokémon. That Pokémon is now Asleep.'
  }];

  public attacks = [{
    name: 'Dark Slumber',
    cost: [D],
    damage: 20,
    text: 'At the end of your opponent\'s next turn, the Defending Pokémon is now Asleep.'
  },
  {
    name: 'Dark Resolve',
    cost: [D, D, C],
    damage: 40,
    text: 'If the Defending Pokémon is Asleep, remove 4 damage counters from Darkrai.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Darkrai';
  public fullName: string = 'Darkrai MD';

  public readonly PUT_SLEEP_MARKER = 'PUT_SLEEP_MARKER';
  public readonly CLEAR_PUT_SLEEP_MARKER = 'CLEAR_PUT_SLEEP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      // Apply Spiky Shell effect at the end of opponent's next turn
      effect.player.marker.addMarker(this.PUT_SLEEP_MARKER, this);
      opponent.active.marker.addMarker(this.CLEAR_PUT_SLEEP_MARKER, this);
    }

    // 30 damage to opponent's active if end turn and counters marker is present
    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_PUT_SLEEP_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);
      effect.player.active.marker.removeMarker(this.CLEAR_PUT_SLEEP_MARKER, this);
      opponent.marker.removeMarker(this.PUT_SLEEP_MARKER, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.PUT_SLEEP_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 40);
      }
    }

    return state;
  }
}