import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { StateUtils } from '../../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Whirlipede extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Venipede';
  public hp: number = 100;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Venoshock',
    cost: [C],
    damage: 30,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 60 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Whirlipede';
  public fullName: string = 'Whirlipede BLK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Venoshock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP)) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
