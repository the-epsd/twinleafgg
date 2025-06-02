import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class EthansTyphlosion extends PokemonCard {

  public stage = Stage.STAGE_2;

  public evolvesFrom = 'Ethan\'s Quilava';

  public tags = [CardTag.ETHANS];

  public cardType = R;

  public hp = 170;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [{
    name: 'Buddy Blast',
    cost: [R],
    damage: 40,
    damageCalculation: '+',
    text: 'This attack does 60 more damage for each Ethan\'s Adventure card in your discard pile.'
  }, {
    name: 'Steam Artillery',
    cost: [R, R, C],
    damage: 160,
    text: ''
  }];

  public regulationMark = 'I';

  public set: string = 'DRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '34';

  public name: string = 'Ethan\'s Typhlosion';

  public fullName: string = 'Ethan\'s Typhlosion DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const adventureCount = player.discard.cards.filter(c => c.name === 'Ethan\'s Adventure').length;
      effect.damage += 60 * adventureCount;
    }

    return state;
  }
}
