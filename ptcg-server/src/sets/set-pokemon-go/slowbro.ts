import { PokemonCard, Stage, CardType, StoreLike, State, SpecialCondition, GameMessage, CardList, ChoosePrizePrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Slowbro extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Slowpoke';

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Tumbling Tackle',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: 'Both Active Pokémon are now Asleep.'
    },
    {
      name: 'Twilight Inspiration',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'You can use this attack only if your opponent has exactly 1 Prize card remaining. Take 2 Prize cards.'
    }
  ];

  public set: string = 'PGO';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '20';

  public name: string = 'Slowbro';

  public fullName: string = 'Slowbro PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = opponent.active;

      active.addSpecialCondition(SpecialCondition.ASLEEP);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const prizes = player.prizes.filter(p => p.isSecret);
      const opponent = StateUtils.getOpponent(state, player);

      const prizesTaken = 6 - opponent.getPrizeLeft();

      if (prizesTaken === 1) {

        state = store.prompt(state, new ChoosePrizePrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          { count: 2, allowCancel: true },
        ), chosenPrize => {

          if (chosenPrize === null || chosenPrize.length === 0) {
            prizes.forEach(p => { p.isSecret = true; });

            player.prizes = this.shuffleFaceDownPrizeCards(player.prizes);

            return state;
          }
          const prizePokemon = chosenPrize[0];
          const prizePokemon2 = chosenPrize[1];
          const hand = player.hand;
          prizePokemon.moveTo(hand);
          prizePokemon2.moveTo(hand);

          player.prizes = this.shuffleFaceDownPrizeCards(player.prizes);
        });
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