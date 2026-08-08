import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Bewear extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Stufful';
  public hp: number = 130;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Knuckle Punch',
    cost: [C, C],
    damage: 50,
    text: ''
  }, {
    name: 'Hyper Lariat',
    cost: [C, C, C],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip 2 coins. If both of them are heads, this attack does 100 more damage.'
  }];

  public regulationMark = 'I';

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Bewear';
  public fullName: string = 'Bewear MEG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hyper Lariat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        if (results.every(r => r)) {
          effect.damage += 100;
        }
      });
    }

    return state;
  }
}
