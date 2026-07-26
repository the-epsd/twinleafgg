import { PokemonCard, State, StateUtils, StoreLike } from '../../../game';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Plusle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Plus Damage',
    cost: [C, C],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on your opponent\'s Active Pokémon.',
  }];

  public regulationMark: string = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Plusle';
  public fullName: string = 'Plusle PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Plus Damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const damageCounters = Math.floor(opponent.active.damage / 10);
      effect.damage += damageCounters * 10;
    }
    return state;
  }
}