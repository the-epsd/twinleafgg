import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, Card, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class BattleVIPPass extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '225';

  public regulationMark = 'E';

  public name: string = 'Battle VIP Pass';

  public fullName: string = 'Battle VIP Pass FST';

  public text: string =
    'You can use this card only during your first turn. ' +
    '' +
    'Search your deck for up to 2 Basic Pokémon and put ' +
    'them onto your Bench. Then, shuffle your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      // Get current turn
      const turn = state.turn;
      
      // Check if it is player's first turn
      if (turn > 2) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      } else {
        const player = effect.player;
        effect.preventDefault = true;
        player.hand.moveCardTo(effect.trainerCard, player.supporter);      
        
        // Allow player to search deck and choose up to 2 Basic Pokemon
        const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
    
        if (player.deck.cards.length === 0) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        } else {
          // Check if bench has open slots
          const openSlots = player.bench.filter(b => b.cards.length === 0);
      
          if (openSlots.length === 0) {
            // No open slots, throw error
            throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
          }

          // We will discard this card after prompt confirmation
          effect.preventDefault = true;
           
          const maxCards = Math.min(2, openSlots.length);
          
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: maxCards, allowCancel: false }
          ), selectedCards => {
            cards = selectedCards || [];
        
            cards.forEach((card, index) => {
              player.deck.moveCardTo(card, slots[index]);
              slots[index].pokemonPlayedTurn = state.turn;
            });

            player.supporter.moveCardTo(this, player.discard);
        
            return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
              player.deck.applyOrder(order);
              
              return state;
            }

            );
          });
        }
      }
    }
    return state;
  }
}