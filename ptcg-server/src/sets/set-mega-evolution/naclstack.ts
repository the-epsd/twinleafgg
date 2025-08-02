import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Naclstack extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nacli';
  public cardType: CardType = F;
  public hp: number = 110;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rock Hurl',
    cost: [F, C],
    damage: 0,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public set: string = 'M1L';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Naclstack';
  public fullName: string = 'Naclstack M1L';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    return state;
  }
}