import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Herd Charge',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip a coin for each Tauros you have in play. This attack does 20 damage times the number of heads.'
  },
  {
    name: 'Thrash',
    cost: [C, C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 40 damage plus 20 more damage. If tails, Tauros does 10 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '74';
  public name: string = 'Tauros';
  public fullName: string = 'Tauros LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Herd Charge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, playerBench + 1, results => {
      let heads: number = 0;
      results.forEach(r => {
      if (r) heads++;
      });
      effect.damage = 20 * heads;
      });
    }

    // Thrash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }

    return state;
  }
}
