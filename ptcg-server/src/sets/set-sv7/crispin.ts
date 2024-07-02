import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, AttachEnergyPrompt, SlotType, StateUtils, ChooseCardsPrompt, CardList, Card } from '../../game';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Crispin extends TrainerCard {

  public regulationMark = 'H';
  
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  
  public set: string = 'SV7';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '97';
  
  public name: string = 'Crispin';
  
  public fullName: string = 'Crispin SV7';

  public text: string =
    'Search your deck for up to 2 Basic Energy cards of different types, reveal them, put 1 in your hand, and attach the remaining Energy to your Pokémon in play. Then shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;
      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 2, allowCancel: false }
      ), selected => {
        cards = selected || [];
      });

      const cardList = new CardList();
      player.deck.moveCardsTo(cards, cardList);

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        cardList,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 1, max: 2, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      player.supporterTurn += 1;
    }
    return state;
  }
}