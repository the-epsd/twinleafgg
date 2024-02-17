import { TrainerCard, TrainerType, StoreLike, State, SuperType, ChoosePrizePrompt, GameMessage, Stage, Card, CardTarget } from '../../game';
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
    'Look at your face-down Prize cards. You may reveal a Basic Pokémon you find there, put it into your hand, and put this Hisuian Heavy Ball in its place as a face-down Prize card. (If you don\'t reveal a Basic Pokémon, put this card in the discard pile.) Then, shuffle your face-down Prize cards.';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const prizes = player.prizes.filter(p => p.isSecret);
      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      // Make prizes no more secret, before displaying prompt
      prizes.forEach(p => { p.isSecret = false; });

      const blocked: CardTarget[] = [];
      const prizesWithPokemon = player.prizes.filter(p => {
        if (p.cards[0].superType === SuperType.POKEMON && Stage.BASIC) {
          return true;
        } else {
          blocked.push();
        }
      });


      if (prizesWithPokemon.length === 0) {
        return state;
      }

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        { count: 1, allowCancel: false }
      ), chosenPrize => {

        // Prizes are secret once again.
        prizes.forEach(p => { p.isSecret = true; });

        const prizePokemon = chosenPrize[0];

        const hand = player.hand;
        player.prizes.push(prizePokemon, hand);

        player.supporter.moveCardTo(effect.trainerCard, player.discard);


      });
    }

    return state;
  }



}