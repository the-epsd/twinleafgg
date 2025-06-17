import { StoreLike, State, GameError, GameMessage, ShuffleDeckPrompt, StateUtils, SelectPrompt } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class DesertShaman extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '123';
  public name: string = 'Desert Shaman';
  public fullName: string = 'Desert Shaman SK';
  public text = 'Shuffle your hand into your deck and draw up to 4 cards. Your opponent does the same.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);


      const cards = player.hand.cards.filter(c => c !== this);
      const opponentCards = opponent.hand.cards.filter(c => c !== this);

      if (cards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardsTo(cards, player.deck);
      opponent.hand.moveCardsTo(opponentCards, opponent.deck);

      store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });

      store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });

      const maxPlayerDraw = 4;
      const maxOpponentDraw = 4;

      if (maxPlayerDraw > 0) {
        const options: { message: string, value: number }[] = [];
        for (let i = maxPlayerDraw; i >= 0; i--) {
          options.push({ message: `Draw ${i} card(s)`, value: i });
        }

        store.prompt(state, new SelectPrompt(
          player.id,
          GameMessage.WANT_TO_DRAW_CARDS,
          options.map(c => c.message),
          { allowCancel: false }
        ), choice => {
          const numCardsToDraw = options[choice].value;
          player.deck.moveTo(player.hand, numCardsToDraw);

          if (maxOpponentDraw > 0) {
            const opponentOptions: { message: string, value: number }[] = [];
            for (let i = maxOpponentDraw; i >= 0; i--) {
              opponentOptions.push({ message: `Draw ${i} card(s)`, value: i });
            }

            store.prompt(state, new SelectPrompt(
              opponent.id,
              GameMessage.WANT_TO_DRAW_CARDS,
              opponentOptions.map(c => c.message),
              { allowCancel: false }
            ), opponentChoice => {
              const opponentNumCardsToDraw = opponentOptions[opponentChoice].value;
              opponent.deck.moveTo(opponent.hand, opponentNumCardsToDraw);
            });
          }
        });
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }

    return state;
  }
}