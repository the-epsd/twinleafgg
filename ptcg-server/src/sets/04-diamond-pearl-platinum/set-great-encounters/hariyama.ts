import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Hariyama extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Makuhita';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Palm Strike',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 40 more damage.'
  },
  {
    name: 'Spirited Throw',
    cost: [F, F, C],
    damage: 50,
    text: 'If Hariyama has fewer remaining HP than the Defending Pokémon, this attack\'s base damage is 80.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Hariyama';
  public fullName: string = 'Hariyama GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Palm Strike
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    // Spirited Throw
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const checkHpSelf = new CheckHpEffect(player, player.active);
      store.reduceEffect(state, checkHpSelf);
      const checkHpOpp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHpOpp);
      const selfRemaining = checkHpSelf.hp - player.active.damage;
      const oppRemaining = checkHpOpp.hp - opponent.active.damage;
      if (selfRemaining < oppRemaining) {
        effect.damage = 80;
      }
    }

    return state;
  }
}
