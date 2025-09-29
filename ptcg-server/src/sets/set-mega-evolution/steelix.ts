import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public cardType: CardType = M;
  public hp: number = 200;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Welcoming Tail',
    cost: [C, C],
    damage: 40,
    damageCalculation: '+',
    text: 'If you have exactly 6 Prize cards remaining, this attack does 200 more damage.'
  },
  {
    name: 'Skull Bash',
    cost: [M, M, C, C],
    damage: 140,
    text: ''
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix M1L';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.getPrizeLeft() === 6) {
        effect.damage += 200;
      }
    }

    return state;
  }
}