import { TrainerCard, TrainerType, StoreLike, State, ChoosePrizePrompt, GameMessage, Card, Stage, PokemonCard, GameError } from '../../game';
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

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        { count: 1, allowCancel: true },
      ), chosenPrize => {

        if (chosenPrize === null) {
          return state;
        }

        if (!(chosenPrize[0] instanceof PokemonCard) || !(chosenPrize[0].stage === Stage.BASIC)) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }

        const prizePokemon = chosenPrize[0];
        const hand = player.hand;
        const heavyBall = effect.trainerCard;

        prizePokemon.moveTo(hand);

        const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
        player.supporter.moveCardTo(heavyBall, player.prizes[chosenPrizeIndex]);

        // const shuffledPrizes = player.prizes.slice().sort(() => Math.random() - 0.5);
        // player.prizes = shuffledPrizes;


        prizes.forEach(p => { p.isSecret = true; });
        prizes.forEach(p => { p.applyOrder([chosenPrize[0].cards[0].id]); });

        // return store.prompt(state, new ShuffleHandPrompt(player.id), order => {
        //   prizes.forEach(p => { p.applyOrder([order[0]]); });
        // });

      });

      return state;
    }
    return state;
  }
}