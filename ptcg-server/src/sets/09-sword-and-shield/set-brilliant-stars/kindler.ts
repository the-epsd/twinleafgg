import { CardList, ChooseCardsPrompt, Player } from '../../../game';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { EnergyType, SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { MOVE_CARDS, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Kindler extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'F';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Kindler';
  public fullName: string = 'Kindler BRS';
  public text: string = `You can use this card only if you discard a [R] Energy card from your hand. 

Look at the top 7 cards of your deck and put up to 2 of them into your hand. Shuffle the other cards back into your deck.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    if (player.deck.cards.length === 0) {
      return false;
    }

    const hasEnergyInHand = player.hand.cards.some((c) => {
      return (
        c.superType === SuperType.ENERGY &&
        c.energyType === EnergyType.BASIC &&
        c.name === 'Fire Energy'
      );
    });

    if (!hasEnergyInHand) {
      return false;
    }

    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const hasEnergyInHand = player.hand.cards.some((c) => {
        return (
          c.superType === SuperType.ENERGY &&
          c.energyType === EnergyType.BASIC &&
          c.name === 'Fire Energy'
        );
      });

      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      state = store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.hand,
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 1, max: 1 },
        ),
        (cards) => {
          cards = cards || [];
          if (cards.length === 0) {
            return;
          }

          MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        },
      );

      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 7, sourceCard: this });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          deckTop,
          {},
          { min: 0, max: 2, allowCancel: false },
        ),
        (selected) => {
          MOVE_CARDS(store, state, deckTop, player.hand, { cards: selected, sourceCard: this });
          MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this });

          SHUFFLE_DECK(store, state, player);
          CLEAN_UP_SUPPORTER(store, effect, player);
        },
      );
    }

    return state;
  }
}
