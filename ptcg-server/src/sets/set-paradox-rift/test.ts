import { TrainerCard, StoreLike, State, GameMessage, PokemonCard, StateUtils, TrainerType, ShowCardsPrompt, SelectPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class Test extends TrainerCard {

  public regulationMark = 'G';
  
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  
  public set: string = 'TEST';
  
  public setNumber: string = '135';
  
  public cardImage: string = 'assets/cardback.png';
  
  public name: string = 'Blaines Quiz';
  
  public fullName: string = 'Blaines Quiz TEST';
  
  public text = `
      Put a Pokémon from your hand face down in front of you and tell your opponent its HP. 
      They guess the name of that Pokémon, and then you reveal it. 
      If your opponent guessed right, they draw 4 cards. 
      If they guessed wrong, you draw 4 cards. 
      Return the Pokémon to your hand.
    `;
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.DISCARD_AND_DRAW,
          action: () => {
      
            const pokemonToShow: PokemonCard[] = [];
      
            player.deck.cards.forEach(card => {
              if (card instanceof PokemonCard) {
                if ([70].includes(card.hp)) {
                  pokemonToShow.push(card);  
                }
              }
            });
      
            if (pokemonToShow.length > 0) {
              return store.prompt(state, new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                pokemonToShow
              ), () => {
      
                return state;
              });
            }
          }
        },
        {
          message: GameMessage.SWITCH_POKEMON,
          action: () => {

            return state;

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
    