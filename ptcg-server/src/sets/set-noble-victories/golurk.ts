import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Golurk extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Golett';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Hammer Arm',
      cost: [F, F, C],
      damage: 60,
      text: 'Discard the top card of your opponent\'s deck.'
    },
    {
      name: 'Hurricane Punch',
      cost: [F, F, C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'Flip 4 coins. This attack does 50 damage times the number of heads.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Golurk';
  public fullName: string = 'Golurk NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.deck.cards.length > 0) {
        MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 1 });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        (effect as AttackEffect).damage = 50 * heads;
      });
    }

    return state;
  }
}
