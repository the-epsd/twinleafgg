import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameLog } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { EnergyCard } from '../../game/store/card/energy-card';
import { SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';

export class EnergyRecycleSystem extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CES';
  public setNumber: string = '128';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Energy Recycle System';
  public fullName: string = 'Energy Recycle System CES';
  public text: string = `Choose 1: 
  
  • Put a basic Energy card from your discard pile into your hand.
  • Shuffle 3 basic Energy cards from your discard pile into your deck.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      // Find all basic Energy cards in discard
      const basicEnergies = player.discard.cards.filter(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC
      );
      if (basicEnergies.length === 0) {
        // No valid targets
        return state;
      }
      // Show the options prompt
      state = store.prompt(state, new SelectOptionPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        [
          'Put a basic Energy card from your discard pile into your hand.',
          'Shuffle 3 basic Energy cards from your discard pile into your deck.'
        ],
        { allowCancel: false }
      ), choice => {
        if (choice === 0) {
          // Option 1: Put 1 basic Energy into hand
          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.discard,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            if (selected && selected.length > 0) {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: selected[0].name });
              player.discard.moveCardsTo(selected, player.hand);
            }
          });
        } else if (choice === 1) {
          // Option 2: Shuffle 3 basic Energy into deck
          if (basicEnergies.length < 3) {
            // Not enough to choose 3
            return;
          }
          state = store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DECK,
            player.discard,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { min: 1, max: 3, allowCancel: false }
          ), selected => {
            if (selected && selected.length === 3) {
              store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: selected.map(c => c.name).join(', ') });
              player.discard.moveCardsTo(selected, player.deck);
              SHUFFLE_DECK(store, state, player);
            }
          });
        }
      });
      return state;
    }
    return state;
  }
}
