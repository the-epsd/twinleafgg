import { TrainerCard, TrainerType, StoreLike, State, SuperType, ChoosePrizePrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class HisuianHeavyBall extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;
  
  public regulationMark = 'F';
  
  public set: string = 'ASR';
  
  public name: string = 'Hisuian Heavy Ball';
  
  public cardImage: string = 'assets/cardback.png';
    
  public setNumber: string = '146';
  
  public fullName: string = 'Hisuian Heavy Ball ASR';
  
  public text: string =
    'Attach a basic D Energy card from your discard pile to 1 of your ' +
      'Benched D Pokemon.';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const prizesWithPokemon = player.prizes.filter(p => p.cards[0].superType === SuperType.POKEMON);

      if (prizesWithPokemon.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        { count: 1, allowCancel: false }
      ), chosenPrize => {

        const prizePokemon = chosenPrize[0].cards[0];

        chosenPrize[0].cards = [this];
        player.discard.moveCardTo(prizePokemon, player.hand);

      });
    }

    return state;
  }


}