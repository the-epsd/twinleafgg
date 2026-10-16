import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sharpen',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Nose Poke',
    cost: [F, C],
    damage: 20,
    damageCalculation: '+',
    text: 'If Probopass is on your Bench, this attack does 20 damage plus 20 more damage.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Nosepass';
  public fullName: string = 'Nosepass LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nose Poke
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const hasProbopassOnBench = effect.player.bench.some(b => b.getPokemonCard()?.name === 'Probopass');
      if (hasProbopassOnBench) {
        effect.damage += 20;
      }
    }

    return state;
  }
}
