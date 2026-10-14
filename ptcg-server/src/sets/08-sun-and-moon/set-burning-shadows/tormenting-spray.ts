import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { GameMessage, Player, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class TormentingSpray extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Tormenting Spray';
  public fullName: string = 'Tormenting Spray BUS';
  public text: string =
    "Choose a random card from your opponent's hand. Your opponent reveals that card. If it's a Supporter card, discard it.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      // Choose a random card from opponent's hand (isSecret = true means random)
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.hand,
          {},
          { allowCancel: false, min: 1, max: 1, isSecret: true },
        ),
        (cards) => {
          cards = cards || [];

          if (cards.length > 0) {
            // Reveal the card
            SHOW_CARDS_TO_PLAYER(store, state, player, cards);

            // If it's a Supporter card, discard it
            const card = cards[0];
            if (card instanceof TrainerCard && card.trainerType === TrainerType.SUPPORTER) {
              MOVE_CARDS(store, state, opponent.hand, opponent.discard, {
                cards: [card],
                sourceCard: this,
              });
            }
          }
        },
      );
    }

    return state;
  }
}
