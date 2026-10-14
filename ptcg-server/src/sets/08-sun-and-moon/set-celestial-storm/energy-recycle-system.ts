import { TrainerType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../../game/store/prompts/choose-cards-prompt';
import { SelectOptionPrompt } from '../../../game/store/prompts/select-option-prompt';
import { State, StoreLike, TrainerCard, GameMessage, Player } from '../../../game';
import {
  MOVE_CARDS,
  SHUFFLE_DECK,
  SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class EnergyRecycleSystem extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '128';
  public name: string = 'Energy Recycle System';
  public fullName: string = 'Energy Recycle System CES';
  public text: string = `Choose 1: 
  
  • Put a basic Energy card from your discard pile into your hand.
  • Shuffle 3 basic Energy cards from your discard pile into your deck.`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    // Need at least 1 basic Energy card in the discard pile
    return player.discard.cards.some(
      (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
    );
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      // Find all basic Energy cards in discard
      const basicEnergies = player.discard.cards.filter(
        (c) => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC,
      );
      if (basicEnergies.length === 0) {
        // No valid targets
        return state;
      }

      return store.prompt(
        state,
        new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'Put a basic Energy card from your discard pile into your hand.',
            'Shuffle 3 basic Energy cards from your discard pile into your deck.',
          ],
          { allowCancel: false },
        ),
        (choice) => {
          if (choice === 0) {
            // Option 1: Put 1 basic Energy into hand
            SEARCH_DISCARD_PILE_FOR_CARDS_TO_HAND(
              store,
              state,
              player,
              this,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
              { min: 1, max: 1, allowCancel: false },
            );
          } else if (choice === 1) {
            // Option 2: Shuffle 3 basic Energy into deck
            if (basicEnergies.length < 3) {
              // Not enough to choose 3
              return;
            }
            store.prompt(
              state,
              new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_CARD_TO_DECK,
                player.discard,
                { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
                { min: 1, max: 3, allowCancel: false },
              ),
              (selected) => {
                if (selected && selected.length === 3) {
                  MOVE_CARDS(store, state, player.discard, player.deck, {
                    cards: selected,
                    sourceCard: this,
                  });
                  SHUFFLE_DECK(store, state, player);
                }
              },
            );
          }
        },
      );
    }

    return state;
  }
}
