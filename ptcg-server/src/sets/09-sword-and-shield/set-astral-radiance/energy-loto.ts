import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { CardList, GameMessage, ChooseCardsPrompt, Player, StateUtils } from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class EnergyLoto extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '140';
  public name: string = 'Energy Loto';
  public fullName: string = 'Energy Loto ASR';
  public text: string =
    'Look at the top 7 cards of your deck. You may reveal an Energy card you find there and put it into your hand. Shuffle the other cards back into your deck.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      MOVE_CARDS(store, state, player.deck, temp, { count: 7, sourceCard: this });

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          temp,
          { superType: SuperType.ENERGY },
          { allowCancel: false, min: 0, max: 1 },
        ),
        (chosenCards) => {
          if (chosenCards && chosenCards.length > 0) {
            // Move chosen Energy to hand and reveal it to opponent
            const energyCard = chosenCards[0];
            MOVE_CARDS(store, state, temp, player.hand, { cards: [energyCard], sourceCard: this });
            SHOW_CARDS_TO_PLAYER(store, state, opponent, chosenCards);
          }

          // Shuffle remaining cards back into deck
          MOVE_CARDS(store, state, temp, player.deck, { sourceCard: this });

          return SHUFFLE_DECK(store, state, player);
        },
      );
    }
    return state;
  }
}
