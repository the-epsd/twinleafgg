import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class TeamRocketsArcher extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public tags = [CardTag.TEAM_ROCKET];

  public regulationMark = 'I';

  public set: string = 'SV10';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '92';

  public name: string = 'Team Rocket\'s Archer';

  public fullName: string = 'Team Rocket\'s Archer SV10';

  public text: string = `You can use this card only if any of your Team Rocket's Pokemon were Knocked Out during your opponent's last turn.

Each player shuffles their hand into their deck. Then, you draw 5 cards, and your opponent draws 3 cards.`;

  public readonly ARCHER_MARKER = 'ARCHER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle playing the card
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Verify a Team Rocket's Pokemon was knocked out during opponent's last turn
      if (!player.marker.hasMarker(this.ARCHER_MARKER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      const cards = player.hand.cards.filter(c => c !== this);

      // Shuffle hands into decks
      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveTo(opponent.deck);

      return store.prompt(state, [
        new ShuffleDeckPrompt(player.id),
        new ShuffleDeckPrompt(opponent.id)
      ], deckOrder => {
        player.deck.applyOrder(deckOrder[0]);
        opponent.deck.applyOrder(deckOrder[1]);

        // Draw new hands
        player.deck.moveTo(player.hand, 5);
        opponent.deck.moveTo(opponent.hand, 3);

        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      });
    }

    // Track when a Team Rocket's Pokemon is knocked out
    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Check if knocked out Pokemon was a Team Rocket's Pokemon
      const knockedOutPokemon = effect.target.getPokemonCard();
      if (knockedOutPokemon &&
        knockedOutPokemon.tags &&
        knockedOutPokemon.tags.includes(CardTag.TEAM_ROCKET)) {
        effect.player.marker.addMarker(this.ARCHER_MARKER, this);
      }

      return state;
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ARCHER_MARKER, this)) {
      effect.player.marker.removeMarker(this.ARCHER_MARKER, this);
    }

    return state;
  }
}
