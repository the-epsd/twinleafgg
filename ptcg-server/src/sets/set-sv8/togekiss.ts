import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PowerType, CoinFlipPrompt, GameMessage, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';

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
  public set: string = 'SV8';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togekiss';
  public fullName: string = 'Togekiss SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if this card is in play (active or bench)
      const isInPlay = opponent.active.cards.includes(this) || opponent.bench.some(b => b.cards.includes(this));
      if (!isInPlay) {
        return state;
      }

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Check if ability has already been activated for this knockout
      if (player.marker.hasMarker('TOGEKISS_KNOCKOUT_FLIP')) {
        return state;
      }

      // Mark ability as used for this knockout
      player.marker.addMarkerToState('TOGEKISS_KNOCKOUT_FLIP');

      return store.prompt(state, [
        new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          //If Heads, take 1 more Prize card for that Knock Out
          effect.prizeCount += 1;
        }
        // Remove the marker after the coin flip
        player.marker.removeMarker('TOGEKISS_KNOCKOUT_FLIP');
      });
    }

    return state;

  }
}