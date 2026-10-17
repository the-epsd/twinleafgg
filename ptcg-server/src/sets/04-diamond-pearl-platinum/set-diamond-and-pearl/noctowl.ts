import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, ChoosePrizePrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Noctowl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Hoothoot';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: L, value: 20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'See Beyond',
    cost: [C],
    damage: 0,
    text: 'Choose a card from your hand and put it as a Prize card face up. Then, choose 1 of your face-down Prize cards without looking and put it into your hand. This attack does nothing if all of your Prize cards are face up.'
  },
  {
    name: 'Extrasensory',
    cost: [C, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If you have the same number of cards in your hand as your opponent, this attack does 30 damage plus 50 more damage.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Noctowl';
  public fullName: string = 'Noctowl DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // See Beyond
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const faceDownPrizes = player.prizes.filter(p => p.cards.length > 0 && p.isSecret && !p.faceUpPrize);

      if (faceDownPrizes.length === 0 || player.hand.cards.length === 0) {
        return state;
      }

      const blockedPrizeIndices: number[] = [];
      const prizesWithCards = player.prizes.filter(p => p.cards.length > 0);
      prizesWithCards.forEach((p, index) => {
        if (!p.isSecret || p.faceUpPrize) {
          blockedPrizeIndices.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.hand,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), (handCards: Card[]) => {
        if (!handCards || handCards.length === 0) {
          return;
        }

        store.prompt(state, new ChoosePrizePrompt(
          player.id,
          GameMessage.CHOOSE_PRIZE_CARD,
          { count: 1, allowCancel: false, isSecret: true, blocked: blockedPrizeIndices }
        ), chosenPrizes => {
          const prize = chosenPrizes && chosenPrizes[0];
          if (!prize) {
            return;
          }

          MOVE_CARDS(store, state, prize, player.hand, { sourceCard: this });
          MOVE_CARDS(store, state, player.hand, prize, { cards: handCards, sourceCard: this });
          prize.isSecret = false;
          prize.isPublic = true;
          prize.faceUpPrize = true;
        });
      });
    }

    // Extrasensory
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.hand.cards.length === effect.opponent.hand.cards.length) {
        effect.damage += 50;
      }
    }

    return state;
  }
}
