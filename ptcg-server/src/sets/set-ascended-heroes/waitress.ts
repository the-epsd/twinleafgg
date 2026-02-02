import { TrainerCard, TrainerType, StoreLike, State, GameError, GameMessage, CardList, ChooseCardsPrompt, SuperType, EnergyType, AttachEnergyPrompt, PlayerType, SlotType, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { SHUFFLE_DECK } from "../../game/store/prefabs/prefabs";
import { WAS_TRAINER_USED } from "../../game/store/prefabs/trainer-prefabs";

export class Waitress extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '215';
  public name: string = 'Waitress';
  public fullName: string = 'Waitress MC';

  public text: string = 'Look at the top 6 cards of your deck, and attach a Basic Energy you find there to 1 of your Pokémon. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;
      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      const cardsToLook = Math.min(6, player.deck.cards.length);
      player.deck.moveTo(deckTop, cardsToLook);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        deckTop,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          // Attach the selected energy
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS,
            deckTop,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            {},
            { allowCancel: false, min: 1, max: 1 }
          ), transfers => {
            transfers = transfers || [];
            if (transfers.length > 0) {
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                deckTop.moveCardTo(transfer.card, target);
              }
            }
            // Put remaining cards back into deck
            deckTop.moveTo(player.deck);
            SHUFFLE_DECK(store, state, player);
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
          });
        } else {
          // No energy selected, put all cards back
          deckTop.moveTo(player.deck);
          SHUFFLE_DECK(store, state, player);
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
        }
      });
    }
    return state;
  }
}

