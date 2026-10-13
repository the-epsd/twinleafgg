import { CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { KnockOutEffect, PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { GameMessage, GamePhase, PlayerType, PowerType, SlotType, StoreLike, State } from '../../../game';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Honedge extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Final Hour',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, put 3 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Slash',
    cost: [P, P, P],
    damage: 50,
    text: ''
  }];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Honedge';
  public fullName: string = 'Honedge FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Final Hour
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;

      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] === player) {
        return state;
      }

      if (effect.target !== player.active) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (selected && selected.length > 0) {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, selected[0], 30, this, this.powers[0]),
          );
        }
      });
    }

    return state;
  }
}
