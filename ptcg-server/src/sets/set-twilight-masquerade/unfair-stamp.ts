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

function* playCard(next: Function, store: StoreLike, state: State,
  self: UnfairStamp, effect: TrainerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // No Pokemon KO last turn
  if (!player.marker.hasMarker(self.UNFAIR_STAMP_MARKER)) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  const cards = player.hand.cards.filter(c => c !== self);

  // We will discard this card after prompt confirmation
  effect.preventDefault = true;

  player.hand.moveCardsTo(cards, player.deck);
  opponent.hand.moveTo(opponent.deck);

  yield store.prompt(state, [
    new ShuffleDeckPrompt(player.id),
    new ShuffleDeckPrompt(opponent.id)
  ], deckOrder => {
    player.deck.applyOrder(deckOrder[0]);
    opponent.deck.applyOrder(deckOrder[1]);

    player.deck.moveTo(player.hand, 5);
    opponent.deck.moveTo(opponent.hand, 2);

    player.supporter.moveCardTo(effect.trainerCard, player.discard);
  });
}

export class UnfairStamp extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [ CardTag.ACE_SPEC ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '165';

  public regulationMark = 'H';

  public name: string = 'Unfair Stamp';

  public fullName: string = 'Unfair Stamp TWM';

  public text: string =
    'You can play this card only if one of your Pokémon was Knocked Out during your opponent\'s last turn.' +
    '' +
    'Each player shuffles their hand into their deck. Then, you draw 5 cards, and your opponent draws 2 cards.';

  public readonly UNFAIR_STAMP_MARKER = 'UNFAIR_STAMP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const generator = playCard(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);

      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.UNFAIR_STAMP_MARKER, this);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.UNFAIR_STAMP_MARKER);
    }

    return state;
  }

}
