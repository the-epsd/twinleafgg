import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, AttachEnergyPrompt, SlotType, StateUtils, ChooseCardsPrompt, CardList, ShowCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Crispin extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '133';

  public name: string = 'Crispin';

  public fullName: string = 'Crispin SV7';

  public text: string =
    'Search your deck for up to 2 Basic Energy cards of different types, reveal them, and put 1 of them into your hand. Attach the other to 1 of your Pokémon. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const cardList = new CardList();
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 1) {
          if (cards[0].name === cards[1].name) {
            throw new GameError(GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
          }
        }

        store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          selected
        ), () => { });

        player.deck.moveCardsTo(cards, cardList);

        if (cardList.cards.length === 2) {
          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            cardList,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 1, max: 1, differentTargets: true }
          ), transfers => {
            transfers = transfers || [];

            if (transfers.length === 0) {
              return;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              cardList.moveCardTo(transfer.card, target);
            }

            // Move the remaining card to the player's hand
            const remainingCard = cardList.cards[0];
            cardList.moveCardTo(remainingCard, player.hand);
          });

        }

        if (cardList.cards.length === 1) {
          const remainingCard = cardList.cards[0];
          cardList.moveCardTo(remainingCard, player.hand);
        }

        player.supporter.moveCardTo(effect.trainerCard, player.discard);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      }
      );
    }
    return state;
  }
}