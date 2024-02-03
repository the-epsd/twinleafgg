import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { CardList, GameMessage, ShuffleDeckPrompt, ChooseCardsPrompt, PokemonCard, ShowCardsPrompt } from '../../game';

export class GreatBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public regulationMark = 'G';

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '183';

  public name: string = 'Great Ball';

  public fullName: string = 'Great Ball PAL';

  public text: string =
    'Look at the top 7 cards of your deck. You may reveal a Pokémon you find there and put it into your hand. Shuffle the other cards back into your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
    
      const player = effect.player;
      const temp = new CardList();
    
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.deck.moveTo(temp, 7); 

      // Check if any cards drawn are basic energy
      const pokemonDrawn = temp.cards.filter(card => {
        return card instanceof PokemonCard && card.superType === SuperType.POKEMON;
      });
      
      // If a Pokemon was taken, show the opponent
      if (pokemonDrawn.length == 0) {
        return store.prompt(state, new ShowCardsPrompt(
          player.id, 
          GameMessage.CARDS_SHOWED_BY_EFFECT,
          temp.cards
        ), () => {
          
          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
            player.supporter.moveCardTo(this, player.discard);
          });
          
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
          
        });
        
      } else {
    
        return store.prompt(state, new ChooseCardsPrompt(
          player.id,  
          GameMessage.CHOOSE_CARD_TO_HAND,
          temp,
          { superType: SuperType.POKEMON },
          { allowCancel: false, min: 0, max: 1 }
        ), chosenCards => {
    
          if (chosenCards.length > 0) {
          // Move chosen Pokemon to hand
            const pokemon = chosenCards[0]; 
            temp.moveCardTo(pokemon, player.hand);
          } else {
          // No Pokemon chosen, shuffle all back
            temp.cards.forEach(card => {
              temp.moveCardTo(card, player.deck);
              player.supporter.moveCardTo(this, player.discard);
            });  
          }
    
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
            return state;
          });
    
        });
    
      }

    }

    return state;

  }
  
}