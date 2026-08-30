import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Larvitar extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Double Stab',
    cost: [C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 10 damage for each heads.'
  }];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '110';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = heads * 10;
      });
    }

    return state;
  }

}
