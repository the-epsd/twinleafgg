import { PokemonCard, CardTag, Stage, CardType, Attack, State, StoreLike, SpecialCondition, Card, CardList, ChooseCardsPrompt, GameError, GameMessage, StateUtils } from '../../game';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Umbreonex extends PokemonCard {
  public cardTag = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Eevee';
  public cardType: CardType = D;
  public hp: number = 280;
  public retreat = [C, C];
  public weakness = [{ type: G }];

  public attacks: Attack[] = [
    {
      name: 'Moon Mirage',
      cost: [D, C, C],
      damage: 160,
      text: 'Your opponent\'s Active Pokémon is now Confused.',
    },
    {
      name: 'Onyx',
      cost: [L, P, D],
      damage: 0,
      text: 'Discard all Energy from this Pokémon. Draw 1 Prize card.',
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'SV8a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Umbreon ex';
  public fullName: string = 'Umbreon ex SV8a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
      store.reduceEffect(state, specialConditionEffect);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      // const opponent = StateUtils.getOpponent(state, player);
      const prizes = player.prizes.filter(p => p.isSecret);

      if (prizes.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      // const blocked: number[] = [];

      // player.prizes.forEach((p, index) => {
      //   if (p.faceUpPrize) {
      //     blocked.push(index);
      //   }
      //   if (p.isPublic) {
      //     blocked.push(index);
      //   }
      //   if (!p.isSecret) {
      //     blocked.push(index);
      //   }
      // });

      // Keep track of which prizes were originally face down
      const originallyFaceDown = player.prizes.map(p => p.isSecret);

      // Make prizes no more secret, before displaying prompt
      prizes.forEach(p => { p.isSecret = true; });

      // state = store.prompt(state, new ChoosePrizePrompt(
      //   player.id,
      //   GameMessage.CHOOSE_POKEMON,
      //   { count: 1, blocked: blocked, allowCancel: true },
      // ), chosenPrize => {


      const allPrizeCards = new CardList();
      player.prizes.forEach(prizeList => {
        allPrizeCards.cards.push(...prizeList.cards);
      });

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        allPrizeCards,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), chosenPrize => {
        // if (chosenPrize === null || chosenPrize.length === 0) {
        //   player.prizes.forEach((p, index) => {
        //     if (originallyFaceDown[index]) {
        //       p.isSecret = true;
        //     }
        //   });
        //   player.supporter.moveCardTo(effect.trainerCard, player.discard);
        //   const faceDownPrizes = player.prizes.filter((p, index) => originallyFaceDown[index]);
        //   this.shuffleFaceDownPrizeCards(faceDownPrizes);
        //   return state;
        // }

        const prizePokemon = chosenPrize[0];
        const hand = player.hand;

        // Find the prize list containing the chosen card
        const chosenPrizeList = player.prizes.find(prizeList => prizeList.cards.includes(prizePokemon));

        // if (chosenPrize.length > 0) {
        //   state = store.prompt(state, new ShowCardsPrompt(
        //     opponent.id,
        //     GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        //     chosenPrize
        //   ), () => { });
        // }

        if (chosenPrizeList) {
          chosenPrizeList.moveCardTo(prizePokemon, hand);
        }

        // At the end, when resetting prize cards:
        player.prizes.forEach((p, index) => {
          if (originallyFaceDown[index]) {
            p.isSecret = true;
          }
        });

        // Shuffle only the face-down prize cards
        const faceDownPrizes = player.prizes.filter((p, index) => originallyFaceDown[index]);
        this.shuffleFaceDownPrizeCards(faceDownPrizes);

        return state;
      });
    }

    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Target is this Pokemon
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        effect.preventDefault = true;
      }
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