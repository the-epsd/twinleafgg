import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Colorful Body',
    powerType: PowerType.POKEBODY,
    text: 'Kecleon\'s type is [G][R][W][L][P][F][D][M][C].'
  }];

  public attacks = [{
    name: 'Triple Smash',
    cost: [C, C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip 3 coins. This attack does 10 damage plus 20 more damage for each heads.'
  }];

  public set: string = 'RR';
  public name: string = 'Kecleon';
  public fullName: string = 'Kecleon RR';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonTypeEffect
      && effect.target.getPokemonCard() === this
      && !IS_POKEBODY_BLOCKED(store, state, StateUtils.findOwner(state, effect.target), this)) {

      effect.cardTypes = [G, R, W, L, P, F, D, M, C];
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage += 20 * heads;
      });
    }

    return state;
  }
}
