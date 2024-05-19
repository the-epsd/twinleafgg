import { Card, CardList, ChoosePrizePrompt, GameMessage, PokemonCard, ShowCardsPrompt, Stage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
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

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      const blocked: number[] = [];
      player.prizes.map(p => p.cards[0]).forEach((c, index) => {
        if (c instanceof PokemonCard && c.stage === Stage.BASIC) {
          return;
        } 
        
        blocked.push(index);
      });
      
      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        { count: 1, blocked, allowCancel: true },
      ), chosenPrize => {

        if (chosenPrize === null || chosenPrize.length === 0) {          
          prizes.forEach(p => { p.isSecret = true; });          
          player.supporter.moveCardTo(effect.trainerCard, player.discard);
          
          player.prizes = this.shuffleArray(player.prizes);          
          
          return state;
        }
        
        const opponent = StateUtils.getOpponent(state, player);
        store.prompt(state, new ShowCardsPrompt(
          opponent.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          chosenPrize[0].cards
        ), () => {
          const prizePokemon = chosenPrize[0];
          const hand = player.hand;
          const heavyBall = effect.trainerCard;

          prizePokemon.moveTo(hand);

          const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
          player.supporter.moveCardTo(heavyBall, player.prizes[chosenPrizeIndex]);

          player.prizes = this.shuffleArray(player.prizes);          
          
          prizes.forEach(p => { p.isSecret = true; });  
        });
      });

      return state;
    }
    return state;
  }
  
  shuffleArray(array: CardList[]): CardList[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    
    return array;
  }
}