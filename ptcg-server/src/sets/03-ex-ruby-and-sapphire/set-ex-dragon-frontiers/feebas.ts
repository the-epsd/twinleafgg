import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Feebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 30;
  public cardType: CardType[] = [R];
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Flail',
    cost: [R],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of damage counters on Feebas.'
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Feebas δ';
  public fullName: string = 'Feebas δ DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Flail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage = effect.player.active.damage;
    }

    return state;
  }
}
