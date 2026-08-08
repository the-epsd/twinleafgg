import { PokemonCard, Stage, CardType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../../game/store/prefabs/prefabs';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Torchic';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Combustion',
    cost: [R],
    damage: 20,
    text: ''
  }, {
    name: 'Double Kick',
    cost: [R, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 40 damage for each heads.'
  }];

  public set: string = 'DRI';

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Combusken';
  public fullName: string = 'Combusken DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 40 * heads;
      });
    }

    return state;
  }
}
