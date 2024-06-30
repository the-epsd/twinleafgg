import { Card, CardList, ChoosePrizePrompt, GameError, GameLog, GameMessage, PokemonCard, ShowCardsPrompt, Stage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
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

      if (prizes.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      const blocked: number[] = [];

      player.prizes.forEach((c, index) => {
        if (!c.isSecret) {
          blocked.push(index);
        }
      });

      // Make prizes no more secret, before displaying prompt
      prizes.forEach(p => { p.isSecret = false; });

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.prizes.map(p => p.cards[0]).forEach((c, index) => {
        if (!(c instanceof PokemonCard && c.stage === Stage.BASIC) && !blocked.includes(index)) {
          blocked.push(index);
        }
      });

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        { count: 1, blocked: blocked, allowCancel: true },
      ), chosenPrize => {

        if (chosenPrize === null || chosenPrize.length === 0) {
          prizes.forEach(p => { p.isSecret = true; });
          player.supporter.moveCardTo(effect.trainerCard, player.discard);

          player.prizes = this.shuffleFaceDownPrizeCards(player.prizes);

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
          store.log(state, GameLog.LOG_HISUIAN_HEAVY_BALL, { name: player.name, card: chosenPrize[0].cards[0].name });
          prizePokemon.moveTo(hand);

          const chosenPrizeIndex = player.prizes.indexOf(chosenPrize[0]);
          player.supporter.moveCardTo(heavyBall, player.prizes[chosenPrizeIndex]);

          prizes.forEach(p => { p.isSecret = true; });
          player.prizes = this.shuffleFaceDownPrizeCards(player.prizes);
        });
      });

      return state;
    }
    return state;
  }

  shuffleFaceDownPrizeCards(array: CardList[]): CardList[] {

    const faceDownPrizeCards = array.filter(p => p.isSecret && p.cards.length > 0);

    for (let i = faceDownPrizeCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = faceDownPrizeCards[i];
      faceDownPrizeCards[i] = faceDownPrizeCards[j];
      faceDownPrizeCards[j] = temp;
    }

    const prizePositions = [];

    for (let i = 0; i < array.length; i++) {
      if (array[i].cards.length === 0 || !array[i].isSecret) {
        prizePositions.push(array[i]);
        continue;
      }

      prizePositions.push(faceDownPrizeCards.splice(0, 1)[0]);
    }

    return prizePositions;
  }
}