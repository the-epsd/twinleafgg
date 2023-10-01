import { TrainerCard } from '../../game/store/card/trainer-card';
import { Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, GameError, Card, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';


export class BattleVIPPass extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'FST';

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
        // Allow player to search deck and choose up to 2 Basic Pokemon
        const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
    
        if (player.deck.cards.length === 0) {
          throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
        } else {
          // handle no open slots
           
        
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: 2, allowCancel: true }
          ), selectedCards => {
            cards = selectedCards || [];
        
    
            cards.forEach((card, index) => {
              player.deck.moveCardTo(card, slots[index]);
              slots[index].pokemonPlayedTurn = state.turn;
            });
        
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