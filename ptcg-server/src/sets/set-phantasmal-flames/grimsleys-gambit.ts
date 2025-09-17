import { TrainerCard, TrainerType, StoreLike, State, Card, CardList, ChooseCardsPrompt, GameError, GameMessage, ShuffleDeckPrompt, SuperType, CardType } from '../../game';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class GrimsleysGambit extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public regulationMark = 'I';
  public name: string = 'Grimsley\'s Gambit';
  public fullName: string = 'Grimsley\'s Gambit M2';
  public text: string = 'Look at the top 7 cards of your deck. Choose a [D] type Pokémon you find there and put it onto your Bench. Shuffle the other cards and put them on the bottom of your deck. (You can\'t use this card on your first turn.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (state.turn === 1 || state.turn === 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      state = MOVE_CARDS(store, state, player.deck, deckTop, { count: 7 });

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        deckTop,
        { superType: SuperType.POKEMON, cardType: CardType.DARK },
        { min: 0, max: 1, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];

        cards.forEach((card, index) => {
          state = MOVE_CARDS(store, state, deckTop, openSlots[index], { cards: [card] });
          openSlots[index].pokemonPlayedTurn = state.turn;
        });

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          deckTop.applyOrder(order);
        });

        state = MOVE_CARDS(store, state, deckTop, player.deck, { toBottom: true });
        state = MOVE_CARDS(store, state, player.supporter, player.discard, { cards: [effect.trainerCard] });
        return state;
      });
    }
    return state;
  }
}
