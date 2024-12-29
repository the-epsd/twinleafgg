import { TrainerCard, TrainerType, StoreLike, State, StateUtils, GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt, ShowCardsPrompt, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class FossilExcavationMap extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '107';

  public set: string = 'FLI';

  public name: string = 'Fossil Excavation Map';

  public fullName: string = 'Fossil Excavation Map FLI';

  public text: string =
    'Choose 1:\n' +
    '• Search your deck for an Unidentified Fossil card, reveal it, and put it into your hand. Then, shuffle your deck.\n' +
    '• Put an Unidentified Fossil card from your discard pile into your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.DISCARD_AND_DRAW,
          action: () => {

            let cards: Card[] = [];

            state = store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.deck,
              { name: 'Unidentified Fossil' },
              { min: 0, max: 1, allowCancel: false }
            ), selected => {
              cards = selected || [];
            });

            player.deck.moveCardsTo(cards, player.hand);

            if (cards.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              ), () => { });
            }
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          }
        },
        {
          message: GameMessage.SWITCH_POKEMON,
          action: () => {

            let cards: Card[] = [];

            state = store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.discard,
              { name: 'Unidentified Fossil' },
              { min: 0, max: 1, allowCancel: false }
            ), selected => {
              cards = selected || [];
            });

            player.discard.moveCardsTo(cards, player.hand);

            if (cards.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              ), () => { });
            }

            player.supporter.moveCardTo(effect.trainerCard, player.discard);
          }
        }
      ];

      const hasFossilInDiscard = player.discard.cards.some(card => card.name === 'Unidentified Fossil');

      if (!hasFossilInDiscard) {
        options.splice(0, 1);
      }

      if (player.deck.cards.length === 0) {
        options.splice(0, 1);
      }

      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }



}