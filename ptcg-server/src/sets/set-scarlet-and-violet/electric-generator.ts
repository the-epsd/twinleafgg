import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, EnergyCard, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils, ShuffleDeckPrompt, ShowCardsPrompt } from '../../game';

export class ElectricGenerator extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'G';

  public set: string = 'SVI';

  public set2: string = 'scarletviolet';

  public setNumber: string = '170';

  public name: string = 'Electric Generator';

  public fullName: string = 'Electric Generator SVI';

  public text: string =
    'Look at the top 5 cards of your deck and attach up to 2 Basic Lightning Energy cards you find there to your Benched Lightning Pokémon in any way you like. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const temp = new CardList();
  
  
      player.deck.moveTo(temp, 5);
  
      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Lightning Energy';
      });
  
      // If no energy cards were drawn, move all cards to deck
      if (energyCardsDrawn.length == 0) {

        state = store.prompt(state, new ShowCardsPrompt(
          player.id, 
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        ), () => {
      
          temp.cards.slice(0, 5).forEach(card => {
            temp.moveCardTo(card, player.deck);
      
            state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
            });
          });
          return state;
        });
        // Attach energy if drawn
        if (energyCardsDrawn.length > 0) {
        
          // Prompt to attach energy if any were drawn
          return store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_CARDS, 
            temp, // Only show drawn energies
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            {superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy'},
            {min: 0, max: 2}
          ), transfers => {
      
            // Attach energy based on prompt selection
            if (transfers) {
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                temp.moveCardTo(transfer.card, target); // Move card to target
              }
              temp.cards.forEach(card => {
                temp.moveCardTo(card, player.deck); // Move card to deck
                state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
                  player.deck.applyOrder(order);
                });
                return state;
              });
              return state;
            }
            return state;
          });
        }
        return state;
      }
      return state;
    }
    return state;
  }
}
            