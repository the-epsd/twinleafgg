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

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '170';

  public name: string = 'Electric Generator';

  public fullName: string = 'Electric Generator SVI';

  public text: string =
    'Look at the top 5 cards of your deck and attach up to 2 Lightning Energy cards you find there to your Benched Lightning Pokémon in any way you like. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const temp = new CardList();
  
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 5);
  
      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Lightning Energy';
      });
  
      // If no energy cards were drawn, move all cards to deck
      if (energyCardsDrawn.length == 0) {
        
        return store.prompt(state, new ShowCardsPrompt(
          player.id, 
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        ), () => {
          
          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
            player.supporter.moveCardTo(this, player.discard);
          });

          player.supporter.moveCardTo(this, player.discard);
          
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
          
        });
        
      } else {
      
        // Attach energy if drawn
        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS, 
          temp, // Only show drawn energies
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy'},
          {min: 0, max: 2, allowCancel: false}
        ), transfers => {
  
          // Attach energy based on prompt selection
          if (transfers) {
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              temp.moveCardTo(transfer.card, target); // Move card to target
              player.supporter.moveCardTo(this, player.discard);
            }
            
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.deck); // Move remaining cards to deck
            });
            
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
              return state;
            });
            
          }
          player.supporter.moveCardTo(this, player.discard);
          return state;
          
        });
        
      }
      
    }
    
    return state;
  }
}