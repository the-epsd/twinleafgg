import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, SlotType, StateUtils } from '../../game';

//Avery is not done yet!! have to add the "remove from bench" logic

export class Avery extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'CRE';

  public set2: string = 'chillingreign';

  public setNumber: string = '130';

  public regulationMark = 'E';

  public name: string = 'Avery';

  public fullName: string = 'Avery CRE';

  public text: string =
    'Draw 3 cards. If you drew any cards in this way, your opponent discards Pokémon from their Bench until they have 3.';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;

      // Draw 3 cards
      player.deck.moveTo(player.hand, 3);

      // Get opponent
      const opponent = StateUtils.getOpponent(state, player);

      // Get opponent's bench length
      const opponentBenchLength = opponent.bench.length;

      let PokemonToDiscard = 0;

      if (opponentBenchLength === 1) {
        PokemonToDiscard = 0;
      }
      if (opponentBenchLength === 2) {
        PokemonToDiscard = 0;
      }
      if (opponentBenchLength === 3) {
        PokemonToDiscard = 0;
      }
      if (opponentBenchLength === 4) {
        PokemonToDiscard = 1; 
      }
      if (opponentBenchLength === 5) {
        PokemonToDiscard = 2;
      }

      let targets: PokemonCardList[] = [];

      // Prompt opponent to discard Pokemon from bench
      if(PokemonToDiscard === 1 || PokemonToDiscard === 2) {
        
        return store.prompt(state, new ChoosePokemonPrompt(
          opponent.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          {allowCancel: false, min: PokemonToDiscard, max: PokemonToDiscard}
        ), results => {
          targets = results || [];
          
          targets.forEach(target => {
            target.moveTo(opponent.discard);
          });

        });
        
      }
      
      return state;
    }
    
    return state;
  }


}