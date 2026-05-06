import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PowerType, CoinFlipPrompt, GameMessage, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Togekiss extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Togetic';
  public cardType: CardType = P;
  public hp: number = 140;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Wonder Kiss',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent\'s Active Pokémon gets Knocked Out, flip a coin. If heads, take 1 more Prize card for that Knock Out. This Ability does not stack.'
  }];

  public attacks = [
    {
      name: 'Speed Wing',
      cost: [C, C, C],
      damage: 140,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togekiss';
  public fullName: string = 'Togekiss SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const knockedOutOwner = effect.player;
      const attacker = StateUtils.getOpponent(state, knockedOutOwner);

      // Check if this card is in play (active or bench)
      const isInPlay = attacker.active.cards.includes(this) || attacker.bench.some(b => b.cards.includes(this));
      if (!isInPlay) {
        return state;
      }

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== attacker) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, attacker, this)) {
        return state;
      }

      // Check if ability has already been activated for this knockout
      if (knockedOutOwner.marker.hasMarker('TOGEKISS_KNOCKOUT_FLIP')) {
        return state;
      }

      // Mark ability as used for this knockout
      knockedOutOwner.marker.addMarkerToState('TOGEKISS_KNOCKOUT_FLIP');

      return store.prompt(state, [
        new CoinFlipPrompt(attacker.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          //If Heads, take 1 more Prize card for that Knock Out
          if (effect.prizeCount > 0) {
            effect.prizeCount += 1;
          }
        }
        // Remove the marker after the coin flip
        knockedOutOwner.marker.removeMarker('TOGEKISS_KNOCKOUT_FLIP');
      });
    }

    return state;

  }
}