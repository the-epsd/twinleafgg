import { ChooseCardsPrompt, GameError, GameLog, GameMessage } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, DRAW_CARDS, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class RollerSkater extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '203';
  public name: string = 'Roller Skater';
  public fullName: string = 'Roller Skater CEC';
  public text: string = 'Discard a card from your hand. If you do, draw 2 cards. If you discarded an Energy card in this way, draw 2 more cards.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.hand.cards.filter(c => c !== effect.trainerCard).length < 1 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      state = store.prompt(state, new ChooseCardsPrompt(
        effect.player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          CLEAN_UP_SUPPORTER(effect, player);
          return;
        }
        let cardsToDraw = 2;

        if (cards[0] instanceof EnergyCard) {
          cardsToDraw = 4;
        }

        MOVE_CARDS(store, state, player.hand, player.discard, { cards: cards, sourceCard: this });
        cards.forEach((card, index) => {
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD_FROM_HAND, { name: player.name, card: card.name });
        });

        DRAW_CARDS(player, cardsToDraw);
      });

      CLEAN_UP_SUPPORTER(effect, player);
      return state;
    }

    return state;
  }
}

