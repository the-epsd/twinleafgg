import { TrainerCard, TrainerType, StoreLike, State, StateUtils, ChooseCardsPrompt, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_DECK_EMPTY, SHOW_CARDS_TO_PLAYER, MOVE_CARD_TO, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class RelicHunter extends TrainerCard {
  public trainerType = TrainerType.SUPPORTER;
  public cardImage: string = 'assets/cardback.png';
  public set = 'SK';
  public setNumber: string = '120';
  public name = 'Relic Hunter';
  public fullName = 'Relic Hunter SK';

  public text = 'Search your deck for up to 2 Supporter and/or Stadium cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(this, player.supporter);
      BLOCK_IF_DECK_EMPTY(player);

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        const isSupporter = c instanceof TrainerCard && (c.trainerType === TrainerType.SUPPORTER);
        const isStadium = c instanceof TrainerCard && (c.trainerType === TrainerType.STADIUM);
        if (!(isSupporter || isStadium)) {
          blocked.push(index);
        }
      });

      effect.preventDefault = true;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.deck,
        {},
        { min: 0, max: 2, allowCancel: false, blocked }
      ), cards => {
        if (!cards || cards.length === 0) {
          return state;
        }

        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        cards.forEach(card => MOVE_CARD_TO(state, card, player.hand));
        SHUFFLE_DECK(store, state, player);
      });

      player.supporter.moveCardTo(this, player.discard);
    }

    return state;
  }
}
