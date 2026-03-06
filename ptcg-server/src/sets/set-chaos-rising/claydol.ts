import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { DEVOLVE_DEFENDING_AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Claydol extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Baltoy';
  public hp: number = 120;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Devolution Ray',
    cost: [F],
    damage: 50,
    text: 'If your opponent\'s Active Pokemon is an Evolved Pokemon, devolve it by putting the highest Stage Evolution card on it into your opponent\'s hand.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Claydol';
  public fullName: string = 'Claydol M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEVOLVE_DEFENDING_AFTER_ATTACK(store, state, effect, 0, this, 'hand');
    }
    return state;
  }
}
