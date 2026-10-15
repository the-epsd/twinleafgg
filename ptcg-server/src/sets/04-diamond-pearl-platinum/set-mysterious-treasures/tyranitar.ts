import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardList, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Tyranitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pupitar';
  public hp: number = 140;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Payback',
    cost: [D, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If your opponent has only 1 Prize card left, this attack does 40 damage plus 40 more damage and discard the top 3 cards from your opponent\'s deck.'
  }, {
    name: 'Ground Burn',
    cost: [F, F, D, D],
    damage: 80,
    damageCalculation: '+',
    text: 'Each player discards the top card of his or her deck. This attack does 80 damage plus 20 more damage for each Energy card discarded in this way.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Tyranitar';
  public fullName: string = 'Tyranitar MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const prizesLeft = opponent.prizes.filter(p => p.cards.length > 0).length;
      if (prizesLeft === 1) {
        effect.damage += 40;
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, {
          count: Math.min(3, opponent.deck.cards.length),
          sourceCard: this,
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const playerTop = new CardList();
      const opponentTop = new CardList();
      let bonus = 0;

      if (player.deck.cards.length > 0) {
        MOVE_CARDS(store, state, player.deck, playerTop, { count: 1, sourceCard: this });
        if (playerTop.cards[0]?.superType === SuperType.ENERGY) {
          bonus += 20;
        }
        MOVE_CARDS(store, state, playerTop, player.discard, { sourceCard: this });
      }
      if (opponent.deck.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.deck, opponentTop, { count: 1, sourceCard: this });
        if (opponentTop.cards[0]?.superType === SuperType.ENERGY) {
          bonus += 20;
        }
        MOVE_CARDS(store, state, opponentTop, opponent.discard, { sourceCard: this });
      }
      effect.damage += bonus;
    }

    return state;
  }
}
