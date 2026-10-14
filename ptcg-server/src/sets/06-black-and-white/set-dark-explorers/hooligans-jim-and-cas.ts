import { GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
  SHUFFLE_DECK,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class HooligansJimAndCas extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'DEX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';
  public name: string = 'Hooligans Jim & Cas';
  public fullName: string = 'Hooligans Jim & Cas DEX';
  public text: string =
    "Flip a coin. If heads, choose 3 random cards from your opponent's hand. " +
    'Your opponent reveals those cards and shuffles them into his or her deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return COIN_FLIP_PROMPT(store, state, player, (result) => {
        if (result && opponent.hand.cards.length > 0) {
          const cardsToShuffle = Math.min(3, opponent.hand.cards.length);
          const selectedCards: typeof opponent.hand.cards = [];
          const handCopy = [...opponent.hand.cards];

          for (let i = 0; i < cardsToShuffle; i++) {
            const randomIndex = Math.floor(Math.random() * handCopy.length);
            selectedCards.push(handCopy[randomIndex]);
            handCopy.splice(randomIndex, 1);
          }

          SHOW_CARDS_TO_PLAYER(store, state, player, selectedCards);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, selectedCards);
          MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: selectedCards });
          SHUFFLE_DECK(store, state, opponent);
        }
      });
    }

    return state;
  }
}
