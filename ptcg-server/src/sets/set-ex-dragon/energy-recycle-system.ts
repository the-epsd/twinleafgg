import { EnergyCard, GameError, SelectPrompt } from '../../game';
import { GameLog, GameMessage } from '../../game/game-message';
import { Card } from '../../game/store/card/card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CLEAN_UP_SUPPORTER, MOVE_CARDS } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class EnergyRecycleSystem extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Energy Recycle System';
  public fullName: string = 'Energy Recycle System DR';

  public text: string =
    `Choose 1:
  
    • Put a basic Energy card from your discard pile into your hand.
    • Shuffle 3 basic Energy cards from your discard pile into your deck.`;


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      let basicEnergyInDiscard: number = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        const isBasicEnergy = c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
        if (isBasicEnergy) {
          basicEnergyInDiscard += 1;
        } else {
          blocked.push(index);
        }
      });

      // Player does not have correct cards in discard
      if (basicEnergyInDiscard === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.CHOOSE_CARD_TO_DECK,
          action: () => {

            let cards: Card[] = [];

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DECK,
              player.discard,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
              { min: Math.min(basicEnergyInDiscard, 3), max: 3, allowCancel: false, blocked }
            ), selected => {
              cards = selected || [];
              cards.forEach((card, index) => {
                store.log(state, GameLog.LOG_PLAYER_RETURNS_TO_DECK_FROM_DISCARD, { name: player.name, card: card.name });
              });

              MOVE_CARDS(store, state, player.discard, player.deck, { cards: cards, sourceCard: this });
              CLEAN_UP_SUPPORTER(effect, player);

              return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                player.deck.applyOrder(order);
              });
            });
          }
        },
        {
          message: GameMessage.CHOOSE_CARD_TO_HAND,
          action: () => {
            let cards: Card[] = [];

            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.discard,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
              { min: 1, max: 1, allowCancel: false, blocked }
            ), selected => {
              cards = selected || [];

              cards.forEach((card, index) => {
                store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
              });

              MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards, sourceCard: this });
              CLEAN_UP_SUPPORTER(effect, player);

              return state;
            });
          }
        }
      ];

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